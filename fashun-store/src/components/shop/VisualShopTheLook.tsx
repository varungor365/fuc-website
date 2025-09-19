'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Heart, Share2, Plus, Eye, Bookmark, Sparkles, Palette, Users } from 'lucide-react';
import Image from 'next/image';
import VisualShopTheLookService, { Look, LookItem } from '@/lib/visual-shop-the-look';

interface VisualShopTheLookProps {
  lookId?: string;
  looks?: Look[];
  showPersonalized?: boolean;
  category?: string;
  style?: string;
  userId?: string;
  onItemClick?: (item: LookItem) => void;
  className?: string;
}

const VisualShopTheLook: React.FC<VisualShopTheLookProps> = ({
  lookId,
  looks: initialLooks,
  showPersonalized = false,
  category,
  style,
  userId,
  onItemClick,
  className = ''
}) => {
  const [looks, setLooks] = useState<Look[]>(initialLooks || []);
  const [selectedLook, setSelectedLook] = useState<Look | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'personalized'>('featured');
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LookItem | null>(null);
  const [cartLoading, setCartLoading] = useState<string | null>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const shopService = new VisualShopTheLookService();

  useEffect(() => {
    if (!initialLooks) {
      loadLooks();
    }
  }, [activeTab, category, style]);

  useEffect(() => {
    if (lookId) {
      loadSpecificLook();
    }
  }, [lookId]);

  const loadLooks = async () => {
    setLoading(true);
    try {
      let newLooks: Look[] = [];

      switch (activeTab) {
        case 'featured':
          newLooks = await shopService.getFeaturedLooks(12, category, style);
          break;
        case 'trending':
          newLooks = await shopService.getTrendingLooks(category, 'week', 12);
          break;
        case 'personalized':
          if (userId) {
            newLooks = await shopService.getPersonalizedLooks(userId, 12);
          }
          break;
      }

      setLooks(newLooks);
    } catch (error) {
      console.error('Error loading looks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificLook = async () => {
    if (!lookId) return;

    try {
      const look = await shopService.getLook(lookId);
      if (look) {
        setSelectedLook(look);
        await shopService.trackLookInteraction(lookId, 'view', userId);
      }
    } catch (error) {
      console.error('Error loading specific look:', error);
    }
  };

  const handleLookClick = async (look: Look) => {
    setSelectedLook(look);
    await shopService.trackLookInteraction(look.id, 'view', userId);
  };

  const handleItemClick = (item: LookItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
    onItemClick?.(item);
  };

  const handleAddToCart = async (item: LookItem, size?: string) => {
    if (!selectedLook) return;

    setCartLoading(item.id);
    try {
      const result = await shopService.addLookItemToCart(
        selectedLook.id,
        item.id,
        size
      );

      if (result.success) {
        await shopService.trackLookInteraction(selectedLook.id, 'shop', userId);
        // Show success message or update cart
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setCartLoading(null);
    }
  };

  const handleAddLookToCart = async () => {
    if (!selectedLook) return;

    setCartLoading('look');
    try {
      const result = await shopService.addLookToCart(selectedLook.id);
      if (result.success) {
        await shopService.trackLookInteraction(selectedLook.id, 'shop', userId);
        // Show success message
      }
    } catch (error) {
      console.error('Error adding look to cart:', error);
    } finally {
      setCartLoading(null);
    }
  };

  const handleLike = async (look: Look) => {
    if (!userId) return;

    try {
      await shopService.trackLookInteraction(look.id, 'like', userId);
      // Update local state to reflect like
    } catch (error) {
      console.error('Error liking look:', error);
    }
  };

  const handleSave = async (look: Look) => {
    if (!userId) return;

    try {
      await shopService.saveLook(userId, look.id);
      await shopService.trackLookInteraction(look.id, 'save', userId);
      // Show save confirmation
    } catch (error) {
      console.error('Error saving look:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (selectedLook) {
    return (
      <div className={`bg-white rounded-lg ${className}`}>
        {/* Look Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedLook.title}</h2>
              {selectedLook.description && (
                <p className="text-gray-600 mb-3">{selectedLook.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {formatNumber(selectedLook.stats.views)}
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {formatNumber(selectedLook.stats.likes)}
                </div>
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  {formatNumber(selectedLook.stats.shops)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatPrice(selectedLook.totalPrice)}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLike(selectedLook)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSave(selectedLook)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex items-center">
            {selectedLook.creator.avatar && (
              <Image
                src={selectedLook.creator.avatar}
                alt={selectedLook.creator.name}
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            )}
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{selectedLook.creator.name}</span>
                {selectedLook.creator.verified && (
                  <span className="ml-1 text-blue-500">✓</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {selectedLook.style.join(', ')} • {selectedLook.occasion.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Look Image */}
        <div className="relative" ref={imageRef}>
          <div className="relative w-full h-96 md:h-[500px]">
            <Image
              src={selectedLook.image}
              alt={selectedLook.title}
              fill
              className="object-cover"
            />
            
            {/* Hotspots for shoppable items */}
            {selectedLook.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="absolute w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                style={{
                  left: `${item.position.x}%`,
                  top: `${item.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Plus className="w-3 h-3 text-blue-600" />
              </button>
            ))}

            {/* Item Preview on Hover */}
            {hoveredItem && (
              <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 max-w-xs">
                {(() => {
                  const item = selectedLook.items.find(i => i.id === hoveredItem);
                  if (!item) return null;
                  
                  return (
                    <div>
                      <div className="flex">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded object-cover mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                          <div className="text-gray-600 text-xs">{item.brand}</div>
                          <div className="font-semibold text-gray-900 text-sm mt-1">
                            {formatPrice(item.price)}
                          </div>
                          {!item.inStock && (
                            <div className="text-red-600 text-xs">Out of stock</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Shoppable Items List */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shop This Look</h3>
            <button
              onClick={handleAddLookToCart}
              disabled={cartLoading === 'look'}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cartLoading === 'look' ? 'Adding...' : 'Add All to Cart'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedLook.items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{item.title}</div>
                    <div className="text-gray-600 text-sm mb-1">{item.brand}</div>
                    <div className="font-semibold text-gray-900 mb-2">
                      {formatPrice(item.price)}
                    </div>
                    
                    {item.inStock ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={cartLoading === item.id}
                        className="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {cartLoading === item.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-3 py-1 bg-gray-300 text-gray-500 text-sm rounded cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Shop the Look</h2>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Palette className="w-4 h-4 mr-1" />
              Style Inspiration
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Community Curated
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'featured'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'trending'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trending
          </button>
          {userId && (
            <button
              onClick={() => setActiveTab('personalized')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'personalized'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              For You
            </button>
          )}
        </div>
      </div>

      {/* Looks Grid */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {looks.map((look) => (
              <div
                key={look.id}
                onClick={() => handleLookClick(look)}
                className="cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <Image
                    src={look.image}
                    alt={look.title}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(look);
                      }}
                      className="block p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(look);
                      }}
                      className="block p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item Count */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {look.items.length} items
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-white bg-opacity-90 text-gray-900 text-sm font-semibold rounded">
                    {formatPrice(look.totalPrice)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {look.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{look.creator.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {formatNumber(look.stats.likes)}
                      </span>
                      <span className="flex items-center">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {formatNumber(look.stats.shops)}
                      </span>
                    </div>
                  </div>
                  {look.style.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500">
                      {look.style.slice(0, 2).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && looks.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No looks found</h3>
            <p className="text-gray-600">
              {activeTab === 'personalized' 
                ? 'Complete your style profile to get personalized recommendations'
                : 'Check back later for new style inspiration'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualShopTheLook;