'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface QuickViewProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    description: string;
    rating?: number;
    reviewCount?: number;
    sizes?: string[];
    colors?: { name: string; hex: string }[];
    inStock: boolean;
    badge?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
      setCurrentImageIndex(0);
      setIsAddedToCart(false);
      setQuantity(1);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, product]);

  const handleAddToCart = () => {
    // TODO: Integrate with actual cart system
    console.log('Adding to cart:', {
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-6xl glass-gradient-frosted rounded-3xl border border-white/20 shadow-gradient-glow overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full glass-gradient-dark border border-white/20 hover:bg-white/20 transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <div className="grid md:grid-cols-2 gap-8 p-8">
                  {/* Left: Image Gallery */}
                  <div className="relative">
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4 z-10 px-4 py-2 btn-gradient-primary rounded-full text-white font-bold text-sm shadow-gradient-neon">
                        {product.badge}
                      </div>
                    )}

                    {/* Main Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 mb-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={product.images[currentImageIndex]}
                            alt={`${product.name} - View ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {/* Image Navigation */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-gradient-dark border border-white/20 hover:bg-white/20 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 text-white" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-gradient-dark border border-white/20 hover:bg-white/20 transition-all"
                          >
                            <ChevronRight className="w-5 h-5 text-white" />
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-gradient-dark border border-white/20 text-white text-sm font-medium">
                          {currentImageIndex + 1} / {product.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === index
                                ? 'border-orange-500 scale-95'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Product Details */}
                  <div className="flex flex-col">
                    {/* Product Title & Rating */}
                    <div className="mb-4">
                      <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                        {product.name}
                      </h2>
                      
                      {product.rating && (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
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
                            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gradient-primary">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-xl text-gray-500 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                              {discount}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Color Selection */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-white font-bold mb-3">
                          Color: <span className="text-orange-400">{selectedColor}</span>
                        </label>
                        <div className="flex gap-3">
                          {product.colors.map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(color.name)}
                              className={`w-12 h-12 rounded-full border-4 transition-all ${
                                selectedColor === color.name
                                  ? 'border-orange-500 scale-110'
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-white font-bold mb-3">
                          Size: <span className="text-orange-400">{selectedSize}</span>
                        </label>
                        <div className="flex gap-3 flex-wrap">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                                selectedSize === size
                                  ? 'btn-gradient-primary text-white shadow-gradient-neon'
                                  : 'glass-gradient-dark text-white border border-white/20 hover:border-orange-500'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-white font-bold mb-3">Quantity</label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 rounded-xl glass-gradient-dark border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-white w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 h-12 rounded-xl glass-gradient-dark border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                      {product.inStock ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">In Stock - Ships in 24 hours</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <X className="w-5 h-5" />
                          <span className="font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-auto">
                      <button
                        onClick={handleAddToCart}
                        disabled={!product.inStock || !selectedSize}
                        className="flex-1 btn-gradient-primary text-white font-bold py-4 rounded-xl hover-gradient-lift transition-all shadow-gradient-neon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                      >
                        {isAddedToCart ? (
                          <>
                            <Check className="w-6 h-6" />
                            Added to Cart!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-6 h-6" />
                            Add to Cart
                          </>
                        )}
                      </button>
                      
                      <button
                        className="p-4 rounded-xl glass-gradient-dark border border-white/20 text-white hover:text-orange-400 hover:border-orange-500 transition-all"
                        title="Add to Wishlist"
                      >
                        <Heart className="w-6 h-6" />
                      </button>
                    </div>

                    {/* View Full Details Link */}
                    <Link
                      href={`/products/${product.id}`}
                      className="mt-6 text-center text-orange-400 hover:text-orange-300 font-bold transition-colors"
                    >
                      View Full Product Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
