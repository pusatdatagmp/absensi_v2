<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\LateLevelController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    /*
    |--------------------------------------------------------------------------
    | Office Settings
    |--------------------------------------------------------------------------
    */

    Route::get('settings/office', [SettingController::class, 'index'])
        ->middleware('role:admin')
        ->name('office.edit');

    Route::put('settings/office', [SettingController::class, 'update'])
        ->middleware('role:admin')
        ->name('office.update');

    /*
    |--------------------------------------------------------------------------
    | Late Levels (dinamis)
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')
        ->prefix('late-levels')
        ->name('late-levels.')
        ->group(function () {

            Route::post('/', [LateLevelController::class, 'store'])
                ->name('store');

            Route::put('/{lateLevel}', [LateLevelController::class, 'update'])
                ->name('update');

            Route::delete('/{lateLevel}', [LateLevelController::class, 'destroy'])
                ->name('destroy');
        });
});
