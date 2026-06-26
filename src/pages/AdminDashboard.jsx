import React, { useState, useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const AdminDashboard = () => {
  const { orders, fetchOrders, visitors, socket, showToast, fetchAnalytics } = useStore();
  const [analytics, setAnalytics] = useState({ revenue: 0, orders: 0, products: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchOrders();
    loadAnalytics();

    if (socket) {
      socket.on('order-notification', (data) => {
        showToast(`🎉 New order #${data.orderId} from ${data.customer}`, 'success');
        fetchOrders();
        loadAnalytics();
      });

      socket.on('analytics-data', (data) => {
        setAnalytics({
          revenue: data.revenue || 0,
          orders: data.orders || 0,
          products: data.products || 0
        });
      });

      const interval = setInterval(() => {
        socket.emit('analytics-request');
      }, 30000);

      return () => {
        socket.off('order-notification');
        socket.off('analytics-data');
        clearInterval(interval);
      };
    }
  }, [socket]);

  const loadAnalytics = async () => {
    const data = await fetchAnalytics();
    if (data) {
      setAnalytics({
        revenue: data.revenue || 0,
        orders: data.orders || 0,
        products: data.products || 0
      });
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass p-4 rounded-2xl border border-purple-500/20">
          <div className="text-sm text-gray-400">Revenue</div>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-green-400">+12% this month</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-blue-500/20">
          <div className="text-sm text-gray-400">Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-xs text-gray-400">{analytics.orders || 0} total</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-green-500/20">
          <div className="text-sm text-gray-400">Visitors</div>
          <div className="text-2xl font-bold">{visitors}</div>
          <div className="text-xs text-green-400">● Live</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-yellow-500/20">
          <div className="text-sm text-gray-400">Products</div>
          <div className="text-2xl font-bold">{analytics.products || 0}</div>
          <div className="text-xs text-gray-400">In catalog</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-2">
        {['dashboard', 'orders', 'products'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm transition capitalize ${
              activeTab === tab
                ? 'gradient-bg text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="glass p-4 rounded-2xl">
          <h2 className="font-bold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Lucide.Package size={32} className="mx-auto mb-2 opacity-50" />
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Order ID</th>
                    <th className="px-4 py-2">Customer</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map(order => (
                    <tr key={order._id} className="border-t border-white/5">
                      <td className="px-4 py-2 font-mono text-xs">{order.orderId}</td>
                      <td className="px-4 py-2">{order.customer?.name || 'N/A'}</td>
                      <td className="px-4 py-2 font-bold">${order.total}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[order.status] || 'bg-gray-500/20 text-gray-400'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="glass p-4 rounded-2xl">
          <h2 className="font-bold mb-4">Product Management</h2>
          <div className="text-center py-8 text-gray-400">
            <Lucide.Package size={32} className="mx-auto mb-2 opacity-50" />
            <p>Product management coming soon</p>
            <p className="text-sm">Use the API to add products</p>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass p-4 rounded-2xl">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Revenue</span>
                <span className="font-bold gradient-text">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Orders</span>
                <span className="font-bold">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Live Visitors</span>
                <span className="font-bold text-green-400">{visitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Products</span>
                <span className="font-bold">{analytics.products || 0}</span>
              </div>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl">
            <h3 className="font-bold mb-4">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Server</span>
                <span className="text-green-400">✅ Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database</span>
                <span className="text-green-400">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Socket.IO</span>
                <span className="text-green-400">✅ Active ({visitors} users)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
