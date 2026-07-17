import React from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on all orders above ₹999 across India.' },
  { icon: Shield, title: '100% Authentic', desc: 'Every product is genuine and quality-checked before dispatch.' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free return policy, no questions asked.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Reach us on WhatsApp anytime for instant assistance.' },
];

const WhyChooseUs = () => (
  <section className="py-20 bg-black text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">Why Choose Just My Fit?</h2>
        <p className="text-gray-400">We go the extra mile to give you the best experience</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center group">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-white transition-colors duration-300">
              <Icon className="w-7 h-7 group-hover:text-black transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
