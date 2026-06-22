// app/layout.js
import './globals.css';
import Providers from '@/providers/Providers';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

// SEO Metadata
export const metadata = {
    title: 'TicketBari - Online Ticket Booking Platform',
    description: 'Book bus, train, launch & flight tickets easily in Bangladesh. Secure payments with Stripe.',
    keywords: ['ticket booking', 'bus ticket', 'train ticket', 'flight ticket', 'Bangladesh'],
    authors: [{ name: 'TicketBari Team' }],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                <Providers>
                    {/* Navbar - Fixed at top */}
                    <Navbar />
                    
                    {/* Main Content Area */}
                    <main className="min-h-screen pt-20 pb-10">
                        {children}
                    </main>
                    
                    {/* Footer - At bottom */}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}