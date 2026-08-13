import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import AnimatedBackground from '@/components/animated-background';
import DotGrid from '@/components/dot-grid';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {

    return (
        <>

            {/* Dot Grid */}
            <DotGrid
                baseColor="#52525b"
                activeColor="#6366f1"
            />

            {/* Overlay */}
            <div className="fixed inset-0 z-0 bg-black/40 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative z-10 ">
                <AppLayoutTemplate
                    breadcrumbs={breadcrumbs}
                    {...props}
                >
                    {children}
                </AppLayoutTemplate>
            </div>
        </>
    );
}