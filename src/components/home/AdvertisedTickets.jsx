'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { FaStar } from 'react-icons/fa';
import TicketCard from '@/components/tickets/TicketCard';

export default function AdvertisedTickets() {
    const { data, isLoading } = useQuery({
        queryKey: ['advertised-tickets'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tickets?advertised=true&limit=6');
            return res.data?.tickets || res.data || [];
        }
    });

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
                <FaStar className="text-yellow-500" />
                <h2 className="text-3xl font-bold">Featured Tickets</h2>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
                </div>
            )}
        </section>
    );
}