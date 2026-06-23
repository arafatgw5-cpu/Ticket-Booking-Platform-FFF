'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function AdvertiseTicketsPage() {
    const queryClient = useQueryClient();

    const { data: tickets, isLoading } = useQuery({
        queryKey: ['admin-tickets'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tickets/admin');
            return res.data;
        }
    });

    const advertiseMutation = useMutation({
        mutationFn: async ({ id, isAdvertised }) => {
            await axiosInstance.patch(`/tickets/advertise/${id}`, { isAdvertised });
        },
        onSuccess: () => {
            toast.success('Ticket advertisement status updated');
            queryClient.invalidateQueries(['admin-tickets']);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update advertisement status');
        }
    });

    const handleToggleAdvertise = (id, currentStatus) => {
        advertiseMutation.mutate({ id, isAdvertised: !currentStatus });
    };

    if (isLoading) return <div className="text-center py-20 text-slate-400">Loading tickets...</div>;

    const approvedTickets = tickets?.filter(t => t.verificationStatus === 'approved') || [];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Advertise{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                        Tickets
                    </span>
                </h1>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                    Select up to 6 approved tickets to feature on the homepage.
                </p>
            </div>

            {approvedTickets.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-12 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl text-slate-400">
                        ?
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        No approved tickets available to advertise.
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden">
                    {/* Responsive wrapper — only the table scrolls if needed */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed', minWidth: '480px' }}>
                            <colgroup>
                                <col className="w-[42%]" />
                                <col className="w-[24%] hidden sm:table-column" />
                                <col className="w-[16%]" />
                                <col className="w-[18%]" />
                            </colgroup>
                            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Ticket
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                                        Vendor
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Price
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                                        Advertise
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                                {approvedTickets.map((ticket) => (
                                    <tr
                                        key={ticket._id}
                                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* Ticket info */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img
                                                    src={ticket.image}
                                                    alt={ticket.title}
                                                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                        {ticket.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                                        {ticket.from}
                                                        <span className="text-blue-400 mx-1">→</span>
                                                        {ticket.to}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Vendor — hidden on mobile */}
                                        <td className="px-5 py-4 hidden sm:table-cell">
                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                                                {ticket.vendorEmail}
                                            </span>
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 whitespace-nowrap">
                                                ${ticket.price}
                                            </span>
                                        </td>

                                        {/* Toggle */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col items-end gap-1">
                                                <button
                                                    onClick={() => handleToggleAdvertise(ticket._id, ticket.isAdvertised)}
                                                    aria-label={`Toggle advertise for ${ticket.title}`}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                                                        ticket.isAdvertised
                                                            ? 'bg-emerald-500'
                                                            : 'bg-slate-200 dark:bg-slate-700'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                                                            ticket.isAdvertised ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                                <span
                                                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                                                        ticket.isAdvertised
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-slate-400 dark:text-slate-500'
                                                    }`}
                                                >
                                                    {ticket.isAdvertised ? 'On' : 'Off'}
                                                </span>
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