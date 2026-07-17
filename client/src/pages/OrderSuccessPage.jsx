import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, MessageCircle } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">Order Placed!</h1>
        <p className="text-gray-400 mb-2">Thank you for shopping with Just My Fit.</p>
        {orderId && <p className="text-sm text-gray-500 mb-8">Order ID: <span className="text-white font-mono">{orderId}</span></p>}

        <div className="bg-gray-900 rounded-xl p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">What's next?</p>
              <p className="text-sm text-gray-400 mt-1">You'll receive an email confirmation shortly. Your order will be delivered within 5–7 business days.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Need help?</p>
              <p className="text-sm text-gray-400 mt-1">Contact us on WhatsApp at +91 93276 01140</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link to="/shop" className="flex-1 bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Continue Shopping
          </Link>
          <Link to="/" className="flex-1 border border-gray-700 py-3 rounded-xl font-semibold hover:border-white transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
