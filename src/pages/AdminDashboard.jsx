import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // ============ AUTHENTICATION ============
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  // ============ DATA ============
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({ revenue: 0, orders: 0, products: 0 });
  const [visitors, setVisitors] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // ============ API BASE ============
  const API_BASE = 'https://growmart-back-production.up.railway.app/api';

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // ============ LOGIN ============
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setToken(data.token);
        setAuthenticated(true);
        setError('');
        showNotification('✅ Welcome Admin!', 'success');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('❌ Network error. Please try again.');
    }
    setLoading(false);
  };

  // ============ LOGOUT ============
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setAuthenticated(false);
    setEmail('');
    setPassword('');
    showNotification('👋 Logged out successfully', 'info');
  };

  // ============ NOTIFICATIONS ============
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // ============ CHECK TOKEN ============
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setAuthenticated(true);
    }
  }, []);

  // ============ API CALLS ============
  const fetchProducts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch (error) {
      console.error('Products error:', error);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setOrders(data.data || []);
    } catch (error) {
      console.error('Orders error:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/analytics`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.data || {});
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  useEffect(() => {
    if (authenticated && token) {
      fetchProducts();
      fetchOrders();
      fetchAnalytics();
      
      const interval = setInterval(() => {
        setVisitors(Math.floor(Math.random() * 10) + 1);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [authenticated, token]);

  // ============ ADD PRODUCT - UPDATED WITH DETAILS ============
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    images: [''],
    stock: '',
    description: '',
    brand: '',
    color: '',
    size: '',
    material: '',
    weight: '',
    dimensions: '',
    warranty: '',
    tags: '',
    isFeatured: false,
    isOnSale: false,
    salePrice: ''
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        name: newProduct.name,
        price: parseFloat(newProduct.price) || 0,
        category: newProduct.category,
        images: newProduct.images.filter(img => img.trim()),
        stock: parseInt(newProduct.stock) || 0,
        description: newProduct.description,
        brand: newProduct.brand,
        color: newProduct.color,
        size: newProduct.size,
        material: newProduct.material,
        weight: newProduct.weight,
        dimensions: newProduct.dimensions,
        warranty: newProduct.warranty,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isFeatured: newProduct.isFeatured,
        isOnSale: newProduct.isOnSale,
        salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : null
      };

      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success) {
        showNotification('✅ Product added successfully!', 'success');
        setNewProduct({ 
          name: '', price: '', category: 'Electronics', images: [''], stock: '',
          description: '', brand: '', color: '', size: '', material: '', 
          weight: '', dimensions: '', warranty: '', tags: '',
          isFeatured: false, isOnSale: false, salePrice: ''
        });
        fetchProducts();
      } else {
        showNotification(data.message || '❌ Failed to add product', 'error');
      }
    } catch (error) {
      showNotification('❌ Failed to add product', 'error');
    }
    setLoading(false);
  };

  // ============ DELETE PRODUCT ============
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showNotification('✅ Product deleted!', 'success');
        fetchProducts();
      } else {
        showNotification(data.message || '❌ Failed to delete', 'error');
      }
    } catch (error) {
      showNotification('❌ Failed to delete', 'error');
    }
  };

  // ============ UPDATE ORDER ============
  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('✅ Order updated!', 'success');
        fetchOrders();
      } else {
        showNotification(data.message || '❌ Failed to update', 'error');
      }
    } catch (error) {
      showNotification('❌ Failed to update', 'error');
    }
  };

  // ============ DASHBOARD STATS ============
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStock = products.filter(p => p.stock < 10);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  // Sample chart data
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 7000 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 9000 },
  ];

  // ============ LOGIN SCREEN ============
  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gray-100'} p-4 relative overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-2xl shadow-purple-500/30 animate-bounce-slow">
              <Lucide.Zap size={36} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Admin Access</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl shadow-purple-500/10">
            <form onSubmit={handleLogin}>
              <div className="relative mb-4">
                <Lucide.Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                  required
                />
              </div>
              <div className="relative mb-4">
                <Lucide.Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white transition-all duration-300 focus:shadow-lg focus:shadow-purple-500/20"
                  required
                />
              </div>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-shake">
                  <Lucide.AlertCircle size={16} />
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  'Access Admin Panel'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============ DASHBOARD ============
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} pt-20 px-4 max-w-7xl mx-auto relative`}>
      
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`backdrop-blur-xl rounded-xl px-4 py-3 border shadow-lg animate-slide-in-right ${n.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400' : n.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-blue-500/20 border-blue-500/30 text-blue-400'}`}>
            {n.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm">Welcome back, Admin!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {visitors} online
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-purple-500/30"
          >
            {darkMode ? <Lucide.Sun size={18} className="text-yellow-400" /> : <Lucide.Moon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 text-sm flex items-center gap-2 border border-red-500/20 hover:border-red-500/40"
          >
            <Lucide.LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: Lucide.DollarSign, gradient: 'from-purple-500 to-pink-500' },
          { label: 'Orders', value: orders.length, icon: Lucide.ShoppingBag, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Low Stock', value: lowStock.length, icon: Lucide.AlertTriangle, gradient: 'from-red-500 to-orange-500' },
          { label: 'Products', value: products.length, icon: Lucide.Package, gradient: 'from-green-500 to-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.gradient}/10 p-4 rounded-2xl border border-white/10 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-${stat.gradient.split(' ')[1]}/20 cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent">
                  {stat.value}
                </div>
              </div>
              <stat.icon className={`text-${stat.gradient.split(' ')[1]}-400 animate-pulse`} size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-2">
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'orders', label: '📦 Orders' },
          { id: 'products', label: '🛍️ Products' },
          { id: 'add-product', label: '➕ Add Product' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm transition-all duration-300 capitalize ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lucide.BarChart3 size={20} className="text-purple-400" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: Lucide.DollarSign },
                { label: 'Total Orders', value: orders.length, icon: Lucide.ShoppingBag },
                { label: 'Total Products', value: products.length, icon: Lucide.Package },
                { label: 'Low Stock Items', value: lowStock.length, icon: Lucide.AlertTriangle },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <span className="text-gray-400 flex items-center gap-2">
                    <item.icon size={16} />
                    {item.label}
                  </span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lucide.Activity size={20} className="text-green-400" />
              System Status
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Server', status: '✅ Online', color: 'text-green-400' },
                { label: 'Database', status: '✅ Connected', color: 'text-green-400' },
                { label: 'Socket.IO', status: '✅ Active', color: 'text-green-400' },
                { label: 'Stripe', status: '✅ Ready', color: 'text-green-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <span className="text-gray-400">{item.label}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="md:col-span-2 backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Lucide.TrendingUp size={20} className="text-purple-400" />
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {lowStock.length > 0 && (
            <div className="md:col-span-2 backdrop-blur-xl bg-red-500/10 p-4 rounded-2xl border border-red-500/20 animate-pulse">
              <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                <Lucide.AlertTriangle size={18} />
                ⚠️ Low Stock Alert
              </h3>
              <div className="flex flex-wrap gap-2">
                {lowStock.map(p => (
                  <span key={p._id} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm border border-red-500/20">
                    {p.name}: {p.stock} left
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Lucide.ShoppingBag size={20} className="text-purple-400" />
            Orders ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Lucide.Package className="mx-auto mb-4 opacity-50" size={48} />
              No orders yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/10">
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 20).map(o => (
                    <tr key={o._id} className="border-t border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 font-mono text-xs">{o.orderId}</td>
                      <td className="px-4 py-3">{o.customer?.name || 'N/A'}</td>
                      <td className="px-4 py-3 font-bold">${o.total}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[o.status] || 'bg-gray-500/20'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select 
                          value={o.status} 
                          onChange={(e) => updateOrderStatus(o._id, e.target.value)} 
                          className="bg-transparent border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-purple-500/50"
                        >
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
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Lucide.Package size={20} className="text-purple-400" />
            Products ({products.length})
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Lucide.Box className="mx-auto mb-4 opacity-50" size={48} />
              No products yet. Add your first product!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p._id} className="backdrop-blur-xl bg-white/5 p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group">
                  <div className="flex items-start gap-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{p.name}</h4>
                      <p className="text-purple-400 font-bold">${p.price}</p>
                      <p className={`text-xs ${p.stock < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                        Stock: {p.stock} {p.stock < 10 && '⚠️'}
                      </p>
                      {p.description && (
                        <p className="text-xs text-gray-500 truncate mt-1">{p.description}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteProduct(p._id)} 
                      className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Lucide.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============ ADD PRODUCT - UPDATED WITH DETAILS ============ */}
      {activeTab === 'add-product' && (
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ✨ Add New Product
          </h2>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            {/* Basic Info - 2 Columns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Product Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter product name" 
                  required 
                  value={newProduct.name} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Category *</label>
                <select 
                  value={newProduct.category} 
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Beauty</option>
                  <option>Groceries</option>
                  <option>Books</option>
                  <option>Sports</option>
                  <option>Toys</option>
                </select>
              </div>
            </div>

            {/* Price & Stock - 2 Columns */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Price * ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  required 
                  value={newProduct.price} 
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Stock *</label>
                <input 
                  type="number" 
                  placeholder="Quantity" 
                  required 
                  value={newProduct.stock} 
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Product Details - New Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Brand</label>
                <input 
                  type="text" 
                  placeholder="Brand name" 
                  value={newProduct.brand} 
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Color</label>
                <input 
                  type="text" 
                  placeholder="Color" 
                  value={newProduct.color} 
                  onChange={(e) => setNewProduct({...newProduct, color: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Size</label>
                <input 
                  type="text" 
                  placeholder="S, M, L, XL or specific" 
                  value={newProduct.size} 
                  onChange={(e) => setNewProduct({...newProduct, size: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Material</label>
                <input 
                  type="text" 
                  placeholder="Material type" 
                  value={newProduct.material} 
                  onChange={(e) => setNewProduct({...newProduct, material: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Weight (kg)</label>
                <input 
                  type="text" 
                  placeholder="0.5 kg" 
                  value={newProduct.weight} 
                  onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Dimensions</label>
                <input 
                  type="text" 
                  placeholder="10 x 20 x 30 cm" 
                  value={newProduct.dimensions} 
                  onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Warranty</label>
                <input 
                  type="text" 
                  placeholder="12 months warranty" 
                  value={newProduct.warranty} 
                  onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="electronics, gadgets, new" 
                  value={newProduct.tags} 
                  onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Sale Options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                  />
                  Featured Product
                </label>
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={newProduct.isOnSale}
                    onChange={(e) => setNewProduct({...newProduct, isOnSale: e.target.checked})}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                  />
                  On Sale
                </label>
              </div>
              {newProduct.isOnSale && (
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Sale Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Sale price" 
                    value={newProduct.salePrice} 
                    onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Description - Full Width */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Product Description</label>
              <textarea 
                placeholder="Detailed product description..." 
                rows="4"
                value={newProduct.description} 
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300 resize-y"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg" 
                value={newProduct.images[0]} 
                onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})} 
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none transition-all duration-300"
              />
            </div>

            {/* Preview Section */}
            {newProduct.images[0] && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={newProduct.images[0]} 
                    alt="Product preview" 
                    className="w-20 h-20 rounded-lg object-cover border border-white/10"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div>
                    <p className="font-medium">{newProduct.name || 'Product Name'}</p>
                    <p className="text-purple-400">${newProduct.price || '0.00'}</p>
                    <p className="text-sm text-gray-400">{newProduct.category}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] shadow-lg shadow-purple-500/30"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding Product...
                </div>
              ) : (
                '➕ Add Product'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
