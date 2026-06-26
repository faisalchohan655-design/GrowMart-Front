import React, { useState, useEffect } from 'react';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const OrderNotification = () => {
  const { socket } = useStore();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleOrder = (data) => {
      const id = Date.now();
      setNotifications(prev => [{ id, ...data }, ...prev]);

      // Remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    socket.on('order-notification', handleOrder);

    return () => {
      socket.off('order-notification', handleOrder);
    };
  }, [socket]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-40 space-y-2 max-w-sm">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="glass p-4 rounded-2xl border border-green-500/30 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">🎉</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-green-400 text-sm">New Order!</div>
              <div className="text-sm text-gray-300 font-mono">
                #{notif.orderId}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {notif.customer} • ${notif.total}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderNotification;
