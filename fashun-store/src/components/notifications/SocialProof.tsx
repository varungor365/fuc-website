'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Purchase {
  name: string;
  product: string;
  location: string;
  time: string;
}

export default function SocialProof() {
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);
  const [show, setShow] = useState(false);

  const purchases: Purchase[] = [
    { name: 'Rahul K.', product: 'Oversized Hoodie', location: 'Mumbai', time: '2 min ago' },
    { name: 'Priya S.', product: 'Graphic Tee', location: 'Delhi', time: '5 min ago' },
    { name: 'Arjun M.', product: 'Cargo Pants', location: 'Bangalore', time: '8 min ago' },
    { name: 'Sneha R.', product: 'Denim Jacket', location: 'Pune', time: '12 min ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPurchase = purchases[Math.floor(Math.random() * purchases.length)];
      setCurrentPurchase(randomPurchase);
      setShow(true);

      setTimeout(() => setShow(false), 5000);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && currentPurchase && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          className="fixed bottom-8 left-8 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl max-w-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
              🛍️
            </div>
            <div className="flex-1">
              <p className="font-bold text-white">{currentPurchase.name}</p>
              <p className="text-sm text-gray-300">
                Purchased <span className="text-purple-400">{currentPurchase.product}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                📍 {currentPurchase.location} • {currentPurchase.time}
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
