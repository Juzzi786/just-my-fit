import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/products').catch(() => ({ data: { data: [] } })),
      axios.get('/api/orders').catch(() => ({ data: { data: [] } })),
    ]).then(([prodRes, orderRes]) => {
      setProducts(prodRes.data?.data || []);
      setOrders(orderRes.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { icon: Package, label: 'Total Products', value: products.length, color: 'text-blue-400' },
    { icon: ShoppingBag, label: 'Total Orders', value: orders.length, color: 'text-green-400' },
    { icon: TrendingUp, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-yellow-400' },
    { icon: Clock, label: 'Pending Orders', value: pendingOrders, color: 'text-red-400' },
  ];

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-6">
            <Icon className={`w-8 h-8 mb-3 ${color}`} />
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-3 font-medium">Order #</th>
                  <th className="text-left py-3 font-medium">Customer</th>
                  <th className="text-left py-3 font-medium">Total</th>
                  <th className="text-left py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {orders.slice(0, 10).map(order => (
                  <tr key={order.id} className="border-b border-gray-800">
                    <td className="py-3 font-mono text-xs">{order.order_number}</td>
                    <td className="py-3">{order.customer_name}</td>
                    <td className="py-3">₹{order.total?.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                          order.status === 'delivered' ? 'bg-green-900 text-green-300' :
                          'bg-gray-800 text-gray-300'}`}>
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
    </div>
  );
};

export default Dashboard;
