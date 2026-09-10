import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';

import { type NavItem, type SharedData } from '@/types';

import { Link, usePage } from '@inertiajs/react';

import {
    LayoutGrid,
    ListTodo,
    MapPinHouse,
    Users
} from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Daftar Karyawan',
        url: '/employees',
        icon: Users,
    },
    {
        title: 'Approval',
        url: '/attendance-approvals',
        icon: ListTodo,
    },
    {
        title: 'Lokasi Kantor',
        url: '/office-locations',
        icon: MapPinHouse,
    }
];

export function AppSidebar() {
    const { appName } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">

            <SidebarHeader className="border-b border-white/10">

                <SidebarMenu>

                    <SidebarMenuItem>

                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="
                    h-16
                    rounded-2xl
                    border
                    border-cyan-500/20
                    bg-white/[0.03]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-cyan-400/40
                    hover:bg-cyan-500/10
                    hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]
                "
                        >

                            <Link
                                href="/dashboard"
                                className="
                        flex
                        items-center
                        justify-center
                    "
                            >

                                <h1
                                    className="
                            bg-gradient-to-r
                            from-cyan-400
                            via-cyan-300
                            to-blue-400
                            bg-clip-text
                            text-xl
                            font-black
                            tracking-[0.2em]
                            text-transparent
                        "
                                >
                                    {appName}
                                </h1>

                            </Link>

                        </SidebarMenuButton>

                    </SidebarMenuItem>

                </SidebarMenu>

            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

        </Sidebar>
    );
}