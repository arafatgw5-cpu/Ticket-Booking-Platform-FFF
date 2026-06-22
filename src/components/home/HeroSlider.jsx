'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Link from 'next/link';

const slides = [
    { id: 1, title: 'Explore Bangladesh', subtitle: 'Book bus, train & launch tickets easily', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600' },
    { id: 2, title: 'Fly with Comfort', subtitle: 'Best deals on domestic flights', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600' },
];

export default function HeroSlider() {
    return (
        <section className="relative h-[500px] rounded-xl overflow-hidden mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl mt-8">
            <Swiper modules={[Autoplay, Pagination]} pagination={{ clickable: true }} autoplay={{ delay: 4000 }} className="h-full">
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full bg-cover bg-center group" style={{ backgroundImage: `url(${slide.image})` }}>
                            {/* Dramatic Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
                            
                            <div className="absolute inset-0 flex items-center">
                                <div className="text-left text-white space-y-6 px-10 md:px-20 max-w-3xl">
                                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                            {slide.title.split(' ')[0]}
                                        </span>
                                        {slide.title.split(' ').slice(1).join(' ')}
                                    </h1>
                                    <p className="text-xl md:text-3xl font-light text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-100">
                                        {slide.subtitle}
                                    </p>
                                    <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-200">
                                        <Link href="/tickets" className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all duration-300">
                                            Explore Tickets
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}