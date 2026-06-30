import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, ShoppingBag, Star, Image as ImageIcon } from 'lucide-react';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://growmart-back-production.up.railway.app/api';

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      console.log('Fetching products...');
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      console.log('Products data:', data);
      
      if (data.success) {
        // Filter products that are on sale
        const onSale = data.data.filter(p => p.isOnSale === true);
        console.log('On sale products:', onSale);
        setPromotions(onSale);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading deals...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😅</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ============ HEADER ============ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-400">🔥 Limited Time Offers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Special Offers
            </span>
          </h1>
          <p className="text-gray-400 mt-2">Don't miss out on these amazing deals!</p>
        </div>

        {/* ============ NO PROMOTIONS ============ */}
        {promotions.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-medium mb-2">No Deals Available</h2>
            <p className="text-gray-400">Check back later for exciting promotions!</p>
            <Link 
              to="/" 
              className="inline-block mt-6 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          /* ============ PRODUCTS GRID ============ */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promotions.map((product) => {
              const discount = product.salePrice 
                ? Math.round((1 - product.salePrice / product.price) * 100)
                : 0;

              return (
                <div 
                  key={product._id} 
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] group"
                >
                  <Link to={`/product/${product._id}`}>
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-black/50">
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <ImageIcon size={48} />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.salePrice && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {discount}% OFF
                        </div>
                      )}
                      
                      {/* Stock Badge */}
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-yellow-500/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Only {product.stock} left!
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-purple-400 transition">
                        {product.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{product.category}</p>
                      
                      {/* Price */}
                      <div className="flex items-center gap-3">
                        {product.salePrice ? (
                          <>
                            <span className="text-xl font-bold text-red-400">${product.salePrice}</span>
                            <span className="text-sm text-gray-500 line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-purple-400">${product.price}</span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                      </div>

                      {/* Button */}
                      <button className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/25">
                        Grab Deal 🔥
                      </button>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;
