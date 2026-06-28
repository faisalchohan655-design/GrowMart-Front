import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

const AdminDashboard = () => {
  // ============ DATA ============
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({ revenue: 0, orders: 0, products: 0 });
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  // ============ SIMPLE TOAST ============
  const showToast = (msg, type) => {
    alert(msg); // Simple alert for demo
  };

  // ============ API CALLS ============
  const API_BASE = 'https://growmart-back-production.up.railway.app/api';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch (error) {
      console.error('Products error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      if (data.success) setOrders(data.data || []);
    } catch (error) {
      console.error('Orders error:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      const data = await res.json();
      if (data.success) setAnalytics(data.data || {});
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // ============ LOAD DATA ============
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAnalytics();
    
    // Visitors count
    const interval = setInterval(() => {
      setVisitors(Math.floor(Math.random() * 10) + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // ============ DASHBOARD ============
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter(p => p.stock < 10);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  // ============ ADD PRODUCT ============
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    images: [''],
    stock: ''
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          stock: parseInt(newProduct.stock) || 0,
          images: newProduct.images.filter(img => img.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Product added!');
        setNewProduct({ name: '', price: '', category: 'Electronics', images: [''], stock: '' });
        fetchProducts();
      }
    } catch (error) {
      alert('❌ Failed to add product');
    }
    setLoading(false);
  };

  // ============ DELETE PRODUCT ============
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      alert('✅ Product deleted!');
      fetchProducts();
    } catch (error) {
      alert('❌ Failed to delete');
    }
  };

  // ============ UPDATE ORDER ============
  const updateOrderStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      alert('✅ Order updated!');
      fetchOrders();
    } catch (error) {
      alert('❌ Failed to update');
    }
  };

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">📊 Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {visitors} online
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 p-4 rounded-2xl border border-purple-500/20">
          <div className="text-sm text-gray-400">Revenue</div>
          <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-blue-500/20">
          <div className="text-sm text-gray-400">Orders</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-red-500/20">
          <div className="text-sm text-gray-400">Low Stock</div>
          <div className="text-2xl font-bold text-red-400">{lowStock.length}</div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-green-500/20">
          <div className="text-sm text-gray-400">Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-2">
        {['dashboard', 'orders', 'products', 'add-product'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm transition capitalize ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'add-product' ? '➕ Add' : tab}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-2xl">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Revenue</span><span className="font-bold">${totalRevenue.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Orders</span><span className="font-bold">{orders.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Products</span><span className="font-bold">{products.length}</span></div>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl">
            <h3 className="font-bold mb-4">System</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-400">Server</span><span className="text-green-400">✅ Online</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Socket.IO</span><span className="text-green-400">✅ Active</span></div>
            </div>
          </div>
          {lowStock.length > 0 && (
            <div className="md:col-span-2 bg-white/5 p-4 rounded-2xl border border-red-500/20">
              <h3 className="font-bold text-red-400 mb-2">⚠️ Low Stock</h3>
              <div className="flex flex-wrap gap-2">
                {lowStock.map(p => (
                  <span key={p._id} className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">{p.name}: {p.stock}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white/5 p-4 rounded-2xl">
          <h2 className="font-bold mb-4">📦 Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No orders</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr><th className="px-4 py-2 text-left">Order</th><th className="px-4 py-2 text-left">Customer</th><th className="px-4 py-2 text-left">Total</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Action</th></tr></thead>
                <tbody>
                  {orders.slice(0, 20).map(o => (
                    <tr key={o._id} className="border-t border-white/10">
                      <td className="px-4 py-2 font-mono text-xs">{o.orderId}</td>
                      <td className="px-4 py-2">{o.customer?.name || 'N/A'}</td>
                      <td className="px-4 py-2 font-bold">${o.total}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[o.status] || 'bg-gray-500/20'}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-2">
                        <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)} className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs outline-none">
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div className="bg-white/5 p-4 rounded-2xl">
          <h2 className="font-bold mb-4">🛍️ Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No products</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr><th className="px-4 py-2 text-left">Product</th><th className="px-4 py-2 text-left">Price</th><th className="px-4 py-2 text-left">Stock</th><th className="px-4 py-2 text-left">Action</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-t border-white/10">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded object-cover" />}
                          {p.name}
                        </div>
                      </td>
                      <td className="px-4 py-2">${p.price}</td>
                      <td className="px-4 py-2">{p.stock}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:text-red-300">
                          <Lucide.Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Product */}
      {activeTab === 'add-product' && (
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">➕ Add Product</h2>
          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name *" required value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" />
            <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none">
              <option>Electronics</option><option>Fashion</option><option>Home</option><option>Beauty</option>
            </select>
            <input type="number" placeholder="Price *" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" />
            <input type="number" placeholder="Stock *" required value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" />
            <input type="text" placeholder="Image URL" value={newProduct.images[0]} onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" />
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Adding...' : '➕ Add Product'}
              </button>
            </div>
          </form>
        </div>
       )}
    </div>
  );
};

export default AdminDashboard;
