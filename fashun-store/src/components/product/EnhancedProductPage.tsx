'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon, 
  ShareIcon, 
  ShoppingBagIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | '360' | 'lifestyle' | 'detail';
}

interface ProductVariant {
  id: string;
  color: string;
  colorCode: string;
  size: string;
  price: number;
  stock: number;
  images: ProductImage[];
}

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  features: string[];
  care: string[];
  shipping: {
    free: boolean;
    days: string;
  };
  reviews: Review[];
}

const ProductImageGallery: React.FC<{ 
  images: ProductImage[], 
  currentIndex: number, 
  onIndexChange: (index: number) => void 
}> = ({ images, currentIndex, onIndexChange }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden group">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]?.url}
          alt={images[currentIndex]?.alt}
          className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={() => onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeftIcon className="w-5 h-5 text-neutral-700" />
          </motion.button>
          
          <motion.button
            onClick={() => onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRightIcon className="w-5 h-5 text-neutral-700" />
          </motion.button>
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
            <MagnifyingGlassIcon className="w-4 h-4 text-neutral-700" />
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            onClick={() => onIndexChange(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex 
                ? 'border-primary-500 scale-105' 
                : 'border-neutral-200 hover:border-primary-300'
            }`}
            whileHover={{ scale: index === currentIndex ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const SizeGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const sizes = [
    { size: 'XS', chest: '34-36', waist: '28-30', length: '26' },
    { size: 'S', chest: '36-38', waist: '30-32', length: '27' },
    { size: 'M', chest: '38-40', waist: '32-34', length: '28' },
    { size: 'L', chest: '40-42', waist: '34-36', length: '29' },
    { size: 'XL', chest: '42-44', waist: '36-38', length: '30' },
    { size: 'XXL', chest: '44-46', waist: '38-40', length: '31' },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="heading-3">Size Guide</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full">
            ×
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 font-semibold">Size</th>
                <th className="text-left py-3 px-4 font-semibold">Chest (inches)</th>
                <th className="text-left py-3 px-4 font-semibold">Waist (inches)</th>
                <th className="text-left py-3 px-4 font-semibold">Length (inches)</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => (
                <tr key={size.size} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-4 font-medium">{size.size}</td>
                  <td className="py-3 px-4">{size.chest}</td>
                  <td className="py-3 px-4">{size.waist}</td>
                  <td className="py-3 px-4">{size.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
          <h4 className="font-semibold mb-2">How to Measure:</h4>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Chest: Measure around the fullest part of your chest</li>
            <li>• Waist: Measure around your natural waistline</li>
            <li>• Length: Measure from shoulder to hem</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReviewSection: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');
  
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="heading-4">Customer Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <motion.div
            key={review.id}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <StarSolidIcon
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating ? 'text-yellow-500' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-neutral-500">{review.date}</span>
            </div>
            
            <p className="text-neutral-700 mb-3">{review.content}</p>
            
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <button className="hover:text-primary-600 transition-colors">
                Helpful ({review.helpful})
              </button>
              <button className="hover:text-primary-600 transition-colors">
                Report
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EnhancedProductPage: React.FC<{ product: Product }> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');

  const availableSizes = Array.from(new Set(product.variants.map(v => v.size))).sort();

  const currentPrice = selectedVariant.price;
  const originalPrice = product.originalPrice;
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <ProductImageGallery
              images={selectedVariant.images}
              currentIndex={currentImageIndex}
              onIndexChange={setCurrentImageIndex}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-neutral-500 uppercase tracking-wide">
                  {product.brand}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-sm text-neutral-500">{product.category}</span>
              </div>
              
              <h1 className="heading-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <StarSolidIcon
                      key={index}
                      className={`w-5 h-5 ${
                        index < Math.floor(product.rating) ? 'text-yellow-500' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-neutral-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-neutral-900">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <>
                    <span className="text-xl text-neutral-500 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h4 className="font-semibold mb-3">Color: {selectedVariant.color}</h4>
              <div className="flex gap-3">
                {product.variants.filter((v, i, arr) => 
                  arr.findIndex(item => item.color === v.color) === i
                ).map((variant) => (
                  <motion.button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedVariant.color === variant.color
                        ? 'border-primary-500 scale-110 shadow-lg'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                    style={{ backgroundColor: variant.colorCode }}
                    whileHover={{ scale: selectedVariant.color === variant.color ? 1.1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Size</h4>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {availableSizes.map((size) => {
                  const sizeVariant = product.variants.find(v => v.size === size && v.color === selectedVariant.color);
                  const isAvailable = sizeVariant && sizeVariant.stock > 0;
                  
                  return (
                    <motion.button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`py-3 px-4 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : isAvailable
                          ? 'border-neutral-200 hover:border-primary-300'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      }`}
                      whileHover={isAvailable ? { scale: 1.02 } : {}}
                      whileTap={isAvailable ? { scale: 0.98 } : {}}
                    >
                      {size}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-semibold">Quantity:</label>
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-neutral-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-neutral-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  className="flex-1 btn btn-primary btn-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  Add to Cart
                </motion.button>
                
                <motion.button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="btn btn-secondary p-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                </motion.button>
                
                <motion.button
                  className="btn btn-secondary p-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShareIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-neutral-200">
              <div className="text-center">
                <TruckIcon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-neutral-500">On orders over ₹2999</div>
              </div>
              <div className="text-center">
                <ArrowPathIcon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-neutral-500">30 day return policy</div>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                <div className="text-sm font-medium">Authentic</div>
                <div className="text-xs text-neutral-500">100% genuine products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-neutral-200">
            {[
              { id: 'details', label: 'Details' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'shipping', label: 'Shipping' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="heading-4 mb-3">Description</h3>
                    <p className="text-neutral-700 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="heading-4 mb-3">Features</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-neutral-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="heading-4 mb-3">Care Instructions</h3>
                    <ul className="space-y-2">
                      {product.care.map((instruction, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
                          <span className="text-neutral-700">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReviewSection reviews={product.reviews} />
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <h3 className="font-semibold mb-3">Shipping Information</h3>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Free shipping on orders over ₹2,999</li>
                        <li>• Standard delivery: 3-5 business days</li>
                        <li>• Express delivery: 1-2 business days (₹299)</li>
                        <li>• Same day delivery available in select cities</li>
                      </ul>
                    </div>
                    
                    <div className="card p-6">
                      <h3 className="font-semibold mb-3">Return Policy</h3>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• 30-day return window</li>
                        <li>• Free returns for exchanges</li>
                        <li>• Items must be unworn with tags</li>
                        <li>• Refunds processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuide onClose={() => setShowSizeGuide(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedProductPage;