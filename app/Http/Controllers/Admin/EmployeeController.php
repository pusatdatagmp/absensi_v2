<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LateLevel;
use App\Models\OfficeLocation;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Setting;
use App\Services\AttendanceService;


class EmployeeController extends Controller
{
    protected AttendanceService $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index()
    {
        $employees = User::where('role', 'employee')
            ->with('officeLocations:id,name')
            ->select(
                'id',
                'name',
                'email',
                'position',
            )
            ->latest()
            ->get();

        return Inertia::render('admin/employees', [
            'employees' => $employees,
            'officeLocations' => OfficeLocation::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    // TAMBAH
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'pin' => 'required|min:4|max:10',
                'position' => 'required|string|max:100',
                'office_location_ids' => [
                    'required',
                    'array',
                    'min:1',
                ],
                'office_location_ids.*' => [
                    'exists:office_locations,id',
                ],
            ],
            [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah digunakan oleh karyawan lain.',

                'name.required' => 'Nama wajib diisi.',
                'pin.required' => 'PIN wajib diisi.',
                'position.required' => 'Jabatan wajib diisi.',

                'office_location_ids.required' => 'Pilih minimal satu lokasi kantor.',
                'office_location_ids.min' => 'Pilih minimal satu lokasi kantor.',
            ]
        );

        $user = User::create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'email' => $validated['email'],
            'pin' => $validated['pin'],
            'role' => 'employee',
            'password' => 'password',
        ]);

        $user->officeLocations()->sync($validated['office_location_ids']);

        return back()->with('success', 'Karyawan berhasil ditambahkan');
    }

    // EDIT
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'pin' => 'nullable|min:4|max:10',
            'position' => 'required|string|max:100',
            'office_location_ids' => [
                'required',
                'array',
                'min:1',
            ],
            'office_location_ids.*' => [
                'exists:office_locations,id',
            ],
        ], [
            'office_location_ids.required' => 'Pilih minimal satu lokasi kantor.',
            'office_location_ids.min' => 'Pilih minimal satu lokasi kantor.',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'position' => $validated['position'],
        ]);

        $user->officeLocations()->sync($validated['office_location_ids']);

        if ($request->filled('pin')) {
            $user->update([
                'pin' => $validated['pin'],
            ]);
        }

        return back()->with('success', 'Karyawan berhasil diupdate');
    }

    // HAPUS
    public function destroy(User $user)
    {
        $user->delete();

        return back()->with('success', 'Karyawan berhasil dihapus');
    }


    // Detail
    public function show(Request $request, User $user)
    {
        $setting = Setting::first();
        $lateLevels = LateLevel::orderBy('minutes')->get();
        $attendances = $user->attendances()

            ->where('approval_status', 'approved')

            ->select(
                'id',
                'date',
                'check_in_time',
                'check_out_time',
                'status',
                'location',
                'latitude',
                'longitude',
                'approval_note',
                'created_at'
            )

            ->when($request->filled('month'), function ($query) use ($request) {
                [$year, $month] = explode('-', $request->month);

                $query->whereYear('date', $year)
                    ->whereMonth('date', $month);
            })

            ->when(
                $request->filled('status')
                    && $request->status !== 'all',
                fn($query) => $query->where('status', $request->status)
            )

            ->latest()
            ->paginate(10)
            ->through(function ($attendance) use ($setting, $lateLevels) {

                $attendance->attendance_level = $this->attendanceService->resolveAttendanceLevel(
                    $attendance,
                    $setting,
                    $lateLevels
                );

                return $attendance;
            })

            ->withQueryString();

        return Inertia::render('admin/employee-detail', [
            'employee' => $user,

            'attendances' => $attendances,

            'filters' => [
                'month' => $request->month,
                'status' => $request->status ?? 'all',
            ],
        ]);
    }

    // Export PDF
    public function exportPdf(Request $request, int $id)
    {
        $employee = User::findOrFail($id);
        $setting = Setting::first();
        $lateLevels = LateLevel::orderBy('minutes')->get();

        $attendances = $employee
            ->attendances()

            ->where('approval_status', 'approved')

            ->when($request->filled('month'), function ($query) use ($request) {

                [$year, $month] = explode('-', $request->month);

                $query->whereYear('date', $year)
                    ->whereMonth('date', $month);
            })

            ->latest()
            ->get()


            ->map(function ($attendance) use ($setting, $lateLevels) {

                $attendance->attendance_level = $this->attendanceService->resolveAttendanceLevel(
                    $attendance,
                    $setting,
                    $lateLevels
                );

                return $attendance;
            });

        $totalHadir = $attendances
            ->where('status', 'hadir')
            ->count();

        $totalIzin = $attendances
            ->where('status', 'izin')
            ->count();

        $hariDalamBulan = $request->filled('month')
            ? \Carbon\Carbon::createFromFormat(
                'Y-m',
                $request->month
            )->daysInMonth
            : now()->daysInMonth;

        $totalTidakHadir = max(
            0,
            $hariDalamBulan - $totalHadir - $totalIzin
        );

        $pdf = Pdf::loadView('pdf.employee', [
            'employee' => $employee,
            'attendances' => $attendances,
            'month' => $request->month,

            'totalHadir' => $totalHadir,
            'totalIzin' => $totalIzin,
            'totalTidakHadir' => $totalTidakHadir,
        ]);

        return $pdf->download(
            'absensi-' . $employee->name . '.pdf'
        );
    }
}
