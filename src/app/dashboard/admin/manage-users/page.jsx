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
        onError: () => toast.error('Failed to update role')
    });

    const fraudMutation = useMutation({
        mutationFn: async (id) => {
            await axiosInstance.patch(`/users/fraud/${id}`);
        },
        onSuccess: () => {
            toast.success('Vendor marked as fraud.');
            queryClient.invalidateQueries(['admin-users']);
        },
        onError: () => toast.error('Failed to mark fraud')
    });

    const handleRoleChange = (id, role) => {
        if (confirm(`Make this user a ${role}?`)) roleMutation.mutate({ id, role });
    };

    const handleMarkFraud = (id) => {
        if (confirm('Mark this vendor as fraud? This cannot be undone.')) fraudMutation.mutate(id);
    };

    if (isLoading) return (
        <div className="flex items-center justify-center py-24 text-sm text-slate-500 dark:text-slate-400">
            Loading users...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Manage <span className="text-indigo-600 dark:text-indigo-400">Users</span>
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Control roles, permissions, and security across the platform.
                    </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Total Users: {users?.length ?? 0}
                </span>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ minWidth: '560px' }}>
                        <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                {['User', 'Role', 'Status', 'Actions'].map((h, i) => (
                                    <th key={h} className={`px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${i === 3 ? 'text-right' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users?.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                    {/* User */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={user.image || 'https://i.pravatar.cc/150'}
                                                    alt={user.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                                                />
                                                {user.isFraud && (
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Role */}
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            user.role === 'admin'
                                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40'
                                                : user.role === 'vendor'
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    {/* Status */}
                                    <td className="px-5 py-4">
                                        {user.isFraud ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                Fraud
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2 flex-wrap">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleRoleChange(user._id, 'admin')}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all active:scale-95"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                            {user.role !== 'vendor' && user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleRoleChange(user._id, 'vendor')}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all active:scale-95"
                                                >
                                                    Make Vendor
                                                </button>
                                            )}
                                            {user.role === 'vendor' && !user.isFraud && (
                                                <button
                                                    onClick={() => handleMarkFraud(user._id)}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all active:scale-95"
                                                >
                                                    Mark Fraud
                                                </button>
                                            )}
                                        </div>
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