import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, Star, Users } from 'lucide-react';

const AboutPage = () => (
  <div className="min-h-screen bg-black text-white">
    {/* Hero */}
    <div className="py-24 px-4 text-center bg-gradient-to-b from-gray-900 to-black">
      <h1 className="text-5xl font-bold mb-6">About Just My Fit</h1>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
        Premium men's fashion, delivered to your door. We curate the finest clothing so you always look your best.
      </p>
    </div>

    {/* Values */}
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Star, title: 'Premium Quality', desc: 'Every piece is carefully selected for quality and style.' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Get your orders delivered within 5–7 business days across India.' },
          { icon: Shield, title: 'Secure Shopping', desc: '100% secure payments and buyer protection on all orders.' },
          { icon: Users, title: 'Customer First', desc: 'Our support team is always here to help you.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center">
            <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Story */}
    <div className="py-16 px-4 bg-gray-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Just My Fit was born from a simple idea — every man deserves to dress well without breaking the bank.
          We source premium men's wear and bring it directly to you, cutting out the middleman so you get
          the best quality at the best prices.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Based in Rajkot, Gujarat, we ship across India and are passionate about helping you find
          clothes that truly fit your style and personality.
        </p>
      </div>
    </div>

    {/* CTA */}
    <div className="py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to upgrade your wardrobe?</h2>
      <p className="text-gray-400 mb-8">Browse our latest collection and find your perfect fit.</p>
      <Link to="/shop" className="bg-white text-black px-10 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors">
        Shop Now
      </Link>
    </div>
  </div>
);

export default AboutPage;
