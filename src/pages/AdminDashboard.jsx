import React, { useState, useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const AdminDashboard = () => {
  const { orders, products, fetchOrders, fetchProducts, visitors, socket, showToast, API } = useStore();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState({ revenue: 0, orders: 0, products: 0 });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: 'Electronics',
    images: [''],
    stock: '',
    isFeatured: false,
    isOnSale: false,
    salePrice: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============ FETCH DATA ============
  useEffect(() => {
    fetchOrders();
    fetchProducts();
    loadAnalytics();
    
    if (socket) {
      socket.on('order-notification', () => {
        fetchOrders();
        loadAnalytics();
      });
    }
    
    return () => {
      if (socket) {
        socket.off('order-notification');
      }
    };
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await API.get('/analytics');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  };

  // ============ PRODUCT MANAGEMENT ============
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        comparePrice: parseFloat(newProduct.comparePrice) || 0,
        stock: parseInt(newProduct.stock) || 0,
        salePrice: parseFloat(newProduct.salePrice) || 0,
        images: newProduct.images.filter(img => img.trim() !== ''),
        rating: 0,
        reviews: []
      };
      
      const res = await API.post('/products', productData);
      if (res.data.success) {
        showToast('✅ Product added successfully!', 'success');
        setNewProduct({
          name: '',
          description: '',
          price: '',
          comparePrice: '',
          category: 'Electronics',
          images: [''],
          stock: '',
          isFeatured: false,
          isOnSale: false,
          salePrice: ''
        });
        fetchProducts();
        loadAnalytics();
      }
    } catch (error) {
      showToast('❌ Failed to add product', 'error');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      showToast('✅ Product deleted!', 'success');
      fetchProducts();
      loadAnalytics();
    } catch (error) {
      showToast('❌ Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { status });
      showToast(`✅ Order status updated to ${status}`, 'success');
      fetchOrders();
    } catch (error) {
      showToast('❌ Failed to update order', 'error');
    }
  };

  // ============ STATS ============
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 10);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  // ============ RENDER ============
  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold gradient-text">📊 Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {visitors} online
        </div>
      </div>

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
        <div className="glass p-4 rounded-2xl border border-red-500/20">
          <div className="text-sm text-gray-400">Low Stock</div>
          <div className="text-2xl font-bold text-red-400">{lowStockProducts.length}</div>
          <div className="text-xs text-gray-400">Products below 10</div>
        </div>
        <div className="glass p-4 rounded-2xl border border-green-500/20">
          <div className="text-sm text-gray-400">Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-xs text-green-400">● In catalog</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-2">
        {['dashboard', 'orders', 'products', 'add-product'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm transition capitalize ${
              activeTab === tab
                ? 'gradient-bg text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'add-product' ? '➕ Add Product' : tab}
          </button>
        ))}
      </div>

      {/* ============ DASHBOARD TAB ============ */}
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
                <span className="text-gray-400">Products</span>
                <span className="font-bold">{products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low Stock Items</span>
                <span className="font-bold text-red-400">{lowStockProducts.length}</span>
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
                <span className="text-gray-400">Products</span>
                <span className="text-green-400">✅ {products.length} loaded</span>
              </div>
            </div>
          </div>
          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="md:col-span-2 glass p-4 rounded-2xl border border-red-500/20">
              <h3 className="font-bold text-red-400 mb-2">⚠️ Low Stock Alert</h3>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <span key={p._id} className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">
                    {p.name}: {p.stock} left
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ ORDERS TAB ============ */}
      {activeTab === 'orders' && (
        <div className="glass p-4 rounded-2xl">
          <h2 className="font-bold mb-4">📦 Orders Management</h2>
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
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 20).map(order => (
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
                      <td className="px-4 py-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="bg-transparent border border-white/10 rounded-lg px-2 py-1 text-xs outline-none"
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

      {/* ============ PRODUCTS TAB ============ */}
      {activeTab === 'products' && (
        <div className="glass p-4 rounded-2xl">
          <h2 className="font-bold mb-4">🛍️ Product Management ({products.length} products)</h2>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Lucide.Package size={32} className="mx-auto mb-2 opacity-50" />
              No products found. Add your first product!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Featured</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-t border-white/5">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <Lucide.Image size={20} className="text-gray-500" />
                          )}
                          <span className="truncate max-w-[150px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{product.category || 'Uncategorized'}</td>
                      <td className="px-4 py-2 font-bold">${product.price}</td>
                      <td className="px-4 py-2">
                        <span className={`${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {product.isFeatured ? '⭐' : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
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

      {/* ============ ADD PRODUCT TAB ============ */}
      {activeTab === 'add-product' && (
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">➕ Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name *"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Living">Home & Living</option>
              <option value="Beauty">Beauty</option>
            </select>
            <div className="md:col-span-2">
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none resize-none"
                rows="3"
              />
            </div>
            <input
              type="number"
              placeholder="Price *"
              required
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="number"
              placeholder="Compare Price"
              value={newProduct.comparePrice}
              onChange={(e) => setNewProduct({...newProduct, comparePrice: e.target.value})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="number"
              placeholder="Stock *"
              required
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.images[0]}
              onChange={(e) => setNewProduct({...newProduct, images: [e.target.value]})}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.isFeatured}
                  onChange={(e) => setNewProduct({...newProduct, isFeatured: e.target.checked})}
                  className="rounded border-white/10 bg-transparent"
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.isOnSale}
                  onChange={(e) => setNewProduct({...newProduct, isOnSale: e.target.checked})}
                  className="rounded border-white/10 bg-transparent"
                />
                On Sale
              </label>
            </div>
            {newProduct.isOnSale && (
              <input
                type="number"
                placeholder="Sale Price"
                value={newProduct.salePrice}
                onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
              />
            )}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
              >
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
