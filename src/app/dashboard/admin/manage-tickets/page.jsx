'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function ManageTicketsPage() {
    const queryClient = useQueryClient();

    const { data: tickets, isLoading } = useQuery({
        queryKey: ['admin-tickets'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tickets/admin');
            return res.data;
        }
    });

    const verifyMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            await axiosInstance.patch(`/tickets/verify/${id}`, { status });
        },
        onSuccess: () => {
            toast.success('Ticket verification status updated');
            queryClient.invalidateQueries(['admin-tickets']);
        },
        onError: () => toast.error('Failed to update ticket status')
    });

    const handleVerify = (id, status) => verifyMutation.mutate({ id, status });

    const initials = (title) =>
        title.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    if (isLoading) return (
        <div className="flex items-center justify-center py-24 text-sm text-slate-500 dark:text-slate-400">
            Loading tickets...
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-medium text-slate-900 dark:text-white">
                    Manage <span className="text-indigo-500 dark:text-indigo-400">Tickets</span>
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review, approve, or reject vendor tickets.
                </p>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden">
                {/* Scrollable wrapper — fixes horizontal overflow on mobile */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse" style={{ minWidth: '580px' }}>
                        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/60">
                            <tr>
                                {[
                                    { label: 'Ticket title & route', align: '' },
                                    { label: 'Vendor email', align: '' },
                                    { label: 'Price & qty', align: '' },
                                    { label: 'Status', align: '' },
                                    { label: 'Actions', align: 'text-right' },
                                ].map(({ label, align }) => (
                                    <th
                                        key={label}
                                        className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap ${align}`}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {tickets?.map((ticket) => (
                                <tr
                                    key={ticket._id}
                                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-150"
                                >
                                    {/* Ticket */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            {ticket.image ? (
                                                <img
                                                    src={ticket.image}
                                                    alt={ticket.title}
                                                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    {initials(ticket.title)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-[200px]">
                                                    {ticket.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {ticket.from}
                                                    <span className="mx-1 text-blue-400">→</span>
                                                    {ticket.to}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Vendor */}
                                    <td className="px-4 py-3 max-w-[160px]">
                                        <span
                                            className="text-xs text-slate-500 dark:text-slate-400 block truncate"
                                            title={ticket.vendorEmail}
                                        >
                                            {ticket.vendorEmail}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                            ৳{ticket.price.toLocaleString()}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wide">
                                            Qty: {ticket.quantity}
                                        </p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                                            ticket.verificationStatus === 'approved'
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                                                : ticket.verificationStatus === 'rejected'
                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40'
                                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                                ticket.verificationStatus === 'approved' ? 'bg-emerald-500' :
                                                ticket.verificationStatus === 'rejected' ? 'bg-red-500' :
                                                'bg-amber-500 animate-pulse'
                                            }`} />
                                            {ticket.verificationStatus}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        {ticket.verificationStatus === 'pending' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleVerify(ticket._id, 'approved')}
                                                    disabled={verifyMutation.isPending}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(ticket._id, 'rejected')}
                                                    disabled={verifyMutation.isPending}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {tickets?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                                        No tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}