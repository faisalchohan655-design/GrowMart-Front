import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Checkout = () => {
  const { cart, getCartTotal, placeOrder, showToast } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const total = getCartTotal();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    for (const key in formData) {
      if (!formData[key]) {
        showToast(`Please fill in ${key}`, 'error');
        return;
      }
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    setLoading(true);
    try {
      const order = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || ''
        })),
        total: total,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        paymentMethod: 'cod'
      };
      
      await placeOrder(order);
      navigate('/');
      showToast('🎉 Order placed successfully!', 'success');
    } catch (error) {
      showToast('Failed to place order', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 px-4 md:px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              required
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
          </div>
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone *"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          />
          
          <input
            type="text"
            name="street"
            placeholder="Street Address *"
            required
            value={formData.street}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City *"
              required
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="State *"
              required
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP *"
              required
              value={formData.zip}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="w-full py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Place Order $${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="glass p-4 rounded-2xl h-fit">
          <h3 className="font-bold mb-4">Your Order</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="truncate">{item.name} × {item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="gradient-text">${total.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Payment: Cash on Delivery
          </div>
          <div className="text-xs text-green-400 mt-1">
            ✅ Free shipping
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
