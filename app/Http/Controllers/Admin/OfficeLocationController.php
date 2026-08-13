<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeLocation\StoreOfficeLocationRequest;
use App\Http\Requests\OfficeLocation\UpdateOfficeLocationRequest;
use App\Http\Resources\OfficeLocationResource;
use App\Models\OfficeLocation;
use Inertia\Inertia;
use Inertia\Response;

class OfficeLocationController extends Controller
{
    /**
     * Daftar lokasi kantor.
     */
    public function index(): Response
    {
        $locations = OfficeLocation::latest()->paginate(10);

        return Inertia::render('admin/office-locations/index', [
            'locations' => OfficeLocationResource::collection($locations),
            'statistics' => [
                'total' => OfficeLocation::count(),
                'active' => OfficeLocation::where('is_active', true)->count(),
            ],
        ]);
    }

    /**
     * Simpan lokasi baru.
     */
    public function store(StoreOfficeLocationRequest $request)
    {
        OfficeLocation::create($request->validated());

        return back()->with(
            'success',
            'Lokasi kantor berhasil ditambahkan.'
        );
    }

    /**
     * Update lokasi.
     */
    public function update(
        UpdateOfficeLocationRequest $request,
        OfficeLocation $officeLocation
    ) {
        $officeLocation->update($request->validated());

        return back()->with(
            'success',
            'Lokasi kantor berhasil diperbarui.'
        );
    }

    /**
     * Hapus lokasi.
     */
    public function destroy(OfficeLocation $officeLocation)
    {
        $officeLocation->delete();

        return back()->with(
            'success',
            'Lokasi kantor berhasil dihapus.'
        );
    }
}
