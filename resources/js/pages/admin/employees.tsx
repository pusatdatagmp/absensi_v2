import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useMemo, useState } from 'react';

import Swal from 'sweetalert2';

import MagicBento, {
    MagicBentoCard,
} from '@/components/MagicBento';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';



interface OfficeLocation {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    office_locations: OfficeLocation[];
}

interface PageProps {
    employees: Employee[];
    officeLocations: OfficeLocation[];
    flash: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Karyawan',
        href: '/employees',
    },
];

export default function Employees() {
    const { employees, flash, officeLocations } = usePage<PageProps>().props;

    const [position, setPosition] = useState('');
    const [search, setSearch] = useState('');
    const { errors } = usePage().props as {
        errors: Record<string, string>;
    };

    // FORM
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [officeLocationIds, setOfficeLocationIds] =
        useState<number[]>([]);

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

    // FILTER SEARCH
    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) =>
            employee.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [employees, search]);

    // RESET FORM
    const resetForm = () => {
        setName('');
        setEmail('');
        setPin('');
        setPosition('');
        setEditId(null);
        setOfficeLocationIds([]);
    };

    const toggleOfficeLocation = (id: number) => {
        setOfficeLocationIds((prev) =>
            prev.includes(id)
                ? prev.filter((locationId) => locationId !== id)
                : [...prev, id]
        );
    };

    // TAMBAH
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            '/employees',
            {
                name,
                email,
                pin,
                position,
                office_location_ids: officeLocationIds,
            },
            {
                onSuccess: () => {
                    setOpenModal(false);
                    resetForm();
                },
            }
        );
    };

    // EDIT
    const handleEdit = (employee: Employee) => {
        setEditId(employee.id);
        setName(employee.name);
        setEmail(employee.email);
        setPosition(employee.position);
        setOfficeLocationIds(employee.office_locations.map((l) => l.id));

        setPin('');

        setOpenModal(true);
    };

    // UPDATE
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        router.put(
            `/employees/${editId}`,
            {
                name,
                email,
                pin,
                position,
                office_location_ids: officeLocationIds,
            },
            {
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
            title: 'Hapus karyawan?',
            text: 'Data yang dihapus tidak bisa dikembalikan',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/employees/${id}`);
            }
        });
    };

    // State Sorting
    const [sortField, setSortField] = useState<
        "name" | "position"
    >("name");

    const [sortDirection, setSortDirection] = useState<
        "asc" | "desc"
    >("asc");

    const handleSort = (
        field: "name" | "position"
    ) => {
        if (sortField === field) {
            setSortDirection(
                sortDirection === "asc"
                    ? "desc"
                    : "asc"
            );
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedEmployees = [...filteredEmployees].sort(
        (a, b) => {
            const aValue =
                a[sortField]?.toLowerCase() ?? "";
            const bValue =
                b[sortField]?.toLowerCase() ?? "";

            return sortDirection === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
    );

    const [showPin, setShowPin] = useState(false);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Karyawan" />

            <div className="min-h-screen overflow-hidden bg-[#09090B] text-white">

                {/* BACKGROUND */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">

                    <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />

                    <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />

                </div>

                <div className="relative z-10 p-6">

                    <MagicBento
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
                                        Daftar Karyawan
                                    </h1>

                                    <p className="mt-3 text-slate-400">
                                        Kelola seluruh data karyawan perusahaan.
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
                                    Tambah Karyawan
                                </button>

                            </div>

                        </MagicBentoCard>

                        {/* SEARCH */}
                        <MagicBentoCard className="col-span-2 xl:col-span-2 p-6">

                            <div className="space-y-4">

                                <h2 className="text-lg font-semibold">
                                    Search Employee
                                </h2>

                                <input
                                    type="text"
                                    placeholder="Cari nama karyawan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        px-4
                                        py-3
                                        text-white
                                        placeholder:text-slate-500
                                        outline-none
                                        transition
                                        focus:border-violet-400
                                        focus:ring-2
                                        focus:ring-violet-500/20
                                    "
                                />

                            </div>

                        </MagicBentoCard>

                        {/* TOTAL */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Total Karyawan
                                </span>

                                <h2 className="text-5xl font-bold">
                                    {employees.length}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* ACTIVE */}
                        <MagicBentoCard className="p-6">

                            <div className="flex h-full flex-col justify-between">

                                <span className="text-sm text-slate-400">
                                    Active Employee
                                </span>

                                <h2 className="text-5xl font-bold text-emerald-400">
                                    {employees.length}
                                </h2>

                            </div>

                        </MagicBentoCard>

                        {/* TABLE */}
                        <MagicBentoCard className="col-span-2 xl:col-span-4 overflow-hidden p-0">

                            <div className="border-b border-white/10 p-6">

                                <h2 className="text-xl font-semibold">
                                    Data Karyawan
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
                                                <button
                                                    onClick={() => handleSort("name")}
                                                    className="
            flex items-center gap-2
            transition-colors
            hover:text-white
        "
                                                >
                                                    Nama

                                                    {sortField === "name" ? (
                                                        sortDirection === "asc" ? (
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
                                                Email
                                            </th>

                                            <th className="px-6 py-4 text-left text-sm text-slate-400">
                                                <button
                                                    onClick={() => handleSort("position")}
                                                    className="
            flex items-center gap-2
            transition-colors
            hover:text-white
        "
                                                >
                                                    Jabatan

                                                    {sortField === "position" ? (
                                                        sortDirection === "asc" ? (
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
                                                Lokasi Kantor
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

                                        {sortedEmployees.map((employee, index) => (

                                            <tr
                                                key={employee.id}
                                                className="
                                                    border-b
                                                    border-white/5
                                                    transition-all
                                                    duration-300
                                                    hover:bg-white/[0.03]
                                                "
                                            >

                                                <td className="px-6 py-5">
                                                    {index + 1}
                                                </td>

                                                <td className="px-6 py-5 font-medium">
                                                    {employee.name}
                                                </td>

                                                <td className="px-6 py-5 text-slate-400">
                                                    {employee.email}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {employee.position}
                                                </td>

                                                <td className="px-6 py-5">
                                                    {employee.office_locations.length > 0
                                                        ? employee.office_locations
                                                            .map((l) => l.name)
                                                            .join(", ")
                                                        : "-"}
                                                </td>

                                                <td className="px-6 py-5">

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
                                                        Active
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-center gap-2">

                                                        <button
                                                            onClick={() =>
                                                                router.visit(`/employees/${employee.id}`)
                                                            }
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
                                                            Detail
                                                        </button>

                                                        <button
                                                            onClick={() => handleEdit(employee)}
                                                            className="
                                                                rounded-xl
                                                                bg-violet-500/10
                                                                px-4
                                                                py-2
                                                                text-sm
                                                                text-violet-400
                                                                transition
                                                                hover:bg-violet-500/20
                                                            "
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(employee.id)}
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
                                {editId ? 'Edit Karyawan' : 'Tambah Karyawan'}
                            </h2>

                            <form
                                onSubmit={editId ? handleUpdate : handleSubmit}
                                className="space-y-4"
                            >

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Nama
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            focus:border-violet-400
                                        "
                                        required
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Jabatan
                                    </label>

                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/10
                                            bg-white/[0.03]
                                            px-4
                                            py-3
                                            text-white
                                            outline-none
                                            focus:border-violet-400
                                        "
                                        required
                                    />

                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
            ${errors.email
                                                ? "border-red-500 focus:border-red-500"
                                                : "border-white/10 focus:border-violet-400"
                                            }
        `}
                                        required
                                    />

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        PIN
                                    </label>

                                    <div className="relative">

                                        <input
                                            type={showPin ? 'text' : 'password'}
                                            value={pin}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                    .replace(/\D/g, '') // hanya angka
                                                    .slice(0, 6);       // maksimal 6 digit

                                                setPin(value);
                                            }}
                                            maxLength={6}
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="
        w-full
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        px-4
        py-3
        pr-20
        text-white
        outline-none
        focus:border-violet-400
    "
                                            placeholder="Masukkan PIN 6 digit"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPin(!showPin)}
                                            className="
                                                absolute
                                                right-4
                                                top-1/2
                                                -translate-y-1/2
                                                text-sm
                                                text-slate-400
                                                hover:text-white
                                            "
                                        >
                                            {showPin ? 'Hide' : 'Show'}
                                        </button>

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm text-slate-300">
                                        Lokasi Kantor
                                        <span className="ml-1 text-slate-500">
                                            (bisa pilih lebih dari satu)
                                        </span>
                                    </label>

                                    <div
                                        className="
        max-h-48
        w-full
        space-y-2
        overflow-y-auto
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-3
    "
                                    >
                                        {officeLocations.length === 0 ? (
                                            <p className="px-1 py-1 text-sm text-slate-500">
                                                Belum ada lokasi kantor.
                                            </p>
                                        ) : (
                                            officeLocations.map((location) => (
                                                <label
                                                    key={location.id}
                                                    className="
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-xl
                px-2
                py-2
                transition
                hover:bg-white/[0.05]
            "
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={officeLocationIds.includes(location.id)}
                                                        onChange={() => toggleOfficeLocation(location.id)}
                                                        className="
                    h-4
                    w-4
                    rounded
                    border-white/20
                    bg-white/[0.03]
                    text-violet-500
                    focus:ring-violet-500/40
                "
                                                    />

                                                    <span className="text-sm text-white">
                                                        {location.name}
                                                    </span>
                                                </label>
                                            ))
                                        )}
                                    </div>

                                    {errors.office_location_ids && (
                                        <p className="mt-2 text-sm text-red-400">
                                            {errors.office_location_ids}
                                        </p>
                                    )}

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

