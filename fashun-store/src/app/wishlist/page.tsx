'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);
  }, []);

  function removeItem(id: string) {
    const updated = wishlist.filter(item => item !== id);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">❤️ My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 mb-4">Your wishlist is empty</p>
            <Link
              href="/products"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map(id => (
              <div key={id} className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
                <div className="aspect-square bg-gray-800"></div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">Product {id}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${id}`}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-center"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => removeItem(id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
