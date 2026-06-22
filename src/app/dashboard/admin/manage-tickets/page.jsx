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
        onError: () => {
            toast.error('Failed to update ticket status');
        }
    });

    const handleVerify = (id, status) => {
        verifyMutation.mutate({ id, status });
    };

    if (isLoading) return <div className="text-center py-20">Loading tickets...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Tickets</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Review, approve, or reject vendor tickets.</p>
                </div>
            </div>
            
            <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900/50 dark:to-slate-900/10 pointer-events-none"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Ticket Title & Route</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Vendor Email</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Price & Qty</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Status</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {tickets?.map((ticket) => (
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
                                    <td className="px-6 py-5">
                                        <p className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-0.5">${ticket.price}</p>
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">Qty: {ticket.quantity}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                                            ticket.verificationStatus === 'approved' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' :
                                            ticket.verificationStatus === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' :
                                            'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                ticket.verificationStatus === 'approved' ? 'bg-emerald-500' :
                                                ticket.verificationStatus === 'rejected' ? 'bg-red-500' :
                                                'bg-amber-500 animate-pulse'
                                            }`}></span>
                                            {ticket.verificationStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right space-x-3">
                                        {ticket.verificationStatus === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleVerify(ticket._id, 'approved')}
                                                    className="px-4 py-2 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all shadow-sm hover:shadow active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleVerify(ticket._id, 'rejected')}
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
        </div>
    );
}
