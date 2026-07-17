import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thanks! We\'ll be in touch soon.');
    setEmail('');
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-3">Stay in the Loop</h2>
        <p className="text-gray-400 mb-8">Get notified about new arrivals, exclusive deals, and style tips.</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          <button type="submit"
            className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>

        <a href="https://wa.me/919327601140?text=Hi%20Just%20My%20Fit!%20I%27d%20like%20to%20know%20about%20new%20arrivals."
          target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm">
          <MessageCircle className="w-4 h-4" />
          Or follow us on WhatsApp for instant updates
        </a>
      </div>
    </section>
  );
};

export default Newsletter;
