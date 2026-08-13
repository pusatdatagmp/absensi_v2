<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Attendance\StoreAttendanceRequest;
use App\Http\Requests\Attendance\CheckOutAttendanceRequest;
use App\Services\AttendanceService;
use App\Models\User;

class AttendanceController extends Controller
{
    public function index()
    {
        $user = User::with('officeLocations')
            ->findOrFail(Auth::id());

        $attendances = Attendance::where('user_id', $user->id)
            ->latest('date')
            ->paginate(10);

        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', today())
            ->first();

        return inertia('employee/attendance', [
            'attendances' => $attendances,
            'officeLocations' => $user->officeLocations
                ->where('is_active', true)
                ->values(),
            'todayAttendance' => $todayAttendance,
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
        try {

            $this->attendanceService->checkIn(
                Auth::user(),
                $request->validated()
            );

            return back()->with(
                'success',
                'Absensi berhasil.'
            );
        } catch (\Exception $e) {

            return back()->withErrors([
                'attendance' => $e->getMessage(),
            ]);
        }
    }

    public function checkOut(CheckOutAttendanceRequest $request)
    {
        try {

            $this->attendanceService->checkOut(
                Auth::user(),
                $request->validated()
            );

            return back()->with(
                'success',
                'Check-out berhasil.'
            );
        } catch (\Exception $e) {

            return back()->withErrors([
                'attendance' => $e->getMessage(),
            ]);
        }
    }

    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return back()->with(
            'success',
            'Absensi berhasil dihapus'
        );
    }
}
