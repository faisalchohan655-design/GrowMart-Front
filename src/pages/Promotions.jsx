import React, { useState, useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Promotions = () => {
  const { socket, showToast, API } = useStore();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPromo, setNewPromo] = useState({
    name: '',
    type: 'discount',
    discount: 20,
    minOrder: 0
  });

  useEffect(() => {
    fetchPromotions();

    if (socket) {
      socket.on('promotion-created', (data) => {
        setPromotions(prev => [data, ...prev]);
        showToast(`🎉 New promotion: ${data.name}`, 'success');
      });
    }

    return () => {
      if (socket) {
        socket.off('promotion-created');
      }
    };
  }, [socket]);

  const fetchPromotions = async () => {
    try {
      const res = await API.get('/promotions');
      if (res.data.success) {
        setPromotions(res.data.data || []);
      }
    } catch (error) {
      showToast('Failed to load promotions', 'error');
    }
    setLoading(false);
  };

  const createPromotion = async (e) => {
    e.preventDefault();
    if (!newPromo.name) {
      showToast('Please enter promotion name', 'error');
      return;
    }
    try {
      const res = await API.post('/promotions', newPromo);
      if (res.data.success) {
        setPromotions([res.data.data, ...promotions]);
        showToast('✅ Promotion created!', 'success');
        setNewPromo({ name: '', type: 'discount', discount: 20, minOrder: 0 });
        // Trigger flash sale via Socket.IO
        if (newPromo.type === 'flash_sale') {
          socket.emit('flash-sale-start', {
            message: newPromo.name,
            discount: newPromo.discount,
            duration: 3600
          });
        }
      }
    } catch (error) {
      showToast('Failed to create promotion', 'error');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      flash_sale: '⚡',
      bogo: '🎁',
      free_shipping: '🚚',
      discount: '💰'
    };
    return icons[type] || '📌';
  };

  const getTypeColor = (type) => {
    const colors = {
      flash_sale: 'bg-red-500/20 text-red-400',
      bogo: 'bg-green-500/20 text-green-400',
      free_shipping: 'bg-blue-500/20 text-blue-400',
      discount: 'bg-purple-500/20 text-purple-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="pt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold gradient-text mb-6">🔥 Promotions</h1>

      {/* Create Promotion */}
      <div className="glass p-6 rounded-2xl border border-white/5 mb-8">
        <h2 className="text-lg font-bold mb-4">Create New Promotion</h2>
        <form onSubmit={createPromotion} className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Promotion Name"
            required
            value={newPromo.name}
            onChange={(e) => setNewPromo({...newPromo, name: e.target.value})}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          />
          <select
            value={newPromo.type}
            onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none"
          >
            <option value="discount">Discount (%)</option>
            <option value="flash_sale">⚡ Flash Sale</option>
            <option value="bogo">🎁 Buy One Get One</option>
            <option value="free_shipping">🚚 Free Shipping</option>
          </select>
          <input
            type="number"
            placeholder="Discount %"
            value={newPromo.discount}
            onChange={(e) => setNewPromo({...newPromo, discount: Number(e.target.value)})}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition"
          >
            Create Promotion
          </button>
        </form>
      </div>

      {/* Promotions List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Lucide.Gift size={48} className="mx-auto mb-4 opacity-50" />
          <h3>No active promotions</h3>
          <p className="text-sm">Create your first promotion above!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {promotions.map(promo => (
            <div key={promo._id} className="glass p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{promo.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm px-2 py-0.5 rounded-full ${getTypeColor(promo.type)}`}>
                      {getTypeIcon(promo.type)} {promo.type === 'flash_sale' && 'Flash Sale'}
                      {promo.type === 'bogo' && 'BOGO'}
                      {promo.type === 'free_shipping' && 'Free Shipping'}
                      {promo.type === 'discount' && `${promo.discount}% OFF`}
                    </span>
                    {promo.isActive && (
                      <span className="text-xs text-green-400">● Active</span>
                    )}
                  </div>
                  {promo.minOrder > 0 && (
                    <p className="text-sm text-gray-400 mt-2">Min Order: ${promo.minOrder}</p>
                  )}
                </div>
                <div className="text-3xl">
                  {getTypeIcon(promo.type)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Promotions;
