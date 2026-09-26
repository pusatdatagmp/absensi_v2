import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import HeadingSmall from '@/components/heading-small';

import { type BreadcrumbItem } from '@/types';

interface Setting {
    company_name: string;
    office_name: string | null;
    office_latitude: number;
    office_longitude: number;
    attendance_radius: number;
    check_in_start: string | null;
    check_in_end: string | null;
    work_start_time: string | null;
    bonus_minutes: number | null;
    check_out: string | null;
}

interface LateLevel {
    id: number;
    label: string;
    minutes: number;
}

interface Props {
    setting: Setting;
    lateLevels: LateLevel[];
    errors: Record<string, string>;
    flash: {
        success?: string;
    };
}

function LateLevelRow({
    level,
    onDelete,
}: {
    level: LateLevel;
    onDelete: (id: number) => void;
}) {
    const [label, setLabel] = useState(level.label);
    const [minutes, setMinutes] = useState(level.minutes);
    const [saving, setSaving] = useState(false);

    const isDirty = label !== level.label || minutes !== level.minutes;

    const handleSave = () => {
        setSaving(true);

        router.put(
            route('late-levels.update', level.id),
            { label, minutes },
            {
                onFinish: () => setSaving(false),
            }
        );
    };

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center">

            <input
                type="text"
                className="w-full rounded-lg border px-3 py-2 sm:flex-1"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Nama level (mis. Telat 1)"
            />

            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min={1}
                    className="w-24 rounded-lg border px-3 py-2"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">menit</span>
            </div>

            <div className="flex gap-2">
                <button
                    type="button"
                    disabled={saving || !isDirty}
                    onClick={handleSave}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-40 dark:bg-white dark:text-black"
                >
                    {saving ? 'Menyimpan...' : 'Simpan'}
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(level.id)}
                    className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                    Hapus
                </button>
            </div>

        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Office settings',
        href: '/settings/office',
    },
];

