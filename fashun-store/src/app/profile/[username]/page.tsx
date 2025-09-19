'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserIcon, 
  StarIcon, 
  ShoppingBagIcon, 
  PaintBrushIcon,
  MapPinIcon,
  CalendarIcon,
  TrophyIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface Customer {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  location?: string
  avatar?: {
    url: string
    alternativeText?: string
  }
  loyaltyPoints: number
  loyaltyTier: string
  orderCount: number
  totalSpent: number
  savedDesigns: any[]
  badges: string[]
  socialLinks: {
    instagram?: string
    twitter?: string
    tiktok?: string
  }
  privacySettings: {
    profilePublic: boolean
    wardrobePublic: boolean
    creationsPublic: boolean
  }
  orders?: any[]
}

interface Design {
  id: string
  name: string
  thumbnail: string
  createdAt: string
  isPublic: boolean
  likes: number
  category: string
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'creations'>('wardrobe')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userDesigns, setUserDesigns] = useState<Design[]>([])
  const [userOrders, setUserOrders] = useState<any[]>([])

  useEffect(() => {
    if (username) {
      fetchUserProfile()
    }
  }, [username])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/users/profile/${username}`)
      
      if (!response.ok) {
        throw new Error('User not found')
      }
      
      const data = await response.json()
      setCustomer(data.customer)
      
      // Fetch user's designs and orders if profile allows
      if (data.customer.privacySettings.creationsPublic) {
        setUserDesigns(data.designs || [])
      }
      
      if (data.customer.privacySettings.wardrobePublic) {
        setUserOrders(data.orders || [])
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-600'
      case 'Silver': return 'text-gray-400'
      case 'Gold': return 'text-yellow-500'
      case 'Platinum': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'first_purchase': return '🛍️'
      case 'designer': return '🎨'
      case 'trendsetter': return '✨'
      case 'loyal_customer': return '💎'
      case 'brand_ambassador': return '👑'
      default: return '🏆'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mb-4"></div>
          <p className="text-primary-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-100 mb-2">User Not Found</h1>
          <p className="text-primary-400 mb-6">{error || 'This user profile does not exist.'}</p>
          <Link 
            href="/"
            className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {customer.avatar?.url ? (
                <Image
                  src={customer.avatar.url}
                  alt={customer.avatar.alternativeText || `${customer.firstName}'s avatar`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-accent-400"
                />
              ) : (
                <div className="w-30 h-30 bg-primary-600 rounded-full flex items-center justify-center border-4 border-accent-400">
                  <UserIcon className="h-12 w-12 text-primary-300" />
                </div>
              )}
              
              {/* Tier Badge */}
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-primary-800 border-2 border-accent-400 ${getTierColor(customer.loyaltyTier)}`}>
                <TrophyIcon className="h-4 w-4 inline mr-1" />
                <span className="text-xs font-bold">{customer.loyaltyTier}</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary-100">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span className="text-primary-400">@{customer.username}</span>
              </div>
              
              {customer.bio && (
                <p className="text-primary-300 mb-3 max-w-2xl">{customer.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-400">
                {customer.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{customer.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  <span>{customer.loyaltyPoints.toLocaleString()} points</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ShoppingBagIcon className="h-4 w-4" />
                  <span>{customer.orderCount} orders</span>
                </div>
              </div>

              {/* Social Links */}
              {(customer.socialLinks.instagram || customer.socialLinks.twitter || customer.socialLinks.tiktok) && (
                <div className="flex gap-3 mt-4">
                  {customer.socialLinks.instagram && (
                    <a 
                      href={`https://instagram.com/${customer.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-accent-400 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {customer.socialLinks.twitter && (
                    <a 
                      href={`https://twitter.com/${customer.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-accent-400 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {customer.socialLinks.tiktok && (
                    <a 
                      href={`https://tiktok.com/@${customer.socialLinks.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:text-accent-400 transition-colors"
                    >
                      TikTok
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-600 text-primary-100 rounded-lg transition-colors">
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Badges */}
          {customer.badges.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-primary-300 mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {customer.badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-primary-700 rounded-full text-sm"
                  >
                    <span>{getBadgeIcon(badge)}</span>
                    <span className="text-primary-200 capitalize">{badge.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-primary-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'wardrobe'
                  ? 'border-accent-400 text-accent-400'
                  : 'border-transparent text-primary-400 hover:text-primary-300'
              }`}
            >
              <ShoppingBagIcon className="h-5 w-5 inline mr-2" />
              My Wardrobe ({userOrders.length})
            </button>
            
            <button
              onClick={() => setActiveTab('creations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'creations'
                  ? 'border-accent-400 text-accent-400'
                  : 'border-transparent text-primary-400 hover:text-primary-300'
              }`}
            >
              <PaintBrushIcon className="h-5 w-5 inline mr-2" />
              My Creations ({userDesigns.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'wardrobe' && (
              <WardrobeTab key="wardrobe" orders={userOrders} customer={customer} />
            )}
            {activeTab === 'creations' && (
              <CreationsTab key="creations" designs={userDesigns} customer={customer} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Wardrobe Tab Component
function WardrobeTab({ orders, customer }: { orders: any[], customer: Customer }) {
  if (!customer.privacySettings.wardrobePublic) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ShoppingBagIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-200 mb-2">Private Wardrobe</h3>
        <p className="text-primary-400">This user's wardrobe is private.</p>
      </motion.div>
    )
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ShoppingBagIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-200 mb-2">No Orders Yet</h3>
        <p className="text-primary-400">This user hasn't made any orders yet.</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {orders.map((order) => (
        <div key={order.id} className="bg-primary-800 rounded-lg p-6 hover:bg-primary-700 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-primary-100">Order #{order.id.slice(-6)}</h4>
              <p className="text-primary-400 text-sm">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
          
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                {item.product?.images?.[0] && (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-primary-200 text-sm">{item.product?.name}</p>
                  <p className="text-primary-400 text-xs">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-primary-400 text-xs">+{order.items.length - 3} more items</p>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-primary-700">
            <div className="flex justify-between items-center">
              <span className="text-primary-400 text-sm">Total</span>
              <span className="text-primary-100 font-semibold">₹{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// Creations Tab Component
function CreationsTab({ designs, customer }: { designs: Design[], customer: Customer }) {
  if (!customer.privacySettings.creationsPublic) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <PaintBrushIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-200 mb-2">Private Creations</h3>
        <p className="text-primary-400">This user's creations are private.</p>
      </motion.div>
    )
  }

  if (designs.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <PaintBrushIcon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-primary-200 mb-2">No Creations Yet</h3>
        <p className="text-primary-400">This user hasn't created any designs yet.</p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {designs.map((design) => (
        <div key={design.id} className="bg-primary-800 rounded-lg overflow-hidden hover:bg-primary-700 transition-colors group">
          <div className="aspect-square relative">
            <Image
              src={design.thumbnail}
              alt={design.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <button className="bg-accent-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                View Design
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h4 className="text-primary-100 font-semibold mb-2">{design.name}</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary-400">{design.category}</span>
              <div className="flex items-center gap-1 text-primary-400">
                <StarIcon className="h-4 w-4" />
                <span>{design.likes}</span>
              </div>
            </div>
            <p className="text-primary-400 text-xs mt-2">
              {new Date(design.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
