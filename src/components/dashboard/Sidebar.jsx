'use client';
import Link from 'next/link';
import { FaUser, FaTicketAlt, FaHistory, FaPlus, FaList, FaEnvelope, FaChartBar, FaUsers, FaAd } from 'react-icons/fa';

const userLinks = [
    { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
    { href: '/dashboard/bookings', label: 'My Bookings', icon: FaTicketAlt },
    { href: '/dashboard/transactions', label: 'Transactions', icon: FaHistory },
];

const vendorLinks = [
    { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
    { href: '/dashboard/vendor/add-ticket', label: 'Add Ticket', icon: FaPlus },
    { href: '/dashboard/vendor/my-tickets', label: 'My Tickets', icon: FaList },
    { href: '/dashboard/vendor/requests', label: 'Requests', icon: FaEnvelope },
    { href: '/dashboard/vendor/revenue', label: 'Revenue', icon: FaChartBar },
];

const adminLinks = [
    { href: '/dashboard/profile', label: 'Profile', icon: FaUser },
    { href: '/dashboard/admin/manage-users', label: 'Manage Users', icon: FaUsers },
    { href: '/dashboard/admin/manage-tickets', label: 'Manage Tickets', icon: FaTicketAlt },
    { href: '/dashboard/admin/advertise', label: 'Advertise', icon: FaAd },
];

export default function Sidebar({ role, pathname, isOpen, setIsOpen }) {
    let links = userLinks;
    if (role === 'vendor') links = vendorLinks;
    if (role === 'admin') links = adminLinks;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed md:sticky top-20 md:top-0 left-0 h-[calc(100vh-5rem)] md:h-screen w-64 glass-card bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 transition-transform duration-300 z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 dark:via-blue-500/30 to-transparent"></div>
                <div className="p-6 relative z-10 flex justify-between items-center">
                    <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 tracking-tight">Dashboard</h2>
                    <button 
                        className="md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </div>
                <nav className="mt-4 relative z-10 flex flex-col gap-1 px-3 pb-8">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100/50 dark:border-blue-800/30' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                                <Icon className={`text-lg ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}