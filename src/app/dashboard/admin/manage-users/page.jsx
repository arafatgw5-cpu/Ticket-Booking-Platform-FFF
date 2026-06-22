'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

export default function ManageUsersPage() {
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await axiosInstance.get('/users');
            return res.data;
        }
    });

    const roleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            await axiosInstance.patch(`/users/role/${id}`, { role });
        },
        onSuccess: () => {
            toast.success('User role updated');
            queryClient.invalidateQueries(['admin-users']);
        },
        onError: () => {
            toast.error('Failed to update role');
        }
    });

    const fraudMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstance.patch(`/users/fraud/${id}`);
        },
        onSuccess: () => {
            toast.success('Vendor marked as fraud. Their tickets are now hidden/rejected.');
            queryClient.invalidateQueries(['admin-users']);
        },
        onError: () => {
            toast.error('Failed to mark fraud');
        }
    });

    const handleRoleChange = (id, role) => {
        if (confirm(`Are you sure you want to make this user an ${role}?`)) {
            roleMutation.mutate({ id, role });
        }
    };

    const handleMarkFraud = (id) => {
        if (confirm('Are you sure you want to mark this vendor as fraud? This action cannot be undone and will hide all their tickets.')) {
            fraudMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading users...</div>;

    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Users</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Control roles, permissions, and security across the platform.</p>
                </div>
                <div className="hidden sm:block">
                    <span className="px-4 py-2 rounded-full glass bg-blue-50/50 dark:bg-slate-800/50 text-sm font-semibold text-blue-700 dark:text-blue-300 shadow-sm border border-blue-100 dark:border-slate-700">
                        Total Users: {users?.length || 0}
                    </span>
                </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900/50 dark:to-slate-900/10 pointer-events-none"></div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">User</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Role</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">Status</th>
                                <th className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {users?.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/30 transition-colors duration-200">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={user.image || 'https://i.pravatar.cc/150'} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                                                {user.isFraud && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" title="Fraudulent User"></div>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-base">{user.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                                            user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50' :
                                            user.role === 'vendor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        {user.isFraud ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200 dark:border-red-800/50 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                Fraud
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right space-x-3">
                                        {user.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleRoleChange(user._id, 'admin')}
                                                className="px-4 py-2 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800 transition-all shadow-sm hover:shadow active:scale-95"
                                            >
                                                Make Admin
                                            </button>
                                        )}
                                        {user.role !== 'vendor' && user.role !== 'admin' && (
                                            <button 
                                                onClick={() => handleRoleChange(user._id, 'vendor')}
                                                className="px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow active:scale-95"
                                            >
                                                Make Vendor
                                            </button>
                                        )}
                                        {user.role === 'vendor' && !user.isFraud && (
                                            <button 
                                                onClick={() => handleMarkFraud(user._id)}
                                                className="px-4 py-2 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm hover:shadow active:scale-95"
                                            >
                                                Mark Fraud
                                            </button>
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
