<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSettingRequest;
use App\Models\LateLevel;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Menampilkan halaman setting.
     */
    public function index(): Response
    {
        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create([
                'company_name'      => 'PT Contoh',
                'office_name'       => null,
                'office_latitude'   => 0,
                'office_longitude'  => 0,
                'attendance_radius' => 100,
                'check_in_start'    => null,
                'check_in_end'      => null,
                'check_out'         => null,
            ]);
        }

        return Inertia::render('admin/settings/index', [
            'setting' => $setting,
            'lateLevels' => LateLevel::orderBy('minutes')->get(),
        ]);
    }

    /**
     * Update setting.
     */
    public function update(UpdateSettingRequest $request)
    {
        $setting = Setting::first();

        $setting->update($request->validated());

        return back()->with('success', 'Setting berhasil diperbarui.');
    }
}
