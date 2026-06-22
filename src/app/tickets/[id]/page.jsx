'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookModal from '@/components/tickets/BookModal';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaBus, FaTrain, FaShip, FaPlane, FaClock } from 'react-icons/fa';

const icons = { Bus: FaBus, Train: FaTrain, Launch: FaShip, Plane: FaPlane };

export default function TicketDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    const { data: ticket, isLoading } = useQuery({
        queryKey: ['ticket', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/tickets/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    useEffect(() => {
        if (!ticket) return;
        const interval = setInterval(() => {
            const diff = new Date(ticket.departureDate) - new Date();
            if (diff <= 0) {
                setTimeLeft('Expired');
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [ticket]);

    const handleBookNow = () => {
        if (!user) {
            toast.error('Please login to book a ticket');
            router.push('/login');
            return;
        }
        setIsModalOpen(true);
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!ticket) return <div className="text-center py-20">Ticket not found</div>;

    const Icon = icons[ticket.transportType] || FaBus;
    const isExpired = new Date(ticket.departureDate) < new Date();

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
            <div className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200/60 dark:border-slate-800 overflow-hidden relative backdrop-blur-xl">
                
                {/* Header Image Section */}
                <div className="relative h-72 md:h-96 w-full group overflow-hidden">
                    <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    
                    {/* Floating Info */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400">
                                    <Icon className="text-lg" />
                                </span>
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20 uppercase tracking-wider">
                                    {ticket.transportType}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">{ticket.title}</h1>
                            <p className="text-lg md:text-xl text-slate-300 font-medium drop-shadow flex items-center gap-2">
                                <span>{ticket.from}</span>
                                <span className="text-blue-400">→</span>
                                <span>{ticket.to}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-300 font-medium mb-1 uppercase tracking-wider">Price per seat</p>
                            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-md">${ticket.price}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 relative z-10">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Available Seats</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">{ticket.quantity}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Departure Date</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date(ticket.departureDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Departure Time</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date(ticket.departureDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300 ${isExpired ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50'}`}>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isExpired ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'}`}>Time Left</p>
                            <p className={`text-xl font-bold flex items-center gap-2 ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-blue-700 dark:text-blue-300'}`}>
                                <FaClock /> {timeLeft}
                            </p>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Amenities & Perks
                        </h3>
                        {ticket.perks && ticket.perks.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {ticket.perks.map((perk, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                        {perk}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No special perks listed for this ticket.</p>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                        <button 
                            onClick={handleBookNow} 
                            disabled={isExpired || ticket.quantity === 0} 
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xl hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 disabled:from-slate-400 disabled:to-slate-500 disabled:hover:transform-none disabled:hover:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            {isExpired ? 'DEPARTURE PASSED' : ticket.quantity === 0 ? 'SOLD OUT' : 'BOOK TICKET NOW'}
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && <BookModal ticket={ticket} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}