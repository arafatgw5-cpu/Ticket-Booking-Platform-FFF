'use client';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
export const metadata = {
    title: 'Book Ticket | TicketBari'
};
export default function BookModal({ ticket, onClose }) {
    const { user } = useAuth();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (user?.role === 'vendor' || user?.role === 'admin') {
            toast.error('Vendors and Admins cannot book tickets');
            return;
        }
        if (quantity > ticket.quantity) {
            toast.error('Not enough tickets available');
            return;
        }

        setLoading(true);
        try {
            const booking = {
                ticketId: ticket._id,
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                vendorEmail: ticket.vendorEmail,
                ticketTitle: ticket.title,
                ticketImage: ticket.image,
                from: ticket.from,
                to: ticket.to,
                departureDate: ticket.departureDate,
                quantity,
                unitPrice: ticket.price,
                totalPrice: ticket.price * quantity
            };

            await axiosInstance.post('/bookings', booking);
            toast.success('Booking request sent!');
            router.push('/dashboard/bookings');
            onClose();
        } catch (error) {
            toast.error('Failed to book ticket');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] max-w-md w-full p-8 border border-slate-200/60 dark:border-slate-800 relative animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Book Ticket</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"><FaTimes className="text-lg" /></button>
                </div>

                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{ticket.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{ticket.from} → {ticket.to}</p>
                </div>

                <form onSubmit={handleBooking} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                            Quantity <span className="text-slate-400 font-normal">(max {ticket.quantity})</span>
                        </label>
                        <input 
                            type="number" 
                            min="1" 
                            max={ticket.quantity} 
                            value={quantity} 
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                            required 
                        />
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Unit Price</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">${ticket.price}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Price</span>
                            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">${ticket.price * quantity}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all">
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}