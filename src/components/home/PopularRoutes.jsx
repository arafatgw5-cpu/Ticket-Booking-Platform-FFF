'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function PopularRoutes() {
    const { data: tickets, isLoading } = useQuery({
        queryKey: ['popular-routes'],
        queryFn: async () => {
            const res = await axiosInstance.get('/tickets?limit=4');
            return res.data?.tickets || res.data || [];
        }
    });

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-2 mb-8">
                <FaMapMarkerAlt className="text-red-500 text-2xl" />
                <h2 className="text-3xl font-bold">Popular Routes</h2>
            </div>
            
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tickets?.slice(0, 4).map((ticket) => (
                        <Link href={`/tickets/${ticket._id}`} key={ticket._id} className="group relative rounded-xl overflow-hidden shadow-lg h-64 block">
                            <img 
                                src={ticket.image} 
                                alt={`${ticket.from} to ${ticket.to}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white text-xl font-bold">{ticket.from} → {ticket.to}</h3>
                                <p className="text-gray-300 font-medium">Starts from ${ticket.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
