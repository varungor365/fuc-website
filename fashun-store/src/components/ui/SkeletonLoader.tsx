'use client';

import { motion } from 'framer-motion';

export const ProductCardSkeleton = () => (
  <div className="bg-gray-800/50 rounded-2xl overflow-hidden">
    <motion.div 
      className="h-80 bg-gradient-to-r from-gray-700 to-gray-600"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <div className="p-4 space-y-3">
      <motion.div 
        className="h-4 bg-gray-700 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
      />
      <motion.div 
        className="h-4 bg-gray-700 rounded w-1/2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
