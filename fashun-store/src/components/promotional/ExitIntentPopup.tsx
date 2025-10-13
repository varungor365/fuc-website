'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('exitPopupSeen');
    if (hasSeenPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        localStorage.setItem('exitPopupSeen', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    localStorage.setItem('discountClaimed', 'true');
    setIsVisible(false);
  };

  const handleRemindLater = () => {
    localStorage.setItem('exitPopupSeen', Date.now().toString());
    setIsVisible(false);
    setTimeout(() => {
      localStorage.removeItem('exitPopupSeen');
    }, 24 * 60 * 60 * 1000); // Remind after 24 hours
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsVisible(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border-2 border-purple-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="inline-block mb-4"
                >
                  <SparklesIcon className="w-16 h-16 text-yellow-400" />
                </motion.div>

                <h2 className="text-3xl font-black text-white mb-2">
                  WAIT! Don't Go! 🎁
                </h2>
                <p className="text-purple-200 mb-6">
                  Get <span className="text-yellow-400 font-bold text-2xl">15% OFF</span> your first order!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 rounded-xl hover:scale-105 transition-transform"
                  >
                    CLAIM MY DISCOUNT 🚀
                  </button>
                </form>

                <button
                  onClick={handleRemindLater}
                  className="text-sm text-purple-300 hover:text-white mt-4 underline"
                >
                  Remind me later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
