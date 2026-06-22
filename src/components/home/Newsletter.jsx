'use client';
import { FaPaperPlane } from 'react-icons/fa';

export default function Newsletter() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="relative rounded-[2rem] p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(37,99,235,0.1)] dark:shadow-[0_20px_60px_rgba(37,99,235,0.2)] overflow-hidden group border border-slate-200 dark:border-transparent transition-colors duration-500">
                
                {/* Advanced Gradient Background */}
                <div className="absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-blue-800 dark:to-slate-900 z-0 transition-colors duration-500"></div>
                
                {/* Animated Glowing Orbs */}
                <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-100 dark:bg-blue-500/30 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
                <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-indigo-100 dark:bg-indigo-500/30 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000 ease-in-out"></div>
                
                {/* Noise Texture Overlay for Premium Feel */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] dark:opacity-10 mix-blend-overlay"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 shadow-sm dark:shadow-lg border border-blue-100 dark:border-white/20 transform -rotate-6 group-hover:rotate-0 transition-all duration-500">
                        <FaPaperPlane className="text-4xl text-blue-600 dark:text-white opacity-90 drop-shadow-sm dark:drop-shadow-lg" />
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-slate-900 dark:text-white tracking-tight transition-colors duration-500">
                        Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-cyan-300">Deal!</span>
                    </h2>
                    <p className="text-slate-600 dark:text-blue-100/80 mb-10 text-lg font-medium transition-colors duration-500">
                        Get the latest updates, exclusive discounts, and travel tips delivered straight to your inbox.
                    </p>
                    
                    <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative flex-1">
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                required
                                className="w-full px-6 py-4 rounded-full bg-slate-50 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-blue-200/60 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-white/20 transition-all duration-300 shadow-inner"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:text-blue-900 text-white font-bold rounded-full transition-all duration-300 shadow-md dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
