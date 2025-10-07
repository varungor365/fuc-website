'use client';

import { useState } from 'react';

export default function StockAlert({ stock }: { stock: number }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubscribed(true);
  }

  if (stock > 10) return null;

  if (stock === 0) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-red-400 mb-2">⚠️ Out of Stock</h3>
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 bg-white/10 rounded border border-white/20"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
            >
              Notify Me
            </button>
          </form>
        ) : (
          <p className="text-green-400">✓ We'll notify you when back in stock!</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4 mb-4">
      <p className="text-orange-400 font-bold">
        🔥 Only {stock} left in stock - Order soon!
      </p>
    </div>
  );
}
