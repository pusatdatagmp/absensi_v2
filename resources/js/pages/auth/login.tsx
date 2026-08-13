import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DotGrid from '@/components/dot-grid';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <DotGrid />
            </div>

            <div className="min-h-screen flex items-center justify-center px-4 relative z-10">

                <div
                    className="
                        w-full
                        max-w-md
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
                            from-lime-500/20
                            via-purple-500/20
                            to-indigo-500/20
                            px-8
                            py-10
                        "
                    >

                        <div className="relative z-10 text-center">

                            <div
                                className="
                                    mx-auto
                                    mb-5
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
                                <span className="text-2xl">
                                    🔐
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">
                                Welcome Back
                            </h1>

                            <p className="mt-3 text-sm text-zinc-300">
                                Login untuk mengakses sistem
                            </p>

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

                    {/* FORM */}
                    <div className="p-8">

                        <form
                            className="space-y-6"
                            onSubmit={submit}
                        >

                            {/* EMAIL */}
                            <div>

                                <Label
                                    htmlFor="email"
                                    className="mb-2 block text-zinc-200"
                                >
                                    Email
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData(
                                            'email',
                                            e.target.value
                                        )
                                    }
                                    placeholder="email@example.com"
                                    className="
                                        h-12
                                        rounded-2xl
                                        border-white/10
                                        bg-white/5
                                        text-white
                                        placeholder:text-zinc-400
                                        focus:border-indigo-400
                                        focus:ring-indigo-500/20
                                    "
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-red-400"
                                />

                            </div>

                            {/* PASSWORD */}
                            <div>

                                <div className="mb-2 flex items-center justify-between">

                                    <Label
                                        htmlFor="password"
                                        className="text-zinc-200"
                                    >
                                        Password
                                    </Label>

                                    

                                </div>

                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Password"
                                    className="
                                        h-12
                                        rounded-2xl
                                        border-white/10
                                        bg-white/5
                                        text-white
                                        placeholder:text-zinc-400
                                        focus:border-indigo-400
                                        focus:ring-indigo-500/20
                                    "
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2 text-red-400"
                                />

                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                className="
                                    group
                                    relative
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    bg-gradient-to-r
                                    from-indigo-500
                                    via-purple-500
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

                                <span
                                    className="
                                        relative
                                        z-10
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >

                                    {processing && (
                                        <LoaderCircle
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    )}

                                    {processing
                                        ? 'Loading...'
                                        : 'Log in'}

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

                        {/* STATUS */}
                        {status && (
                            <div
                                className="
                                    mt-6
                                    rounded-2xl
                                    border border-emerald-500/20
                                    bg-emerald-500/10
                                    p-4
                                    text-center
                                    text-sm
                                    text-emerald-300
                                "
                            >
                                {status}
                            </div>
                        )}

                       

                    </div>

                </div>

            </div>
        </>
    );
}