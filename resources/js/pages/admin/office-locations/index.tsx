import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useMemo, useState } from 'react';

import Swal from 'sweetalert2';

import MagicBento, {
    MagicBentoCard,
} from '@/components/MagicBento';
import {
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    MapPin,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface OfficeLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLocations {
    data: OfficeLocation[];
    links?: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
        links: PaginationLink[];
    };
}

interface PageProps {
    locations: PaginatedLocations;
    statistics: {
        total: number;
        active: number;
    };
    flash?: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lokasi Kantor',
        href: '/office-locations',
    },
];

export default function OfficeLocationsIndex() {
    const { locations, statistics, flash } = usePage<PageProps>().props;

    const { errors } = usePage().props as {
        errors: Record<string, string>;
    };

    const locationRows = locations.data;

    const totalLocations = statistics.total;
    const activeLocations = statistics.active;
    const inactiveLocations = statistics.total - statistics.active;

    // FORM
    const [name, setName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');
    const [isActive, setIsActive] = useState(true);

    // MODAL
    const [openModal, setOpenModal] = useState(false);

    // EDIT
    const [editId, setEditId] = useState<number | null>(null);

    // SWEET ALERT SUCCESS
    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
                background: '#111827',
                color: '#fff',
            });
        }
    }, [flash]);

    // RESET FORM
    const resetForm = () => {
        setName('');
        setLatitude('');
        setLongitude('');
        setRadius('');
        setIsActive(true);
        setEditId(null);
    };

    // TAMBAH
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            '/office-locations',
            {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                radius: parseFloat(radius),
                is_active: isActive,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenModal(false);
                    resetForm();
                },
            }
        );
    };

    // EDIT
    const handleEdit = (location: OfficeLocation) => {
        setEditId(location.id);
        setName(location.name);
        setLatitude(String(location.latitude));
        setLongitude(String(location.longitude));
        setRadius(String(location.radius));
        setIsActive(location.is_active);

        setOpenModal(true);
    };

    // UPDATE
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(
            `/office-locations/${editId}`,
            {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                radius: parseFloat(radius),
                is_active: isActive,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenModal(false);
                    resetForm();
                },
            }
        );
    };

    // DELETE
    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus lokasi kantor?',
            text: 'Data yang dihapus tidak bisa dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/office-locations/${id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

    // State Sorting
    const [sortField, setSortField] = useState<'name'>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: 'name') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedLocations = useMemo(() => {
        return [...locationRows].sort((a, b) => {
            const aValue = a[sortField]?.toLowerCase() ?? '';
            const bValue = b[sortField]?.toLowerCase() ?? '';

            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
    }, [locationRows, sortField, sortDirection]);

    // Pagination navigation (preserves scroll & filters state)
    const goToPage = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lokasi Kantor" />

            <div className="min-h-screen overflow-hidden bg-[#09090B] text-white">

                {/* BACKGROUND */}
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
                        glowColor="139, 92, 246"
                        className="auto-rows-[minmax(180px,_auto)]"
                    >

                        {/* HEADER */}
                        <MagicBentoCard className="col-span-2 xl:col-span-4 p-8">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight">
                                        Lokasi Kantor
                                    </h1>

                                    <p className="mt-3 text-slate-400">
                                        Kelola seluruh lokasi kantor yang dapat digunakan sebagai titik absensi karyawan.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        resetForm();
                                        setOpenModal(true);
                                    }}
                                    className="
                                        rounded-2xl
                                        bg-violet-500
                                        px-5
                                        py-3
                                        font-medium
                                        text-white
                                        transition-all
                                        duration-300
                                        hover:scale-[1.03]
                                        hover:bg-violet-400
                                    "
                                >
                                    + Tambah Lokasi
                                </button>

                            </div>

                        </MagicBentoCard>

                        {/* TOTAL */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Total Lokasi
                                </span>

                                <h2 className="text-5xl font-bold text-cyan-400">
                                    {totalLocations}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* ACTIVE */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Lokasi Aktif
                                </span>

                                <h2 className="text-5xl font-bold text-emerald-400">
                                    {activeLocations}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* INACTIVE */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Lokasi Nonaktif
                                </span>

                                <h2 className="text-5xl font-bold text-red-400">
                                    {inactiveLocations}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* TABLE */}
                        <MagicBentoCard className="col-span-2 xl:col-span-4 overflow-hidden p-0">

                            <div className="border-b border-white/10 p-6">

                                <h2 className="text-xl font-semibold">
                                    Daftar Lokasi Kantor
                                </h2>

                            </div>

                            {sortedLocations.length === 0 ? (

                                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">

                                    <div className="rounded-full bg-white/5 p-4 ring-1 ring-white/10">
                                        <MapPin className="h-6 w-6 text-slate-500" />
                                    </div>

                                    <p className="text-sm text-slate-400">
                                        Belum ada lokasi kantor.
                                    </p>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead className="border-b border-white/10 bg-white/[0.02]">

                                            <tr>

                                                <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                    No
                                                </th>

                                                <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                    <button
                                                        onClick={() => handleSort('name')}
                                                        className="
            flex items-center gap-2
            transition-colors
            hover:text-white
        "
                                                    >
                                                        Nama Lokasi

                                                        {sortField === 'name' ? (
                                                            sortDirection === 'asc' ? (
                                                                <ChevronUp size={16} />
                                                            ) : (
                                                                <ChevronDown size={16} />
                                                            )
                                                        ) : (
                                                            <ArrowUpDown
                                                                size={14}
                                                                className="opacity-50"
                                                            />
                                                        )}
                                                    </button>
                                                </th>

                                                <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                    Latitude
                                                </th>

                                                <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                    Longitude
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

                                            {sortedLocations.map((location, index) => (

                                                <tr
                                                    key={location.id}
                                                    className="
                                                    border-b
                                                    border-white/5
                                                    transition-all
                                                    duration-300
                                                    hover:bg-white/[0.03]
                                                "
                                                >

                                                    <td className="px-6 py-5">
                                                        {(locations.meta.from ?? 1) + index}
                                                    </td>

                                                    <td className="px-6 py-5 font-medium">
                                                        {location.name}
                                                    </td>

                                                    <td className="px-6 py-5 text-slate-400">
                                                        {location.latitude}
                                                    </td>

                                                    <td className="px-6 py-5 text-slate-400">
                                                        {location.longitude}
                                                    </td>

                                                    <td className="px-6 py-5 text-slate-400">
                                                        {location.radius} m
                                                    </td>

                                                    <td className="px-6 py-5">

                                                        {location.is_active ? (
                                                            <span
                                                                className="
                                                                rounded-full
                                                                border
                                                                border-emerald-500/20
                                                                bg-emerald-500/10
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-emerald-400
                                                            "
                                                            >
                                                                Aktif
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className="
                                                                rounded-full
                                                                border
                                                                border-red-500/20
                                                                bg-red-500/10
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-red-400
                                                            "
                                                            >
                                                                Nonaktif
                                                            </span>
                                                        )}

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <div className="flex justify-center gap-2">

                                                            <button
                                                                onClick={() => handleEdit(location)}
                                                                className="
                                                                rounded-xl
                                                                bg-cyan-500/10
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                text-cyan-400
                                                                transition
                                                                hover:bg-cyan-500/20
                                                            "
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(location.id)}
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

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                            {/* PAGINATION */}
                            {sortedLocations.length > 0 && locations.meta.last_page > 1 && (

                                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-6 sm:flex-row">

                                    <p className="text-xs text-slate-400">
                                        Menampilkan{' '}
                                        <span className="font-medium text-slate-200">
                                            {locations.meta.from}
                                        </span>{' '}
                                        -{' '}
                                        <span className="font-medium text-slate-200">
                                            {locations.meta.to}
                                        </span>{' '}
                                        dari{' '}
                                        <span className="font-medium text-slate-200">
                                            {locations.meta.total}
                                        </span>{' '}
                                        lokasi
                                    </p>

                                    <div className="flex items-center gap-1.5">
                                        {locations.meta.links.map((link, i) => (
                                            <button
                                                key={i}
                                                disabled={!link.url}
                                                onClick={() => goToPage(link.url)}
                                                className={`min-w-[2.25rem] rounded-xl px-3 py-1.5 text-xs font-medium transition ${link.active
                                                        ? 'bg-violet-500 text-white'
                                                        : link.url
                                                            ? 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]'
                                                            : 'cursor-not-allowed text-slate-600'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>

                                </div>

                            )}

                        </MagicBentoCard>

                    </MagicBento>

                </div>

                {/* MODAL */}
                {openModal && (

                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">

                        <div
                            className="
                                w-full
                                max-w-md
                                rounded-3xl
                                border
                                border-white/10
                                bg-[#111827]/90
                                p-6
                                backdrop-blur-2xl
                            "
                        >

                            <h2 className="mb-6 text-2xl font-bold">
                                {editId ? 'Edit Lokasi Kantor' : 'Tambah Lokasi Kantor'}
                            </h2>

                            <form
                                onSubmit={editId ? handleUpdate : handleSubmit}
                                className="space-y-4"
                            >

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Nama Lokasi
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`
                                            w-full
                                            rounded-2xl
                                            border
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            transition-colors
                                            ${errors.name
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-white/10 focus:border-violet-400'
                                            }
                                        `}
                                        placeholder="Contoh: Kantor Pusat"
                                        required
                                    />

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.name}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Latitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        className={`
                                            w-full
                                            rounded-2xl
                                            border
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            transition-colors
                                            ${errors.latitude
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-white/10 focus:border-violet-400'
                                            }
                                        `}
                                        placeholder="-7.257472"
                                        required
                                    />

                                    {errors.latitude && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.latitude}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Longitude
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        className={`
                                            w-full
                                            rounded-2xl
                                            border
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            transition-colors
                                            ${errors.longitude
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-white/10 focus:border-violet-400'
                                            }
                                        `}
                                        placeholder="112.752090"
                                        required
                                    />

                                    {errors.longitude && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.longitude}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Radius (meter)
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        value={radius}
                                        onChange={(e) => setRadius(e.target.value)}
                                        className={`
                                            w-full
                                            rounded-2xl
                                            border
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            transition-colors
                                            ${errors.radius
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-white/10 focus:border-violet-400'
                                            }
                                        `}
                                        placeholder="100"
                                        required
                                    />

                                    {errors.radius && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.radius}
                                        </p>
                                    )}

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Status
                                    </label>

                                    <label className="flex items-center gap-2 text-sm text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
                                            className="h-4 w-4 accent-violet-500"
                                        />
                                        Aktifkan lokasi ini
                                    </label>

                                </div>

                                <div className="flex justify-end gap-3 pt-4">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpenModal(false);
                                            resetForm();
                                        }}
                                        className="
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-5
                                            py-3
                                            transition
                                            hover:bg-white/[0.06]
                                        "
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        className="
                                            rounded-2xl
                                            bg-violet-500
                                            px-5
                                            py-3
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-violet-400
                                        "
                                    >
                                        {editId ? 'Update' : 'Simpan'}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>
        </AppLayout>
    );
}