export default function OfficeSettings() {
    const { setting, lateLevels, errors, flash } = usePage<Props>().props;

    const [newLabel, setNewLabel] = useState('');
    const [newMinutes, setNewMinutes] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.success,
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [flash]);

    const [data, setData] = useState({
        company_name: setting.company_name,
        office_name: setting.office_name ?? '',
        office_latitude: setting.office_latitude,
        office_longitude: setting.office_longitude,
        attendance_radius: setting.attendance_radius,
        check_in_start: setting.check_in_start?.substring(0, 5) ?? '',
        check_in_end: setting.check_in_end?.substring(0, 5) ?? '',
        work_start_time: setting.work_start_time?.substring(0, 5) ?? '',
        bonus_minutes: setting.bonus_minutes ?? 15,
        check_out: setting.check_out?.substring(0, 5) ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        router.put(route('office.update'), data);
    }

    function handleAddLevel(e: React.FormEvent) {
        e.preventDefault();

        setAdding(true);

        router.post(
            route('late-levels.store'),
            { label: newLabel, minutes: Number(newMinutes) },
            {
                onSuccess: () => {
                    setNewLabel('');
                    setNewMinutes('');
                },
                onFinish: () => setAdding(false),
            }
        );
    }

    function handleDeleteLevel(id: number) {
        Swal.fire({
            title: 'Hapus level telat?',
            text: 'Level yang dihapus tidak bisa dikembalikan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('late-levels.destroy', id));
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Office settings" />

            <SettingsLayout>
                <div className="space-y-6">

                    <HeadingSmall
                        title="Office settings"
                        description="Atur jam kerja perusahaan."
                    />

                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >

                        {/* Company */}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Company Name
                            </label>

                            <input
                                className="w-full rounded-lg border px-3 py-2"
                                value={data.company_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        company_name: e.target.value,
                                    })
                                }
                            />

                            {errors.company_name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.company_name}
                                </p>
                            )}
                        </div>

                        {/* Office */}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Office Name
                            </label>

                            <input
                                className="w-full rounded-lg border px-3 py-2"
                                value={data.office_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        office_name: e.target.value,
                                    })
                                }
                            />
                        </div>

                       

                        {/* Jendela Absen */}

                        <div>
                            <p className="mb-2 text-sm font-medium">
                                Jendela Absen
                            </p>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Rentang jam tombol absen aktif. Boleh dibuka lebih pagi
                                dari Jam Masuk Resmi supaya karyawan yang datang awal
                                tetap bisa absen dan mendapat predikat Bonus.
                            </p>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Jendela Absen Mulai
                                    </label>

                                    <input
                                        type="time"
                                        className="w-full rounded-lg border px-3 py-2"
                                        value={data.check_in_start}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                check_in_start: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Jendela Absen Selesai
                                    </label>

                                    <input
                                        type="time"
                                        className="w-full rounded-lg border px-3 py-2"
                                        value={data.check_in_end}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                check_in_end: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Baseline Jam Masuk */}

                        <div>
                            <p className="mb-2 text-sm font-medium">
                                Baseline Jam Masuk
                            </p>
                            <p className="mb-3 text-sm text-muted-foreground">
                                Dipakai untuk menghitung predikat Bonus / Ontime / Telat.
                                Terpisah dari Jendela Absen di atas.
                            </p>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Jam Masuk Resmi
                                    </label>

                                    <input
                                        type="time"
                                        className="w-full rounded-lg border px-3 py-2"
                                        value={data.work_start_time}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                work_start_time: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Toleransi Bonus (menit)
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        className="w-full rounded-lg border px-3 py-2"
                                        value={data.bonus_minutes}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                bonus_minutes: Number(e.target.value),
                                            })
                                        }
                                    />

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Absen sekian menit atau lebih sebelum Jam Masuk
                                        Resmi mendapat predikat Bonus.
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Check Out */}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Check-out Mulai
                            </label>

                            <input
                                type="time"
                                className="w-full max-w-xs rounded-lg border px-3 py-2"
                                value={data.check_out}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        check_out: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-lg bg-white px-5 py-2 text-black"
                        >
                            Save Settings
                        </button>

                    </form>

                    {/* Level Telat (dinamis) */}

                    <div className="border-t pt-6">

                        <label className="mb-2 block text-sm font-medium">
                            Level Telat
                        </label>

                        <p className="mb-4 text-sm text-muted-foreground">
                            Toleransi keterlambatan (dalam menit setelah Jam Masuk Resmi).
                            Admin bisa menambah, mengubah, atau menghapus level kapan saja —
                            level akan otomatis diurutkan dari toleransi terkecil ke terbesar.
                            Kehadiran yang melewati semua level tercatat sebagai "Telat".
                        </p>

                        <div className="space-y-3">

                            {lateLevels.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada level telat. Tambahkan minimal satu level di bawah.
                                </p>
                            ) : (
                                lateLevels.map((level) => (
                                    <LateLevelRow
                                        key={level.id}
                                        level={level}
                                        onDelete={handleDeleteLevel}
                                    />
                                ))
                            )}

                        </div>

                        <form
                            onSubmit={handleAddLevel}
                            className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed p-3 sm:flex-row sm:items-start"
                        >

                            <div className="sm:flex-1">
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border px-3 py-2"
                                    placeholder="Nama level baru (mis. Telat 4)"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                />

                                {errors.label && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.label}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        className="w-24 rounded-lg border px-3 py-2"
                                        placeholder="Menit"
                                        value={newMinutes}
                                        onChange={(e) => setNewMinutes(e.target.value)}
                                    />
                                    <span className="text-sm text-muted-foreground">menit</span>
                                </div>

                                {errors.minutes && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.minutes}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="rounded-lg bg-white px-5 py-2 text-black cursor-pointer disabled:opacity-40 dark:bg-white dark:text-black"
                            >
                                {adding ? 'Menambah...' : 'Tambah Level'}
                            </button>

                        </form>

                    </div>

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}