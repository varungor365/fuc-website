'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  category?: string;
}

interface CompleteTheLookProps {
  currentProduct: Product;
  recommendations: Product[];
  onAddToCart?: (productId: string) => void;
}

export default function CompleteTheLook({ currentProduct, recommendations, onAddToCart }: CompleteTheLookProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Complete the <span className="text-gradient-primary">Look</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Style it up with these complementary pieces that go perfectly with your selection
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {recommendations.map((product, index) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-gradient-frosted rounded-2xl border border-white/10 overflow-hidden hover-gradient-lift transition-all">
                  {/* Product Image */}
                  <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                        {discount}% OFF
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onAddToCart?.(product.id);
                        }}
                        className="p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full hover:scale-110 transition-transform shadow-gradient-neon"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to wishlist logic
                        }}
                        className="p-4 bg-white/10 backdrop-blur-sm text-white rounded-full hover:scale-110 hover:bg-white/20 transition-all border border-white/20"
                        title="Add to Wishlist"
                      >
                        <Heart className="w-6 h-6" />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    {/* Category */}
                    {product.category && (
                      <p className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">
                        {product.category}
                      </p>
                    )}

                    {/* Product Name */}
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-xl font-black text-white mb-3 line-clamp-2 hover:text-orange-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating!)
                                  ? 'fill-orange-400 text-orange-400'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl font-black text-gradient-primary">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => onAddToCart?.(product.id)}
                      className="w-full btn-gradient-primary text-white font-bold py-3 rounded-xl hover-gradient-lift transition-all shadow-gradient-neon flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bundle Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 glass-gradient-frosted rounded-2xl border border-white/10 text-center"
        >
          <h3 className="text-2xl font-black text-white mb-3">
            🎁 Bundle & Save
          </h3>
          <p className="text-gray-300 mb-4">
            Add all these items to your cart and get an extra <span className="text-orange-400 font-bold">10% OFF</span> on your entire order!
          </p>
          <button
            onClick={() => {
              // Add all to cart logic
              recommendations.forEach(product => onAddToCart?.(product.id));
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover-gradient-lift transition-all shadow-gradient-neon"
          >
            Add All to Cart - Save More! 🔥
          </button>
        </motion.div>
      </div>
    </section>
  );
}
