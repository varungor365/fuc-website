'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  HeartIcon,
  ShareIcon,
  TrashIcon,
  PlusIcon,
  FolderPlusIcon,
  EyeIcon,
  TagIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  BellSlashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

interface WishlistItem {
  id: string
  productId: string
  productName: string
  productImage: string
  currentPrice: number
  originalPrice?: number
  size?: string
  color?: string
  addedAt: string
  notes?: string
  priority: 'low' | 'medium' | 'high'
  priceDropAlert: boolean
  stockAlert: boolean
  inStock: boolean
  collectionId?: string
  collectionName?: string
}

interface WishlistCollection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  itemCount: number
  coverImage?: string
  tags: string[]
  shareStats?: {
    viewCount: number
    isShared: boolean
  }
}

interface WishlistProps {
  userId: string
}

export default function Wishlist({ userId }: WishlistProps) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [collections, setCollections] = useState<WishlistCollection[]>([])
  const [activeTab, setActiveTab] = useState<'items' | 'collections'>('items')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'price' | 'priority'>('recent')
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [showShareModal, setShowShareModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: [] as string[]
  })

  // Mock data
  const mockItems: WishlistItem[] = [
    {
      id: '1',
      productId: 'product-1',
      productName: 'Cozy Winter Hoodie',
      productImage: '/api/placeholder/300/300',
      currentPrice: 2699,
      originalPrice: 2999,
      size: 'L',
      color: 'Black',
      addedAt: '2025-01-15T10:00:00Z',
      notes: 'Perfect for winter',
      priority: 'high',
      priceDropAlert: true,
      stockAlert: true,
      inStock: true,
      collectionId: 'collection-1',
      collectionName: 'Winter Essentials'
    },
    {
      id: '2',
      productId: 'product-2',
      productName: 'Casual Denim Jacket',
      productImage: '/api/placeholder/300/300',
      currentPrice: 3499,
      originalPrice: 3499,
      size: 'M',
      color: 'Blue',
      addedAt: '2025-01-14T15:30:00Z',
      priority: 'medium',
      priceDropAlert: false,
      stockAlert: true,
      inStock: true,
      collectionId: 'collection-2',
      collectionName: 'Spring Collection'
    },
    {
      id: '3',
      productId: 'product-3',
      productName: 'Classic White Sneakers',
      productImage: '/api/placeholder/300/300',
      currentPrice: 4999,
      originalPrice: 5999,
      size: '9',
      color: 'White',
      addedAt: '2025-01-12T09:15:00Z',
      priority: 'low',
      priceDropAlert: true,
      stockAlert: false,
      inStock: false
    }
  ]

  const mockCollections: WishlistCollection[] = [
    {
      id: 'collection-1',
      name: 'Winter Essentials',
      description: 'Cozy pieces for the cold season',
      isPublic: true,
      itemCount: 5,
      coverImage: '/api/placeholder/400/300',
      tags: ['winter', 'cozy', 'essentials'],
      shareStats: {
        viewCount: 25,
        isShared: true
      }
    },
    {
      id: 'collection-2',
      name: 'Spring Collection',
      description: 'Fresh looks for spring',
      isPublic: false,
      itemCount: 3,
      coverImage: '/api/placeholder/400/300',
      tags: ['spring', 'fresh', 'casual']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems(mockItems)
      setCollections(mockCollections)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredItems = items
    .filter(item => selectedCollection === 'all' || item.collectionId === selectedCollection)
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        case 'price':
          return b.currentPrice - a.currentPrice
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleToggleAlert = (itemId: string, alertType: 'price' | 'stock') => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          [alertType === 'price' ? 'priceDropAlert' : 'stockAlert']: 
            !item[alertType === 'price' ? 'priceDropAlert' : 'stockAlert']
        }
      }
      return item
    }))
  }

  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) return

    const collection: WishlistCollection = {
      id: `collection-${Date.now()}`,
      name: newCollection.name.trim(),
      description: newCollection.description.trim(),
      isPublic: newCollection.isPublic,
      itemCount: 0,
      tags: newCollection.tags
    }

    setCollections([...collections, collection])
    setNewCollection({ name: '', description: '', isPublic: false, tags: [] })
    setShowCreateCollection(false)
  }

  const handleDeleteCollection = (collectionId: string) => {
    setCollections(collections.filter(c => c.id !== collectionId))
    // Remove collection from items
    setItems(items.map(item => ({
      ...item,
      collectionId: item.collectionId === collectionId ? undefined : item.collectionId,
      collectionName: item.collectionId === collectionId ? undefined : item.collectionName
    })))
  }

  const generateShareUrl = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId)
    if (!collection) return ''
    
    const shareId = `${collection.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`
    return `https://fashun.co.in/wishlist/share/${shareId}`
  }

  const copyShareUrl = (collectionId: string) => {
    const shareUrl = generateShareUrl(collectionId)
    navigator.clipboard.writeText(shareUrl)
    // Show success message
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High Priority'
      case 'medium': return 'Medium Priority'
      case 'low': return 'Low Priority'
      default: return 'Normal'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-400">
            {items.length} items saved • {collections.length} collections
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'items'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Items ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'collections'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Collections ({collections.length})
          </button>
        </div>

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            {/* Filters and Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Collections</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name} ({collection.itemCount})
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="recent">Recently Added</option>
                <option value="price">Price (High to Low)</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16">
                <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No items in your wishlist</h3>
                <p className="text-gray-400 mb-6">Start adding items you love!</p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Priority Badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(item.priority)}`}>
                        {getPriorityText(item.priority)}
                      </div>

                      {/* Price Drop Badge */}
                      {item.originalPrice && item.currentPrice < item.originalPrice && (
                        <div className="absolute top-3 right-3 bg-green-600 px-2 py-1 rounded-full text-xs font-medium text-white">
                          ₹{item.originalPrice - item.currentPrice} OFF
                        </div>
                      )}

                      {/* Stock Status */}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-white font-medium line-clamp-2 mb-1">
                          {item.productName}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>• Color: {item.color}</span>}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">
                          ₹{item.currentPrice.toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice > item.currentPrice && (
                          <span className="text-gray-500 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Collection */}
                      {item.collectionName && (
                        <div className="flex items-center space-x-1 text-sm text-purple-400">
                          <TagIcon className="w-4 h-4" />
                          <span>{item.collectionName}</span>
                        </div>
                      )}

                      {/* Notes */}
                      {item.notes && (
                        <p className="text-sm text-gray-400 italic">"{item.notes}"</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleAlert(item.id, 'price')}
                            className={`p-2 rounded-lg transition-colors ${
                              item.priceDropAlert
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                            title="Price drop alert"
                          >
                            {item.priceDropAlert ? <BellIcon className="w-4 h-4" /> : <BellSlashIcon className="w-4 h-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleToggleAlert(item.id, 'stock')}
                            className={`p-2 rounded-lg transition-colors ${
                              item.stockAlert
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                            title="Stock alert"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                          title="Remove from wishlist"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div>
            {/* Create Collection Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowCreateCollection(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <FolderPlusIcon className="w-5 h-5" />
                <span>Create Collection</span>
              </button>
            </div>

            {/* Collections Grid */}
            {collections.length === 0 ? (
              <div className="text-center py-16">
                <FolderPlusIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No collections yet</h3>
                <p className="text-gray-400 mb-6">Organize your wishlist with collections</p>
                <button
                  onClick={() => setShowCreateCollection(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Create First Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all overflow-hidden"
                  >
                    {/* Collection Cover */}
                    <div className="aspect-video relative">
                      {collection.coverImage ? (
                        <Image
                          src={collection.coverImage}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                          <TagIcon className="w-12 h-12 text-white/50" />
                        </div>
                      )}
                      
                      {/* Privacy Badge */}
                      <div className="absolute top-3 left-3">
                        {collection.isPublic ? (
                          <div className="bg-green-600 px-2 py-1 rounded-full flex items-center space-x-1">
                            <GlobeAltIcon className="w-3 h-3 text-white" />
                            <span className="text-xs text-white">Public</span>
                          </div>
                        ) : (
                          <div className="bg-gray-700 px-2 py-1 rounded-full flex items-center space-x-1">
                            <LockClosedIcon className="w-3 h-3 text-white" />
                            <span className="text-xs text-white">Private</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collection Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-gray-400 text-sm">
                            {collection.description}
                          </p>
                        )}
                      </div>

                      <div className="text-sm text-gray-400">
                        {collection.itemCount} item{collection.itemCount !== 1 ? 's' : ''}
                        {collection.shareStats?.isShared && (
                          <span> • {collection.shareStats.viewCount} views</span>
                        )}
                      </div>

                      {/* Tags */}
                      {collection.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {collection.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <button
                          onClick={() => setSelectedCollection(collection.id)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                        >
                          View Items
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowShareModal(collection.id)}
                            className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            title="Share collection"
                          >
                            <ShareIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteCollection(collection.id)}
                            className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                            title="Delete collection"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Collection Modal */}
        <AnimatePresence>
          {showCreateCollection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateCollection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Create Collection</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Collection Name</label>
                    <input
                      type="text"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                      placeholder="e.g., Summer Essentials"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Description (Optional)</label>
                    <textarea
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                      placeholder="Describe your collection..."
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection({...newCollection, isPublic: e.target.checked})}
                        className="form-checkbox h-5 w-5 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-white">Make this collection public</span>
                    </label>
                    <p className="text-gray-400 text-sm mt-1 ml-8">
                      Public collections may appear in discovery. All collections can be shared via link.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 pt-4">
                  <button
                    onClick={handleCreateCollection}
                    disabled={!newCollection.name.trim()}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Collection
                  </button>
                  <button
                    onClick={() => setShowCreateCollection(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (() => {
            const sharedCollection = collections.find(c => c.id === showShareModal)
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowShareModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Share Collection</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-3">
                          <div className="text-gray-400 text-sm mb-1">Share URL:</div>
                          <div className="text-white font-mono text-sm break-all">
                            {generateShareUrl(showShareModal)}
                          </div>
                        </div>
                        <button
                          onClick={() => copyShareUrl(showShareModal)}
                          className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                          title="Copy link"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm">
                      {sharedCollection?.isPublic ? (
                        <>Anyone with this link can view your collection. This collection is public and may appear in discovery.</>
                      ) : (
                        <>Only people with this link can view your collection. This is a private collection and won't appear in public listings.</>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 mt-6 pt-4">
                    <button
                      onClick={() => setShowShareModal(null)}
                      className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          })()}
        </AnimatePresence>
      </div>
    </div>
  )
}