'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function AbandonedCartPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const checkCart = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        setCartItems(items.length);
      }
    };

    checkCart();
    const interval = setInterval(checkCart, 5000);

    const timer = setTimeout(() => {
      if (cartItems > 0 && !localStorage.getItem('cartReminderShown')) {
        setIsVisible(true);
        localStorage.setItem('cartReminderShown', 'true');
      }
    }, 30000); // Show after 30 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [cartItems]);

  if (cartItems === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-4 left-1/2 z-40 w-full max-w-md px-4"
        >
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 shadow-2xl border border-purple-500/50 relative">
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <ShoppingBagIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">
                  Don't forget your items! 🛍️
                </h3>
                <p className="text-purple-200 text-sm mb-3">
                  You have {cartItems} item{cartItems > 1 ? 's' : ''} waiting in your cart
                </p>
                <Link
                  href="/cart"
                  onClick={() => setIsVisible(false)}
                  className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-2 rounded-xl hover:scale-105 transition-transform"
                >
                  Complete Purchase
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
