import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Arjun Shah', city: 'Surat', rating: 5, text: 'Amazing quality! The shirt I ordered fits perfectly and the fabric is premium. Will definitely order again.' },
  { name: 'Rohan Patel', city: 'Ahmedabad', rating: 5, text: 'Fast delivery and great packaging. The clothes are exactly as shown in the pictures. Highly recommended!' },
  { name: 'Karan Mehta', city: 'Rajkot', rating: 5, text: 'Best men\'s clothing store online. The WhatsApp support is super quick and helpful. Love the collection!' },
];

const Testimonials = () => (
  <section className="py-20 bg-gray-950 text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">What Our Customers Say</h2>
        <p className="text-gray-400">Real reviews from real customers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map(({ name, city, rating, text }) => (
          <div key={name} className="bg-gray-900 rounded-xl p-6">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400" fill="#facc15" />
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-5">"{text}"</p>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-gray-500">{city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
