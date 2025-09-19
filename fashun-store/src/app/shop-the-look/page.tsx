'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Share2, 
  ShoppingBag, 
  Eye,
  Filter,
  Grid3X3,
  List,
  Instagram,
  TrendingUp,
  Users,
  Star,
  MapPin,
  Tag,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  brand?: string;
}

interface Hotspot {
  x: number;
  y: number;
  product: Product;
}

interface LookbookPost {
  id: number;
  title: string;
  description: string;
  image: string;
  author: {
    username: string;
    avatar: string;
    isVerified?: boolean;
  };
  hotspots: Hotspot[];
  featured_products: Product[];
  instagram_post_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_featured: boolean;
  category: string;
  tags: string[];
  estimated_price: number;
  style_notes?: string;
  created_at: string;
}

interface UGCPost {
  id: number;
  caption: string;
  media: string[];
  author: {
    username: string;
    avatar: string;
  };
  hashtags: string[];
  featured_products: Product[];
  social_platform: string;
  likes_count: number;
  style_category: string;
  outfit_rating: number;
  location?: string;
  submission_date: string;
}

// Mock Data
const mockLookbooks: LookbookPost[] = [
  {
    id: 1,
    title: "Urban Street Vibes",
    description: "Perfect streetwear combo for city adventures",
    image: "/api/placeholder/600/800",
    author: {
      username: "stylecrewofficial",
      avatar: "/api/placeholder/40/40",
      isVerified: true
    },
    hotspots: [
      {
        x: 30,
        y: 20,
        product: {
          id: 1,
          name: "FUC! Oversized Hoodie",
          price: 89.99,
          image: "/api/placeholder/200/200",
          brand: "FUC!"
        }
      },
      {
        x: 40,
        y: 70,
        product: {
          id: 2,
          name: "Cargo Pants",
          price: 129.99,
          image: "/api/placeholder/200/200",
          brand: "Street Essentials"
        }
      }
    ],
    featured_products: [],
    likes_count: 1250,
    comments_count: 89,
    shares_count: 156,
    is_featured: true,
    category: "street",
    tags: ["urban", "hoodie", "cargo", "streetwear"],
    estimated_price: 219.98,
    style_notes: "Mix textures and oversized fits for that perfect street aesthetic",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Minimalist Chic",
    description: "Clean lines and neutral tones",
    image: "/api/placeholder/600/900",
    author: {
      username: "minimalfashion",
      avatar: "/api/placeholder/40/40"
    },
    hotspots: [
      {
        x: 50,
        y: 35,
        product: {
          id: 3,
          name: "Essential White Tee",
          price: 49.99,
          image: "/api/placeholder/200/200",
          brand: "Basics Co."
        }
      }
    ],
    featured_products: [],
    likes_count: 892,
    comments_count: 34,
    shares_count: 67,
    is_featured: false,
    category: "casual",
    tags: ["minimal", "white", "clean", "basics"],
    estimated_price: 149.97,
    created_at: "2024-01-14T15:30:00Z"
  }
];

