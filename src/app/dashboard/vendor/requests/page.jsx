'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

export default function RequestedBookingsPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['vendor-bookings', session?.user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/bookings/vendor/${session.user.email}`);
            return res.data;
        },
        enabled: !!session?.user?.email
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            await axiosInstance.patch(`/bookings/status/${id}`, { status });
        },
        onSuccess: () => {
            toast.success('Booking status updated');
            queryClient.invalidateQueries(['vendor-bookings']);
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const handleStatusUpdate = (id, status) => {
        statusMutation.mutate({ id, status });
    };

    if (isLoading) return <div className="text-center py-20">Loading requests...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Requests</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Manage incoming booking requests from users.</p>
                </div>
            </div>

            {bookings?.length === 0 ? (
                <div className="glass-card bg-white/50 dark:bg-slate-900/50 rounded-2xl shadow-sm p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
                    No booking requests yet.
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900/50 dark:to-slate-900/10 pointer-events-none"></div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">User Details</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Ticket Details</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Qty & Price</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Status</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {bookings?.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-200">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 dark:text-white text-base">{booking.userName}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{booking.userEmail}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900 dark:text-white">{booking.ticketTitle}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{booking.from} <span className="text-blue-400 mx-1">→</span> {booking.to}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase mb-1">Qty: {booking.quantity}</p>
                                            <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">${booking.totalPrice}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                                                booking.status === 'accepted' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' :
                                                booking.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' :
                                                booking.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' :
                                                'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    booking.status === 'accepted' ? 'bg-blue-500' :
                                                    booking.status === 'paid' ? 'bg-emerald-500' :
                                                    booking.status === 'rejected' ? 'bg-red-500' :
                                                    'bg-amber-500 animate-pulse'
                                                }`}></span>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right space-x-3">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                                        className="px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow active:scale-95"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                        className="px-4 py-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm hover:shadow active:scale-95"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
