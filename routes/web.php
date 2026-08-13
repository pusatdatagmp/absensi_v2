<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\EmployeeAuthController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AttendanceApprovalController;
use App\Http\Controllers\Admin\OfficeLocationController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// =========================
// ADMIN
// =========================

Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // ============ CRUD EMPLOYEES ============
    Route::get('/employees', [EmployeeController::class, 'index'])
        ->name('employees');

    Route::post('/employees', [EmployeeController::class, 'store'])
        ->name('employees.store');

    Route::put('/employees/{user}', [EmployeeController::class, 'update'])
        ->name('employees.update');

    Route::delete('/employees/{user}', [EmployeeController::class, 'destroy'])
        ->name('employees.destroy');

    // ============ APPROVAL EMPLOYEE ============
    Route::get(
        '/attendance-approvals',
        [AttendanceApprovalController::class, 'index']
    )->name('attendance-approvals');

    Route::put(
        '/attendance-approvals/{attendance}/approve',
        [AttendanceApprovalController::class, 'approve']
    )->name('attendance-approvals.approve');

    Route::put(
        '/attendance-approvals/{attendance}/reject',
        [AttendanceApprovalController::class, 'reject']
    )->name('attendance-approvals.reject');

    // ========== Detail Employee ==========
    Route::get('/employees/{user}', [EmployeeController::class, 'show'])
        ->name('employees.show');

    Route::delete(
        '/attendances/{attendance}',
        [AttendanceController::class, 'destroy']
    );
    // Download PDF
    Route::get('/employees/{employee}/export-pdf', [EmployeeController::class, 'exportPdf']);
});


// =========================
// OFFICE SETTING MASTER
// =========================

Route::middleware(['auth', 'role:admin'])
    ->prefix('office-locations')
    ->name('office-locations.')
    ->group(function () {

        Route::get('/', [OfficeLocationController::class, 'index'])
            ->name('index');

        Route::post('/', [OfficeLocationController::class, 'store'])
            ->name('store');

        Route::put('/{officeLocation}', [OfficeLocationController::class, 'update'])
            ->name('update');

        Route::delete('/{officeLocation}', [OfficeLocationController::class, 'destroy'])
            ->name('destroy');
    });


// =========================
// EMPLOYEE AUTH
// =========================

Route::get('/employee-login', function () {
    return Inertia::render('auth/employee-login');
})->name('employee.login');

Route::post('/employee-login', [EmployeeAuthController::class, 'login'])
    ->name('employee.login.post');

Route::post('/logout', [EmployeeAuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');


// =========================
// EMPLOYEE
// =========================

Route::middleware(['auth', 'role:employee'])->group(function () {

    Route::get('/employee/attendance', [AttendanceController::class, 'index']);
    Route::get('/employee', [AttendanceController::class, 'index'])
        ->name('employee.dashboard');

    Route::post('/employee/attendance', [AttendanceController::class, 'store'])
        ->name('employee.attendance.store');

    Route::post('/employee/attendance/checkout', [AttendanceController::class, 'checkOut'])
        ->name('employee.attendance.checkout');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
