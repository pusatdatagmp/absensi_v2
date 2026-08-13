import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";

import MagicBento, {
    MagicBentoCard,
} from "@/components/MagicBento";

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
}

interface Attendance {
    id: number;
    date: string;
    check_in_time: string;
    check_out_time: string | null;
    created_at: string;
    status: 'hadir' | 'izin';
    attendance_level: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    approval_note: string | null;
}

interface AttendancePagination {
    data: Attendance[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    employee: Employee;
    attendances: AttendancePagination;
    filters: {
        month: string;
        status: string;
    };

    [key: string]: unknown;
}
export default function EmployeeDetail() {

    const {
        employee,
        attendances,
        filters,
    } = usePage<PageProps>().props;

    const [month, setMonth] = useState(
        filters.month || ''
    );

    const [statusFilter, setStatusFilter] =
        useState<'all' | 'hadir' | 'izin'>(
            (filters.status as any) || 'all'
        );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Daftar Karyawan',
            href: '/employees',
        },
        {
            title: employee.name,
            href: `/employees/${employee.id}`,
        },
    ];

    useEffect(() => {
        router.get(
            `/employees/${employee.id}`,
            {
                month,
                status: statusFilter,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    }, [month, statusFilter]);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={employee.name} />

            <div className="min-h-screen overflow-hidden bg-[#09090B] text-white">

                {/* BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

                </div>


                <div className="relative z-10 p-6 space-y-4">

                    {/* HEADER */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                                Detail Karyawan
                            </h1>

                            <p className="mt-2 text-white/50">
                                Informasi profile dan riwayat absensi karyawan.
                            </p>
                        </div>

                        <button
                            onClick={() => router.visit('/employees')}
                            className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-5
                            py-3
                            text-sm
                            font-medium
                            backdrop-blur-xl
                            transition
                            hover:bg-white/[0.06]
                        "
                        >
                            Kembali
                        </button>

                    </div>

                    {/* MAGIC BENTO */}
                    <MagicBento
                        enableStars
                        enableSpotlight
                        enableBorderGlow
                        enableTilt
                        clickEffect
                        glowColor="6, 182, 212"
                        className="grid-cols-1 xl:grid-cols-2 mt-4"
                    >

                        {/* PROFILE */}
                        <MagicBentoCard className="xl:col-span-3 p-8">

                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

                            <div className="relative z-10">

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div>

                                        <div
                                            className="
                                            mb-5
                                            flex
                                            h-20
                                            w-20
                                            items-center
                                            justify-center
                                            rounded-3xl
                                            bg-cyan-500/10
                                            text-3xl
                                            font-bold
                                            text-cyan-400
                                        "
                                        >
                                            {employee.name.charAt(0)}
                                        </div>

                                        <h2 className="text-3xl font-bold">
                                            {employee.name}
                                        </h2>

                                        <p className="mt-2 text-white/50">
                                            {employee.email}
                                        </p>

                                    </div>

                                    <div
                                        className="
                                        rounded-2xl
                                        border
                                        border-lime-500/20
                                        bg-lime-500/10
                                        px-4
                                        py-2
                                        text-sm
                                        font-medium
                                        text-lime-400
                                    "
                                    >
                                        Aktif
                                    </div>

                                </div>

                                <div className="mt-8 grid gap-4 md:grid-cols-3">

                                    <div
                                        className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        p-5
                                    "
                                    >
                                        <p className="text-sm text-white/50">
                                            Jabatan
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            {employee.position}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        p-5
                                    "
                                    >
                                        <p className="text-sm text-white/50">
                                            Total Absensi
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            {attendances.data.length}
                                        </p>
                                    </div>

                                    <div
                                        className="
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        p-5
                                    "
                                    >
                                        <p className="text-sm text-white/50">
                                            Status
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-cyan-400">
                                            Aktif
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </MagicBentoCard>

                        {/* STATS */}
                        <MagicBentoCard className="p-8">

                            <div className="flex h-full flex-col justify-between">

                                <div>

                                    <p className="text-sm uppercase tracking-widest text-cyan-400">
                                        Statistik
                                    </p>

                                    <h3 className="mt-3 text-4xl font-bold">
                                        {attendances.data.length}
                                    </h3>

                                    <p className="mt-2 text-white/50">
                                        Total data absensi ditemukan.
                                    </p>

                                </div>

                                <div className="mt-10 space-y-4">

                                    <div>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-white/50">
                                                Hadir
                                            </span>

                                            <span>
                                                {
                                                    attendances.data.filter(
                                                        (a) =>
                                                            a.status === "hadir"
                                                    ).length
                                                }
                                            </span>
                                        </div>

                                        <div className="h-2 rounded-full bg-white/10">

                                            <div
                                                className="h-2 rounded-full bg-cyan-400"
                                                style={{
                                                    width: `${(attendances.data.filter(
                                                        (a) =>
                                                            a.status === "hadir"
                                                    ).length /
                                                        (attendances.data.length ||
                                                            1)) *
                                                        100
                                                        }%`,
                                                }}
                                            />

                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="text-white/50">
                                                Izin
                                            </span>

                                            <span>
                                                {
                                                    attendances.data.filter(
                                                        (a) =>
                                                            a.status === "izin"
                                                    ).length
                                                }
                                            </span>
                                        </div>

                                        <div className="h-2 rounded-full bg-white/10">

                                            <div
                                                className="h-2 rounded-full bg-violet-400"
                                                style={{
                                                    width: `${(attendances.data.filter(
                                                        (a) =>
                                                            a.status === "izin"
                                                    ).length /
                                                        (attendances.data.length ||
                                                            1)) *
                                                        100
                                                        }%`,
                                                }}
                                            />

                                        </div>
                                    </div>

                                </div>

                            </div>

                        </MagicBentoCard>

                    </MagicBento>

                    {/* ATTENDANCE TABLE */}
                    <MagicBento
                        enableStars
                        enableSpotlight
                        enableBorderGlow
                        enableTilt
                        clickEffect
                        glowColor="6, 182, 212"
                        className="
        w-full
        grid-cols-1
    "
                    >

                        <MagicBentoCard
                            id="print-area"
                            className="
        w-full
        min-w-0
        overflow-hidden

        md:col-span-2
        xl:col-span-4
    "
                        >

                            {/* TOPBAR */}
                            <div
                                className="
                flex
                flex-col
                gap-5
                border-b
                border-white/10
                p-6
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
                            >

                                <div>

                                    <h2 className="text-2xl font-bold text-white">
                                        Riwayat Absensi
                                    </h2>

                                    <p className="mt-1 text-white/50">
                                        Data absensi seluruh karyawan.
                                    </p>

                                </div>

                                <div className="flex flex-col gap-4 lg:flex-row">

                                    {/* FILTER BULAN */}
                                    <input
                                        type="month"
                                        value={month}
                                        onChange={(e) =>
                                            setMonth(e.target.value)
                                        }
                                        className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-3
                        text-white
                        outline-none
                        transition
                        focus:border-cyan-400
                    "
                                    />

                                    {/* FILTER STATUS */}
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(
                                                e.target.value as
                                                | "all"
                                                | "hadir"
                                                | "izin"
                                            )
                                        }
                                        className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-3
                        text-white
                        outline-none
                        transition
                        focus:border-cyan-400
                    "
                                    >
                                        <option
                                            value="all"
                                            className="bg-slate-950"
                                        >
                                            Semua
                                        </option>

                                        <option
                                            value="hadir"
                                            className="bg-slate-950"
                                        >
                                            Hadir
                                        </option>

                                        <option
                                            value="izin"
                                            className="bg-slate-950"
                                        >
                                            Izin
                                        </option>

                                    </select>

                                    {/* EXPORT */}
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams();

                                            if (month) {
                                                params.append("month", month);
                                            }

                                            window.open(
                                                `/employees/${employee.id}/export-pdf?${params.toString()}`,
                                                "_blank"
                                            );
                                        }}
                                        className="
        rounded-2xl
        bg-cyan-500
        px-5
        py-3
        text-sm
        font-semibold
        text-black
        transition
        hover:scale-[1.02]
        hover:bg-cyan-400
    "
                                    >
                                        Export PDF
                                    </button>

                                </div>

                            </div>

                            {/* TABLE */}
                            <div className="w-full overflow-x-auto">

                                <table className="min-w-full table-auto">

                                    <thead className="border-b border-white/10 bg-white/[0.02]">

                                        <tr>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                No
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Tanggal
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Check-in
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Check-out
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Status
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Level
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Lokasi
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Keterangan
                                            </th>

                                            <th className="px-6 py-5 text-left text-sm font-semibold text-white/60">
                                                Aksi
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {attendances.data.length > 0 ? (

                                            attendances.data.map(
                                                (attendance, index) => (

                                                    <tr
                                                        key={attendance.id}
                                                        className="
                                        border-b
                                        border-white/5
                                        transition
                                        hover:bg-white/[0.03]
                                    "
                                                    >

                                                        <td className="px-6 py-5 text-white">
                                                            {
                                                                ((attendances.current_page - 1) * attendances.per_page)
                                                                + index
                                                                + 1
                                                            }
                                                        </td>

                                                        <td className="px-6 py-5 text-white/80">

                                                            {new Date(
                                                                attendance.date
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}

                                                        </td>

                                                        <td className="px-6 py-5 text-white/80">
                                                            {attendance.check_in_time}
                                                        </td>

                                                        <td className="px-6 py-5 text-white/80">
                                                            {attendance.check_out_time ?? "-"}
                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span
                                                                className={`rounded-full px-4 py-2 text-xs font-semibold ${attendance.status === "hadir"
                                                                    ? "bg-cyan-500/10 text-cyan-400"
                                                                    : "bg-violet-500/10 text-violet-400"
                                                                    }`}
                                                            >
                                                                {attendance.status === "hadir"
                                                                    ? "Hadir"
                                                                    : "Izin"}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span
                                                                className={`
            rounded-full
            px-4
            py-2
            text-xs
            font-semibold
            ${attendance.attendance_level === "Bonus"
                                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                                        : attendance.attendance_level === "Ontime"
                                                                            ? "bg-blue-500/10 text-blue-400"
                                                                            : attendance.attendance_level === "Telat 1"
                                                                                ? "bg-yellow-500/10 text-yellow-400"
                                                                                : attendance.attendance_level === "Telat 2"
                                                                                    ? "bg-orange-500/10 text-orange-400"
                                                                                    : attendance.attendance_level === "Telat 3"
                                                                                        ? "bg-red-500/10 text-red-400"
                                                                                        : attendance.attendance_level === "Setengah Hari"
                                                                                            ? "bg-rose-500/10 text-rose-400"
                                                                                            : "bg-violet-500/10 text-violet-400"
                                                                    }
        `}
                                                            >
                                                                {attendance.attendance_level ?? "-"}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5 text-white">
                                                            {attendance.latitude && attendance.longitude
                                                                ? `${attendance.latitude}, ${attendance.longitude}`
                                                                : '-'}
                                                        </td>

                                                        <td className="px-6 py-5 text-white/70">
                                                            {attendance.approval_note ?? "-"}
                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <button
                                                                onClick={() => {

                                                                    Swal.fire({
                                                                        title: 'Yakin?',
                                                                        text: 'Data absensi akan dihapus permanen',
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#ef4444',
                                                                        cancelButtonColor: '#6b7280',
                                                                        confirmButtonText: 'Ya, hapus',
                                                                        cancelButtonText: 'Batal',
                                                                        background: '#020617',
                                                                        color: '#fff',
                                                                    }).then((result) => {

                                                                        if (result.isConfirmed) {

                                                                            router.delete(
                                                                                `/attendances/${attendance.id}`
                                                                            );
                                                                        }
                                                                    });
                                                                }}
                                                                className="
                                                rounded-xl
                                                bg-red-500/10
                                                px-4
                                                py-2
                                                text-sm
                                                text-red-400
                                                transition
                                                hover:bg-red-500/20
                                            "
                                                            >
                                                                Hapus
                                                            </button>

                                                        </td>

                                                    </tr>
                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-16 text-center text-white/40"
                                                >
                                                    Belum ada absensi
                                                </td>

                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                                <div className="flex items-center justify-between border-t border-white/10 p-6">
                                    <span className="text-sm text-white/50">
                                        Menampilkan {attendances.data.length} dari {attendances.total} data
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={attendances.current_page === 1}
                                            onClick={() =>
                                                router.get(
                                                    `/employees/${employee.id}`,
                                                    {
                                                        page: attendances.current_page - 1,
                                                        month,
                                                        status: statusFilter,
                                                    },
                                                    { preserveState: true }
                                                )
                                            }
                                        >
                                            Prev
                                        </button>

                                        <span>
                                            {attendances.current_page} / {attendances.last_page}
                                        </span>

                                        <button
                                            disabled={
                                                attendances.current_page ===
                                                attendances.last_page
                                            }
                                            onClick={() =>
                                                router.get(
                                                    `/employees/${employee.id}`,
                                                    {
                                                        page: attendances.current_page + 1,
                                                        month,
                                                        status: statusFilter,
                                                    },
                                                    { preserveState: true }
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </MagicBentoCard>

                    </MagicBento>

                </div>

            </div>
        </AppLayout>
    );

}