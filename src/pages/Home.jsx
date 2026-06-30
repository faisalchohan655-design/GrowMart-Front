import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import LiveChat from '../components/LiveChat'; // ✅ ADDED

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visitors, setVisitors] = useState(0);
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

            {/* Stats - Compact Row */}
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

            {/* CTAs */}
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

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <Lucide.ChevronDown size={24} className="text-gray-500 opacity-40" />
        </motion.div>
      </section>

      {/* ============ FEATURED CATEGORIES ============ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Shop by Category</span>
            </h2>
            <p className="text-gray-400">Find exactly what you're looking for</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { name: 'Electronics', icon: Lucide.Laptop, gradient: 'from-blue-500/20 to-cyan-500/20', color: 'text-blue-400' },
              { name: 'Fashion', icon: Lucide.Shirt, gradient: 'from-pink-500/20 to-rose-500/20', color: 'text-pink-400' },
              { name: 'Home', icon: Lucide.Home, gradient: 'from-emerald-500/20 to-teal-500/20', color: 'text-emerald-400' },
              { name: 'Beauty', icon: Lucide.Sparkles, gradient: 'from-purple-500/20 to-violet-500/20', color: 'text-purple-400' }
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${category.gradient} border border-white/10 text-center cursor-pointer group transition-all duration-300 hover:border-purple-500/30`}
              >
                <category.icon className={`w-8 h-8 mx-auto ${category.color} group-hover:scale-110 transition`} />
                <p className="mt-2 font-medium">{category.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="gradient-text">Featured Products</span>
              </h2>
              <p className="text-gray-400">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <Lucide.ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 h-48 rounded-2xl mb-3" />
                  <div className="bg-white/5 h-4 w-3/4 rounded mb-2" />
                  <div className="bg-white/5 h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredProducts.slice(0, 8).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">What Our Customers Say</span>
            </h2>
            <p className="text-gray-400">Real reviews from real people</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { name: 'Sarah Johnson', review: 'Amazing quality! Fast shipping and great customer service. Highly recommend!', rating: 5 },
              { name: 'Mike Chen', review: 'Best online shopping experience. The products are exactly as described.', rating: 5 },
              { name: 'Emily Davis', review: 'Love the variety and prices. Will definitely be shopping here again!', rating: 5 }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{testimonial.review}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl" />
            <div className="relative z-10 text-center">
              <Lucide.Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <span className="gradient-text">Shop?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Join thousands of happy customers. Start shopping today!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
              >
                <Link to="/products" className="flex items-center gap-2">
                  Browse Products
                  <Lucide.ShoppingBag size={20} />
                </Link>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SCROLL TO TOP ============ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 z-40"
          >
            <Lucide.ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ============ LIVE CHAT ============ */}
      <LiveChat /> {/* ✅ ADDED */}
    </div>
  );
};

// ============ PRODUCT CARD COMPONENT ============
const ProductCard = ({ product }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <div className="relative h-48 overflow-hidden bg-black/30">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Lucide.Image size={32} />
              </div>
            )}
            {product.stock < 10 && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500/80 backdrop-blur-xl text-[10px] font-medium">
                Low Stock
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-400">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold gradient-text">
                ${product.price}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <Lucide.ShoppingCart size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Homepage;
