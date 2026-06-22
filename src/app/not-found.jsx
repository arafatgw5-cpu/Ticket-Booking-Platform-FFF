import Link from 'next/link';
import { FaRoute } from 'react-icons/fa';
// SEO Metadata for 404 Page
export const metadata = {
    title: '404 - Page Not Found | TicketBari'
};

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
            <FaRoute className="text-6xl text-blue-500 mb-6" />
            <h2 className="text-4xl font-bold mb-4 text-center">404 - Destination Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
                Oops! The page you are looking for seems to have taken a different route or doesn't exist.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition shadow-lg"
            >
                Return to Homepage
            </Link>
        </div>
    );
}
