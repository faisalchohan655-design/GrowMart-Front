import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../App';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as Lucide from 'lucide-react';

// Stripe Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_123456789');

// ============ CHECKOUT FORM ============
const CheckoutForm = ({ total, onSuccess }) => {
  const { user, placeOrder, cart, showToast, API } = useStore();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',        // ✅ Zip is optional
    country: 'US'
  });

  // ✅ List of required fields (zip excluded)
  const requiredFields = ['name', 'email', 'phone', 'street', 'city', 'state', 'country'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate only required fields
    for (const key of requiredFields) {
      if (!formData[key]) {
        showToast(`Please fill in ${key}`, 'error');
        return;
      }
    }

    setLoading(true);
    
    try {
      let orderData = {
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
          zip: formData.zip || '',   // ✅ Send empty string if not provided
          country: formData.country
        },
        paymentMethod: paymentMethod
      };

      // For Stripe payments
      if (paymentMethod === 'stripe' && stripe && elements) {
        // Create payment intent
        const res = await API.post('/create-payment-intent', { amount: total });
        const { clientSecret } = res.data;

        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.name,
              email: formData.email
            }
          }
        });

        if (error) {
          showToast(error.message, 'error');
          setLoading(false);
          return;
        }

        orderData.paymentStatus = 'paid';
        orderData.paymentId = paymentIntent.id;
      } else {
        // COD
        orderData.paymentStatus = 'pending';
      }

      // Place order
      await placeOrder(orderData);
      onSuccess();

    } catch (error) {
      showToast('Payment failed. Please try again.', 'error');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Payment Method Selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="stripe"
            checked={paymentMethod === 'stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="rounded border-white/10 bg-transparent"
          />
          💳 Credit Card
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="rounded border-white/10 bg-transparent"
          />
          💵 Cash on Delivery
        </label>
      </div>

      {/* Customer Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name *"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          required
        />
      </div>
      
      <input
        name="phone"
        placeholder="Phone *"
        value={formData.phone}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
        required
      />
      
      <input
        name="street"
        placeholder="Street Address *"
        value={formData.street}
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
        required
      />
      
      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="city"
          placeholder="City *"
          value={formData.city}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          required
        />
        <input
          name="state"
          placeholder="State *"
          value={formData.state}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          required
        />
        {/* ✅ Zip Code – Optional */}
        <input
          name="zip"
          placeholder="ZIP (optional)"
          value={formData.zip}
          onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
        />
      </div>

      {/* Stripe Card Element */}
      {paymentMethod === 'stripe' && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <CardElement options={{
            style: {
              base: {
                color: '#e2e8f0',
                fontSize: '16px',
                '::placeholder': { color: '#a0aec0' }
              }
            }
          }} />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (paymentMethod === 'stripe' && !stripe)}
        className="w-full py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : paymentMethod === 'stripe' ? `Pay $${total.toFixed(2)}` : `Place Order $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

// ============ MAIN CHECKOUT PAGE ============
const Checkout = () => {
  const { cart, getCartTotal } = useStore();
  const navigate = useNavigate();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto text-center py-16">
        <Lucide.ShoppingCart size={64} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Link to="/products" className="inline-block mt-6 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold gradient-text">Order Placed!</h2>
        <p className="text-gray-400 mt-2">Your order has been placed successfully.</p>
        <p className="text-sm text-gray-500 mt-1">You will receive a confirmation email shortly.</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 md:px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass p-6 rounded-2xl border border-white/5">
            <h2 className="font-bold text-lg mb-4">Payment Details</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm total={total} onSuccess={() => setPaymentSuccess(true)} />
            </Elements>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass p-6 rounded-2xl border border-white/5 h-fit">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="truncate">{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="gradient-text">${total.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {total > 50 ? '✅ Free shipping' : `🚚 Shipping: $5.00`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
