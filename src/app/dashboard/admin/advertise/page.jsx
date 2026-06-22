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

    if (isLoading) return <div className="text-center py-20">Loading tickets...</div>;

    const approvedTickets = tickets?.filter(t => t.verificationStatus === 'approved') || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Advertise <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">Tickets</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Select up to 6 approved tickets to feature on the homepage.</p>
                </div>
            </div>
            
            {approvedTickets.length === 0 ? (
                <div className="glass-card bg-white/50 dark:bg-slate-900/50 rounded-2xl shadow-sm p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <span className="text-2xl text-slate-400">?</span>
                    </div>
                    No approved tickets available to advertise.
                </div>
            ) : (
                <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900/50 dark:to-slate-900/10 pointer-events-none"></div>
                    
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Ticket details</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Vendor</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Price</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase text-right">Advertise Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {approvedTickets.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-200">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <img src={ticket.image} alt={ticket.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white text-base">{ticket.title}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{ticket.from} <span className="text-blue-400 mx-1">→</span> {ticket.to}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{ticket.vendorEmail}</td>
                                        <td className="px-6 py-5 text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">${ticket.price}</td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex flex-col items-end gap-1.5">
                                                <button 
                                                    onClick={() => handleToggleAdvertise(ticket._id, ticket.isAdvertised)}
                                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                                                        ticket.isAdvertised ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-slate-200 dark:bg-slate-700'
                                                    }`}
                                                >
                                                    <span 
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                                            ticket.isAdvertised ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                    />
                                                </button>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${ticket.isAdvertised ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                                    {ticket.isAdvertised ? 'Advertised' : 'Hidden'}
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
