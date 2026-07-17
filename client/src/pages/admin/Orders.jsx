import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders')
      .then(res => setOrders(res.data?.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    pending: 'bg-yellow-900 text-yellow-300',
    confirmed: 'bg-blue-900 text-blue-300',
    shipped: 'bg-purple-900 text-purple-300',
    delivered: 'bg-green-900 text-green-300',
    cancelled: 'bg-red-900 text-red-300',
  }[s] || 'bg-gray-800 text-gray-300');

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-12 text-center text-gray-500">
          <p>No orders yet. They will appear here when customers place orders.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-white">
            <thead className="border-b border-gray-800 text-gray-400">
              <tr>
                <th className="text-left py-4 px-6 font-medium">Order #</th>
                <th className="text-left py-4 px-6 font-medium">Customer</th>
                <th className="text-left py-4 px-6 font-medium">Total</th>
                <th className="text-left py-4 px-6 font-medium">Date</th>
                <th className="text-left py-4 px-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-gray-300">{order.order_number}</td>
                  <td className="py-4 px-6">
                    <p className="font-medium">{order.customer_name}</p>
                    {order.customer_phone && <p className="text-xs text-gray-500">{order.customer_phone}</p>}
                  </td>
                  <td className="py-4 px-6 font-medium">₹{order.total?.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
