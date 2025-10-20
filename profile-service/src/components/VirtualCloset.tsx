'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  TagIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface PhygitalItem {
  id: string;
  name: string;
  imageUrl: string;
  category: 'tshirts' | 'hoodies' | 'accessories' | 'footwear' | 'bottoms';
  brand: string;
  price: number;
  purchaseDate: string;
  wearCount: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isFavorite: boolean;
  tags: string[];
  nftData?: {
    tokenId: string;
    blockchain: string;
    verified: boolean;
  };
}

interface VirtualClosetProps {
  userId?: string;
}

// Mock data for development - in production, this would come from Supabase
const mockClosetItems: PhygitalItem[] = [
  {
    id: '1',
    name: 'Phygital Streetwear Tee #001',
    imageUrl: '/api/placeholder/300/400',
    category: 'tshirts',
    brand: 'FASHUN',
    price: 89.99,
    purchaseDate: '2024-01-15',
    wearCount: 23,
    rarity: 'legendary',
    isFavorite: true,
    tags: ['limited-edition', 'streetwear', 'nft'],
    nftData: {
      tokenId: '001',
      blockchain: 'Ethereum',
      verified: true
    }
  },
  {
    id: '2',
    name: 'Urban Glow Hoodie',
    imageUrl: '/api/placeholder/300/400',
    category: 'hoodies',
    brand: 'FASHUN',
    price: 149.99,
    purchaseDate: '2024-02-01',
    wearCount: 12,
    rarity: 'epic',
    isFavorite: false,
    tags: ['glow-in-dark', 'premium', 'winter'],
    nftData: {
      tokenId: '002',
      blockchain: 'Polygon',
      verified: true
    }
  },
  {
    id: '3',
    name: 'Digital Rebel Sneakers',
    imageUrl: '/api/placeholder/300/400',
    category: 'footwear',
    brand: 'FASHUN',
    price: 199.99,
    purchaseDate: '2024-01-20',
    wearCount: 45,
    rarity: 'rare',
    isFavorite: true,
    tags: ['sneakers', 'digital', 'comfort'],
  },
  {
    id: '4',
    name: 'Cyber Cargo Pants',
    imageUrl: '/api/placeholder/300/400',
    category: 'bottoms',
    brand: 'FASHUN',
    price: 119.99,
    purchaseDate: '2024-02-10',
    wearCount: 8,
    rarity: 'epic',
    isFavorite: false,
    tags: ['cargo', 'tech-wear', 'utility'],
  },
  {
    id: '5',
    name: 'Holographic Cap',
    imageUrl: '/api/placeholder/300/400',
    category: 'accessories',
    brand: 'FASHUN',
    price: 59.99,
    purchaseDate: '2024-02-05',
    wearCount: 15,
    rarity: 'rare',
    isFavorite: false,
    tags: ['holographic', 'accessories', 'street'],
  },
  {
    id: '6',
    name: 'Matrix Tee Collection #003',
    imageUrl: '/api/placeholder/300/400',
    category: 'tshirts',
    brand: 'FASHUN',
    price: 79.99,
    purchaseDate: '2024-01-25',
    wearCount: 31,
    rarity: 'common',
    isFavorite: false,
    tags: ['matrix', 'collection', 'digital-art'],
  }
];

interface SortableItemProps {
  item: PhygitalItem;
  viewMode: 'grid' | 'list';
  onToggleFavorite: (id: string) => void;
  onViewDetails: (item: PhygitalItem) => void;
}

