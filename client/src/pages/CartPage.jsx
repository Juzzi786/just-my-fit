import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { items, subtotal, shipping, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <ShoppingBag className="w-16 h-16 text-gray-600" />
      <h2 className="text-2xl font-bold">Your cart is empty</h2>
      <Link to="/shop" className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-400 transition-colors">Clear all</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 bg-gray-900 rounded-xl p-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  {item.size && <p className="text-sm text-gray-400 mt-1">Size: {item.size}</p>}
                  <p className="text-white font-bold mt-1">₹{item.price?.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-700 rounded-lg flex items-center justify-center hover:border-white transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-700 rounded-lg flex items-center justify-center hover:border-white transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.id, item.size)} className="ml-auto text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `₹${shipping}`}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{total?.toLocaleString()}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-500 mb-4">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</p>
            )}
            <button onClick={() => navigate('/checkout')}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors mb-3">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
