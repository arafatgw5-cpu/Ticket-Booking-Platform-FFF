'use client';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FaUpload } from 'react-icons/fa';

export default function AddTicketPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [selectedPerks, setSelectedPerks] = useState([]);

    const PERKS_OPTIONS = ['AC', 'Non-AC', 'Breakfast', 'Lunch', 'WiFi', 'Sleeping Berth'];

    const handlePerkToggle = (perk) => {
        setSelectedPerks(prev => 
            prev.includes(perk) ? prev.filter(p => p !== perk) : [...prev, perk]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        
        let imageUrl = '';
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            
            try {
                const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });
                const imgbbData = await imgbbResponse.json();
                if (imgbbData.success) {
                    imageUrl = imgbbData.data.url;
                } else {
                    toast.error('Image upload failed');
                    setLoading(false);
                    return;
                }
            } catch (error) {
                toast.error('Image upload failed');
                setLoading(false);
                return;
            }
        }

        const newTicket = {
            title: form.title.value,
            from: form.from.value,
            to: form.to.value,
            transportType: form.transportType.value,
            price: parseFloat(form.price.value),
            quantity: parseInt(form.quantity.value),
            departureDate: form.departureDate.value,
            perks: selectedPerks,
            image: imageUrl || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', // Default if no image
            vendorName: session?.user?.name,
            vendorEmail: session?.user?.email,
        };

        try {
            await axiosInstance.post('/tickets', newTicket);
            toast.success('Ticket added successfully. Pending admin approval.');
            queryClient.invalidateQueries({ queryKey: ['vendor-tickets'] });
            router.push('/dashboard/vendor/my-tickets');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add ticket');
        } finally {
            setLoading(false);
        }
    };

    if (!session?.user) return null;

    return (
        <div className="max-w-4xl mx-auto pb-10 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
                Add New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Ticket</span>
            </h1>
            <div className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-8 border border-slate-200/60 dark:border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Ticket Title</label>
                            <input name="title" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Green Line Express" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Transport Type</label>
                            <select name="transportType" required className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                <option value="Bus">Bus</option>
                                <option value="Train">Train</option>
                                <option value="Launch">Launch</option>
                                <option value="Plane">Plane</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">From (Location)</label>
                            <input name="from" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Dhaka" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">To (Location)</label>
                            <input name="to" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. Chittagong" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Price (per unit)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                <input name="price" required type="number" min="0" step="0.01" className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. 50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Ticket Quantity</label>
                            <input name="quantity" required type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400" placeholder="e.g. 40" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Departure Date & Time</label>
                            <input name="departureDate" required type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Perks</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {PERKS_OPTIONS.map(perk => (
                                    <label key={perk} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedPerks.includes(perk) ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedPerks.includes(perk) ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'}`}>
                                            {selectedPerks.includes(perk) && (
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium ${selectedPerks.includes(perk) ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{perk}</span>
                                        <input type="checkbox" className="hidden" checked={selectedPerks.includes(perk)} onChange={() => handlePerkToggle(perk)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Vendor Name</label>
                            <input type="text" value={session.user.name} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 cursor-not-allowed font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Vendor Email</label>
                            <input type="text" value={session.user.email} readOnly className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 cursor-not-allowed font-medium" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <label className="block text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Ticket Image</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/50 rounded-xl cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all shadow-sm">
                                <FaUpload />
                                <span>Choose Image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
                            </label>
                            {imageFile && <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-xs">{imageFile.name}</span>}
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none transition-all duration-300 flex items-center justify-center">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Adding Ticket...
                                </span>
                            ) : 'Add Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
