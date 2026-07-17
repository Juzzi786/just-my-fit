import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingCart, ArrowLeft, Package, Shield, RotateCcw } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    axios.get(`/api/products`)
      .then(res => {
        const found = (res.data?.data || []).find(p => p.slug === slug);
        setProduct(found || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Product not found.</div>;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-900 rounded-xl overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-white' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.category && <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">{product.category}</p>}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-white mb-6">₹{product.price?.toLocaleString()}</p>

            {product.description && <p className="text-gray-300 mb-8 leading-relaxed">{product.description}</p>}

            {/* Size Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3 text-gray-300">SIZE</p>
              <div className="flex gap-3 flex-wrap">
                {SIZES.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium text-sm transition-all
                      ${selectedSize === size ? 'border-white bg-white text-black' : 'border-gray-700 text-white hover:border-gray-400'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-sm font-medium mb-3 text-gray-300">QUANTITY</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center hover:border-white transition-colors">-</button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center hover:border-white transition-colors">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <button onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={() => toggleWishlist(product)}
                className="p-4 border border-gray-700 rounded-xl hover:border-white transition-colors">
                <Heart className="w-5 h-5" fill={isInWishlist(product.id) ? '#ef4444' : 'none'} stroke={isInWishlist(product.id) ? '#ef4444' : 'white'} />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-gray-800 pt-6">
              {[
                { icon: Package, text: 'Free shipping on orders above ₹999' },
                { icon: Shield, text: '100% authentic products' },
                { icon: RotateCcw, text: '7-day easy returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-gray-400">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
