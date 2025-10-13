'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, Check } from 'lucide-react';
import { StockNotificationService } from '@/services/stock-notification.service';
import toast from 'react-hot-toast';

export default function StockNotification({ productId, variantId }: { productId: string; variantId: string }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await StockNotificationService.subscribe(email, productId, variantId);
      setSubscribed(true);
      toast.success('You\'ll be notified when this item is back in stock!');
    } catch (error) {
      toast.error('Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4"
    >
      <AnimatePresence mode="wait">
        {!subscribed ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center mb-3">
              <Bell className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="font-semibold text-yellow-900">Out of Stock</h4>
            </div>
            <p className="text-sm text-yellow-800 mb-3">
              Get notified when this item is back in stock
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Notify Me'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center text-green-700"
          >
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">You're on the list! We'll email you when it's back.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
