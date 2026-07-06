import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardCheck, FileText, Folder, LayoutGrid, Wallet } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    // Role lain (admin, kepala_sekolah, guru) belum punya modul sendiri —
    // sidebar mereka tetap dashboard generik.
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    if (auth.user.role === 'staf_ppdb') {
        mainNavItems.push({
            title: 'Verifikasi Pendaftaran',
            url: '/ppdb/pendaftaran',
            icon: ClipboardCheck,
        });
    }

    if (auth.user.role === 'staf_keuangan') {
        mainNavItems.push({
            title: 'Pembayaran Siswa',
            url: '/keuangan/siswa',
            icon: Wallet,
        });
    }

    if (auth.user.role === 'wali_murid') {
        mainNavItems.push({
            title: 'Formulir PPDB',
            url: '/ppdb/formulir',
            icon: FileText,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
