import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="glass rounded-2xl p-4 border border-white/5 hover:border-purple-500/30 transition group">
      <Link to={`/product/${product._id}`}>
        {/* Image - Fixed Centering */}
        <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center mb-3 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain p-2" 
            />
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

export default ProductCard;
