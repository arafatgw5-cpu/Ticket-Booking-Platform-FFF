'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBus, FaUser, FaSignOutAlt, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import useAuth from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, isLoading, handleLogout } = useAuth();
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Hydration error এড়াতে mount হওয়ার পরেই রেন্ডার
    useEffect(() => {
        setMounted(true);
        
        // Scroll detection for shadow effect
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Route change হলে mobile menu বন্ধ
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (!mounted) return null;

    // Active link detection
    const isActive = (path) => pathname === path;

    const linkClass = (path) => `
        relative py-2 text-sm font-medium transition-colors
        ${isActive(path) 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
        }
        after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 
        after:transition-all after:duration-300
        ${isActive(path) ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
    `;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
            scrolled 
                ? 'glass border-transparent' 
                : 'bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200/50 dark:border-slate-800/50'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform">
                        <FaBus className="text-2xl" />
                        <span>TicketBari</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className={linkClass('/')}>
                            Home
                        </Link>
                        <Link href="/tickets" className={linkClass('/tickets')}>
                            All Tickets
                        </Link>
                        {user && (
                            <Link href="/dashboard" className={linkClass('/dashboard')}>
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button 
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <FaSun className="text-yellow-400 text-lg" />
                            ) : (
                                <FaMoon className="text-gray-600 text-lg" />
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <FaTimes className="text-xl" />
                            ) : (
                                <FaBars className="text-xl" />
                            )}
                        </button>

                        {/* User Section (Desktop) */}
                        <div className="hidden md:block">
                            {isLoading ? (
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                            ) : user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        <img 
                                            src={user.image || 'https://i.pravatar.cc/150'} 
                                            alt={user.name} 
                                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500"
                                        />
                                        <span className="text-sm font-medium max-w-[120px] truncate">
                                            {user.name}
                                        </span>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        {/* User Info Header */}
                                        <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
                                            <p className="text-base font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                                            <span className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full capitalize shadow-md shadow-blue-500/20">
                                                {user.role || 'user'}
                                            </span>
                                        </div>
                                        
                                        <Link 
                                            href="/dashboard/profile" 
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FaUser className="text-xs" /> My Profile
                                        </Link>
                                        <Link 
                                            href="/dashboard" 
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <FaBus className="text-xs" /> Dashboard
                                        </Link>
                                        
                                        <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                                            <button 
                                                onClick={handleLogout} 
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <FaSignOutAlt className="text-xs" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link 
                                        href="/login" 
                                        className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm hover:shadow-md"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                        <div className="flex flex-col gap-2">
                            <Link 
                                href="/" 
                                className={`px-4 py-2 rounded-lg ${isActive('/') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                Home
                            </Link>
                            <Link 
                                href="/tickets" 
                                className={`px-4 py-2 rounded-lg ${isActive('/tickets') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                                All Tickets
                            </Link>
                            {user && (
                                <Link 
                                    href="/dashboard" 
                                    className={`px-4 py-2 rounded-lg ${isActive('/dashboard') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
                                >
                                    Dashboard
                                </Link>
                            )}

                            {/* Mobile User Section */}
                            {isLoading ? (
                                <div className="px-4 py-2">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            ) : user ? (
                                <>
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 mt-2">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={user.image || 'https://i.pravatar.cc/150'} 
                                                alt={user.name} 
                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        href="/dashboard/profile" 
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                    >
                                        <FaUser className="text-sm" /> My Profile
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <FaSignOutAlt className="text-sm" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2 mx-2 mt-2">
                                    <Link 
                                        href="/login" 
                                        className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-center font-medium transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}