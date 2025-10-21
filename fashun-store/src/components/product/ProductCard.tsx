'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeartIcon, EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { HolographicCard } from '@/components/ui/holographic-card';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isSale?: boolean;
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [isHovered, setIsHovered] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here
    console.log('Quick view:', product.id);
  };

  return (
    <HolographicCard containerClassName={className}>
      <motion.div
        className="group relative bg-gradient-to-br from-white/80 via-white/60 to-white/80 backdrop-blur-xl rounded-2xl overflow-hidden"
        whileHover={{ y: -4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                New
              </span>
            )}
            {product.isSale && discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              onClick={handleWishlistToggle}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isWishlisted ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-neutral-600" />
              )}
            </motion.button>

            <motion.button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <EyeIcon className="w-5 h-5 text-neutral-600" />
            </motion.button>
          </div>

          {/* Quick Add to Cart - Shown on Hover */}
          <motion.div
            className="absolute bottom-3 left-3 right-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={handleAddToCart}
              className="w-full bg-primary-500 text-white font-medium py-3 rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBagIcon className="w-4 h-4" />
              Quick Add
            </motion.button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500 uppercase tracking-wide font-medium">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-yellow-500">★</span>
                <span className="text-xs text-neutral-600">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-neutral-500">Colors:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color);
                    }}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-primary-500 scale-110' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-neutral-400 ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-neutral-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
    </HolographicCard>
  );
};

export default ProductCard;