import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showToast, API } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
        } else {
          showToast('Product not found', 'error');
          navigate('/products');
        }
      } catch (error) {
        showToast('Failed to load product', 'error');
        navigate('/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 flex justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [''];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images - With CSS Class */}
        <div>
          <div className="glass rounded-2xl p-4 mb-4">
            <div className="image-container aspect-square rounded-xl bg-white/5">
              {images[selectedImage] ? (
                <img 
                  src={images[selectedImage]} 
                  alt={product.name} 
                  className="product-detail-image" 
                />
              ) : (
                <Lucide.Image size={80} className="text-gray-600" />
              )}
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                    selectedImage === i ? 'border-purple-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold gradient-text">${product.price}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-lg text-gray-500 line-through">${product.comparePrice}</span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Lucide.Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                />
              ))}
              <span className="text-sm text-gray-400 ml-2">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>
          )}

          <div className="mt-4">
            <p className="text-gray-400 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>

          {/* Stock Status */}
          <div className="mt-4">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
            </span>
          </div>

          {/* Category */}
          {product.category && (
            <div className="mt-2 text-sm text-gray-400">
              Category: <span className="text-purple-400">{product.category}</span>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <label className="text-sm text-gray-400">Quantity</label>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              >
                <Lucide.Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition flex items-center justify-center"
              >
                <Lucide.Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full mt-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lucide.ShoppingCart size={18} className="inline mr-2" />
            {product.stock > 0 ? `Add to Cart (${quantity})` : 'Out of Stock'}
          </button>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mt-3 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            <Lucide.ArrowLeft size={16} /> Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
