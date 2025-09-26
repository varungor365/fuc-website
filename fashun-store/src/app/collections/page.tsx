'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  HeartIcon,
  StarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Mock products data for stable testing - More like Bewakoof/TSS
const mockProducts = [
  {
    id: '1',
    name: 'Oversized Graphic Tee - Neon Dreams',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    description: 'Premium cotton oversized fit with vibrant neon graphics',
    image: '/api/placeholder/400/500',
    category: 'T-Shirts',
    badge: 'BESTSELLER',
    rating: 4.8,
    reviews: 2847,
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '2',
    name: 'Urban Street Hoodie - Tokyo Vibes',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    description: 'Comfortable oversized hoodie with Japanese street art',
    image: '/api/placeholder/400/500',
    category: 'Hoodies',
    badge: 'NEW',
    rating: 4.6,
    reviews: 1523,
    colors: ['Black', 'Gray', 'Maroon'],
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: '3',
    name: 'Vintage Band Tee - Classic Rock',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    description: 'Retro band merchandise with distressed finish',
    image: '/api/placeholder/400/500',
    category: 'T-Shirts',
    badge: 'TRENDING',
    rating: 4.7,
    reviews: 987,
    colors: ['Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '4',
    name: 'Cargo Joggers - Street Edition',
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    description: 'Comfortable cargo joggers with multiple pockets',
    image: '/api/placeholder/400/500',
    category: 'Pants',
    badge: 'LIMITED',
    rating: 4.5,
    reviews: 756,
    colors: ['Black', 'Olive', 'Gray'],
    sizes: ['28', '30', '32', '34', '36']
  },
  {
    id: '5',
    name: 'Anime Print Oversized Shirt',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    description: 'Trendy anime-inspired graphic print shirt',
    image: '/api/placeholder/400/500',
    category: 'Shirts',
    badge: 'HOT',
    rating: 4.9,
    reviews: 634,
    colors: ['White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '6',
    name: 'Denim Bomber Jacket - Vintage Wash',
    price: 2999,
    originalPrice: 3999,
    discount: 25,
    description: 'Premium denim bomber with vintage stone wash',
    image: '/api/placeholder/400/500',
    category: 'Jackets',
    badge: 'EXCLUSIVE',
    rating: 4.8,
    reviews: 445,
    colors: ['Blue', 'Black'],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '7',
    name: 'Minimalist Logo Tee',
    price: 699,
    originalPrice: 999,
    discount: 30,
    description: 'Clean minimal design with small logo placement',
    image: '/api/placeholder/400/500',
    category: 'T-Shirts',
    badge: 'EVERYDAY',
    rating: 4.4,
    reviews: 1876,
    colors: ['Black', 'White', 'Gray', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: '8',
    name: 'Streetwear Zip Hoodie - Graffiti',
    price: 2199,
    originalPrice: 2799,
    discount: 21,
    description: 'Full-zip hoodie with graffiti art print',
    image: '/api/placeholder/400/500',
    category: 'Hoodies',
    badge: 'ARTIST',
    rating: 4.6,
    reviews: 892,
    colors: ['Black', 'White'],
    sizes: ['M', 'L', 'XL', 'XXL']
  }
];

const categories = [
  { name: 'All', count: 5000 },
  { name: 'T-Shirts', count: 2500 },
  { name: 'Hoodies', count: 800 },
  { name: 'Shirts', count: 1200 },
  { name: 'Pants', count: 900 },
  { name: 'Jackets', count: 600 }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Gray', 'Navy', 'Maroon', 'Olive'];
const priceRanges = [
  { label: 'Under ₹1000', min: 0, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
  { label: 'Above ₹3000', min: 3000, max: 10000 }
];

const sortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Customer Rating', value: 'rating' }
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  // Filter products based on selected category
  const filteredProducts = mockProducts.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Collections</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Streetwear Collections
              </h1>
              <p className="text-lg text-gray-300">
                {filteredProducts.length} products found
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
              
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-black">
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 space-y-6`}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-400">({category.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.label}
                        checked={selectedPriceRange === range.label}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-transparent border-gray-400 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4">Sizes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSizes(prev => 
                          prev.includes(size) 
                            ? prev.filter(s => s !== size)
                            : [...prev, size]
                        );
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-white/20 text-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Colors</h3>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColors(prev => 
                          prev.includes(color) 
                            ? prev.filter(c => c !== color)
                            : [...prev, color]
                        );
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColors.includes(color)
                          ? 'border-purple-400 scale-110'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'gray' ? '#6b7280' :
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                       color.toLowerCase() === 'maroon' ? '#7f1d1d' :
                                       '#84cc16'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className={`group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 product-card ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    data-testid="product-card"
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 h-48' : 'aspect-[4/5]'
                    }`}>
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-gray-500 text-6xl">👕</div>
                      </div>
                      
                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                          product.badge === 'BESTSELLER' ? 'bg-green-500 text-white' :
                          product.badge === 'NEW' ? 'bg-blue-500 text-white' :
                          product.badge === 'TRENDING' ? 'bg-red-500 text-white' :
                          product.badge === 'LIMITED' ? 'bg-orange-500 text-white' :
                          product.badge === 'HOT' ? 'bg-red-600 text-white' :
                          product.badge === 'EXCLUSIVE' ? 'bg-purple-500 text-white' :
                          product.badge === 'EVERYDAY' ? 'bg-gray-500 text-white' :
                          'bg-pink-500 text-white'
                        }`}>
                          {product.badge}
                        </span>
                      </div>

                      {/* Discount */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}% OFF
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                          <HeartIcon className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 bg-purple-600 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-400 mr-2">
                          <StarIcon className="w-4 h-4 fill-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                      </div>

                      {/* Colors & Sizes */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Colors:</span>
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color, idx) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{
                                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                                 color.toLowerCase() === 'black' ? '#000000' :
                                                 color.toLowerCase() === 'gray' ? '#6b7280' :
                                                 color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                                 color.toLowerCase() === 'maroon' ? '#7f1d1d' :
                                                 '#84cc16'
                                }}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-gray-400">+{product.colors.length - 3}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">Sizes:</span>
                          <span className="text-xs text-white">{product.sizes.join(', ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-white">
                            ₹{product.price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        
                        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-16">
              <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300">
                Load More Products ({mockProducts.length - filteredProducts.length} more)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}