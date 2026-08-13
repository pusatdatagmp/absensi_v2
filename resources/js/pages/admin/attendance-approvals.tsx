import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import Swal from "sweetalert2";

import MagicBento, {
    MagicBentoCard,
} from "@/components/MagicBento";

interface Attendance {
    id: number;
    date: string;
    check_in_time: string;
    distance: number;
    location: string | null;
    approval_status: "pending" | "approved" | "rejected";

    user: {
        id: number;
        name: string;
        position: string;
    };
}

interface Props {
    attendances: {
        data: Attendance[];
    };

    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

const breadcrumbs = [
    {
        title: "Approval Absensi",
        href: "/attendance-approvals",
    },
];

export default function AttendanceApprovals({
    attendances,
    pendingCount,
    approvedCount,
    rejectedCount,
}: Props) {
    const approve = async (id: number) => {
        const { value: note, isConfirmed } = await Swal.fire({
            title: "Approve Absensi",
            input: "textarea",
            inputLabel: "Catatan (Opsional)",
            inputPlaceholder: "Masukkan catatan approval...",
            inputAttributes: {
                maxlength: "255",
            },
            showCancelButton: true,
            confirmButtonText: "Approve",
            cancelButtonText: "Batal",

            background: "#111827",
            color: "#fff",

            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
        });

        if (!isConfirmed) return;

        router.put(
            `/attendance-approvals/${id}/approve`,
            {
                approval_note: note,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Absensi berhasil disetujui.",
                        timer: 1800,
                        showConfirmButton: false,
                        background: "#111827",
                        color: "#fff",
                    });
                },
            }
        );
    };

    const reject = async (id: number) => {
        const { value: note, isConfirmed } = await Swal.fire({
            title: "Tolak Absensi",

            input: "textarea",
            inputLabel: "Alasan Penolakan",

            inputPlaceholder: "Masukkan alasan penolakan...",

            inputValidator: (value) => {
                if (!value) {
                    return "Alasan penolakan wajib diisi.";
                }
            },

            showCancelButton: true,

            confirmButtonText: "Reject",
            cancelButtonText: "Batal",

            background: "#111827",
            color: "#fff",

            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
        });

        if (!isConfirmed) return;

        router.put(
            `/attendance-approvals/${id}/reject`,
            {
                approval_note: note,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Absensi berhasil ditolak.",
                        timer: 1800,
                        showConfirmButton: false,
                        background: "#111827",
                        color: "#fff",
                    });
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Approval Absensi" />

            <div className="min-h-screen overflow-hidden bg-[#09090B] text-white">

                {/* Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
                </div>

                <div className="relative z-10 p-6">

                    <MagicBento
                        cols="md:grid-cols-3"
                        enableTilt
                        enableMagnetism
                        enableStars
                        enableSpotlight
                        glowColor="139,92,246"
                        className="auto-rows-[minmax(180px,_auto)]"
                    >

                        {/* HEADER */}
                        <MagicBentoCard className="col-span-2 xl:col-span-4 p-8">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <h1 className="text-4xl font-bold tracking-tight">
                                        Approval Absensi
                                    </h1>

                                    <p className="mt-3 text-slate-400">
                                        Kelola absensi yang berada di luar radius
                                        kantor dan membutuhkan persetujuan admin.
                                    </p>

                                </div>

                            </div>

                        </MagicBentoCard>

                        {/* Pending */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Pending Approval
                                </span>

                                <h2 className="text-5xl font-bold text-yellow-400">
                                    {pendingCount}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* Approved */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Approved
                                </span>

                                <h2 className="text-5xl font-bold text-emerald-400">
                                    {approvedCount}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* Rejected */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Rejected
                                </span>

                                <h2 className="text-5xl font-bold text-red-400">
                                    {rejectedCount}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* TABLE */}
                        <MagicBentoCard className="col-span-2 xl:col-span-4 overflow-hidden p-0">

                            <div className="border-b border-white/10 p-6">

                                <h2 className="text-xl font-semibold">
                                    Daftar Approval Absensi
                                </h2>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="border-b border-white/10 bg-white/[0.02]">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                No
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Nama
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Jabatan
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Tanggal
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Jam
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Radius
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-center text-sm text-slate-400">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {attendances.data.length === 0 && (

                                            <tr>

                                                <td
                                                    colSpan={8}
                                                    className="py-10 text-center text-slate-500"
                                                >
                                                    Tidak ada data yang menunggu approval.
                                                </td>

                                            </tr>

                                        )}

                                        {attendances.data.map((attendance, index) => (

                                            <tr
                                                key={attendance.id}
                                                className="border-b border-white/5 transition hover:bg-white/[0.03]"
                                            >

                                                <td className="px-6 py-5">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-5 font-medium">
                                                    {attendance.user.name}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {attendance.user.position}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {attendance.date}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {attendance.check_in_time}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {attendance.distance} Meter
                                                </td>

                                                <td className="px-6 py-5">

                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-medium
                                                        ${attendance.approval_status ===
                                                                "pending"
                                                                ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                                                                : attendance.approval_status ===
                                                                    "approved"
                                                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                                                    : "border-red-500/20 bg-red-500/10 text-red-400"
                                                            }`}
                                                    >
                                                        {attendance.approval_status}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-center gap-2">

                                                        <button
                                                            onClick={() =>
                                                                approve(attendance.id)
                                                            }
                                                            className="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 transition hover:bg-emerald-500/20"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                reject(attendance.id)
                                                            }
                                                            className="rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                                                        >
                                                            Reject
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        </MagicBentoCard>

                    </MagicBento>

                </div>

            </div>

        </AppLayout>
    );
}