const mockUGC: UGCPost[] = [
  {
    id: 1,
    caption: "Living my best life in @fucfashion! The quality is unmatched 🔥",
    media: ["/api/placeholder/400/600", "/api/placeholder/400/400"],
    author: {
      username: "fashionista_alex",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#fucfashion", "#streetstyle", "#ootd", "#fashioninspo"],
    featured_products: [
      {
        id: 4,
        name: "FUC! Graphic Tee",
        price: 59.99,
        image: "/api/placeholder/200/200"
      }
    ],
    social_platform: "instagram",
    likes_count: 456,
    style_category: "street",
    outfit_rating: 4.8,
    location: "New York, NY",
    submission_date: "2024-01-16T09:15:00Z"
  },
  {
    id: 2,
    caption: "Weekend vibes ✨ Thanks @fucfashion for keeping me stylish!",
    media: ["/api/placeholder/500/700"],
    author: {
      username: "style_maven",
      avatar: "/api/placeholder/40/40"
    },
    hashtags: ["#weekendstyle", "#comfortable", "#chic"],
    featured_products: [],
    social_platform: "instagram",
    likes_count: 234,
    style_category: "casual",
    outfit_rating: 4.5,
    submission_date: "2024-01-15T18:45:00Z"
  }
];

// Product Hotspot Component
const ProductHotspot: React.FC<{
  hotspot: Hotspot;
  onClick: () => void;
  isVisible: boolean;
}> = ({ hotspot, onClick, isVisible }) => (
  <motion.div
    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}
    style={{
      left: `${hotspot.x}%`,
      top: `${hotspot.y}%`,
    }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-black">
        <Plus className="w-4 h-4 text-black" />
      </div>
      <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-full animate-ping opacity-25" />
    </div>
  </motion.div>
);

// Product Modal Component
const ProductModal: React.FC<{
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}> = ({ product, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-sm w-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold">{product.name}</h3>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mb-4">
            <p className="text-2xl font-bold">${product.price}</p>
            {product.brand && (
              <p className="text-gray-600">{product.brand}</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Lookbook Card Component
const LookbookCard: React.FC<{
  post: LookbookPost;
  onProductClick: (product: Product) => void;
}> = ({ post, onProductClick }) => {
  const [showHotspots, setShowHotspots] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
        onMouseEnter={() => setShowHotspots(true)}
        onMouseLeave={() => setShowHotspots(false)}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          showHotspots ? 'opacity-20' : 'opacity-0'
        }`} />
        
        {/* Hotspots */}
        {post.hotspots.map((hotspot, index) => (
          <ProductHotspot
            key={index}
            hotspot={hotspot}
            isVisible={showHotspots}
            onClick={() => onProductClick(hotspot.product)}
          />
        ))}
        
        {/* Featured Badge */}
        {post.is_featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-black px-3 py-1 rounded-full text-xs font-medium capitalize">
          {post.category}
        </div>
        
        {/* Instagram Link */}
        {post.instagram_post_url && (
          <Link
            href={post.instagram_post_url}
            target="_blank"
            className="absolute bottom-4 right-4 bg-pink-500 p-2 rounded-full text-white hover:bg-pink-600 transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </Link>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar}
              alt={post.author.username}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">@{post.author.username}</span>
              {post.author.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Title & Description */}
        <h3 className="font-bold text-lg mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{post.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.comments_count}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-4 h-4" />
              {post.shares_count}
            </span>
          </div>
          <div className="text-sm font-bold">
            ~${post.estimated_price}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 mx-auto ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Shop Look
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// UGC Card Component
const UGCCard: React.FC<{
  post: UGCPost;
}> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === post.media.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? post.media.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Media Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={post.media[currentMediaIndex]}
          alt={post.caption}
          fill
          className="object-cover"
        />
        
        {/* Media Navigation */}
        {post.media.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Media Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {post.media.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMediaIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Platform Badge */}
        <div className="absolute top-4 right-4 bg-pink-500 p-2 rounded-full text-white">
          <Instagram className="w-4 h-4" />
        </div>
        
        {/* Rating */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{post.outfit_rating}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={post.author.avatar}
              alt={post.author.username}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-medium text-sm">@{post.author.username}</span>
            {post.location && (
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">{post.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Caption */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.caption}</p>
        
        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {post.hashtags.slice(0, 3).map((hashtag, index) => (
            <span key={index} className="text-blue-500 text-xs">
              {hashtag}
            </span>
          ))}
        </div>
        
        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes_count}
            </span>
            <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
              {post.style_category}
            </span>
          </div>
          
          {post.featured_products.length > 0 && (
            <button className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition-colors">
              Shop Items
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function ShopTheLookPage() {
  const [activeTab, setActiveTab] = useState<'lookbooks' | 'ugc'>('lookbooks');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lookbooks, setLookbooks] = useState<LookbookPost[]>(mockLookbooks);
  const [ugcPosts, setUGCPosts] = useState<UGCPost[]>(mockUGC);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Styles', icon: Grid3X3 },
    { id: 'street', name: 'Streetwear', icon: TrendingUp },
    { id: 'casual', name: 'Casual', icon: Users },
    { id: 'formal', name: 'Formal', icon: Star },
  ];

  const filteredLookbooks = selectedCategory === 'all' 
    ? lookbooks 
    : lookbooks.filter(post => post.category === selectedCategory);

  const filteredUGC = selectedCategory === 'all'
    ? ugcPosts
    : ugcPosts.filter(post => post.style_category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">Shop the Look</h1>
              
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('lookbooks')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'lookbooks'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Lookbooks
                </button>
                <button
                  onClick={() => setActiveTab('ugc')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'ugc'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Community
                </button>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  isFilterOpen
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-gray-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t overflow-hidden"
              >
                <div className="py-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Categories:</span>
                    <div className="flex gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {category.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'lookbooks' ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {filteredLookbooks.map((post) => (
              <LookbookCard
                key={post.id}
                post={post}
                onProductClick={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {filteredUGC.map((post) => (
              <UGCCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct!}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
