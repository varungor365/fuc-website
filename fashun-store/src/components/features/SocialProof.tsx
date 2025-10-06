'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';

export default function SocialProof() {
  const [notification, setNotification] = useState<any>(null);

  const notifications = [
    { name: 'Rahul from Mumbai', product: 'Urban Hoodie', time: '2 min ago' },
    { name: 'Priya from Delhi', product: 'Streetwear Tee', time: '5 min ago' },
    { name: 'Amit from Bangalore', product: 'Cargo Pants', time: '8 min ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setNotification(notifications[Math.floor(Math.random() * notifications.length)]);
      setTimeout(() => setNotification(null), 5000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          className="fixed bottom-24 left-6 z-40 bg-white rounded-2xl shadow-2xl p-4 max-w-sm"
        >
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{notification.name}</p>
              <p className="text-sm text-gray-600">purchased {notification.product}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{notification.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
