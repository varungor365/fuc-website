'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { UserIcon, ShoppingBagIcon, HeartIcon, CogIcon, PowerIcon, MapPinIcon, ArrowPathIcon, FolderIcon, TruckIcon } from '@heroicons/react/24/outline'

// Mock user data
const userData = {
  name: 'Varun Gor',
  email: 'varun@example.com',
  joinDate: 'January 2024',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
}

// Mock orders data
const recentOrders = [
  {
    id: '#ORD-001',
    date: '2024-12-15',
    status: 'Delivered',
    total: 4499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop&crop=center',
    trackingNumber: 'FUC123456789',
    canTrack: true
  },
  {
    id: '#ORD-002',
    date: '2024-12-10',
    status: 'Shipped',
    total: 2999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop&crop=center',
    trackingNumber: 'FUC987654321',
    canTrack: true
  },
  {
    id: '#ORD-003',
    date: '2024-12-05',
    status: 'Processing',
    total: 1499,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=60&h=60&fit=crop&crop=center',
    trackingNumber: null,
    canTrack: false
  }
]

// Mock wishlist data
const wishlistItems = [
  {
    id: 1,
    name: 'Designer Hoodie',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=120&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Graphic Tee',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=120&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'Polo Shirt',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=100&h=120&fit=crop&crop=center'
  }
]

