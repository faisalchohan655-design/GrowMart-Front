import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - GrowMart</title>
        <meta name="description" content="Learn how GrowMart collects, uses, and protects your personal information. Your privacy matters to us." />
        <meta name="keywords" content="privacy policy, data protection, growmart privacy" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/privacy-policy" />
        <meta property="og:title" content="Privacy Policy - GrowMart" />
        <meta property="og:description" content="Your privacy is important to us. Read our privacy policy to understand how we handle your data." />
        <meta property="og:url" content="https://grow-mart-front-dngm.vercel.app/privacy-policy" />
        <meta name="twitter:card" content="summary" />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lucide.Shield className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Privacy Policy</h1>
            </div>
            <p className="text-gray-400 mb-8">Last updated: June 30, 2026</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">1. Information We Collect</h2>
                <p className="text-gray-400 leading-relaxed">
                  We collect information you provide directly, such as your name, email address, phone number, and payment details when you create an account, place an order, or contact us. We also collect usage data automatically through cookies and similar technologies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">2. How We Use Your Information</h2>
                <p className="text-gray-400 leading-relaxed">
                  We use your information to process orders, provide customer support, send order confirmations, improve our services, and send promotional offers (only with your consent). We do not sell your personal data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">3. Sharing Your Information</h2>
                <p className="text-gray-400 leading-relaxed">
                  We share your information with trusted service providers (e.g., payment processors, shipping partners) only to fulfill orders. We require them to protect your data and use it only for the services they provide to us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">4. Data Security</h2>
                <p className="text-gray-400 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">5. Your Rights</h2>
                <p className="text-gray-400 leading-relaxed">
                  You have the right to access, correct, or delete your personal data at any time. You can also opt out of marketing communications. Contact us at <a href="mailto:support@growmart.com" className="text-purple-400 hover:underline">support@growmart.com</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">6. Cookies</h2>
                <p className="text-gray-400 leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences in your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">7. Changes to This Policy</h2>
                <p className="text-gray-400 leading-relaxed">
                  We may update this policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-purple-400 mb-3">8. Contact Us</h2>
                <p className="text-gray-400 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@growmart.com" className="text-purple-400 hover:underline">support@growmart.com</a>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
