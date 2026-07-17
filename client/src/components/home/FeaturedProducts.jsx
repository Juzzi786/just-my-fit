import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts((res.data?.data || []).slice(0, 8)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">Loading products...</div>
    </section>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Featured Products</h2>
          <p className="text-gray-400">Handpicked styles for the modern man</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden aspect-square">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-black/60 rounded-full hover:bg-black transition-colors"
                >
                  <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? '#ef4444' : 'none'} stroke={isInWishlist(product.id) ? '#ef4444' : 'white'} />
                </button>
              </div>
              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold hover:text-gray-300 transition-colors truncate">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-lg">₹{product.price?.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="border border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
