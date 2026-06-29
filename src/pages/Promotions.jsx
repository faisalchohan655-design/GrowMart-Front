import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitors, setVisitors] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 18
  });

  const API_BASE = 'https://growmart-back-production.up.railway.app/api';
  const SOCKET_URL = 'https://growmart-back-production.up.railway.app';

  // ============ SOCKET.IO - REAL VISITORS ============
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('visitors', (count) => {
      setVisitors(count);
    });
    return () => socket.disconnect();
  }, []);

  // ============ COUNTDOWN TIMER ============
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newSeconds = prev.seconds - 1;
        if (newSeconds < 0) {
          return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
        }
        return { ...prev, seconds: newSeconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ============ FETCH PROMOTIONS ============
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const [productsRes, featuredRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/products?featured=true`)
      ]);

      const productsData = await productsRes.json();
      const featuredData = await featuredRes.json();

      if (productsData.success) {
        const onSale = productsData.data.filter(p => p.isOnSale === true);
        setPromotions(onSale);
      }

      if (featuredData.success) {
        setFeatured(featuredData.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Groceries'];

  const filteredPromotions = selectedCategory === 'All'
    ? promotions
    : promotions.filter(p => p.category === selectedCategory);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ============ HERO SECTION ============ */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-20%] w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-30%] left-[-20%] w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Live Visitors - REAL */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">{visitors} shoppers online</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">🔥 Special Offers</span>
              <br />
              <span className="text-white">Just for You!</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Don't miss out on these amazing deals. Limited time offers on your favorite products.
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 md:gap-8 mb-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl md:text-3xl font-bold gradient-text">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CATEGORY FILTER ============ */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED DEALS ============ */}
      {featured.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lucide.Star className="text-yellow-400 fill-yellow-400" />
                <span className="gradient-text">Featured Deals</span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            >
              {featured.slice(0, 4).map((product, index) => (
                <FeaturedCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ============ PROMOTIONS GRID ============ */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lucide.FireExtinguisher className="text-orange-400" />
                <span className="gradient-text">All Deals</span>
              </h2>
              <p className="text-sm text-gray-500">{filteredPromotions.length} deals available</p>
            </div>
          </motion.div>

          {filteredPromotions.length === 0 ? (
            <div className="text-center py-16">
              <Lucide.Gift className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Deals Available</h3>
              <p className="text-gray-400">Check back later for exciting promotions!</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredPromotions.map((product, index) => (
                <PromotionCard key={product._id} product={product} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

// ============ FEATURED CARD ============
const FeaturedCard = ({ product, index }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
      }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <Lucide.Image size={40} />
            </div>
          )}
          <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
            ★ Featured
          </div>
          {product.isOnSale && (
            <div className="absolute top-2 right-2 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
              SALE
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-white group-hover:text-purple-400 transition line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold gradient-text">${product.price}</span>
            {product.salePrice && (
              <span className="text-sm text-gray-500 line-through">${product.salePrice}</span>
            )}
          </div>
          <button className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/20">
            Shop Now
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

// ============ PROMOTION CARD ============
const PromotionCard = ({ product, index }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.05 } }
      }}
      className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative h-48 overflow-hidden bg-black/30">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <Lucide.Image size={40} />
            </div>
          )}
          
          {product.isOnSale && product.salePrice && (
            <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
              {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-4">
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm">
              Quick View
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-white group-hover:text-purple-400 transition line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-red-400">${product.salePrice}</span>
                <span className="text-sm text-gray-500 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-lg font-bold gradient-text">${product.price}</span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Lucide.Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              4.5
            </span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <Lucide.ShoppingBag className="w-3 h-3" />
              {product.stock} left
            </span>
          </div>

          <button className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 text-sm font-medium hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40">
            Grab Deal 🔥
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default Promotions;
