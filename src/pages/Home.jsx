import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visitors, setVisitors] = useState(0); // Real visitors
  const [socket, setSocket] = useState(null);

  const API_BASE = 'https://growmart-back-production.up.railway.app/api';
  const SOCKET_URL = 'https://growmart-back-production.up.railway.app';

  // ============ SOCKET.IO - REAL VISITORS ============
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    newSocket.on('visitors', (count) => {
      setVisitors(count);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ============ FETCH PRODUCTS ============
  useEffect(() => {
    fetchProducts();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ============ HERO SECTION ============ */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-30%] right-[-20%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-30%] left-[-20%] w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[100px] animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Real Visitors Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">{visitors} online</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient bg-[length:200%_200%]">
                Welcome to
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                GrowMart
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto mb-5">
              Smart Shopping with AI Recommendations & Real-time Experience
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
              {[
                { value: `${products.length}+`, label: 'Products', icon: Lucide.Package },
                { value: '⚡', label: 'Real-time', icon: null },
                { value: '🔒', label: 'Secure', icon: null }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {stat.icon && <stat.icon className="w-4 h-4 text-purple-400" />}
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-gray-500">{stat.label}</span>
                  {i < 2 && <span className="text-gray-600">•</span>}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Link to="/products" className="flex items-center gap-2">
                  <Lucide.ShoppingBag size={16} />
                  Start Shopping
                </Link>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all duration-300"
              >
                <Link to="/promotions" className="flex items-center gap-2">
                  <Lucide.Gift size={16} />
                  View Promotions
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <Lucide.ChevronDown size={24} className="text-gray-500 opacity-40" />
        </motion.div>
      </section>

      {/* ============ REST OF HOMEPAGE ============ */}
      {/* ... Categories, Products, Testimonials, CTA sections ... */}
      {/* Same as before, but without fake visitor code */}

      {/* ============ SCROLL TO TOP ============ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 z-50"
          >
            <Lucide.ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
