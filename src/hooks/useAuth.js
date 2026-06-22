import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function useAuth() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchToken = async () => {
            if (session?.user) {
                try {
                    const res = await fetch('/api/get-token');
                    if (res.ok) {
                        const data = await res.json();
                        if (data.token) {
                            localStorage.setItem('token', data.token);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch JWT token:', error);
                }
            } else {
                localStorage.removeItem('token');
            }
        };

        if (!isPending) {
            fetchToken();
        }
    }, [session, isPending]);

    const handleLogout = async () => {
        await signOut();
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        router.push('/');
    };

    return {
        user: session?.user || null,
        isLoading: isPending,
        handleLogout
    };
}