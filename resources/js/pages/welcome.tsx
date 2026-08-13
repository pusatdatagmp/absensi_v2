import { Head, Link } from "@inertiajs/react";
import DotGrid from "@/components/dot-grid";
import { CircleArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import DanceCat from "@/assets/DanceCat.json";

export default function Welcome() {
    return (
        <>
            <Head title="Web Absensi" />

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <DotGrid />
            </div>

            {/* Content */}
            <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
                <div className="rgb-border max-w-2xl w-full rounded-2xl p-[2px]">

                    <div className="bg-zinc-950/70 rounded-2xl p-10 shadow-xl relative z-10">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white">
                                Absensi Karyawan
                            </h1>

                            <p className="mt-4 text-white/80">
                                Sistem Absensi Deevatech
                            </p>
                        </div>

                        <div className="text-center mt-10">

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/employee-login"
                                    className="px-5 py-3 rounded-xl bg-violet-700 text-white hover:opacity-90 transition text-center group
                    relative
                    w-full
                    overflow-hidden
                   
                    bg-gradient-to-r
                    from-indigo-600
                    via-purple-700
                    to-indigo-600
                 
                    font-semibold
                    
                    shadow-lg
                   
                    duration-300
                    hover:scale-[1.02]
                    hover:shadow-indigo-500/30
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50"
                                >
                                    Login Karyawan

                                    <div
                                        className="
                        absolute
                        inset-0
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
                                </Link>

                                <Link
                                    href="/login"
                                    className="
        inline-flex items-center justify-center gap-2
        mx-auto
        text-sm
        text-white/60
        hover:text-violet-400
        transition-all duration-300
        group
    "
                                >
                                    Admin
                                    <CircleArrowRight
                                        size={16}
                                        className="
            transition-transform duration-300
            group-hover:translate-x-1
        "
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}