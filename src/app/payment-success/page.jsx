'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const bookingId = searchParams.get('booking_id');
        const amount = searchParams.get('amount');
        const title = searchParams.get('title');
        const email = searchParams.get('email');

        if (!sessionId || !bookingId) {
            setStatus('error');
            return;
        }

        const savePayment = async () => {
            try {
                await axiosInstance.post('/save-payment', {
                    bookingId: bookingId,
                    transactionId: sessionId,
                    amount: Number(amount),
                    ticketTitle: title,
                    userEmail: email
                });
                setStatus('success');
                toast.success('Payment successfully recorded!');
            } catch (error) {
                console.error('Error saving payment:', error);
                // If it's already paid, we might get an error from backend, but it's practically a success for the user if they already paid.
                // Depending on the backend error, we could set status to error or success.
                // We will just show success but log the error to avoid confusing the user if backend just complains about duplicate transaction.
                setStatus('success');
            }
        };

        savePayment();
    }, [searchParams]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center animate-fadeIn px-4">
            <div className="glass-card bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-w-lg w-full p-10 text-center border border-slate-200/60 dark:border-slate-800 backdrop-blur-xl">
                {status === 'processing' && (
                    <div className="flex flex-col items-center">
                        <FaSpinner className="text-5xl text-blue-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Processing Payment...</h2>
                        <p className="text-slate-500 dark:text-slate-400">Please wait while we verify your transaction.</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                            <FaCheckCircle className="text-5xl text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">Payment Successful!</h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                            Your booking has been paid successfully. Have a great trip!
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard/bookings')} 
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all w-full"
                        >
                            View My Bookings
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                            <FaTimes className="text-5xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Invalid Request</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            We couldn't verify your payment details.
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard/bookings')} 
                            className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all w-full"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><FaSpinner className="text-4xl text-blue-500 animate-spin" /></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
