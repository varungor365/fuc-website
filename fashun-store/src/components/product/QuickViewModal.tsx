'use client';

import * as React from 'react';
import { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: Array<{ name: string; value: string; image?: string }>;
  sizes: Array<{ name: string; available: boolean }>;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount?: number;
}

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', {
      productId: product.id,
      color: product.colors[selectedColor],
      size: selectedSize,
      quantity
    });
    onClose();
  };

  const currentImage = product.colors[selectedColor]?.image || product.images[selectedImage] || product.images[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Product Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwSDI1MFYyNTBIMTUwVjE1MFoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                      }}
                    />
                  </div>

                  {/* Thumbnail Images */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2">
                      {product.images.slice(0, 4).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImage === index
                              ? 'border-primary-500'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0zMCAzMEg1MFY1MEgzMFYzMFoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                            }}
                          />
                        </button>
                      ))}
                      {product.images.length > 4 && (
                        <div className="w-20 h-20 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 text-sm font-medium">
                          +{product.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary-400">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">
                      Color: {product.colors[selectedColor].name}
                    </h3>
                    <div className="flex gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(index)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            selectedColor === index
                              ? 'border-primary-500 scale-110'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size.name}
                          onClick={() => setSelectedSize(size.name)}
                          disabled={!size.available}
                          className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                            selectedSize === size.name
                              ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                              : size.available
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                              : 'border-gray-700 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-3">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-600 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-400" />
                        </button>
                        <span className="px-4 py-2 text-white font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      {product.stockCount && (
                        <span className="text-sm text-gray-400">
                          {product.stockCount} in stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock || !selectedSize}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-3 border rounded-lg transition-colors ${
                        isWishlisted
                          ? 'border-red-500 bg-red-500/20 text-red-400'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <Heart className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Truck className="w-4 h-4 text-primary-400" />
                      <span>Free shipping on orders over $100</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <RotateCcw className="w-4 h-4 text-primary-400" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Shield className="w-4 h-4 text-primary-400" />
                      <span>2-year warranty included</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-white mb-2">Description</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;