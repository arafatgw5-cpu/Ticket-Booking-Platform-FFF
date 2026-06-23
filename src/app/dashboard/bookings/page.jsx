'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

import Countdown from '@/components/Countdown';

export default function BookingsPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['bookings', session?.user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/bookings/user/${session.user.email}`);
            return res.data;
        },
        enabled: !!session?.user?.email
    });

    const handlePaymentClick = async (booking) => {
        try {
            setIsRedirecting(true);
            toast.loading('Redirecting to checkout...', { id: 'checkout' });
            
            // Calling the internal Next.js App Router API route
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: booking.totalPrice,
                    title: booking.ticketTitle,
                    bookingId: booking._id
                })
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("API returned non-JSON response:", text);
                throw new Error('API returned an invalid response. Please check server logs or restart the development server.');
            }
            
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Payment intent error:', error);
            toast.error(error.message || 'Failed to initialize payment', { id: 'checkout' });
            setIsRedirecting(false);
        }
    };

    const statusStyles = {
        pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
        accepted: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
        rejected: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
        paid: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-10">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Bookings</span>
            </h1>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"></div>)}
                </div>
            ) : !bookings?.length ? (
                <div className="glass-card bg-white/80 dark:bg-slate-900/80 p-16 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
                    <p className="text-xl font-bold text-slate-400 dark:text-slate-500">No bookings found yet.</p>
                    <p className="text-sm text-slate-400 mt-2">Start exploring tickets and book your first ride!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        const isExpired = new Date(booking.departureDate) < new Date();
                        return (
                            <div key={booking._id} className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-800 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                                <div className="relative h-40 overflow-hidden">
                                    <img src={booking.ticketImage} alt={booking.ticketTitle} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <h3 className="text-lg font-extrabold text-white truncate">{booking.ticketTitle}</h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1 font-medium">
                                        {booking.from} <span className="text-blue-500">→</span> {booking.to}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                                        Departure: {new Date(booking.departureDate).toLocaleString()}
                                    </p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Qty: {booking.quantity}</span>
                                        <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">${booking.totalPrice}</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles[booking.status] || statusStyles.pending}`}>
                                            {booking.status}
                                        </span>
                                        {!isExpired && booking.status !== 'rejected' && booking.status !== 'paid' && (
                                            <div className="text-xs font-medium text-slate-500"><Countdown departure={booking.departureDate} /></div>
                                        )}
                                    </div>

                                    {booking.status === 'accepted' && !isExpired && (
                                        <button onClick={() => handlePaymentClick(booking)} disabled={isRedirecting} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all">
                                            {isRedirecting ? 'Processing...' : 'Pay Now'}
                                        </button>
                                    )}
                                    {booking.status === 'rejected' && <p className="text-center text-red-500 dark:text-red-400 font-bold text-sm">Booking Rejected</p>}
                                    {booking.status === 'paid' && <p className="text-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">✓ Paid Successfully</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Payment is now handled via Stripe Hosted Checkout */}
        </div>
    );
}