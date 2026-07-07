import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us - GrowMart</title>
        <meta name="description" content="Learn about GrowMart, your trusted online marketplace for quality products. Our mission is to provide a seamless shopping experience." />
        <meta name="keywords" content="about us, growmart story, online marketplace" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/about" />
        <meta property="og:title" content="About Us - GrowMart" />
        <meta property="og:description" content="Discover the story behind GrowMart and our commitment to customer satisfaction." />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lucide.Users className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">About GrowMart</h1>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                <span className="text-white font-bold">GrowMart</span> is a leading online marketplace dedicated to offering high-quality products at affordable prices. We believe in making shopping convenient, secure, and enjoyable for everyone.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Lucide.Target className="text-purple-400 mb-3" size={28} />
                  <h3 className="text-lg font-bold">Our Mission</h3>
                  <p className="text-sm text-gray-400 mt-2">To empower customers by providing a curated selection of products with fast delivery and exceptional customer service.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <Lucide.Eye className="text-purple-400 mb-3" size={28} />
                  <h3 className="text-lg font-bold">Our Vision</h3>
                  <p className="text-sm text-gray-400 mt-2">To become the most trusted and innovative e-commerce platform in the region, constantly evolving with customer needs.</p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-purple-400 mt-8">Why Choose Us?</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-400">
                <li>✅ Curated product selection from trusted brands</li>
                <li>✅ Secure payment options (Stripe, credit cards, etc.)</li>
                <li>✅ Fast and reliable shipping across Pakistan</li>
                <li>✅ 24/7 customer support via chat and email</li>
                <li>✅ Real-time order tracking and notifications</li>
              </ul>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <p className="text-center text-gray-300">
                  📧 Have questions? Reach out to us at{' '}
                  <a href="mailto:support@growmart.com" className="text-purple-400 hover:underline">
                    support@growmart.com
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
