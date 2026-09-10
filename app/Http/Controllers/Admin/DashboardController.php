<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LateLevel;
use App\Models\Setting;
use App\Models\Attendance;
use App\Models\User;
use App\Services\AttendanceService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index()
    {
        $setting = Setting::first();
        $lateLevels = LateLevel::orderBy('minutes')->get();
        // TOTAL EMPLOYEE
        $totalEmployees = User::where('role', 'employee')->count();

        // HADIR HARI INI
        $presentToday = Attendance::whereDate('date', now())->count();

        // IZIN
        $izinCount = Attendance::whereDate('date', now())
            ->where('status', 'izin')
            ->count();

        // TIDAK HADIR
        $absentCount = User::where('role', 'employee')->count() - $presentToday;

        // ATTENDANCE CHART
        $attendanceChart = User::where('role', 'employee')
            ->get()
            ->map(function ($user) {

                $hadir = Attendance::where('user_id', $user->id)
                    ->whereMonth('date', now()->month)
                    ->whereYear('date', now()->year)
                    ->where('status', 'hadir')
                    ->count();

                $izin = Attendance::where('user_id', $user->id)
                    ->whereMonth('date', now()->month)
                    ->whereYear('date', now()->year)
                    ->where('status', 'izin')
                    ->count();

                $hariDalamBulan = now()->daysInMonth;

                return [
                    'name' => $user->name,
                    'hadir' => $hadir,
                    'tidak_hadir' => max(
                        0,
                        $hariDalamBulan - $hadir - $izin
                    ),
                ];
            });

        // DATA TABLE
        $attendanceData = Attendance::with('user')
            ->whereHas('user')
            ->whereDate('date', now())
            ->latest()
            ->get()
            ->map(function ($attendance) use ($setting, $lateLevels) {

                $attendanceLevel = $this->attendanceService->resolveAttendanceLevel(
                    $attendance,
                    $setting,
                    $lateLevels
                );

                return [
                    'id' => $attendance->id,
                    'name' => $attendance->user->name,
                    'position' => $attendance->user->position,
                    'checkIn' => $attendance->check_in_time,
                    'status' => strtolower($attendance->status ?? 'hadir'),
                    'location' => $attendance->location,
                    'attendance_level' => $attendanceLevel,
                    'latitude' => $attendance->latitude,
                    'longitude' => $attendance->longitude,
                ];
            });

        $notAttendanceData = User::where('role', 'employee')
            ->whereDoesntHave('attendances', function ($q) {
                $q->whereDate('date', now());
            })
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'position' => $user->position,
                    'status' => 'tidak_hadir',
                ];
            });

        $setting = Setting::first();

        return Inertia::render('dashboard', [

            'statistics' => [
                [
                    'title' => 'Total Karyawan',
                    'value' => $totalEmployees,
                    'color' => 'text-blue-600',
                ],

                [
                    'title' => 'Sudah Absen',
                    'value' => $presentToday,
                    'color' => 'text-green-600',
                ],

                [
                    'title' => 'Izin',
                    'value' => $izinCount,
                    'color' => 'text-yellow-500',
                ],

                [
                    'title' => 'Belum Absen',
                    'value' => $absentCount,
                    'color' => 'text-red-500',
                ],
            ],

            'attendanceData' => $attendanceData,
            'attendanceChart' => $attendanceChart,
            'notAttendanceData' => $notAttendanceData,

            'office' => [
                'latitude' => $setting->office_latitude ?? 0,
                'longitude' => $setting->office_longitude ?? 0,
                'radius' => $setting->attendance_radius?? 100,
            ],
        ]);
    }
}
