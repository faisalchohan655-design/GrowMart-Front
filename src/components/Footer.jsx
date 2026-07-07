import React from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/95 border-t border-white/10 text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* ============ BRAND ============ */}
          <div>
            <Link to="/" className="text-2xl font-bold gradient-text inline-block mb-3">
              GrowMart
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your Growth Marketplace — Smart Shopping with AI Recommendations & Real-time Experience.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="mailto:Growmart655@gmail.com"
                className="text-sm text-gray-400 hover:text-purple-400 transition flex items-center gap-2"
              >
                <Lucide.Mail size={16} />
                Growmart655@gmail.com
              </a>
            </div>
          </div>

          {/* ============ QUICK LINKS ============ */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Promotions', path: '/promotions' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-purple-400 transition duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ SUPPORT ============ */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'FAQ', path: '/faq' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-purple-400 transition duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ LEGAL & SOCIAL ============ */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Terms of Service', path: '/terms-of-service' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-purple-400 transition duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition border border-white/10 hover:border-purple-500/30"
                  aria-label="Facebook"
                >
                  <Lucide.Facebook size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition border border-white/10 hover:border-purple-500/30"
                  aria-label="Instagram"
                >
                  <Lucide.Instagram size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition border border-white/10 hover:border-purple-500/30"
                  aria-label="Twitter"
                >
                  <Lucide.Twitter size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition border border-white/10 hover:border-purple-500/30"
                  aria-label="YouTube"
                >
                  <Lucide.Youtube size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ============ COPYRIGHT ============ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500"
        >
          <p>&copy; {currentYear} GrowMart. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Made with</span>
            <Lucide.Heart size={14} className="text-red-500 fill-red-500" />
            <span>in Pakistan</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
