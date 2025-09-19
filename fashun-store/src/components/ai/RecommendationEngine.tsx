'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SparklesIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// Types for our recommendation system
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
}

interface RecommendationReason {
  type: 'browsing_history' | 'similar_users' | 'trending' | 'style_match' | 'size_fit';
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface RecommendationProps {
  products: Product[];
  reason: RecommendationReason;
  title: string;
  subtitle?: string;
  userId?: string;
  className?: string;
}

// Mock AI recommendation logic
const generateRecommendations = (
  userId?: string,
  currentProduct?: Product,
  userPreferences?: any
): Product[] => {
  // Mock products for demonstration
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Urban Nexus Hoodie',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/400/500',
      rating: 4.8,
      reviewCount: 124,
      category: 'hoodies',
      tags: ['streetwear', 'urban', 'comfortable'],
      isTrending: true
    },
    {
      id: '2',
      name: 'Minimalist Blend Tee',
      price: 34.99,
      image: '/api/placeholder/400/500',
      rating: 4.6,
      reviewCount: 89,
      category: 'tshirts',
      tags: ['minimal', 'basic', 'versatile'],
      isNew: true
    },
    {
      id: '3',
      name: 'Denim Fusion Jacket',
      price: 149.99,
      originalPrice: 199.99,
      image: '/api/placeholder/400/500',
      rating: 4.9,
      reviewCount: 67,
      category: 'jackets',
      tags: ['denim', 'vintage', 'layering']
    },
    {
      id: '4',
      name: 'Tech Joggers Pro',
      price: 79.99,
      image: '/api/placeholder/400/500',
      rating: 4.7,
      reviewCount: 156,
      category: 'pants',
      tags: ['athletic', 'tech', 'comfortable'],
      isTrending: true
    }
  ];

  // Simulate AI logic - in reality this would call ML APIs
  return mockProducts.slice(0, 4);
};

// Product Card Component with AI insights
const AIProductCard: React.FC<{ 
  product: Product; 
  reason: RecommendationReason;
  onAddToWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
  isWishlisted: boolean;
}> = ({ product, reason, onAddToWishlist, onQuickView, isWishlisted }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  return (
    <motion.div
      className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* AI Recommendation Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-white">
          <reason.icon className="w-3 h-3" />
          <span>AI Pick</span>
        </div>
      </div>

      {/* Product Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1">
        {product.isNew && (
          <span className="bg-green-500/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white">
            New
          </span>
        )}
        {product.isTrending && (
          <span className="bg-orange-500/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-white">
            Trending
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                className="btn btn-glass btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EyeIcon className="w-4 h-4" />
                Quick View
              </motion.button>
              <motion.button
                className={`btn btn-sm ${
                  isWishlisted ? 'btn-accent' : 'btn-ghost'
                } text-white border-white/30`}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToWishlist(product.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-white/80">{product.rating}</span>
          </div>
          <span className="text-xs text-white/60">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-white/60 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* AI Reason */}
        <div className="bg-white/5 rounded-lg p-2 border border-white/10">
          <div className="flex items-center space-x-2">
            <reason.icon className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-white/80">{reason.text}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Recommendation Engine Component
const RecommendationEngine: React.FC<RecommendationProps> = ({
  products: initialProducts,
  reason,
  title,
  subtitle,
  userId,
  className = ''
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading recommendations
  useEffect(() => {
    if (initialProducts.length === 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const recommendations = generateRecommendations(userId);
        setProducts(recommendations);
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userId, initialProducts]);

  const handleAddToWishlist = (productId: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleQuickView = (productId: string) => {
    // TODO: Implement quick view modal
    console.log('Quick view:', productId);
  };

  const handleRefreshRecommendations = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newRecommendations = generateRecommendations(userId);
      setProducts(newRecommendations);
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse"></div>
            {subtitle && <div className="h-4 w-48 bg-white/5 rounded animate-pulse"></div>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/5] bg-white/10"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/5 rounded w-3/4"></div>
                <div className="h-6 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h2 className="heading-2 text-white">{title}</h2>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SparklesIcon className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
          {subtitle && (
            <p className="body-large text-white/70">{subtitle}</p>
          )}
        </div>

        <motion.button
          className="btn btn-ghost text-white border-white/30 hover:bg-white/10"
          onClick={handleRefreshRecommendations}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          <SparklesIcon className="w-4 h-4" />
          Refresh
        </motion.button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AIProductCard
              product={product}
              reason={reason}
              onAddToWishlist={handleAddToWishlist}
              onQuickView={handleQuickView}
              isWishlisted={wishlistedItems.has(product.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* AI Insights Footer */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-3 mb-3">
          <SparklesIcon className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">AI Insights</h3>
        </div>
        <p className="text-sm text-white/70">
          These recommendations are powered by our AI engine that analyzes your style preferences, 
          browsing history, and trends from similar users to suggest products you'll love.
        </p>
      </div>
    </div>
  );
};

// Predefined recommendation reasons
export const RECOMMENDATION_REASONS = {
  BROWSING_HISTORY: {
    type: 'browsing_history' as const,
    text: 'Based on your recent browsing',
    icon: EyeIcon
  },
  SIMILAR_USERS: {
    type: 'similar_users' as const,
    text: 'Users like you also loved',
    icon: UserIcon
  },
  TRENDING: {
    type: 'trending' as const,
    text: 'Trending in your style',
    icon: ArrowTrendingUpIcon
  },
  STYLE_MATCH: {
    type: 'style_match' as const,
    text: 'Matches your style profile',
    icon: SparklesIcon
  },
  SIZE_FIT: {
    type: 'size_fit' as const,
    text: 'Perfect fit for your size',
    icon: UserIcon
  }
};

export default RecommendationEngine;