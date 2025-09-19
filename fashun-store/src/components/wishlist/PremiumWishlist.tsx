'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ShoppingBagIcon,
  ShareIcon,
  XMarkIcon,
  EyeIcon,
  TagIcon,
  SparklesIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  color: string;
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  addedDate: Date;
  lastPriceCheck: Date;
  priceHistory: { date: Date; price: number }[];
  isOnSale: boolean;
  discount?: number;
  tags: string[];
  notes?: string;
}

interface WishlistCollection {
  id: string;
  name: string;
  description: string;
  items: string[];
  isPublic: boolean;
  createdDate: Date;
  coverImage?: string;
}

interface PremiumWishlistProps {
  userId: string;
  className?: string;
}

const PremiumWishlist: React.FC<PremiumWishlistProps> = ({ userId, className = '' }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [collections, setCollections] = useState<WishlistCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'alphabetical'>('newest');
  const [filterBy, setFilterBy] = useState<{
    category: string[];
    priceRange: [number, number];
    inStock: boolean | null;
    onSale: boolean | null;
  }>({
    category: [],
    priceRange: [0, 50000],
    inStock: null,
    onSale: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock data
  useEffect(() => {
    const mockItems: WishlistItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Premium Cotton Hoodie',
        brand: 'FASHUN',
        price: 2399,
        originalPrice: 2999,
        image: '/api/placeholder/300/400',
        category: 'hoodies',
        color: 'Black',
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        addedDate: new Date('2024-01-15'),
        lastPriceCheck: new Date(),
        priceHistory: [
          { date: new Date('2024-01-01'), price: 2999 },
          { date: new Date('2024-01-15'), price: 2399 }
        ],
        isOnSale: true,
        discount: 20,
        tags: ['comfortable', 'winter', 'casual'],
        notes: 'Perfect for winter!'
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'Vintage Graphic Tee',
        brand: 'STREET',
        price: 1299,
        image: '/api/placeholder/300/400',
        category: 'tshirts',
        color: 'White',
        sizes: ['XS', 'S', 'M', 'L'],
        rating: 4.5,
        reviewCount: 89,
        inStock: false,
        addedDate: new Date('2024-01-10'),
        lastPriceCheck: new Date(),
        priceHistory: [{ date: new Date('2024-01-10'), price: 1299 }],
        isOnSale: false,
        tags: ['vintage', 'graphic', 'streetwear']
      },
      {
        id: '3',
        productId: 'prod-3',
        name: 'Designer Cargo Pants',
        brand: 'URBAN',
        price: 3599,
        originalPrice: 4499,
        image: '/api/placeholder/300/400',
        category: 'pants',
        color: 'Khaki',
        sizes: ['28', '30', '32', '34'],
        rating: 4.7,
        reviewCount: 156,
        inStock: true,
        addedDate: new Date('2024-01-05'),
        lastPriceCheck: new Date(),
        priceHistory: [
          { date: new Date('2024-01-01'), price: 4499 },
          { date: new Date('2024-01-05'), price: 3599 }
        ],
        isOnSale: true,
        discount: 20,
        tags: ['designer', 'cargo', 'trendy']
      }
    ];

    const mockCollections: WishlistCollection[] = [
      {
        id: 'winter',
        name: 'Winter Essentials',
        description: 'Cozy items for the cold season',
        items: ['1'],
        isPublic: false,
        createdDate: new Date('2024-01-01'),
        coverImage: '/api/placeholder/200/200'
      },
      {
        id: 'streetwear',
        name: 'Streetwear Vibes',
        description: 'Urban and contemporary pieces',
        items: ['2', '3'],
        isPublic: true,
        createdDate: new Date('2024-01-05')
      }
    ];

    setItems(mockItems);
    setCollections(mockCollections);
  }, []);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Apply collection filter
    if (activeCollection !== 'all') {
      const collection = collections.find(c => c.id === activeCollection);
      if (collection) {
        filtered = filtered.filter(item => collection.items.includes(item.id));
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filterBy.category.length > 0) {
      filtered = filtered.filter(item => filterBy.category.includes(item.category));
    }

    if (filterBy.inStock !== null) {
      filtered = filtered.filter(item => item.inStock === filterBy.inStock);
    }

    if (filterBy.onSale !== null) {
      filtered = filtered.filter(item => item.isOnSale === filterBy.onSale);
    }

    filtered = filtered.filter(item =>
      item.price >= filterBy.priceRange[0] && item.price <= filterBy.priceRange[1]
    );

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.addedDate.getTime() - a.addedDate.getTime();
        case 'oldest':
          return a.addedDate.getTime() - b.addedDate.getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, activeCollection, collections, searchQuery, filterBy, sortBy]);

  const categories = Array.from(new Set(items.map(item => item.category)));
  const priceAlerts = items.filter(item => item.isOnSale).length;
  const outOfStockItems = items.filter(item => !item.inStock).length;

  const removeFromWishlist = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const moveToCart = (itemId: string) => {
    // Implementation for moving item to cart
    console.log('Moving to cart:', itemId);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const WishlistItemCard: React.FC<{ item: WishlistItem; index: number }> = ({ item, index }) => (
    <motion.div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
        selectedItems.has(item.id) ? 'ring-2 ring-primary-500' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      layout
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <motion.button
          onClick={() => toggleItemSelection(item.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            selectedItems.has(item.id)
              ? 'bg-primary-500 border-primary-500'
              : 'bg-white/80 border-white backdrop-blur-sm hover:bg-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {selectedItems.has(item.id) && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </motion.button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.isOnSale && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {item.discount}% OFF
            </span>
          )}
          {!item.inStock && (
            <span className="bg-neutral-800 text-white text-xs font-medium px-2 py-1 rounded-full">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            onClick={() => moveToCart(item.id)}
            disabled={!item.inStock}
            className="flex-1 bg-black text-white py-2 px-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBagIcon className="w-4 h-4 inline mr-1" />
            {item.inStock ? 'Add to Cart' : 'Notify Me'}
          </motion.button>
          
          <motion.button
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ShareIcon className="w-4 h-4 text-neutral-700" />
          </motion.button>
          
          <motion.button
            onClick={() => removeFromWishlist(item.id)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-4 h-4 text-neutral-700" />
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-neutral-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {item.name}
            </h3>
            <p className="text-sm text-neutral-600">{item.brand}</p>
          </div>
          
          <HeartSolidIcon className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <StarSolidIcon
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(item.rating) ? 'text-yellow-500' : 'text-neutral-300'
              }`}
            />
          ))}
          <span className="text-xs text-neutral-500 ml-1">({item.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-neutral-900">
              ₹{item.price.toLocaleString()}
            </span>
            {item.originalPrice && (
              <span className="text-sm text-neutral-500 line-through ml-2">
                ₹{item.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {item.isOnSale && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowTrendingUpIcon className="w-3 h-3" />
              Price Drop!
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Added Date */}
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <ClockIcon className="w-3 h-3" />
          Added {item.addedDate.toLocaleDateString()}
        </div>

        {/* Notes */}
        {item.notes && (
          <div className="mt-2 text-xs text-neutral-600 italic">
            "{item.notes}"
          </div>
        )}
      </div>
    </motion.div>
  );

  const CollectionCard: React.FC<{ collection: WishlistCollection }> = ({ collection }) => (
    <motion.button
      onClick={() => setActiveCollection(collection.id)}
      className={`p-4 rounded-2xl text-left transition-all ${
        activeCollection === collection.id
          ? 'bg-primary-50 border-2 border-primary-200'
          : 'bg-white border-2 border-neutral-200 hover:border-primary-200'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3 mb-2">
        {collection.coverImage ? (
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-500 rounded-lg flex items-center justify-center">
            <HeartSolidIcon className="w-6 h-6 text-white" />
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900">{collection.name}</h3>
          <p className="text-sm text-neutral-600">{collection.items.length} items</p>
        </div>
        
        {collection.isPublic && (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )}
      </div>
      
      <p className="text-sm text-neutral-600 line-clamp-2">{collection.description}</p>
    </motion.button>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="heading-2">My Wishlist</h1>
          <p className="text-neutral-600">
            {items.length} items saved • {priceAlerts} price alerts • {outOfStockItems} out of stock
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setShowCreateCollection(true)}
            className="btn btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Create Collection
          </motion.button>
          
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </motion.button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your wishlist..."
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          
          <div className="flex border border-neutral-200 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-l-xl ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-current rounded-sm"></div>
                ))}
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-r-xl border-l border-neutral-200 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-600'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-current rounded-sm h-0.5"></div>
                ))}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4">Collections</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <motion.button
            onClick={() => setActiveCollection('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
              activeCollection === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            All Items ({items.length})
          </motion.button>
          
          {collections.map((collection) => (
            <motion.button
              key={collection.id}
              onClick={() => setActiveCollection(collection.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                activeCollection === collection.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {collection.name} ({collection.items.length})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 border border-neutral-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filterBy.category.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilterBy(prev => ({
                              ...prev,
                              category: [...prev.category, category]
                            }));
                          } else {
                            setFilterBy(prev => ({
                              ...prev,
                              category: prev.category.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      checked={filterBy.inStock === null}
                      onChange={() => setFilterBy(prev => ({ ...prev, inStock: null }))}
                    />
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      checked={filterBy.inStock === true}
                      onChange={() => setFilterBy(prev => ({ ...prev, inStock: true }))}
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stock"
                      checked={filterBy.inStock === false}
                      onChange={() => setFilterBy(prev => ({ ...prev, inStock: false }))}
                    />
                    <span className="text-sm">Out of Stock</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={filterBy.priceRange[1]}
                    onChange={(e) => setFilterBy(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>₹0</span>
                    <span>₹{filterBy.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Special Offers
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filterBy.onSale === true}
                      onChange={(e) => setFilterBy(prev => ({
                        ...prev,
                        onSale: e.target.checked ? true : null
                      }))}
                    />
                    <span className="text-sm">On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary-50 border border-primary-200 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-primary-900">
                {selectedItems.size} items selected
              </span>
              
              <div className="flex items-center gap-3">
                <button className="btn btn-sm btn-secondary">
                  Move to Collection
                </button>
                <button className="btn btn-sm btn-secondary">
                  Share Selected
                </button>
                <button className="btn btn-sm btn-primary">
                  Add All to Cart
                </button>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        <AnimatePresence>
          {filteredAndSortedItems.map((item, index) => (
            <WishlistItemCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <HeartIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            {searchQuery || Object.values(filterBy).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true))
              ? 'No items match your filters'
              : 'Your wishlist is empty'
            }
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchQuery || Object.values(filterBy).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true))
              ? 'Try adjusting your search or filters'
              : 'Start exploring and save items you love'
            }
          </p>
          {!searchQuery && !Object.values(filterBy).some(v => v !== null && (Array.isArray(v) ? v.length > 0 : true)) && (
            <button className="btn btn-primary">
              Explore Products
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumWishlist;