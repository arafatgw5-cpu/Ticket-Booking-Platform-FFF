'use client';
import { useSession } from '@/lib/auth-client';

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto py-8 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-10">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Profile</span>
            </h1>
            
            <div className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900/40 dark:to-indigo-900/40"></div>
                
                <div className="p-8 md:p-12 relative z-10 pt-20">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10">
                        <div className="relative">
                            <img src={user.image || 'https://i.pravatar.cc/150'} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 shadow-xl object-cover bg-white" />
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                        </div>
                        
                        <div className="text-center md:text-left flex-1 pb-2">
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{user.email}</p>
                        </div>
                        
                        <div className="pb-2">
                            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm border ${
                                user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/50' :
                                user.role === 'vendor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${
                                    user.role === 'admin' ? 'bg-purple-500' :
                                    user.role === 'vendor' ? 'bg-blue-500' :
                                    'bg-slate-500'
                                }`}></span>
                                {user.role || 'user'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/50">
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Account ID</span>
                            <p className="font-medium text-slate-800 dark:text-slate-200 font-mono text-sm">{user._id || 'ID_UNAVAILABLE'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Member Since</span>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}