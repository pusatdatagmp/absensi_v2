import { Head, router, useForm, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DotGrid from "@/components/dot-grid";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface OfficeLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
}

interface AttendanceItem {
    id: number;
    status: "hadir" | "izin";
    date: string;
    check_in_time: string;
    check_out_time: string | null;
    location: string | null;
    approval_status: "approved" | "pending" | "rejected";
    approval_note: string | null;
}

interface TodayAttendance {
    id: number;
    status: "hadir" | "izin";
    check_in_time: string;
    check_out_time: string | null;
    approval_status: "approved" | "pending" | "rejected";
    approval_note: string | null;
}

// ========== Rumus Haversine ==========
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

export default function Attendance() {

    const {
        auth,
        attendances,
        officeLocations,
        todayAttendance,
    } = usePage().props as {
        auth?: { user?: User };

        officeLocations?: OfficeLocation[];

        todayAttendance?: TodayAttendance | null;

        attendances?: {
            data: AttendanceItem[];
            links: any[];
        };
    };

    const user = auth?.user;

    const form = useForm({
        status: "",
        latitude: "",
        longitude: "",
        location: "",
    });

    const checkOutForm = useForm({
        latitude: "",
        longitude: "",
        location: "",
    });

    const [distance, setDistance] = useState<number | null>(null);
    const [nearestLocation, setNearestLocation] =
        useState<OfficeLocation | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    const [location, setLocation] = useState<{
        latitude: number | null;
        longitude: number | null;
    }>({
        latitude: null,
        longitude: null,
    });

    const hasCheckedIn = !!todayAttendance;
    const hasCheckedOut = !!todayAttendance?.check_out_time;
    const canCheckOut =
        hasCheckedIn &&
        todayAttendance?.status === "hadir" &&
        !hasCheckedOut;


    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                console.log("Lokasi tidak diizinkan");
            }
        );
    }, []);

    // Hitung jarak ke setiap lokasi kantor yang di-assign, lalu pilih yang
    // terdekat. Dipindah ke useEffect supaya tidak dijalankan ulang di setiap
    // render (menaruh setState langsung di body komponen menyebabkan infinite loop).
    useEffect(() => {
        if (
            location.latitude != null &&
            location.longitude != null &&
            officeLocations &&
            officeLocations.length > 0
        ) {
            let closest: OfficeLocation | null = null;
            let closestDistance = Infinity;

            for (const office of officeLocations) {
                const d = calculateDistance(
                    location.latitude,
                    location.longitude,
                    office.latitude,
                    office.longitude
                );

                if (d < closestDistance) {
                    closestDistance = d;
                    closest = office;
                }
            }

            setNearestLocation(closest);
            setDistance(closest ? closestDistance : null);
        }
    }, [location.latitude, location.longitude, officeLocations]);

    const submitAttendance = (
        attendanceStatus: "hadir" | "izin"
    ) => {

        // ======================
        // IZIN
        // ======================
        if (attendanceStatus === "izin") {

            form.transform(() => ({
                status: "izin",
                latitude: "",
                longitude: "",
                location: "",
            }));

            form.post("/employee/attendance", {

                onSuccess: () => {

                    Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Izin berhasil dikirim",
                    });
                },

                onError: (errors) => {

                    console.log(errors);

                    Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Izin gagal",
                    });
                },
            });

            return;
        }

        // ======================
        // HADIR
        // ======================
        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                setLocation({
                    latitude,
                    longitude,
                });

                form.transform(() => ({
                    status: "hadir",
                    latitude: String(latitude),
                    longitude: String(longitude),
                    location: `${latitude}, ${longitude}`,
                }));

                form.post("/employee/attendance", {

                    onSuccess: () => {

                        Swal.fire({
                            icon: "success",
                            title: "Berhasil",
                            text: "Absensi berhasil",
                        });
                    },

                    onError: (errors) => {

                        Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: errors.attendance || "Absensi gagal",
                        });
                    },
                });
            },

            () => {

                Swal.fire({
                    icon: "error",
                    title: "Lokasi Ditolak",
                    text: "Izinkan akses lokasi",
                });
            }
        );
    };

    const submitCheckOut = () => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                setLocation({
                    latitude,
                    longitude,
                });

                checkOutForm.transform(() => ({
                    latitude: String(latitude),
                    longitude: String(longitude),
                    location: `${latitude}, ${longitude}`,
                }));

                checkOutForm.post("/employee/attendance/checkout", {

                    onSuccess: () => {

                        Swal.fire({
                            icon: "success",
                            title: "Berhasil",
                            text: "Check-out berhasil",
                        });
                    },

                    onError: (errors) => {

                        Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: errors.attendance || "Check-out gagal",
                        });
                    },
                });
            },

            () => {

                Swal.fire({
                    icon: "error",
                    title: "Lokasi Ditolak",
                    text: "Izinkan akses lokasi",
                });
            }
        );
    };

    const handleCheckOut = async () => {
        const result = await Swal.fire({
            title: "Konfirmasi Check-out",
            text: "Apakah Anda yakin ingin check-out sekarang?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Check-out",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            submitCheckOut();
        }
    };

    const handleLogout = () => {
        router.post("/logout");
    };

    const currentDate = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const currentTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Konfirmasi sebelum klik hadir/izin
    const handleAttendance = async (attendanceStatus: "hadir" | "izin") => {
        const result = await Swal.fire({
            title: "Konfirmasi Absensi",
            text: `Apakah Anda yakin ingin memilih "${attendanceStatus === "hadir" ? "Hadir" : "Izin"
                }"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            submitAttendance(attendanceStatus);
        }
    };

    return (
        <>
            <Head title="Absensi Karyawan" />

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <DotGrid />
            </div>

            <div className="min-h-screen flex items-center justify-center p-4 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >

                    <div
                        className="
                    overflow-hidden
                    rounded-3xl
                    border border-white/10
                    bg-white/10
                    shadow-2xl
                    text-white
                "
                    >

                        {/* HEADER */}
                        <div
                            className="
                        relative
                        overflow-hidden
                        border-b border-white/10
                        bg-gradient-to-r
                        from-gray-200/20
                        via-purple-500/20
                        to-indigo-500/20
                        px-6 py-6 sm:px-8 sm:py-8
                    "
                        >

                            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                                {/* Informasi User */}
                                <div className="order-2 text-center lg:order-1 lg:text-left">
                                    <p className="text-sm text-zinc-300">
                                        Selamat datang 👋
                                    </p>

                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                        Absensi
                                    </h1>

                                    <h2 className="mt-3 text-lg font-medium text-zinc-200">
                                        {user?.name}
                                    </h2>
                                </div>

                                {/* Avatar & Action */}
                                <div className="order-1 flex flex-col items-center gap-5 lg:order-2 lg:items-end">

                                    {/* Avatar */}
                                    <div
                                        className="
                flex h-20 w-20 items-center justify-center
                rounded-3xl
                border border-white/20
                bg-white/10
                text-4xl
                shadow-xl
                backdrop-blur-xl
            "
                                    >
                                        👤
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setShowHistory(true)}
                                            className="
                    flex flex-1 items-center w-2/3 mx-auto justify-center gap-2
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    px-5 py-3
                    text-sm font-medium
                    text-white
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white/20
                "
                                        >
                                            <span>📋</span>
                                            <span>Riwayat Absensi</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleLogout}
                                            className="
                    flex flex-1 items-center w-2/3 mx-auto justify-center gap-2
                    rounded-2xl
                    border border-red-400/20
                    bg-red-500/10
                    px-5 py-3
                    text-sm font-medium
                    text-red-200
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-red-500/20
                "
                                        >
                                            <span>🚪</span>
                                            <span>Logout</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Glow */}
                            <div
                                className="
                            absolute
                            -top-20
                            right-0
                            h-52
                            w-52
                            rounded-full
                            bg-purple-500/20
                            blur-3xl
                        "
                            />

                        </div>

                        {/* CONTENT */}
                        <div className="p-6 sm:p-4">



                            <div
                                className="
    
        rounded-2xl
        border
        border-indigo-500/20
        bg-slate-800/80
        p-5
    "
                            >

                                <p className="text-sm text-indigo-300">
                                    Lokasi Kantor Terdekat
                                </p>

                                <h3 className="mt-2 text-xl font-bold">
                                    {nearestLocation?.name ?? "-"}
                                </h3>

                                <p className="mt-2 text-white/70">
                                    Radius:
                                    {" "}
                                    {nearestLocation?.radius ?? "-"}
                                    {" "}
                                    Meter
                                </p>

                                {officeLocations && officeLocations.length > 1 && (
                                    <p className="mt-2 text-xs text-white/50">
                                        Terdaftar di {officeLocations.length} lokasi kantor
                                    </p>
                                )}

                            </div>

                            {/* BUTTON */}
                            <div className="mt-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                {/* HADIR */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleAttendance("hadir")}
                                    disabled={form.processing || hasCheckedIn}
                                    className="
                                group
                                relative
                                overflow-hidden
                                rounded-2xl
                                bg-gradient-to-r
                                from-indigo-500
                                via-purple-500
                                to-indigo-600
                                py-4
                                font-semibold
                                text-white
                                shadow-lg
                                transition-all
                                duration-300
                                hover:shadow-indigo-500/30
                                disabled:opacity-50
                            "
                                >

                                    <span className="relative z-10">
                                        {form.processing
                                            ? "Memproses..."
                                            : hasCheckedIn
                                                ? "Sudah Check-in"
                                                : "Hadir"}
                                    </span>

                                    <div
                                        className="
                                    absolute inset-0
                                    translate-x-[-100%]
                                    bg-gradient-to-r
                                    from-transparent
                                    via-white/20
                                    to-transparent
                                    transition-transform
                                    duration-1000
                                    group-hover:translate-x-[100%]
                                "
                                    />

                                </motion.button>

                                {/* IZIN */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleAttendance("izin")}
                                    disabled={form.processing || hasCheckedIn}
                                    className="
                                rounded-2xl
                                border border-white/10
                                bg-white
                                py-4
                                font-semibold
                                text-gray-800
                                backdrop-blur-md
                                transition-all
                                duration-300
                                hover:bg-white/80
                                disabled:opacity-50
                            "
                                >
                                    {form.processing
                                        ? "Memproses..."
                                        : "Izin"}
                                </motion.button>

                            </div>

                            {/* CHECK-OUT */}
                            {hasCheckedIn && todayAttendance?.status === "hadir" && (
                                <div className="mb-4">
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={handleCheckOut}
                                        disabled={checkOutForm.processing || !canCheckOut}
                                        className="
                                    group
                                    relative
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-emerald-500
                                    via-teal-500
                                    to-emerald-600
                                    py-4
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    transition-all
                                    duration-300
                                    hover:shadow-emerald-500/30
                                    disabled:opacity-50
                                "
                                    >
                                        <span className="relative z-10">
                                            {checkOutForm.processing
                                                ? "Memproses..."
                                                : hasCheckedOut
                                                    ? `Sudah Check-out (${todayAttendance?.check_out_time})`
                                                    : "Check-out"}
                                        </span>
                                    </motion.button>
                                </div>
                            )}

                            {/* APPROVAL STATUS HARI INI */}
                            {todayAttendance &&
                                todayAttendance.approval_status !== "approved" && (
                                    <div
                                        className={`mb-4 rounded-2xl border p-5 ${todayAttendance.approval_status === "rejected"
                                            ? "border-red-500/20 bg-red-500/10"
                                            : "border-yellow-500/20 bg-yellow-500/10"
                                            }`}
                                    >
                                        <p
                                            className={
                                                todayAttendance.approval_status === "rejected"
                                                    ? "font-semibold text-red-300"
                                                    : "font-semibold text-yellow-300"
                                            }
                                        >
                                            {todayAttendance.approval_status === "rejected"
                                                ? "❌ Absensi Ditolak"
                                                : "⏳ Menunggu Persetujuan Admin"}
                                        </p>

                                        {todayAttendance.approval_note && (
                                            <p className="mt-2 text-sm text-white/80">
                                                Keterangan: {todayAttendance.approval_note}
                                            </p>
                                        )}
                                    </div>
                                )}

                            {/* INFO */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                <div
                                    className="
                                rounded-2xl
                                border border-white/10
                                bg-white/5
                                p-5
                                backdrop-blur-md
                            "
                                >
                                    <p className="text-sm text-zinc-400">
                                        Tanggal
                                    </p>

                                    <h3 className="mt-2 font-semibold text-zinc-100">
                                        {currentDate}
                                    </h3>
                                </div>

                                <div
                                    className="
                                rounded-2xl
                                border border-white/10
                                bg-white/5
                                p-5
                                backdrop-blur-md
                            "
                                >
                                    <p className="text-sm text-zinc-400">
                                        Jam
                                    </p>

                                    <h3 className="mt-2 text-xl font-bold text-zinc-100">
                                        {currentTime}
                                    </h3>
                                </div>

                            </div>

                            {/* LOCATION */}
                            <div
                                className="
        mt-6
        rounded-2xl
        border
        border-emerald-500/20
        bg-emerald-500/10
        p-5
    "
                            >

                                <h3 className="font-semibold text-lg">
                                    Informasi Lokasi
                                </h3>

                                <p className="mt-3">
                                    📍 Lokasi Kantor :
                                    {" "}
                                    {nearestLocation?.name ?? "-"}
                                </p>

                                <p>
                                    📏 Jarak Anda :
                                    {" "}
                                    {distance !== null ? distance.toFixed(0) : "-"}
                                    {" "}
                                    Meter
                                </p>

                                <p>
                                    Radius Maksimal :
                                    {" "}
                                    {nearestLocation?.radius ?? "-"}
                                    {" "}
                                    Meter
                                </p>

                                <div className="mt-4">

                                    {distance !== null &&
                                        nearestLocation &&
                                        distance <= nearestLocation.radius ? (

                                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-300">
                                            ✅ Dalam Radius
                                        </span>

                                    ) : (

                                        <span className="rounded-full bg-red-500/20 px-3 py-1 text-red-300">
                                            ❌ Di Luar Radius
                                        </span>

                                    )}

                                </div>

                            </div>

                        </div>


                    </div>

                </motion.div>


            </div>

            {/* MODAL RIWAYAT ABSENSI */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        onClick={() => setShowHistory(false)}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="
                                relative z-10
                                w-full max-w-2xl
                                max-h-[80vh]
                                overflow-hidden
                                rounded-3xl
                                border border-white/10
                                bg-zinc-900/90
                                text-white
                                shadow-2xl
                                backdrop-blur-xl
                            "
                        >
                            {/* Header Modal */}
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <h3 className="text-lg font-semibold">
                                    Riwayat Absensi
                                </h3>

                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="
                                        flex h-8 w-8 items-center justify-center
                                        rounded-full
                                        bg-white/10
                                        text-white/80
                                        transition-colors
                                        hover:bg-white/20 hover:text-white
                                    "
                                    aria-label="Tutup"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body Modal (scrollable) */}
                            <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(attendances?.data ?? []).length > 0 ? (
                                        (attendances?.data ?? []).map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-md"
                                            >
                                                <div className="flex justify-between">
                                                    <span
                                                        className={
                                                            item.status === "hadir"
                                                                ? "text-green-300"
                                                                : "text-yellow-300"
                                                        }
                                                    >
                                                        {item.status === "hadir" ? "🟢 Hadir" : "🟡 Izin"}
                                                    </span>

                                                    <span className="text-white/60 text-xs">
                                                        {item.date}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center gap-3 text-lg font-bold">
                                                    <span>
                                                        In: {item.check_in_time}
                                                    </span>

                                                    {item.check_out_time && (
                                                        <span className="text-emerald-300">
                                                            Out: {item.check_out_time}
                                                        </span>
                                                    )}
                                                </div>

                                                {item.location && (
                                                    <div className="mt-2 text-sm text-white/70">
                                                        📍 {item.location}
                                                    </div>
                                                )}

                                                {item.approval_status !== "approved" && (
                                                    <div className="mt-3">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${item.approval_status === "rejected"
                                                                ? "bg-red-500/20 text-red-300"
                                                                : "bg-yellow-500/20 text-yellow-300"
                                                                }`}
                                                        >
                                                            {item.approval_status === "rejected"
                                                                ? "❌ Ditolak"
                                                                : "⏳ Menunggu Persetujuan"}
                                                        </span>
                                                    </div>
                                                )}

                                                {item.approval_note && (
                                                    <div className="mt-2 text-sm text-white/70">
                                                        📝 Keterangan: {item.approval_note}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-white/60 text-sm">
                                            Belum ada riwayat absensi
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
