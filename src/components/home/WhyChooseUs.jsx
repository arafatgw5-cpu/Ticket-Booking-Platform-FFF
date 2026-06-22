import { FaShieldAlt, FaHeadset, FaBolt } from 'react-icons/fa';

const features = [
    { icon: FaShieldAlt, title: 'Secure Booking', desc: 'Your payments are 100% secure with Stripe.' },
    { icon: FaHeadset, title: '24/7 Support', desc: 'Our team is always here to help you.' },
    { icon: FaBolt, title: 'Instant Confirmation', desc: 'Get your tickets confirmed in seconds.' },
];

export default function WhyChooseUs() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-blue-50 dark:bg-gray-800 rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose TicketBari?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                        <feature.icon className="text-4xl text-blue-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}