import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Products = () => {
  const { products, loading, fetchProducts, addToCart } = useStore();
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchCategory = !category || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold gradient-text">All Products</h1>
        <span className="text-sm text-gray-400">{sorted.length} products</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Lucide.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm min-w-[150px]"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
        {(search || category) && (
          <button
            onClick={() => { setSearch(''); setCategory(''); }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12">
          <Lucide.Search size={48} className="mx-auto mb-4 opacity-50 text-gray-600" />
          <h3 className="text-lg text-gray-400">No products found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sorted.map(product => (
            <div key={product._id} className="glass rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition group">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
