import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });

  // Load social links from localStorage on mount
  useEffect(() => {
    const facebook = localStorage.getItem('social_facebook') || '';
    const instagram = localStorage.getItem('social_instagram') || '';
    const twitter = localStorage.getItem('social_twitter') || '';
    setSocialLinks({ facebook, instagram, twitter });
  }, []);

  // Helper to get link or fallback
  const getLink = (key) => socialLinks[key] || '#';

  return (
    <footer className="bg-black/95 border-t border-white/10 text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
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

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-purple-400 transition">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-purple-400 transition">Products</Link></li>
              <li><Link to="/promotions" className="text-gray-400 hover:text-purple-400 transition">Promotions</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-purple-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-purple-400 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-purple-400 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-purple-400 transition">Terms of Service</Link></li>
            </ul>

            {/* Social Icons */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {/* Facebook */}
                <a
                  href={getLink('facebook')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full border transition ${
                    socialLinks.facebook ? 'bg-white/5 hover:bg-purple-500/20 border-white/10 hover:border-purple-500/30' : 'opacity-30 cursor-not-allowed'
                  }`}
                  aria-label="Facebook"
                >
                  <Lucide.Facebook size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                {/* Instagram */}
                <a
                  href={getLink('instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full border transition ${
                    socialLinks.instagram ? 'bg-white/5 hover:bg-purple-500/20 border-white/10 hover:border-purple-500/30' : 'opacity-30 cursor-not-allowed'
                  }`}
                  aria-label="Instagram"
                >
                  <Lucide.Instagram size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                {/* Twitter */}
                <a
                  href={getLink('twitter')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full border transition ${
                    socialLinks.twitter ? 'bg-white/5 hover:bg-purple-500/20 border-white/10 hover:border-purple-500/30' : 'opacity-30 cursor-not-allowed'
                  }`}
                  aria-label="Twitter"
                >
                  <Lucide.Twitter size={18} className="text-gray-300 hover:text-purple-400" />
                </a>
                {/* YouTube removed */}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
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
