'use client';

import { X, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full rounded-2xl" />
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-purple-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {product.colors?.map((color: string, i: number) => (
                    <button key={i} className="w-8 h-8 rounded-full border-2 border-gray-300" style={{ backgroundColor: color }} />
                  ))}
                </div>

                <div className="flex gap-2">
                  {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-600 hover:text-purple-600">
                      {size}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:text-blue-500">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
