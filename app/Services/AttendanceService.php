<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\LateLevel;
use App\Models\Setting;
use App\Models\User;
use Carbon\Carbon;
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

        DB::transaction(function () use (
            $user,
            $nearestLocation,
            $data,
            $distance,
            $approvalStatus
        ) {

            Attendance::create([

                'user_id' => $user->id,

                'office_location_id' => $nearestLocation?->id,

                'date' => now()->toDateString(),

                'check_in_time' => now()->toTimeString(),

                'status' => $data['status'],

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
    }

    /**
     * Check Out Attendance
     */
    public function checkOut(User $user, array $data): void
    {
        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
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

        $setting = Setting::first();

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

        $attendance->update([
            'check_out_time' => now()->toTimeString(),
            'check_out_latitude' => $data['latitude'] ?? null,
            'check_out_longitude' => $data['longitude'] ?? null,
            'check_out_location' => $data['location'] ?? null,
            'check_out_distance' => $distance,
        ]);
    }

    /**
     * Tentukan level kehadiran (Bonus/Ontime/level telat dinamis/Setengah Hari)
     * berdasarkan jam check-in dan daftar level telat yang diatur admin.
     *
     * $lateLevels boleh di-passing dari luar (mis. saat memproses banyak
     * attendance sekaligus dalam satu loop) supaya tidak query berulang.
     */
    public function resolveAttendanceLevel(
        ?Attendance $attendance,
        ?Setting $setting,
        ?Collection $lateLevels = null
    ): string {

        if (
            !$attendance ||
            $attendance->status !== 'hadir' ||
            !$attendance->check_in_time ||
            !$setting ||
            !$setting->check_in_start
        ) {
            return '-';
        }

        $baseline = Carbon::createFromFormat(
            'H:i:s',
            $setting->check_in_start
        );

        $time = Carbon::createFromFormat(
            'H:i:s',
            $attendance->check_in_time
        );

        if ($time->lte($baseline->copy()->subMinutes(15))) {
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

        return 'Setengah Hari';
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
