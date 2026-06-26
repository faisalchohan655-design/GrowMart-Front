import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Home = () => {
  const { products, visitors, fetchProducts, loading } = useStore();
  const featured = products.filter(p => p.isFeatured).slice(0, 4);
  const onSale = products.filter(p => p.isOnSale).slice(0, 4);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="glass rounded-3xl p-8 md:p-12 text-center mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
              🚀 Real-time
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">
              ✨ AI Powered
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Welcome to GrowMart
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-6">
            Your Growth Marketplace — Smart Shopping with AI Recommendations & Real-time Experience
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {visitors} online
            </span>
            <span>📦 {products.length} products</span>
            <span>⚡ Real-time</span>
            <span>🔒 Secure checkout</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link to="/products" className="px-8 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition">
              Start Shopping
            </Link>
            <Link to="/promotions" className="px-8 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/30 transition">
              View Promotions
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lucide.Star className="text-yellow-400 fill-yellow-400" size={20} />
              Featured Products
            </h2>
            <Link to="/products?featured=true" className="text-sm text-purple-400 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lucide.Flame className="text-red-400 fill-red-400" size={20} />
              On Sale
            </h2>
            <Link to="/products?sale=true" className="text-sm text-purple-400 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {onSale.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home & Living', 'Beauty'].map((cat) => {
            const icons = {
              'Electronics': '📱',
              'Fashion': '👗',
              'Home & Living': '🏠',
              'Beauty': '💄'
            };
            return (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="glass p-6 rounded-2xl text-center hover:border-purple-500/30 transition group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition">
                  {icons[cat] || '📦'}
                </div>
                <span className="text-sm font-medium">{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="glass p-8 rounded-3xl mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Why Choose GrowMart?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold">Real-time Experience</h3>
            <p className="text-sm text-gray-400">Live chat, instant order notifications, real-time updates</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold">AI Powered</h3>
            <p className="text-sm text-gray-400">Smart product recommendations and personalized shopping</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-bold">Secure & Trusted</h3>
            <p className="text-sm text-gray-400">Safe & encrypted payments with secure checkout</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="glass rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition group">
      <Link to={`/product/${product._id}`}>
        <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center mb-3 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          ) : (
            <Lucide.Image size={40} className="text-gray-600" />
          )}
        </div>
        <h3 className="font-medium truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold gradient-text">${product.price}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-500 line-through">${product.comparePrice}</span>
          )}
        </div>
        {product.isOnSale && (
          <span className="inline-block mt-1 text-xs text-red-400">🔥 Sale</span>
        )}
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="w-full mt-3 py-2 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Home;
