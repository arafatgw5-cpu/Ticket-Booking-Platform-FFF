import HeroSlider from '@/components/home/HeroSlider';
import AdvertisedTickets from '@/components/home/AdvertisedTickets';
import PopularRoutes from '@/components/home/PopularRoutes';
import LatestTickets from '@/components/home/LatestTickets';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
    return (
        <div className="space-y-16">
            <HeroSlider />
            <AdvertisedTickets />
            <PopularRoutes />
            <LatestTickets />
            <WhyChooseUs />
            <Newsletter />
        </div>
    );
}