import Link from 'next/link';
import { FaBus, FaTrain, FaShip, FaPlane, FaCalendarAlt, FaChair } from 'react-icons/fa';

const icons = { Bus: FaBus, Train: FaTrain, Launch: FaShip, Plane: FaPlane };

export default function TicketCard({ ticket }) {
    const Icon = icons[ticket.transportType] || FaBus;

    return (
        <div className="group relative rounded-2xl p-[1px] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] dark:hover:shadow-[0_20px_40px_rgba(79,70,229,0.2)] h-full">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative h-full flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[15px] overflow-hidden z-10">
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-900/10 dark:bg-slate-900/30 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-overlay"></div>
                    <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"></div>
                    
                    {/* Floating Price Badge inside Image */}
                    <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white font-extrabold text-sm shadow-lg shadow-black/20">
                        ${ticket.price}
                    </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col relative z-20 -mt-6 bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100/50 dark:border-blue-800/30 shadow-sm">
                            <Icon className="text-blue-600 dark:text-blue-400 text-sm" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wider uppercase">{ticket.transportType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                            <FaChair className="text-slate-400 dark:text-slate-500" /> 
                            <span className={ticket.quantity < 5 ? "text-red-500" : ""}>{ticket.quantity} Left</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-extrabold mb-3 line-clamp-1 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-400 transition-all duration-300">{ticket.title}</h3>
                    
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-4 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">From</span>
                            <span className="font-bold text-sm">{ticket.from}</span>
                        </div>
                        <div className="w-8 flex justify-center text-blue-400 dark:text-blue-500 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                            →
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold mb-0.5">To</span>
                            <span className="font-bold text-sm">{ticket.to}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 text-indigo-500">
                            <FaCalendarAlt />
                        </div>
                        <span className="font-medium">{new Date(ticket.departureDate).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {ticket.perks && ticket.perks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {ticket.perks.slice(0, 3).map((perk, idx) => (
                                <span key={idx} className="text-[10px] font-bold px-2.5 py-1 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                                    {perk}
                                </span>
                            ))}
                            {ticket.perks.length > 3 && (
                                <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                    +{ticket.perks.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mt-auto pt-4 flex">
                        <Link href={`/tickets/${ticket._id}`} className="w-full relative group/btn overflow-hidden rounded-xl p-0.5 flex items-center justify-center">
                            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative w-full flex items-center justify-center bg-transparent py-3 px-6 text-white font-bold text-sm tracking-wide transition-all duration-300 group-hover/btn:scale-105">
                                Book Ticket
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}