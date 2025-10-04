'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  image?: string;
  stock: number;
}

interface SizeVariant {
  id: string;
  name: string;
  stock: number;
  price?: number;
}

interface VariantSwatchesProps {
  colors: ColorVariant[];
  sizes: SizeVariant[];
  selectedColor?: string;
  selectedSize?: string;
  onColorSelect: (colorId: string) => void;
  onSizeSelect: (sizeId: string) => void;
  className?: string;
}

export default function VariantSwatches({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  className = ''
}: VariantSwatchesProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Color Variants */}
      {colors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Color: {colors.find(c => c.id === selectedColor)?.name || 'Select Color'}
          </h4>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <motion.button
                key={color.id}
                onClick={() => onColorSelect(color.id)}
                className={`relative w-10 h-10 rounded-full border-2 overflow-hidden ${
                  selectedColor === color.id
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-gray-300 hover:border-gray-400'
                } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                disabled={color.stock === 0}
                title={`${color.name} ${color.stock === 0 ? '- Out of Stock' : ''}`}
              >
                {color.image ? (
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.colorCode }}
                  />
                )}
                
                {selectedColor === color.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                
                {color.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-0.5 bg-red-500 rotate-45" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Size Variants */}
      {sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Size: {sizes.find(s => s.id === selectedSize)?.name || 'Select Size'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <motion.button
                key={size.id}
                onClick={() => onSizeSelect(size.id)}
                className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  selectedSize === size.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed line-through' : 'cursor-pointer'}`}
                whileTap={{ scale: 0.98 }}
                whileHover={size.stock > 0 ? { scale: 1.02 } : {}}
                disabled={size.stock === 0}
                title={`${size.name} ${size.stock === 0 ? '- Out of Stock' : `- ${size.stock} in stock`}`}
              >
                {size.name}
                {size.price && (
                  <span className="ml-1 text-xs">
                    (+₹{size.price})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Link */}
      <div className="flex items-center justify-between text-sm">
        <button className="text-primary-600 hover:text-primary-700 underline">
          Size Guide
        </button>
        {selectedSize && (
          <span className="text-gray-600">
            {sizes.find(s => s.id === selectedSize)?.stock} in stock
          </span>
        )}
      </div>
    </div>
  );
}