export default function AccountDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: 'returns', label: 'Returns & Refunds', icon: ArrowPathIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'affiliate', label: 'Affiliate Dashboard', icon: TruckIcon, external: true, href: '/affiliate/dashboard' },
    { id: 'profile', label: 'Profile', icon: CogIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-400/10'
      case 'Shipped': return 'text-blue-400 bg-blue-400/10'
      case 'Processing': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-primary-400 bg-primary-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src={userData.avatar} alt={userData.name} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {userData.name}!</h1>
                <p className="text-primary-300">Member since {userData.joinDate}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-primary-400 hover:text-white transition-colors">
              <PowerIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                item.external ? (
                  <Link
                    key={item.id}
                    href={item.href || '#'}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-primary-800 text-primary-300 hover:text-white"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-accent-500 text-black'
                        : 'hover:bg-primary-800 text-primary-300 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <ShoppingBagIcon className="h-8 w-8 text-accent-400" />
                    </div>
                  </div>
                  
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Total Spent</p>
                        <p className="text-2xl font-bold text-white">₹45,678</p>
                      </div>
                      <div className="text-accent-400 text-2xl">💰</div>
                    </div>
                  </div>
                  
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Wishlist Items</p>
                        <p className="text-2xl font-bold text-white">{wishlistItems.length}</p>
                      </div>
                      <HeartIcon className="h-8 w-8 text-accent-400" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-primary-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                    <Link href="/account/orders" className="text-accent-400 hover:text-accent-300 text-sm">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center gap-4 p-4 bg-primary-800 rounded-lg">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={order.image} alt="" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-white">{order.id}</p>
                              <p className="text-primary-400 text-sm">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-white">₹{order.total.toLocaleString()}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                                {order.canTrack && (
                                  <Link 
                                    href={`/track?orderId=${order.id.replace('#', '')}`}
                                    className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                                  >
                                    <TruckIcon className="w-3 h-3" />
                                    Track
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/collections/all" className="bg-primary-900 rounded-lg p-6 hover:bg-primary-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingBagIcon className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Continue Shopping</h3>
                        <p className="text-primary-400 text-sm">Explore our latest collections</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/account/wishlist" className="bg-primary-900 rounded-lg p-6 hover:bg-primary-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HeartIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">View Wishlist</h3>
                        <p className="text-primary-400 text-sm">Check your saved items</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/returns" className="bg-primary-900 rounded-lg p-6 hover:bg-primary-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowPathIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Returns & Refunds</h3>
                        <p className="text-primary-400 text-sm">Manage your returns</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-primary-900 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-white">{order.id}</h3>
                          <p className="text-primary-400 text-sm">{order.date}</p>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image src={order.image} alt="" fill className="object-cover" />
                          </div>
                          <span className="text-primary-300">+ 2 more items</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-white">₹{order.total.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Link href={`/account/orders/${order.id}`} className="text-accent-400 hover:text-accent-300 text-sm">
                                View Details
                              </Link>
                              {order.canTrack && (
                                <>
                                  <span className="text-primary-600">•</span>
                                  <Link 
                                    href={`/track?orderId=${order.id.replace('#', '')}`}
                                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                                  >
                                    <TruckIcon className="w-4 h-4" />
                                    Track
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
                  <Link
                    href="/wishlist"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <HeartIcon className="w-5 h-5" />
                    <span>Manage Wishlist</span>
                  </Link>
                </div>

                {/* Wishlist Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Total Items</p>
                        <p className="text-2xl font-bold text-white">{wishlistItems.length}</p>
                      </div>
                      <HeartIcon className="h-8 w-8 text-red-400" />
                    </div>
                  </div>
                  
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Collections</p>
                        <p className="text-2xl font-bold text-white">2</p>
                      </div>
                      <FolderIcon className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="bg-primary-900 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-400 text-sm">Price Alerts</p>
                        <p className="text-2xl font-bold text-white">1</p>
                      </div>
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-xs font-bold">↓</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-primary-900 rounded-lg p-6">
                    <h3 className="text-white font-medium mb-2">Recent Collections</h3>
                    <p className="text-primary-400 text-sm mb-4">
                      Organize your wishlist with collections
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">Winter Essentials</span>
                        <span className="text-primary-400">5 items</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">Spring Collection</span>
                        <span className="text-primary-400">3 items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary-900 rounded-lg p-6">
                    <h3 className="text-white font-medium mb-2">Price Drops</h3>
                    <p className="text-primary-400 text-sm mb-4">
                      Items with recent price reductions
                    </p>
                    <div className="text-green-400 text-sm">
                      ✓ Designer Hoodie - ₹300 OFF
                    </div>
                  </div>
                </div>

                {/* Recent Wishlist Items */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="bg-primary-900 rounded-lg p-4">
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                          <button className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                            <HeartIcon className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                        <h3 className="font-medium text-white mb-2">{item.name}</h3>
                        <p className="text-accent-400 font-semibold mb-4">₹{item.price.toLocaleString()}</p>
                        <button className="w-full bg-accent-500 hover:bg-accent-600 text-black py-2 rounded-lg font-semibold transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6">
                    <Link
                      href="/wishlist"
                      className="text-purple-400 hover:text-purple-300 font-medium"
                    >
                      View all wishlist items →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'returns' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Returns & Refunds</h2>
                <div className="bg-primary-900 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <ArrowPathIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Manage Your Returns</h3>
                    <p className="text-primary-400 mb-6">
                      Need to return an item? Our self-service returns portal makes it easy.
                    </p>
                    <Link
                      href="/returns"
                      className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                      <span>Go to Returns Portal</span>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-primary-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Easy Returns</h4>
                      <p className="text-primary-400 text-sm">
                        Start a return request in just a few clicks. No need to call customer service.
                      </p>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Track Progress</h4>
                      <p className="text-primary-400 text-sm">
                        Monitor your return status with real-time updates and tracking information.
                      </p>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Quick Refunds</h4>
                      <p className="text-primary-400 text-sm">
                        Get your money back within 5-7 business days after we receive your return.
                      </p>
                    </div>
                    <div className="bg-primary-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">30-Day Policy</h4>
                      <p className="text-primary-400 text-sm">
                        Return items within 30 days of delivery in original condition with tags.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="bg-primary-900 rounded-lg p-6">
                  <p className="text-primary-300">Profile management features coming soon...</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Saved Addresses</h2>
                <div className="bg-primary-900 rounded-lg p-6">
                  <p className="text-primary-300">Address management features coming soon...</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
