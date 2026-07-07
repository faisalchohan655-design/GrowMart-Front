import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us - GrowMart</title>
        <meta name="description" content="Learn about GrowMart, your trusted online marketplace for quality products. Our mission is to provide a seamless shopping experience." />
        <meta name="keywords" content="about us, growmart story, online marketplace, growmart" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/about" />
        <meta property="og:title" content="About Us - GrowMart" />
        <meta property="og:description" content="Discover the story behind GrowMart and our commitment to customer satisfaction." />
        <meta property="og:url" content="https://grow-mart-front-dngm.vercel.app/about" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Lucide.Users className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">About GrowMart</h1>
            </div>
            <p className="text-gray-400 mb-8">Your trusted online marketplace since 2024.</p>

            {/* Main Content */}
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p className="text-lg">
                <span className="text-white font-bold">GrowMart</span> is a leading online marketplace dedicated to offering high-quality products at affordable prices. We believe in making shopping convenient, secure, and enjoyable for everyone.
              </p>

              {/* Mission & Vision Cards */}
              <div className="grid sm:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition duration-300">
                  <Lucide.Target className="text-purple-400 mb-3" size={28} />
                  <h3 className="text-lg font-bold text-white">Our Mission</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    To empower customers by providing a curated selection of products with fast delivery and exceptional customer service.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition duration-300">
                  <Lucide.Eye className="text-purple-400 mb-3" size={28} />
                  <h3 className="text-lg font-bold text-white">Our Vision</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    To become the most trusted and innovative e-commerce platform in the region, constantly evolving with customer needs.
                  </p>
                </div>
              </div>

              {/* Why Choose Us */}
              <h2 className="text-xl font-bold text-purple-400 mt-8">Why Choose GrowMart?</h2>
              <ul className="grid sm:grid-cols-2 gap-3 list-none text-gray-300">
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Curated product selection from trusted brands</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Secure payment options (Stripe, credit cards, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Fast and reliable shipping across Pakistan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>24/7 customer support via chat and email</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Real-time order tracking and notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lucide.CheckCircle className="text-green-400 mt-1" size={18} />
                  <span>Easy returns and exchange policy</span>
                </li>
              </ul>

              {/* Contact Info */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <p className="text-center text-gray-300 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <Lucide.Mail className="text-purple-400" size={20} />
                  <span>Have questions? Reach out to us at</span>
                  <a
                    href="mailto:Growmart655@gmail.com"
                    className="text-purple-400 hover:underline font-medium"
                  >
                    Growmart655@gmail.com
                  </a>
                </p>
              </div>

              {/* Back to Home */}
              <div className="text-center mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition shadow-lg shadow-purple-500/25"
                >
                  <Lucide.ArrowLeft size={18} />
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
