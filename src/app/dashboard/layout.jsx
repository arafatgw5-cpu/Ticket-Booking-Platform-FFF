'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { FaBars } from 'react-icons/fa';

export default function DashboardLayout({ children }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push('/login');
        }
    }, [session, isPending, router]);

    // Close sidebar on mobile when navigating
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (isPending) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!session?.user) return null;

    return (
        <div className="flex min-h-screen">
            <Sidebar role={session.user.role} pathname={pathname} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 p-4 md:p-6 bg-slate-50 dark:bg-slate-950 overflow-x-hidden min-w-0">
                <div className="md:hidden flex items-center mb-6">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                        <FaBars className="text-xl" />
                    </button>
                    <span className="ml-4 font-bold text-lg text-slate-800 dark:text-slate-200">Dashboard</span>
                </div>
                {children}
            </main>
        </div>
    );
}