function SortableItem({ item, viewMode, onToggleFavorite, onViewDetails }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-amber-600';
      case 'epic': return 'from-purple-400 to-pink-600';
      case 'rare': return 'from-blue-400 to-cyan-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400/50 shadow-yellow-400/20';
      case 'epic': return 'border-purple-400/50 shadow-purple-400/20';
      case 'rare': return 'border-blue-400/50 shadow-blue-400/20';
      default: return 'border-gray-400/50 shadow-gray-400/20';
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        layout
        className={`bg-white/5 backdrop-blur-sm rounded-xl border ${getRarityBorder(item.rarity)} p-4 hover:bg-white/10 transition-all duration-300 cursor-grab active:cursor-grabbing`}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-20`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{item.name}</h3>
            <p className="text-gray-400 text-sm">{item.brand} • {item.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getRarityColor(item.rarity)} text-white`}>
                {item.rarity.toUpperCase()}
              </span>
              <span className="text-gray-400 text-xs">Worn {item.wearCount} times</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {item.isFavorite ? (
                <HeartIcon className="w-5 h-5 text-red-400 fill-current" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => onViewDetails(item)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <EyeIcon className="w-5 h-5 text-gray-400" />
            </button>
            <div className="text-right">
              <p className="text-white font-medium">${item.price}</p>
              <p className="text-gray-400 text-sm">{new Date(item.purchaseDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className={`group relative bg-white/5 backdrop-blur-sm rounded-xl border ${getRarityBorder(item.rarity)} p-4 hover:bg-white/10 transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-105`}
    >
      {/* Rarity Glow Effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Item Image */}
      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-20`} />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          {item.isFavorite ? (
            <HeartIcon className="w-4 h-4 text-red-400 fill-current" />
          ) : (
            <HeartIcon className="w-4 h-4 text-white/70" />
          )}
        </button>
        
        {/* NFT Badge */}
        {item.nftData && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-medium">
            NFT
          </div>
        )}
        
        {/* Wear Count */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
          {item.wearCount} wears
        </div>
        
        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(item)}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          <EyeIcon className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* Item Info */}
      <div className="space-y-2">
        <h3 className="text-white font-medium text-sm truncate">{item.name}</h3>
        <p className="text-gray-400 text-xs">{item.brand}</p>
        
        {/* Rarity Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getRarityColor(item.rarity)} text-white`}>
            {item.rarity.toUpperCase()}
          </span>
          <span className="text-white font-medium text-sm">${item.price}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function VirtualCloset({ userId }: VirtualClosetProps) {
  const [items, setItems] = useState<PhygitalItem[]>(mockClosetItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'wears' | 'rarity'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<PhygitalItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Simulate loading from Supabase
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    
    return matchesSearch && matchesCategory && matchesRarity;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      case 'price':
        return b.price - a.price;
      case 'wears':
        return b.wearCount - a.wearCount;
      case 'rarity':
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      default:
        return 0;
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleFavorite = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'all') return items.length;
    return items.filter(item => item.category === category).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Virtual Closet</h2>
          <p className="text-purple-300">Syncing your phygital wardrobe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Virtual Closet</h1>
              <p className="text-purple-300">Manage your phygital wardrobe • Total Value: ${getTotalValue().toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-purple-300">
                {filteredItems.length} of {items.length} items
              </div>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                {viewMode === 'grid' ? (
                  <ListBulletIcon className="w-5 h-5 text-white" />
                ) : (
                  <Squares2X2Icon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your closet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 transition-colors"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-white" />
                  <span className="text-white">Filters</span>
                </button>

                {/* Quick Categories */}
                <div className="flex items-center gap-2">
                  {['all', 'tshirts', 'hoodies', 'accessories', 'footwear', 'bottoms'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)} ({getCategoryCount(category)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-400/50"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price">Price (High to Low)</option>
                  <option value="wears">Most Worn</option>
                  <option value="rarity">Rarity</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Rarity</label>
                      <select
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400/50"
                      >
                        <option value="all">All Rarities</option>
                        <option value="legendary">Legendary</option>
                        <option value="epic">Epic</option>
                        <option value="rare">Rare</option>
                        <option value="common">Common</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Favorites Only</label>
                      <button
                        onClick={() => {/* Toggle favorites filter */}}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                      >
                        Show Favorites
                      </button>
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">NFT Items</label>
                      <button
                        onClick={() => {/* Toggle NFT filter */}}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                      >
                        NFT Only
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Closet Items */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredItems.map(item => item.id)}
              strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
            >
              {filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-center">
                  <div className="text-white">
                    <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No items found</h2>
                    <p className="text-purple-300 mb-6">Adjust your filters or add more items to your closet</p>
                    <a
                      href="https://www.fashun.co.in/store"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      Shop Phygital Items
                    </a>
                  </div>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    : "space-y-4"
                }>
                  {filteredItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      viewMode={viewMode}
                      onToggleFavorite={toggleFavorite}
                      onViewDetails={setSelectedItem}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Item Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedItem.nftData && (
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                      <h3 className="text-white font-medium mb-2">NFT Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Token ID:</span>
                          <span className="text-white">#{selectedItem.nftData.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Blockchain:</span>
                          <span className="text-white">{selectedItem.nftData.blockchain}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Verified:</span>
                          <span className="text-green-400">✓ Verified</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedItem.name}</h2>
                      <p className="text-gray-400">{selectedItem.brand}</p>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-gray-400 hover:text-white text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Purchase Price</div>
                      <div className="text-white text-2xl font-bold">${selectedItem.price}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Times Worn</div>
                      <div className="text-white text-2xl font-bold">{selectedItem.wearCount}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Rarity</div>
                      <div className={`text-lg font-bold bg-gradient-to-r ${
                        selectedItem.rarity === 'legendary' ? 'from-yellow-400 to-amber-600' :
                        selectedItem.rarity === 'epic' ? 'from-purple-400 to-pink-600' :
                        selectedItem.rarity === 'rare' ? 'from-blue-400 to-cyan-600' :
                        'from-gray-400 to-gray-600'
                      } bg-clip-text text-transparent`}>
                        {selectedItem.rarity.toUpperCase()}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Purchase Date</div>
                      <div className="text-white text-lg font-medium">
                        {new Date(selectedItem.purchaseDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/10 rounded-full text-white text-sm border border-white/20"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => toggleFavorite(selectedItem.id)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
                        selectedItem.isFavorite
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                      }`}
                    >
                      <HeartIcon className={`w-5 h-5 ${selectedItem.isFavorite ? 'fill-current' : ''}`} />
                      {selectedItem.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedItem.name,
                            text: `Check out my ${selectedItem.name} from FASHUN!`,
                            url: `https://p.fashun.co.in/items/${selectedItem.id}`
                          });
                        }
                      }}
                      className="flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <ShareIcon className="w-5 h-5" />
                      Share Item
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}