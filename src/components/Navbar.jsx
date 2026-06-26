import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../App';
import * as Lucide from 'lucide-react';

const Navbar = () => {
  const { cart, visitors, isConnected } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { path: '/', label: 'Home', icon: 'Home' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/promotions', label: 'Promotions', icon: 'Gift' },
    { path: '/admin', label: 'Admin', icon: 'LayoutDashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Lucide.Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">GrowMart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = Lucide[item.icon];
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm transition ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="hidden md:flex items-center gap-1.5 text-xs">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-gray-500">{isConnected ? 'Online' : 'Offline'}</span>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-400 hover:text-white transition">
            <Lucide.ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            <Lucide.Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 space-y-2">
          {navItems.map((item) => {
            const Icon = Lucide[item.icon];
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
                  isActive
                    ? 'gradient-bg text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            {isConnected ? 'Connected' : 'Offline'}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
