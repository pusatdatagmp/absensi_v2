<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\LateLevel;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    /**
     * Check In Attendance
     */
    public function checkIn(User $user, array $data): void
    {
        $alreadyAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
            ->exists();

        if ($alreadyAttendance) {
            throw new \Exception('Anda sudah melakukan absensi hari ini.');
        }

        $setting = Setting::first();

        if ($setting && $setting->check_in_start && $setting->check_in_end) {

            $now = Carbon::now();

            $start = Carbon::today()->setTimeFromTimeString(
                $setting->check_in_start
            );

            $end = Carbon::today()->setTimeFromTimeString(
                $setting->check_in_end
            );

            if ($now->lt($start) || $now->gt($end)) {
                throw new \Exception(
                    "Check-in hanya diperbolehkan pukul {$setting->check_in_start} - {$setting->check_in_end}"
                );
            }
        }

        $officeLocations = $user->officeLocations()
            ->where('is_active', true)
            ->get();

        if ($officeLocations->isEmpty()) {
            throw new \Exception(
                'Lokasi kantor belum ditentukan oleh administrator.'
            );
        }

        $distance = null;
        $nearestLocation = null;

        // default langsung approved
        $approvalStatus = 'approved';

        if (
            $data['status'] === 'hadir' &&
            !empty($data['latitude']) &&
            !empty($data['longitude'])
        ) {

            foreach ($officeLocations as $officeLocation) {

                $currentDistance = $this->calculateDistance(
                    $data['latitude'],
                    $data['longitude'],
                    $officeLocation->latitude,
                    $officeLocation->longitude
                );

                if ($distance === null || $currentDistance < $distance) {
                    $distance = $currentDistance;
                    $nearestLocation = $officeLocation;
                }
            }

            // Di luar radius lokasi terdekat -> menunggu approval admin
            if ($nearestLocation && $distance > $nearestLocation->radius) {
                $approvalStatus = 'pending';
            }
        }

        $checkInTime = now()->toTimeString();

        // Snapshot level kehadiran pada saat check-in supaya histori tidak
        // ikut berubah kalau admin mengubah baseline/late level nanti.
        $attendanceLevel = $this->determineAttendanceLevel(
            $data['status'],
            $checkInTime,
            $setting
        );

        try {
            DB::transaction(function () use (
                $user,
                $nearestLocation,
                $data,
                $distance,
                $approvalStatus,
                $checkInTime,
                $attendanceLevel
            ) {

                Attendance::create([

                    'user_id' => $user->id,

                    'office_location_id' => $nearestLocation?->id,

                    'date' => now()->toDateString(),

                    'check_in_time' => $checkInTime,

                    'status' => $data['status'],

                    'attendance_level' => $attendanceLevel,

                    'latitude' => $data['latitude'] ?? null,

                    'longitude' => $data['longitude'] ?? null,

                    'location' => $data['location'] ?? null,

                    'distance' => $distance,

                    'approval_status' => $approvalStatus,

                    // Belum ada catatan admin
                    'approval_note' => null,

                    'approved_by' => null,

                    'approved_at' => $approvalStatus === 'approved'
                        ? now()
                        : null,
                ]);
            });
        } catch (QueryException $e) {

            // Race condition: dua request check-in bersamaan lolos cek
            // exists() di atas sebelum salah satunya sempat insert. Unique
            // index (user_id, date) di database jadi penjaga terakhir.
            if ($this->isDuplicateEntry($e)) {
                throw new \Exception('Anda sudah melakukan absensi hari ini.');
            }

            throw $e;
        }
    }

    /**
     * Check Out Attendance
     */
    public function checkOut(User $user, array $data): void
    {
        $setting = Setting::first();

        DB::transaction(function () use ($user, $data, $setting) {

            $attendance = Attendance::where('user_id', $user->id)
                ->whereDate('date', today())
                ->lockForUpdate()
                ->first();

            if (!$attendance) {
                throw new \Exception('Anda belum melakukan check-in hari ini.');
            }

            if ($attendance->status !== 'hadir') {
                throw new \Exception('Check-out hanya berlaku untuk absensi hadir.');
            }

            if ($attendance->check_out_time) {
                throw new \Exception('Anda sudah melakukan check-out hari ini.');
            }

            if ($setting && $setting->check_out) {

                $now = Carbon::now();

                $checkOutStart = Carbon::today()->setTimeFromTimeString(
                    $setting->check_out
                );

                if ($now->lt($checkOutStart)) {
                    throw new \Exception(
                        "Check-out hanya diperbolehkan mulai pukul {$setting->check_out}"
                    );
                }
            }

            $distance = null;
            $officeLocation = null;

            if (!empty($data['latitude']) && !empty($data['longitude'])) {

                $officeLocation = $attendance->officeLocation
                    ?? $user->officeLocations()
                        ->where('is_active', true)
                        ->get()
                        ->sortBy(fn($location) => $this->calculateDistance(
                            $data['latitude'],
                            $data['longitude'],
                            $location->latitude,
                            $location->longitude
                        ))
                        ->first();

                if ($officeLocation) {
                    $distance = $this->calculateDistance(
                        $data['latitude'],
                        $data['longitude'],
                        $officeLocation->latitude,
                        $officeLocation->longitude
                    );
                }
            }

            $approvalStatus = $attendance->approval_status;
            $approvalNote = $attendance->approval_note;

            // Check-in bisa saja sudah disetujui karena masih dalam radius,
            // tapi check-out dari lokasi yang jauh di luar radius tetap
            // perlu ditinjau ulang oleh admin.
            if (
                $distance !== null &&
                $officeLocation &&
                $distance > $officeLocation->radius &&
                $approvalStatus === 'approved'
            ) {
                $approvalStatus = 'pending';
                $approvalNote = 'Check-out di luar radius kantor, menunggu peninjauan admin.';
            }

            $attendance->update([
                'check_out_time' => now()->toTimeString(),
                'check_out_latitude' => $data['latitude'] ?? null,
                'check_out_longitude' => $data['longitude'] ?? null,
                'check_out_location' => $data['location'] ?? null,
                'check_out_distance' => $distance,
                'approval_status' => $approvalStatus,
                'approval_note' => $approvalNote,
            ]);
        });
    }

    /**
     * Tentukan level kehadiran (Bonus/Ontime/level telat dinamis/Telat)
     * berdasarkan jam check-in dan daftar level telat yang diatur admin.
     *
     * $lateLevels boleh di-passing dari luar (mis. saat memproses banyak
     * attendance sekaligus dalam satu loop) supaya tidak query berulang.
     *
     * Dipakai untuk menghitung ulang level pada attendance lama yang belum
     * punya kolom attendance_level tersimpan (data sebelum fitur snapshot
     * ini ada). Untuk attendance baru, level sudah disimpan saat check-in.
     */
    public function resolveAttendanceLevel(
        ?Attendance $attendance,
        ?Setting $setting,
        ?Collection $lateLevels = null
    ): string {

        if (!$attendance || !$attendance->check_in_time) {
            return '-';
        }

        return $this->determineAttendanceLevel(
            $attendance->status,
            $attendance->check_in_time,
            $setting,
            $lateLevels
        );
    }

    /**
     * Logika inti penentuan level kehadiran. Baseline jam masuk resmi
     * memakai work_start_time, dengan fallback ke check_in_start untuk
     * kompatibilitas kalau admin belum mengisi work_start_time. Baseline ini
     * SENGAJA dipisah dari jendela absen (check_in_start/check_in_end) agar
     * karyawan yang datang lebih pagi dari jendela check-in tetap bisa absen
     * dan mendapat predikat Bonus, bukan malah ditolak sistem.
     */
    private function determineAttendanceLevel(
        ?string $status,
        ?string $checkInTime,
        ?Setting $setting,
        ?Collection $lateLevels = null
    ): string {

        $baselineTime = $setting?->work_start_time ?? $setting?->check_in_start;

        if (
            $status !== 'hadir' ||
            !$checkInTime ||
            !$setting ||
            !$baselineTime
        ) {
            return '-';
        }

        $bonusMinutes = $setting->bonus_minutes ?? 15;

        $baseline = Carbon::createFromFormat(
            'H:i:s',
            $baselineTime
        );

        $time = Carbon::createFromFormat(
            'H:i:s',
            $checkInTime
        );

        if ($time->lte($baseline->copy()->subMinutes($bonusMinutes))) {
            return 'Bonus';
        }

        if ($time->lte($baseline)) {
            return 'Ontime';
        }

        $lateLevels ??= LateLevel::orderBy('minutes')->get();

        foreach ($lateLevels as $level) {
            if ($time->lte($baseline->copy()->addMinutes($level->minutes))) {
                return $level->label;
            }
        }

        return 'Telat';
    }

    /**
     * Cek apakah QueryException berasal dari pelanggaran unique constraint
     * (SQLSTATE 23000 di MySQL/SQLite, 23505 di PostgreSQL).
     */
    private function isDuplicateEntry(QueryException $e): bool
    {
        return in_array($e->getCode(), ['23000', '23505'], true);
    }

    /**
     * Haversine Formula
     */
    public function calculateDistance(
        float $lat1,
        float $lon1,
        float $lat2,
        float $lon2
    ): float {

        $earthRadius = 6371000;

        $dLat = deg2rad($lat2 - $lat1);

        $dLon = deg2rad($lon2 - $lon1);

        $a =
            sin($dLat / 2) * sin($dLat / 2)
            +
            cos(deg2rad($lat1))
            *
            cos(deg2rad($lat2))
            *
            sin($dLon / 2)
            *
            sin($dLon / 2);

        $c = 2 * atan2(
            sqrt($a),
            sqrt(1 - $a)
        );

        return round(
            $earthRadius * $c,
            2
        );
    }
}
