<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceApprovalController extends Controller
{
    /**
     * Daftar absensi yang menunggu approval.
     */
    public function index()
    {
        $attendances = Attendance::with('user')
            ->where('approval_status', 'pending')
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/attendance-approvals', [

            'attendances' => $attendances,

            'pendingCount' => Attendance::where(
                'approval_status',
                'pending'
            )->count(),

            'approvedCount' => Attendance::where(
                'approval_status',
                'approved'
            )->count(),

            'rejectedCount' => Attendance::where(
                'approval_status',
                'rejected'
            )->count(),
        ]);
    }

    /**
     * Approve absensi.
     */
    public function approve(Request $request, Attendance $attendance)
    {
        $request->validate([
            'approval_note' => 'nullable|string|max:500',
        ]);

        $attendance->update([
            'approval_status' => 'approved',
            'approved_by'     => auth()->id(),
            'approved_at'     => now(),
            'approval_note'   => $request->approval_note,
        ]);

        return back()->with(
            'success',
            'Absensi berhasil disetujui.'
        );
    }

    /**
     * Reject absensi.
     */
    public function reject(Request $request, Attendance $attendance)
    {
        $request->validate([
            'approval_note' => 'required|string|max:500',
        ]);

        $attendance->update([
            'approval_status' => 'rejected',
            'approved_by'     => auth()->id(),
            'approved_at'     => now(),
            'approval_note'   => $request->approval_note,
        ]);

        return back()->with(
            'success',
            'Absensi berhasil ditolak.'
        );
    }
}
