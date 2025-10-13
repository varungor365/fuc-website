'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '@/lib/saleor';

export default function SaleorProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(8).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live from Saleor</h2>
          <p className="text-gray-600">Real products from your backend</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img
                src={product.thumbnail?.url || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=85'}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{product.name}</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{product.pricing?.priceRange?.start?.gross?.amount || 0}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
