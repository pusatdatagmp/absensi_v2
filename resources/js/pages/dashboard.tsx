import MagicBento, {
    MagicBentoCard,
} from '@/components/MagicBento';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface AttendanceChart {
    name: string;
    total: number;
}

interface AttendanceData {
    id: number;
    name: string;
    position: string;
    checkIn: string;
    status: 'hadir' | 'izin' | 'tidak_hadir';
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    attendance_level: string;
}

interface StatisticItem {
    title: string;
    value: number;
    color: string;
}

interface PageProps {
    office: {
        latitude: number;
        longitude: number;
        radius: number;
    };

    statistics: StatisticItem[];
    attendanceData: AttendanceData[];
    attendanceChart: AttendanceChart[];
    notAttendanceData: AttendanceData[];
}

const statusConfig: Record<
    AttendanceData['status'],
    {
        label: string;
        className: string;
    }
> = {
    hadir: {
        label: 'Hadir',
        className:
            'border border-lime-500/20 bg-lime-500/15 text-lime-300',
    },

    izin: {
        label: 'Izin',
        className:
            'border border-violet-500/20 bg-violet-500/15 text-violet-300',
    },

    tidak_hadir: {
        label: 'Tidak Hadir',
        className:
            'border border-red-500/20 bg-red-500/15 text-red-300',
    },
};

