import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useStore();
  const navigate = useNavigate();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto text-center py-16">
        <Lucide.ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Browse our products and add items you love!</p>
        <Link to="/products" className="inline-block mt-6 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item._id} className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Lucide.Image size={30} className="text-gray-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <div className="text-sm text-gray-400">Qty: {item.quantity}</div>
                <div className="font-bold gradient-text">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
              >
                <Lucide.Trash2 size={18} />
              </button>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
          >
            <Lucide.Trash2 size={14} /> Clear Cart
          </button>
        </div>

        <div className="glass p-6 rounded-2xl h-fit">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span className="text-green-400">FREE</span>
            </div>
            {total > 100 && (
              <div className="flex justify-between text-xs text-green-400">
                <span>🎉 Free shipping applied</span>
              </div>
            )}
            <div className="border-t border-white/5 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-4 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
