'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, ShoppingCart } from 'lucide-react';
import { BundleService } from '@/services/medusa/bundle.service';
import { useMedusaCart } from '@/hooks/useMedusaCart';
import { playSound } from '@/lib/sound-effects';
import toast from 'react-hot-toast';

export default function BundleRecommendation({ productId }: { productId: string }) {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useMedusaCart();

  useEffect(() => {
    loadBundles();
  }, [productId]);

  const loadBundles = async () => {
    const suggestions = await BundleService.suggestBundle(productId);
    setBundles(suggestions);
    setLoading(false);
  };

  const addBundleToCart = async (bundleProduct: any) => {
    try {
      await addItem(bundleProduct.variants[0].id, 1);
      playSound('addToCart');
      toast.success(`Added ${bundleProduct.title} to cart with 15% discount!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading || bundles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mt-8"
    >
      <div className="flex items-center mb-4">
        <Package className="w-6 h-6 text-purple-600 mr-2" />
        <h3 className="text-xl font-bold">Complete Your Look</h3>
        <span className="ml-auto bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Save 15%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bundles.slice(0, 3).map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <img
              src={product.thumbnail || '/placeholder.png'}
              alt={product.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h4 className="font-semibold text-sm mb-2">{product.title}</h4>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-gray-400 line-through text-sm">
                  ₹{(product.variants[0].prices[0].amount / 100).toFixed(0)}
                </span>
                <span className="text-purple-600 font-bold ml-2">
                  ₹{(product.bundlePrice / 100).toFixed(0)}
                </span>
              </div>
            </div>
            <button
              onClick={() => addBundleToCart(product)}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Bundle
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
