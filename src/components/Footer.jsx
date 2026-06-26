import React from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-6 px-4 md:px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
            <Lucide.Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold gradient-text">GrowMart</span>
          <span className="text-xs text-gray-500">v1.0.0</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>© {currentYear} GrowMart. All rights reserved.</span>
          <span className="hidden md:inline">|</span>
          <div className="flex items-center gap-1 text-xs">
            <span>🚀</span>
            <span>Real-time powered by Socket.IO</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-500 hover:text-white transition">
            <Lucide.Github size={18} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition">
            <Lucide.Twitter size={18} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white transition">
            <Lucide.Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
