import { FaBus, FaFacebook, FaPhone, FaEnvelope, FaCcStripe, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="relative bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 mt-20 overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors duration-500">
            {/* Top Glow Line (Only visible in dark mode or soft blue in light) */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 dark:via-blue-500 to-transparent dark:opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <div className="flex items-center gap-2 text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                            <FaBus className="text-blue-600 dark:text-blue-500" /> TicketBari
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Book bus, train, launch & flight tickets easily with a seamless experience and secure payments.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white tracking-wide uppercase text-sm">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Home</Link></li>
                            <li><Link href="/tickets" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> All Tickets</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white tracking-wide uppercase text-sm">Contact Info</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><FaEnvelope className="text-blue-600 dark:text-blue-500 text-lg" /> support@ticketbari.com</li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300"><FaPhone className="text-blue-600 dark:text-blue-500 text-lg" /> +880 1234 567890</li>
                            <li className="flex items-center gap-4 mt-6">
                                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-white hover:bg-blue-600 hover:text-white transition-colors text-xl shadow-sm"><FaFacebook /></a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white tracking-wide uppercase text-sm">Payment Methods</h3>
                        <div className="flex items-center gap-4 text-4xl text-slate-400 dark:text-slate-500">
                            <FaCcStripe className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" />
                            <FaCcVisa className="hover:text-[#1434CB] dark:hover:text-white transition-colors cursor-pointer" />
                            <FaCcMastercard className="hover:text-[#EB001B] dark:hover:text-white transition-colors cursor-pointer" />
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 font-medium">100% secure payments via Stripe</p>
                    </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 text-center text-slate-500 dark:text-slate-500 text-sm">
                    © {new Date().getFullYear()} TicketBari. Designed with excellence. All rights reserved.
                </div>
            </div>
        </footer>
    );
}