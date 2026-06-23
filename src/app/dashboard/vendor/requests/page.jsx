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
        onError: () => toast.error('Failed to update status')
    });

    const handleStatusUpdate = (id, status) => statusMutation.mutate({ id, status });

    if (isLoading) return (
        <div className="flex items-center justify-center py-24 text-sm text-slate-500 dark:text-slate-400">
            Loading requests...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Booking <span className="text-indigo-600 dark:text-indigo-400">Requests</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Manage incoming booking requests from users.
                </p>
            </div>

            {bookings?.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No booking requests yet.
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left" style={{ minWidth: '640px' }}>
                            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    {['User details', 'Ticket details', 'Qty & price', 'Status', 'Actions'].map((h, i) => (
                                        <th key={h} className={`px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${i === 4 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {bookings?.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{booking.userName}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[160px]">{booking.userEmail}</p>
                                        </td>
                                        {/* Ticket */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{booking.ticketTitle}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {booking.from}
                                                <span className="mx-1 text-blue-400">→</span>
                                                {booking.to}
                                            </p>
                                        </td>
                                        {/* Qty & Price */}
                                        <td className="px-5 py-4">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Qty: {booking.quantity}</p>
                                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">${booking.totalPrice}</p>
                                        </td>
                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                booking.status === 'accepted'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40'
                                                    : booking.status === 'paid'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                                                    : booking.status === 'rejected'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40'
                                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    booking.status === 'accepted' ? 'bg-blue-500' :
                                                    booking.status === 'paid' ? 'bg-emerald-500' :
                                                    booking.status === 'rejected' ? 'bg-red-500' :
                                                    'bg-amber-500 animate-pulse'
                                                }`} />
                                                {booking.status}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all active:scale-95"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
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