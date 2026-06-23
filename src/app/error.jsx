'use client';
import { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <FaExclamationTriangle className="text-6xl text-red-500 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-center">Something went wrong!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                We apologize for the inconvenience. An unexpected error has occurred on our end.
            </p>
            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
            >
                Try again
            </button>
        </div>
    );
}
