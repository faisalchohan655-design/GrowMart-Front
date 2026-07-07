import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - GrowMart</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and guidelines for using GrowMart. Learn about your rights and responsibilities." />
        <meta name="keywords" content="terms of service, terms and conditions, growmart terms" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/terms-of-service" />
        <meta property="og:title" content="Terms of Service - GrowMart" />
        <meta property="og:description" content="Understand the terms and conditions for using GrowMart's platform." />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lucide.FileText className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Terms of Service</h1>
            </div>
            <p className="text-gray-400 mb-8">Last updated: June 30, 2026</p>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-400 leading-relaxed">
                  By using GrowMart, you agree to these Terms of Service. If you do not agree, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">2. Account Registration</h2>
                <p className="text-gray-400 leading-relaxed">
                  You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">3. Orders and Payments</h2>
                <p className="text-gray-400 leading-relaxed">
                  All orders are subject to availability and confirmation of the price. We reserve the right to cancel orders for any reason.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">4. Intellectual Property</h2>
                <p className="text-gray-400 leading-relaxed">
                  All content on GrowMart is our property. You may not copy, reproduce, or distribute any content without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">5. Limitation of Liability</h2>
                <p className="text-gray-400 leading-relaxed">
                  We are not liable for any indirect, incidental, or consequential damages arising from your use of our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">6. Governing Law</h2>
                <p className="text-gray-400 leading-relaxed">
                  These terms are governed by the laws of Pakistan. Any disputes will be resolved in the courts of Lahore.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">7. Contact</h2>
                <p className="text-gray-400 leading-relaxed">
                  For any questions, contact us at <a href="mailto:support@growmart.com" className="text-purple-400 hover:underline">support@growmart.com</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
