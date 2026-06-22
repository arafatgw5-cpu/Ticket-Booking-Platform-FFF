'use client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending && session?.user) {
            router.push('/dashboard/profile');
        } else if (!isPending && !session?.user) {
            router.push('/login');
        }
    }, [session, isPending, router]);

    return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
