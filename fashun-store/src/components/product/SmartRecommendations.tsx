'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  StarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  discount?: number;
}

interface RecommendationSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  reason: string;
  algorithm: 'ai' | 'trending' | 'similar' | 'personalized' | 'social';
}

interface SmartRecommendationsProps {
  currentProduct: Product;
  userPreferences?: {
    style: string[];
    priceRange: [number, number];
    favoriteColors: string[];
    favoriteCategories: string[];
  };
  userHistory?: Product[];
  className?: string;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  currentProduct,
  userPreferences,
  userHistory = [],
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);

  // Simulate AI-powered recommendation generation
  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: RecommendationSection[] = [
        {
          id: 'ai-personalized',
          title: 'AI Picked For You',
          subtitle: 'Based on your style DNA',
          icon: <SparklesIcon className="w-5 h-5" />,
          reason: 'Our AI analyzed your preferences and found these perfect matches',
          algorithm: 'ai',
          products: generateMockProducts(6, 'ai')
        },
        {
          id: 'similar-style',
          title: 'Similar Styles',
          subtitle: 'Customers also loved',
          icon: <HeartIcon className="w-5 h-5" />,
          reason: 'Based on the style and features of your current selection',
          algorithm: 'similar',
          products: generateMockProducts(6, 'similar')
        },
        {
          id: 'trending',
          title: 'Trending Now',
          subtitle: 'Popular this week',
          icon: <ArrowTrendingUpIcon className="w-5 h-5" />,
          reason: 'Most popular items trending in your style category',
          algorithm: 'trending',
          products: generateMockProducts(6, 'trending')
        },
        {
          id: 'social',
          title: 'Social Favorites',
          subtitle: 'Instagram favorites',
          icon: <UserGroupIcon className="w-5 h-5" />,
          reason: 'Most shared and loved items on social media',
          algorithm: 'social',
          products: generateMockProducts(6, 'social')
        }
      ];
      
      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    generateRecommendations();
  }, [currentProduct, userPreferences, userHistory]);

  const generateMockProducts = (count: number, type: string): Product[] => {
    const baseProducts = [
      {
        name: 'Premium Cotton Hoodie',
        category: 'hoodies',
        colors: ['black', 'white', 'navy', 'gray'],
        basePrice: 2999
      },
      {
        name: 'Vintage Graphic Tee',
        category: 'tshirts',
        colors: ['white', 'black', 'blue'],
        basePrice: 1299
      },
      {
        name: 'Streetwear Joggers',
        category: 'pants',
        colors: ['black', 'gray', 'navy'],
        basePrice: 2199
      },
      {
        name: 'Oversized Denim Jacket',
        category: 'jackets',
        colors: ['blue', 'black', 'white'],
        basePrice: 3499
      },
      {
        name: 'Minimalist Crewneck',
        category: 'sweatshirts',
        colors: ['beige', 'white', 'gray'],
        basePrice: 2799
      },
      {
        name: 'Designer Cargo Pants',
        category: 'pants',
        colors: ['khaki', 'black', 'olive'],
        basePrice: 2899
      }
    ];

    return Array.from({ length: count }, (_, index) => {
      const baseProduct = baseProducts[index % baseProducts.length];
      const hasDiscount = Math.random() > 0.6;
      const discount = hasDiscount ? Math.floor(Math.random() * 40) + 10 : 0;
      const price = baseProduct.basePrice - (baseProduct.basePrice * discount / 100);
      
      return {
        id: `${type}-${index + 1}`,
        name: `${baseProduct.name} ${index + 1}`,
        price: Math.round(price),
        originalPrice: hasDiscount ? baseProduct.basePrice : undefined,
        image: `/api/placeholder/300/400?text=${baseProduct.name.replace(' ', '+')}`,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        category: baseProduct.category,
        colors: baseProduct.colors,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        inStock: Math.random() > 0.1,
        isNew: type === 'trending' && Math.random() > 0.5,
        isTrending: type === 'trending',
        discount: hasDiscount ? discount : undefined
      };
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlisted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.isTrending && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <FireIcon className="w-3 h-3" />
              TRENDING
            </span>
          )}
          {product.discount && (
            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {wishlisted.has(product.id) ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-neutral-700" />
          )}
        </motion.button>

        {/* Quick Add Button */}
        <motion.button
          className="absolute bottom-3 left-3 right-3 bg-black text-white py-2 px-4 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBagIcon className="w-4 h-4 inline mr-2" />
          Quick Add
        </motion.button>

        {/* Color Swatches */}
        <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-white shadow-sm"
              style={{ 
                backgroundColor: color === 'white' ? '#f5f5f5' : color,
                borderColor: color === 'white' ? '#d1d5db' : 'white'
              }}
            />
          ))}
          {product.colors.length > 3 && (
            <div className="w-4 h-4 rounded-full bg-neutral-200 border border-white text-xs flex items-center justify-center text-neutral-600">
              +{product.colors.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarSolidIcon
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {!product.inStock && (
            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const SectionHeader: React.FC<{ section: RecommendationSection; isActive: boolean }> = ({ 
    section, 
    isActive 
  }) => (
    <motion.button
      onClick={() => setActiveSection(recommendations.findIndex(r => r.id === section.id))}
      className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
        isActive 
          ? 'bg-primary-50 border-2 border-primary-200 text-primary-700' 
          : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isActive ? 'bg-primary-100' : 'bg-neutral-100'
      }`}>
        {section.icon}
      </div>
      
      <div className="flex-1 text-left">
        <h3 className="font-semibold">{section.title}</h3>
        <p className="text-sm opacity-70">{section.subtitle}</p>
      </div>
      
      <ChevronRightIcon className="w-5 h-5" />
    </motion.button>
  );

  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"></div>
          <h2 className="heading-3 mb-2">Analyzing Your Style</h2>
          <p className="text-neutral-600">Our AI is finding the perfect recommendations for you...</p>
        </div>
      </div>
    );
  }

  const activeRecommendation = recommendations[activeSection];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="heading-2 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Smart Recommendations
        </motion.h2>
        <motion.p 
          className="text-neutral-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Powered by AI to understand your unique style and preferences
        </motion.p>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((section, index) => (
          <SectionHeader
            key={section.id}
            section={section}
            isActive={index === activeSection}
          />
        ))}
      </div>

      {/* Active Section */}
      <AnimatePresence mode="wait">
        {activeRecommendation && (
          <motion.div
            key={activeRecommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Section Description */}
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                  {activeRecommendation.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {activeRecommendation.title}
                  </h3>
                  <p className="text-neutral-600">
                    {activeRecommendation.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeRecommendation.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center">
              <motion.button
                className="btn btn-primary btn-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View All {activeRecommendation.title}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartRecommendations;