<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LateLevel;
use Illuminate\Http\Request;

class LateLevelController extends Controller
{
    /**
     * Simpan level telat baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'label' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'minutes' => [
                    'required',
                    'integer',
                    'min:1',
                    'unique:late_levels,minutes',
                ],
            ],
            [
                'label.required' => 'Nama level wajib diisi.',
                'minutes.required' => 'Toleransi menit wajib diisi.',
                'minutes.min' => 'Toleransi menit minimal 1.',
                'minutes.unique' => 'Sudah ada level dengan toleransi menit yang sama.',
            ]
        );

        LateLevel::create($validated);

        return back()->with('success', 'Level telat berhasil ditambahkan.');
    }

    /**
     * Update level telat.
     */
    public function update(Request $request, LateLevel $lateLevel)
    {
        $validated = $request->validate(
            [
                'label' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'minutes' => [
                    'required',
                    'integer',
                    'min:1',
                    'unique:late_levels,minutes,' . $lateLevel->id,
                ],
            ],
            [
                'label.required' => 'Nama level wajib diisi.',
                'minutes.required' => 'Toleransi menit wajib diisi.',
                'minutes.min' => 'Toleransi menit minimal 1.',
                'minutes.unique' => 'Sudah ada level dengan toleransi menit yang sama.',
            ]
        );

        $lateLevel->update($validated);

        return back()->with('success', 'Level telat berhasil diperbarui.');
    }

    /**
     * Hapus level telat.
     */
    public function destroy(LateLevel $lateLevel)
    {
        $lateLevel->delete();

        return back()->with('success', 'Level telat berhasil dihapus.');
    }
}
