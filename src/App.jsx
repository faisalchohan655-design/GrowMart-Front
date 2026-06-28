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
import ProtectedRoute from './components/ProtectedRoute';

// ============ Pages ============
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Promotions from './pages/Promotions';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// ============ API Setup ============
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ Socket.IO ============
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// ============ Context ============
const StoreContext = createContext(null);
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visitors, setVisitors] = useState(0);
  const [toast, setToast] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ============ AUTH ============
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}! 🎉`, 'success');
        return res.data;
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome, ${res.data.user.name}! 🎉`, 'success');
        return res.data;
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCart([]);
    showToast('Logged out successfully', 'info');
  };

  const loadUser = async () => {
    if (!token) return;
    try {
      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      logout();
    }
  };

  // ============ Socket.IO ============
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🔌 Socket.IO Connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 Socket.IO Disconnected');
    });

    socket.on('visitors', (count) => {
      setVisitors(count);
    });

    socket.on('order-notification', (data) => {
      showToast(`🎉 New order #${data.orderId} from ${data.customer}`, 'success');
      setNotifications(prev => [data, ...prev].slice(0, 10));
    });

    loadUser();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('visitors');
      socket.off('order-notification');
    };
  }, []);

  // ============ PRODUCTS ============
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data.data || []);
    } catch (error) {
      showToast('Failed to load products', 'error');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
  };

  // ============ CART ============
  const addToCart = (product, quantity = 1) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
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

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  // ============ ORDER ============
  const placeOrder = async (orderData) => {
    try {
      const res = await API.post('/orders', orderData);
      if (res.data.success) {
        const order = res.data.data;
        socket.emit('new-order', order);
        setOrders([order, ...orders]);
        clearCart();
        showToast(`✅ Order #${order.orderId} placed successfully!`, 'success');
        return order;
      }
    } catch (error) {
      showToast('❌ Failed to place order', 'error');
      throw error;
    }
  };

  // ============ STRIPE ============
  const createPaymentIntent = async (amount) => {
    try {
      const res = await API.post('/create-payment-intent', { amount });
      return res.data;
    } catch (error) {
      showToast('Payment initialization failed', 'error');
      throw error;
    }
  };

  const value = {
    user,
    token,
    products,
    cart,
    orders,
    loading,
    visitors,
    toast,
    notifications,
    isConnected,
    socket,
    login,
    register,
    logout,
    fetchProducts,
    fetchOrders,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    placeOrder,
    createPaymentIntent,
    showToast,
    API
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

// ============ Toast ============
const Toast = () => {
  const { toast } = useStore();
  if (!toast) return null;
  const Icon = Lucide[toast.type === 'error' ? 'AlertCircle' : toast.type === 'info' ? 'Info' : 'CheckCircle'];
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

// ============ App ============
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
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

// ============ 404 ============
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-32 text-center">
      <div className="text-6xl mb-4">🤔</div>
      <h1 className="text-3xl font-bold text-gray-400">Page Not Found</h1>
      <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition">
        Go Home
      </button>
    </div>
  );
};

export default App;
