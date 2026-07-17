import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', slug: 'shirts' },
  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', slug: 't-shirts' },
  { name: 'Trousers', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80', slug: 'trousers' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', slug: 'accessories' },
];

const Categories = () => (
  <section className="py-20 bg-gray-950 text-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-3">Shop by Category</h2>
        <p className="text-gray-400">Find exactly what you're looking for</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES.map(cat => (
          <Link key={cat.name} to={`/shop?category=${cat.slug}`}
            className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-lg">{cat.name}</h3>
              <p className="text-gray-300 text-sm mt-0.5 group-hover:text-white transition-colors">Shop Now →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;
