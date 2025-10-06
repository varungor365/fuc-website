'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ClockIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setProducts(viewed.slice(0, 4));
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  }, []);

  if (!mounted || products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <ClockIcon className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/products/${product.slug || product.id}`}>
                <div className="bg-gray-800/50 rounded-2xl overflow-hidden hover:scale-105 transition-transform">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm truncate mb-2">{product.name}</h3>
                    <p className="text-purple-400 font-bold">₹{product.price?.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
