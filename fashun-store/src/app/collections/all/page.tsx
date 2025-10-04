'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  Bars3Icon,
  XMarkIcon,
  EyeIcon,
  HeartIcon,
  ShoppingBagIcon,
  CheckIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

const mockProducts: Product[] = [
  {
    id: 'cyber-punk-hoodie',
    name: 'Cyber Punk Neon Hoodie',
    price: 3299,
    comparePrice: 4199,
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    rating: 4.8,
    reviewCount: 247,
    category: 'Hoodies',
    tags: ['streetwear', 'neon', 'premium'],
    inStock: true
  },
  {
    id: 'neon-glow-hoodie',
    name: 'Neon Glow Tech Hoodie',
    price: 2899,
    comparePrice: 3499,
    image: '/images/products/hoodies/hoodie-2-main.jpg',
    rating: 4.6,
    reviewCount: 156,
    category: 'Hoodies',
    tags: ['tech', 'glow', 'futuristic'],
    inStock: true
  },
  {
    id: 'quantum-bomber',
    name: 'Quantum Mesh Bomber',
    price: 4599,
    comparePrice: 5299,
    image: '/images/products/hoodies/hoodie-1-front.jpg',
    rating: 4.7,
    reviewCount: 89,
    category: 'Jackets',
    tags: ['bomber', 'mesh', 'premium'],
    inStock: true
  },
  {
    id: 'holographic-tee',
    name: 'Holographic Tech Tee',
    price: 1899,
    comparePrice: 2299,
    image: '/images/products/t-shirts/tshirt-2-main.jpg',
    rating: 4.5,
    reviewCount: 203,
    category: 'T-Shirts',
    tags: ['holographic', 'tech', 'casual'],
    inStock: true
  }
];

const categories = ['All', 'Hoodies', 'T-Shirts', 'Jackets', 'Accessories'];
const priceRanges = [
  { label: 'Under ₹2000', min: 0, max: 2000 },
  { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
  { label: '₹3000 - ₹5000', min: 3000, max: 5000 },
  { label: 'Over ₹5000', min: 5000, max: Infinity }
];

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price < range.max
        );
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // For demo, we'll just reverse the array
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, selectedPriceRange, sortBy, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Collections
            </span>
          </h1>
          <p className="text-white/60 text-lg">Discover our latest streetwear collection</p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
            
            {/* Category Pills */}
            <div className="hidden md:flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">
              {filteredProducts.length} products
            </span>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 text-white px-3 py-2 rounded-lg text-sm"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="mr-2 accent-purple-500"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === ''}
                        onChange={() => setSelectedPriceRange('')}
                        className="mr-2 accent-purple-500"
                      />
                      All Prices
                    </label>
                    {priceRanges.map((range) => (
                      <label key={range.label} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === range.label}
                          onChange={() => setSelectedPriceRange(range.label)}
                          className="mr-2 accent-purple-500"
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div>
                  <h3 className="font-semibold mb-3">Actions</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedPriceRange('');
                      setSortBy('featured');
                    }}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-white/5 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleQuickView(product)}
                    className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                    <HeartIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Discount Badge */}
                {product.comparePrice && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <StarSolid className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white/80">{product.rating}</span>
                  <span className="text-xs text-white/60">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-white">₹{product.price.toLocaleString()}</span>
                  {product.comparePrice && (
                    <span className="text-sm text-white/50 line-through">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Quick View Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={closeQuickView}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white">Quick View</h2>
                  <button
                    onClick={closeQuickView}
                    className="text-white/60 hover:text-white"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Product Image */}
                  <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">{selectedProduct.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarSolid
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedProduct.rating) 
                                ? 'text-yellow-400' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/80">{selectedProduct.rating}</span>
                      <span className="text-white/60">({selectedProduct.reviewCount} reviews)</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">
                        ₹{selectedProduct.price.toLocaleString()}
                      </span>
                      {selectedProduct.comparePrice && (
                        <span className="text-lg text-white/50 line-through">
                          ₹{selectedProduct.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                      <Link
                        href={`/products/${selectedProduct.id}`}
                        className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all duration-300"
                      >
                        View Details
                      </Link>
                      <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}