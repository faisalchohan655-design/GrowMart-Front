import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate with email API or just show success
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - GrowMart</title>
        <meta name="description" content="Get in touch with GrowMart. We're here to help with your orders, questions, or feedback. Reach us via email or contact form." />
        <meta name="keywords" content="contact, support, growmart contact" />
        <link rel="canonical" href="https://grow-mart-front-dngm.vercel.app/contact" />
      </Helmet>

      <div className="min-h-screen bg-black text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lucide.Mail className="text-purple-400" size={32} />
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">Contact Us</h1>
            </div>
            <p className="text-gray-400 mb-8">We'd love to hear from you. Fill out the form or reach us directly.</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lucide.MapPin className="text-purple-400" size={20} />
                    <span className="text-gray-300">Lahore, Pakistan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lucide.Mail className="text-purple-400" size={20} />
                    <a href="mailto:Growmart655@gmail.com" className="text-gray-300 hover:text-purple-400 transition">
                      Growmart655@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Lucide.Clock className="text-purple-400" size={20} />
                    <span className="text-gray-300">Mon - Fri, 9am - 6pm (PKT)</span>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-purple-400">Alternatively, reach us via:</h3>
                  <div className="flex gap-4 mt-3">
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-purple-500/20 transition">
                      <Lucide.Facebook size={20} />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-purple-500/20 transition">
                      <Lucide.Instagram size={20} />
                    </a>
                    <a href="#" className="p-2 rounded-full bg-white/10 hover:bg-purple-500/20 transition">
                      <Lucide.Twitter size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white"
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Your Message"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 outline-none text-white resize-y"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition"
                  >
                    Send Message
                  </button>
                  {submitted && (
                    <p className="text-green-400 text-center mt-2">✅ Message sent successfully!</p>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
