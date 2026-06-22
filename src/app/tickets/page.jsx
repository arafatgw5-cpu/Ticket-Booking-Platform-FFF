'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import TicketCard from '@/components/tickets/TicketCard';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function AllTicketsPage() {
    const [search, setSearch] = useState('');
    const [transportType, setTransportType] = useState('');
    const [sort, setSort] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['tickets', search, transportType, sort, page],
        queryFn: async () => {
            const res = await axiosInstance.get('/tickets', {
                params: { search, transportType, sort, page, limit: 6 }
            });
            return res.data;
        }
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold mb-8">All Tickets</h1>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input type="text" placeholder="Search (e.g., Dhaka-Chittagong)" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <select value={transportType} onChange={(e) => setTransportType(e.target.value)} className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">All Transport Types</option>
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Launch">Launch</option>
                    <option value="Plane">Plane</option>
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Sort By</option>
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.tickets?.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
                    </div>
                    {data?.tickets?.length === 0 && <p className="text-center text-gray-500 mt-8">No tickets found.</p>}
                    
                    <div className="flex justify-center mt-8 gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">Previous</button>
                        <span className="px-4 py-2">Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={data?.tickets?.length < 6} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">Next</button>
                    </div>
                </>
            )}
        </div>
    );
}