import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../App';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as Lucide from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ total, onSuccess }) => {
  const { user, placeOrder, cart, showToast } = useStore();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    for (const key in formData) {
      if (!formData[key]) {
        showToast(`Please fill in ${key}`, 'error');
        return;
      }
    }

    setLoading(true);
    try {
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

      // Place order
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
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        paymentId: paymentIntent.id
      };

      await placeOrder(order);
      onSuccess();

    } catch (error) {
      showToast('Payment failed', 'error');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
        <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
      </div>
      <input name="phone" placeholder="Phone *" value={formData.phone} onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
      <input name="street" placeholder="Street Address *" value={formData.street} onChange={handleChange}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
      <div className="grid md:grid-cols-3 gap-4">
        <input name="city" placeholder="City *" value={formData.city} onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
        <input name="state" placeholder="State *" value={formData.state} onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
        <input name="zip" placeholder="ZIP *" value={formData.zip} onChange={handleChange}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none" required />
      </div>

      {/* Stripe Card Element */}
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

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

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
        <h2 className="text-3xl font-bold gradient-text">Payment Successful!</h2>
        <p className="text-gray-400 mt-2">Your order has been placed successfully.</p>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