export default function Dashboard() {

    const { office } = usePage<PageProps>().props;

    const OFFICE_LAT = office.latitude;
    const OFFICE_LNG = office.longitude;

    const [selectedTitle, setSelectedTitle] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState<AttendanceData[]>([]);

    function calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) {
        const R = 6371000;

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

        return R * c;
    }

    const {
        statistics = [],
        attendanceData = [],
        attendanceChart = [],
        notAttendanceData,
    } = usePage<PageProps>().props;

    const handleStatisticClick = (title: string) => {
        let employees: AttendanceData[] = [];

        switch (title) {
            case "Hadir":
                employees = attendanceData.filter(
                    (x) => x.status === "hadir"
                );
                break;

            case "Izin":
                employees = attendanceData.filter(
                    (x) => x.status === "izin"
                );
                break;

            case "Belum Absen":
            case "Tidak Hadir":
                employees = notAttendanceData;
                break;

            default:
                return;
        }

        setSelectedTitle(title);
        setSelectedEmployees(employees);
        setShowDetail(true);
    };


    console.log(attendanceData);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen overflow-hidden bg-[hsl(240,10%,4%)] text-white">

                {/* BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

                </div>

                {/* GRID BACKGROUND */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-40

                        [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)]
                        [background-size:40px_40px]
                    "
                />

                {/* GLOW */}
                <div
                    className="
        absolute
        left-1/2
        top-0
        h-[300px]
        w-[300px]
        md:h-[500px]
        md:w-[500px]
        -translate-x-1/2
        rounded-full
        bg-violet-500/10
        blur-3xl
        pointer-events-none
    "
                />

                <div className="relative z-10 p-6 space-y-4">

                    {/* HEADER */}
                    <div>

                        <h1
                            className="
                                bg-gradient-to-b
                                from-violet-200
                                to-violet-600
                                bg-clip-text
                                text-3xl
                                font-black
                                tracking-tight
                                text-transparent
                            "
                        >
                            Dashboard Admin
                        </h1>

                        <p className="mt-1 text-zinc-400">
                            Manage absensi karyawan perusahaan.
                        </p>

                    </div>

                    {/* STATISTICS */}
                    <MagicBento
                        enableStars
                        enableSpotlight
                        enableBorderGlow
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect
                        glowColor="139, 92, 246"
                        particleCount={10}
                        spotlightRadius={300}
                    >

                        {statistics.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleStatisticClick(item.title)}
                                className="cursor-pointer"
                            >
                                <MagicBentoCard

                                    className="
        p-6
        cursor-pointer
        transition-all
        duration-300
        hover:scale-[1.02]
    "
                                >

                                    {/* CARD GLOW */}
                                    <div
                                        className="
                                        absolute
                                        -right-10
                                        -top-10
                                        h-32
                                        w-32
                                        rounded-full
                                        bg-violet-500/10
                                        blur-3xl
                                    "
                                    />

                                    <div className="relative z-10">

                                        <p className="text-sm text-zinc-200">
                                            {item.title}
                                        </p>

                                        <h2
                                            className={`
                                            mt-4
                                            text-4xl
                                            font-black
                                            tracking-tight
                                            ${item.color}
                                        `}
                                        >
                                            {item.value}
                                        </h2>

                                    </div>

                                </MagicBentoCard>
                            </div>

                        ))}

                    </MagicBento>

                    {/* CHART */}
                    <MagicBento
                        enableStars
                        enableSpotlight
                        enableBorderGlow
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect
                        glowColor="99, 102, 241"
                        particleCount={12}
                        spotlightRadius={350}
                    >

                        <MagicBentoCard className="col-span-full p-6">

                            <div
                                className="
                                    absolute
                                    right-0
                                    top-0
                                    h-52
                                    w-52
                                    rounded-full
                                    bg-indigo-500/10
                                    blur-3xl
                                "
                            />

                            <div className="relative z-10">

                                <div className="mb-6">

                                    <h2 className="text-xl font-bold text-white">
                                        Grafik Absensi Karyawan
                                    </h2>

                                    <p className="text-sm text-zinc-400">
                                        Total absensi per karyawan
                                    </p>

                                </div>

                                <div className="h-[280px] w-full">

                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <BarChart
                                            data={attendanceChart}
                                            barCategoryGap={16}
                                        >

                                            <defs>

                                                <linearGradient
                                                    id="attendanceGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >

                                                    <stop
                                                        offset="0%"
                                                        stopColor="#8b5cf9"
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopColor="#ffff"
                                                    />

                                                </linearGradient>

                                                <linearGradient
                                                    id="absentGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor="#ef4444" />
                                                    <stop offset="100%" stopColor="#ffff" />
                                                </linearGradient>

                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="rgba(255,255,255,0.08)"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                angle={-30}
                                                tick={false}
                                                tickLine={false}
                                                axisLine={false}

                                            />

                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                                tick={{
                                                    fill: '#a3aaa1',
                                                    fontSize: 12,
                                                }}
                                            />

                                            <Tooltip
                                                cursor={{
                                                    fill: "rgba(99, 102, 241, 0.08)", // indigo transparan
                                                }}
                                                contentStyle={{
                                                    background:
                                                        '#09090b',
                                                    border:
                                                        '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius:
                                                        '16px',
                                                    color:
                                                        '#ffffff',
                                                }}
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="hadir"
                                                name="Hadir"
                                                fill="url(#attendanceGradient)"
                                                radius={[12, 12, 0, 0]}
                                            />

                                            <Bar
                                                dataKey="tidak_hadir"
                                                name="Tidak Hadir"
                                                fill="url(#absentGradient)"
                                                radius={[12, 12, 0, 0]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>

                        </MagicBentoCard>

                    </MagicBento>

                    {/* TABLE */}
                    <MagicBento
                        enableStars
                        enableSpotlight
                        enableBorderGlow
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect
                        glowColor="168, 85, 247"
                        particleCount={12}
                        spotlightRadius={350}
                    >

                        <MagicBentoCard className="col-span-full overflow-hidden">

                            {/* TABLE HEADER */}
                            <div className="border-b border-white/10 p-5">

                                <h2 className="text-xl font-bold text-white">
                                    Absensi Karyawan Hari Ini
                                </h2>

                            </div>

                            {/* TABLE */}
                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-white/[0.03]">

                                        <tr>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                No
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                Nama
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                Jabatan
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                Jam Masuk
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300">
                                                Radius
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {attendanceData.map((item, index) => {

                                            const status =
                                                statusConfig[item.status];

                                            const distance =
                                                item.latitude != null &&
                                                    item.longitude != null
                                                    ? calculateDistance(
                                                        item.latitude,
                                                        item.longitude,
                                                        OFFICE_LAT,
                                                        OFFICE_LNG
                                                    )
                                                    : null;

                                            const isFar =
                                                distance !== null &&
                                                distance > office.radius;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    className="
                                                        border-t
                                                        border-white/5
                                                        transition
                                                        hover:bg-white/[0.03]
                                                    "
                                                >

                                                    <td className="px-6 py-4 text-zinc-300">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-6 py-4 font-medium text-white">
                                                        {item.name}
                                                    </td>

                                                    <td className="px-6 py-4 text-zinc-400">
                                                        {item.position}
                                                    </td>

                                                    <td className="px-6 py-4 text-zinc-300">
                                                        {item.checkIn}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`
            rounded-full
            px-3
            py-1
            text-sm
            font-medium
            border

            ${item.attendance_level === "Bonus"
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                    : item.attendance_level === "Ontime"
                                                                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                        : item.attendance_level === "Telat 1"
                                                                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                                            : item.attendance_level === "Telat 2"
                                                                                ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                                                                : item.attendance_level === "Telat 3"
                                                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                                }
        `}
                                                        >
                                                            {item.attendance_level}
                                                        </span>
                                                    </td>

                                                    <td
                                                        className={`px-6 py-4 text-sm ${isFar
                                                            ? 'text-white font-semibold'
                                                            : 'text-green-300'
                                                            }`}
                                                    >
                                                        {item.location && distance !== null
                                                            ? `${Math.round(distance)} Meter`
                                                            : (
                                                                <span className="text-red-400">
                                                                    Tidak ada lokasi
                                                                </span>
                                                            )}
                                                    </td>

                                                </tr>

                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        </MagicBentoCard>

                    </MagicBento>

                    {showDetail && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

                            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">

                                <div className="flex items-center justify-between border-b border-white/10 p-6">

                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {selectedTitle}
                                        </h2>

                                        <p className="text-sm text-zinc-400">
                                            Total {selectedEmployees.length} karyawan
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowDetail(false)}
                                        className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20"
                                    >
                                        ✕
                                    </button>

                                </div>

                                <div className="max-h-[450px] overflow-y-auto">

                                    {selectedEmployees.length === 0 ? (

                                        <div className="p-8 text-center text-zinc-400">
                                            Tidak ada data.
                                        </div>

                                    ) : (

                                        selectedEmployees.map((employee, index) => (

                                            <div
                                                key={employee.id}
                                                className="flex items-center justify-between border-b border-white/5 px-6 py-4 hover:bg-white/[0.03]"
                                            >

                                                <div>

                                                    <div className="font-semibold text-white">
                                                        {index + 1}. {employee.name}
                                                    </div>

                                                    <div className="text-sm text-zinc-400">
                                                        {employee.position}
                                                    </div>

                                                </div>

                                                <span
                                                    className={`
                                    rounded-full
                                    px-3
                                    py-1
                                    text-xs

                                    ${employee.status === "hadir"
                                                            ? "bg-lime-500/20 text-lime-300"
                                                            : employee.status === "izin"
                                                                ? "bg-violet-500/20 text-violet-300"
                                                                : "bg-red-500/20 text-red-300"
                                                        }
                                `}
                                                >
                                                    {employee.status === "hadir"
                                                        ? "Hadir"
                                                        : employee.status === "izin"
                                                            ? "Izin"
                                                            : "Belum Absen"}
                                                </span>

                                            </div>

                                        ))

                                    )}

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </div >

        </AppLayout >
    );
}