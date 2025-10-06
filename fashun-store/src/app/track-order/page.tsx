'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
            <p className="text-gray-400">Enter your order details to track your shipment</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-2025-001"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              Track Order
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
