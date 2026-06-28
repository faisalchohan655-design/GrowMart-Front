import React, { useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Profile = () => {
  const { user, orders, fetchOrders } = useStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const userOrders = orders.filter(o => o.userId === user?.id);

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">👤 My Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* User Info */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="font-bold text-lg mb-4">Account Details</h2>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-400">Name</div>
              <div className="font-medium">{user?.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Email</div>
              <div className="font-medium">{user?.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Role</div>
              <div className="font-medium capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Orders</span>
              <span className="font-bold">{userOrders.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Spent</span>
              <span className="font-bold gradient-text">
                ${userOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded-2xl border border-white/5">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/" className="block w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-center">
              Browse Products
            </Link>
            <Link to="/cart" className="block w-full px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-center">
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-6 glass p-6 rounded-2xl border border-white/5">
        <h2 className="font-bold text-lg mb-4">📦 Order History</h2>
        {userOrders.length === 0 ? (
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
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map(order => (
                  <tr key={order._id} className="border-t border-white/5">
                    <td className="px-4 py-2 font-mono text-xs">{order.orderId}</td>
                    <td className="px-4 py-2 font-bold">${order.total}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
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
    </div>
  );
};

export default Profile;
