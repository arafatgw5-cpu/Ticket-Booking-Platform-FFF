'use client';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { useSession } from '@/lib/auth-client';
import { FaMoneyBillWave, FaTicketAlt, FaShoppingCart } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function RevenuePage() {
    const { data: session } = useSession();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['vendor-stats', session?.user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/stats/vendor/${session.user.email}`);
            return res.data;
        },
        enabled: !!session?.user?.email
    });

    if (isLoading) return <div className="text-center py-20">Loading stats...</div>;

    const summaryCards = [
        { title: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: FaMoneyBillWave, iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { title: 'Tickets Sold', value: stats?.totalSold || 0, icon: FaShoppingCart, iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'Tickets Added', value: stats?.totalAdded || 0, icon: FaTicketAlt, iconColor: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    const pieData = [
        { name: 'Tickets Sold', value: stats?.totalSold || 0 },
        { name: 'Available/Unsold', value: Math.max((stats?.totalAdded * 10) - (stats?.totalSold || 0), 0) } // Approximation for demo
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-10">
                Revenue <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400">Overview</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {summaryCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="glass-card bg-white/80 dark:bg-slate-900/80 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex items-center gap-6 border border-slate-200/60 dark:border-slate-800 transition-transform duration-300 hover:-translate-y-1">
                            <div className={`w-16 h-16 ${card.bgColor} rounded-2xl flex items-center justify-center`}>
                                <Icon className={`text-3xl ${card.iconColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{card.title}</p>
                                <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card bg-white/80 dark:bg-slate-900/80 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">Sales Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card bg-white/80 dark:bg-slate-900/80 p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-8 text-slate-900 dark:text-white">Revenue Metrics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{name: 'Performance', Added: stats?.totalAdded, Sold: stats?.totalSold, Revenue: stats?.totalRevenue / 10}]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'rgba(100,116,139,0.1)'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="Added" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                                <Bar dataKey="Sold" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
