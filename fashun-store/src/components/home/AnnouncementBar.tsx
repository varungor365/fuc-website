'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Announcement Bar - Inspired by District, Basel themes
export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      id: 1,
      text: "🔥 Free Shipping on Orders Above ₹999 - Limited Time Offer!",
      link: "/collections/all",
      color: "from-red-500 to-pink-500"
    },
    {
      id: 2,
      text: "✨ New Collection Drop: Premium Streetwear Collection Now Live!",
      link: "/collections/streetwear",
      color: "from-purple-500 to-blue-500"
    },
    {
      id: 3,
      text: "💫 Use Code FASHUN20 for 20% Off Your First Order",
      link: "/collections/new-arrivals",
      color: "from-green-500 to-teal-500"
    }
  ];

  // Rotate messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`relative overflow-hidden bg-gradient-to-r ${messages[currentMessage].color} text-white`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex-1 text-center">
              <AnimatePresence mode="wait">
                <motion.a
                  key={currentMessage}
                  href={messages[currentMessage].link}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium hover:underline cursor-pointer"
                >
                  {messages[currentMessage].text}
                </motion.a>
              </AnimatePresence>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close announcement"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            key={currentMessage}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}