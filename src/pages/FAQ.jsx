import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse products, add items to your cart, and proceed to checkout. Follow the steps to enter your shipping details and complete payment.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, Stripe, and other online payment options. Cash on delivery is also available for select regions.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by location. Typically, orders are delivered within 3-5 business days. You will receive a tracking number once your order is shipped.'
    },
    {
      question: 'Can I return or exchange an item?',
      answer: 'Yes, we have a 7-day return policy. Items must be unused and in original packaging. Contact our support for return instructions.'
    },
    {
      question: 'How do I track my order?',
      answer: 'You will receive an email with tracking information once your order is shipped. You can also track your order from your account dashboard.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard encryption and secure payment gateways to protect your financial data.'
    }
  ];

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <>
      <Helmet>
        <title>FAQ - GrowMart</title>
        <meta name="description" content="Find answers to commonly asked questions about ordering, shipping, payments, returns, and more at GrowMart." />
        <meta name="keywords" content="faq, frequently asked questions, help, support" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/faq" />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lucide.HelpCircle className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Frequently Asked Questions</h1>
            </div>
            <p className="text-gray-400 mb-8">Find quick answers to the most common questions.</p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <span className="text-purple-400">
                      {openIndex === index ? <Lucide.ChevronUp size={20} /> : <Lucide.ChevronDown size={20} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 text-gray-300 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <p className="text-gray-400">Still have questions?</p>
              <Link to="/contact" className="inline-block mt-3 px-6 py-2 bg-purple-500 rounded-xl hover:bg-purple-600 transition">
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
