import DotGrid from "@/components/dot-grid";
import { Head, useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function EmployeeLogin() {

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        pin: "",
    });

    const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handlePinChange = (
        value: string,
        index: number
    ) => {

        if (!/^\d?$/.test(value)) return;

        const currentPin = data.pin.padEnd(6, " ").split("");

        currentPin[index] = value;

        const newPin = currentPin.join("").replace(/\s/g, "");

        setData("pin", newPin);

        if (value && index < 5) {
            pinRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {

        if (
            e.key === "Backspace" &&
            !data.pin[index] &&
            index > 0
        ) {
            pinRefs.current[index - 1]?.focus();
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/employee-login");
    };

    return (
        <>
            <Head title="Login Employee" />

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <DotGrid />
            </div>

            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative z-10">
                <div className="rgb-border w-full max-w-md rounded-3xl p-[2px]">
                    <div
                        className="
                rounded-3xl
                border border-white/10
                bg-zinc-950/70
                shadow-2xl
                p-6 sm:p-8
                text-white
            "
                    >

                        {/* Header */}
                        <div className="text-center mb-8">

                            <div
                                className="
                    mx-auto
                    mb-4
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-indigo-500
                    to-purple-600
                    shadow-lg
                "
                            >
                                <span className="text-2xl">🔐</span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Login Karyawan
                            </h1>

                            <p className="text-sm sm:text-base text-zinc-300 mt-2">
                                Masuk menggunakan email dan PIN
                            </p>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >

                            {/* Email */}
                            <div>

                                <label className="block text-sm font-medium text-zinc-200 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="employee@gmail.com"
                                    className="
                        w-full
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/10 backdrop-blur-sm
                        px-4
                        py-3
                        text-white
                        placeholder:text-zinc-400
                        outline-none
                        transition-all
                        duration-300
                        focus:border-indigo-400
                        focus:bg-white/10
                        focus:ring-4
                        focus:ring-indigo-500/20
                    "
                                />

                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-2">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* PIN */}
                            <div>

                                <label className="block text-sm font-medium text-zinc-200 mb-3">
                                    PIN
                                </label>

                                <div className="grid grid-cols-6 gap-2 sm:gap-3">

                                    {[0, 1, 2, 3, 4, 5].map((index) => (

                                        <input
                                            key={index}
                                            ref={(el) => {
                                                pinRefs.current[index] = el;
                                            }}
                                            type="password"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={1}
                                            value={data.pin[index] || ""}
                                            onChange={(e) =>
                                                handlePinChange(
                                                    e.target.value,
                                                    index
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(e, index)
                                            }
                                            className="
                                aspect-square
                                w-full
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/10 backdrop-blur-sm
                                text-center
                                text-xl
                                font-bold
                                text-white
                                outline-none
                                transition-all
                                duration-300
                                focus:scale-105
                                focus:border-indigo-400
                                focus:bg-white/10
                                focus:ring-4
                                focus:ring-indigo-500/20
                            "
                                        />

                                    ))}

                                </div>

                                {errors.pin && (
                                    <p className="text-red-400 text-sm mt-3">
                                        {errors.pin}
                                    </p>
                                )}

                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="
                    group
                    relative
                    w-full
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    via-purple-700
                    to-indigo-600
                    py-3.5
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                    hover:shadow-indigo-500/30
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
                            >

                                <span className="relative z-10">
                                    {processing ? "Loading..." : "Login"}
                                </span>

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

                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </>
    );
}