import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import * as Lucide from 'lucide-react';

// ============ Components ============
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import VisitorsCounter from './components/VisitorsCounter';
import FlashSaleAlert from './components/FlashSaleAlert';
import OrderNotification from './components/OrderNotification';

// ============ Pages ============
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Promotions from './pages/Promotions';
import AdminDashboard from './pages/AdminDashboard';

// ============ API Setup ============
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// ============ Socket.IO ============
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// ============ Context ============
const StoreContext = createContext(null);
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};

const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Socket.IO Connection Events
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket.IO Connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Socket.IO Disconnected');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Socket.IO Listeners
  useEffect(() => {
    // Visitors count
    socket.on('visitors', (count) => {
      setVisitors(count);
    });

    // Chat replies
    socket.on('chat-reply', (data) => {
      showToast(`💬 ${data.message}`, 'info');
    });

    // New order notification
    socket.on('order-notification', (data) => {
      showToast(`🎉 New order #${data.orderId} from ${data.customer}`, 'success');
      setNotifications(prev => [data, ...prev].slice(0, 10));
    });

    // Flash sale alerts
    socket.on('flash-sale-alert', (data) => {
      showToast(`⚡ ${data.message}`, 'info');
    });

    // Order confirmation
    socket.on('order-confirmation', (data) => {
      showToast(`✅ Order #${data.orderId} confirmed! Delivery: ${data.estimatedDelivery}`, 'success');
    });

    // Typing indicator
    socket.on('typing-indicator', (data) => {
      // Handle typing indicator if needed
    });

    return () => {
      socket.off('visitors');
      socket.off('chat-reply');
      socket.off('order-notification');
      socket.off('flash-sale-alert');
      socket.off('order-confirmation');
      socket.off('typing-indicator');
    };
  }, []);

  // ============ Product Functions ============
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data.data || []);
    } catch (error) {
      showToast('Failed to load products', 'error');
      console.error('Fetch products error:', error);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      showToast('Failed to load orders', 'error');
      console.error('Fetch orders error:', error);
    }
  };

  // ============ Cart Functions ============
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    showToast(`🛒 ${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
    showToast('🗑️ Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    showToast('🗑️ Cart cleared', 'info');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // ============ Order Functions ============
  const placeOrder = async (orderData) => {
    try {
      // Emit through Socket.IO
      socket.emit('new-order', orderData);

      // Also save via API
      const res = await API.post('/orders', orderData);
      setOrders([res.data.data, ...orders]);
      clearCart();
      showToast(`✅ Order placed! #${res.data.data.orderId}`);
      return res.data.data;
    } catch (error) {
      showToast('❌ Failed to place order', 'error');
      console.error('Place order error:', error);
      throw error;
    }
  };

  // ============ Analytics ============
  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/analytics');
      return res.data.data;
    } catch (error) {
      console.error('Fetch analytics error:', error);
      return null;
    }
  };

  const value = {
    products,
    cart,
    orders,
    loading,
    visitors,
    toast,
    notifications,
    socket,
    isConnected,
    showToast,
    fetchProducts,
    fetchOrders,
    fetchAnalytics,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    placeOrder,
    API
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

// ============ Toast Component ============
const Toast = () => {
  const { toast } = useStore();
  if (!toast) return null;

  const icons = {
    success: 'CheckCircle',
    error: 'AlertCircle',
    info: 'Info'
  };

  const Icon = Lucide[icons[toast.type] || 'CheckCircle'];
  const colors = {
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
    info: 'bg-blue-500/90'
  };

  return (
    <div className={`fixed top-20 right-6 z-[999] px-6 py-3 rounded-xl text-white shadow-xl animate-slide-in flex items-center gap-2 ${colors[toast.type] || 'bg-gray-700/90'}`}>
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
};

// ============ Main App ============
function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />

          {/* Socket.IO Components */}
          <LiveChat />
          <VisitorsCounter />
          <FlashSaleAlert />
          <OrderNotification />
          <Toast />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}

// ============ 404 Page ============
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 text-center">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-3xl font-bold text-gray-400">Page Not Found</h1>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition"
      >
        Go Home
      </button>
    </div>
  );
};

export default App;
