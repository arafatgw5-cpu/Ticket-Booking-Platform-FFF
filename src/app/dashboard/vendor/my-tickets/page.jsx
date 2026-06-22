'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { FaTrash, FaEdit, FaBus, FaTrain, FaShip, FaPlane, FaTicketAlt } from 'react-icons/fa';
import UpdateTicketModal from '@/components/dashboard/UpdateTicketModal';

const icons = { Bus: FaBus, Train: FaTrain, Launch: FaShip, Plane: FaPlane };

export default function MyTicketsPage() {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const [updatingTicket, setUpdatingTicket] = useState(null);

    const { data: tickets, isLoading } = useQuery({
        queryKey: ['vendor-tickets', session?.user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/tickets/vendor/${session.user.email}`);
            return res.data;
        },
        enabled: !!session?.user?.email
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstance.delete(`/tickets/${id}`);
        },
        onSuccess: () => {
            toast.success('Ticket deleted successfully');
            queryClient.invalidateQueries(['vendor-tickets']);
        },
        onError: () => {
            toast.error('Failed to delete ticket');
        }
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this ticket?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        My Added <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Tickets</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Manage your inventory, update pricing, or remove routes.</p>
                </div>
            </div>

            {tickets?.length === 0 ? (
                <div className="glass-card bg-white/50 dark:bg-slate-900/50 rounded-2xl shadow-sm p-12 text-center text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <FaTicketAlt className="text-2xl text-slate-400" />
                    </div>
                    You haven&apos;t added any tickets yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets?.map((ticket) => {
                        const Icon = icons[ticket.transportType] || FaBus;
                        const isRejected = ticket.verificationStatus === 'rejected';

                        return (
                            <div key={ticket._id} className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-slate-200/60 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden">
                                    <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-md border ${
                                        ticket.verificationStatus === 'approved' ? 'bg-emerald-500/20 text-white border-emerald-500/50' :
                                        ticket.verificationStatus === 'rejected' ? 'bg-red-500/20 text-white border-red-500/50' :
                                        'bg-amber-500/20 text-white border-amber-500/50 animate-pulse'
                                    }`}>
                                        {ticket.verificationStatus}
                                    </span>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col relative z-10 -mt-6 bg-white dark:bg-slate-900 rounded-t-2xl">
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50 w-fit mb-4">
                                        <Icon className="text-blue-600 dark:text-blue-400 text-sm" />
                                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wide uppercase">{ticket.transportType}</span>
                                    </div>
                                    
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">{ticket.title}</h3>
                                    
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-5 font-medium">
                                        <span>{ticket.from}</span>
                                        <span className="text-blue-500">→</span>
                                        <span>{ticket.to}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 font-semibold">Qty: {ticket.quantity}</span>
                                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">${ticket.price}</span>
                                    </div>
                                    
                                    <div className="mt-auto flex gap-3">
                                        <button 
                                            onClick={() => setUpdatingTicket(ticket)}
                                            disabled={isRejected}
                                            className="flex-1 flex justify-center items-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 border border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                        >
                                            <FaEdit /> Update
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(ticket._id)}
                                            disabled={isRejected}
                                            className="flex-1 flex justify-center items-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {updatingTicket && (
                <UpdateTicketModal 
                    ticket={updatingTicket} 
                    onClose={() => setUpdatingTicket(null)} 
                    onSuccess={() => queryClient.invalidateQueries(['vendor-tickets'])}
                />
            )}
        </div>
    );
}
