'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EyeIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'payments', label: 'Payment Methods', icon: CreditCardIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ]

  const recentOrders = [
    {
      id: '#ORD-2025-001',
      date: '2025-10-02',
      status: 'delivered',
      total: 2499,
      items: 2,
      image: '/images/products/hoodies/hoodie-1-main.jpg'
    },
    {
      id: '#ORD-2025-002',
      date: '2025-10-01',
      status: 'shipped',
      total: 1899,
      items: 1,
      image: '/images/products/t-shirts/tshirt-1-main.jpg'
    },
    {
      id: '#ORD-2025-003',
      date: '2025-09-28',
      status: 'processing',
      total: 3299,
      items: 3,
      image: '/images/products/hoodies/hoodie-2-main.jpg'
    }
  ]

  const wishlistItems = [
    {
      id: 'w-1',
      name: 'Premium Street Hoodie',
      price: 2999,
      originalPrice: 3499,
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      inStock: true
    },
    {
      id: 'w-2',
      name: 'Graphic Design Tee',
      price: 1499,
      image: '/images/products/t-shirts/tshirt-2-main.jpg',
      inStock: false
    }
  ]

  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingBagIcon },
    { label: 'Wishlist Items', value: '8', icon: HeartIcon },
    { label: 'Rewards Points', value: '2,450', icon: ShieldCheckIcon },
    { label: 'Member Since', value: '2023', icon: UserIcon },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/20'
      case 'shipped': return 'text-blue-400 bg-blue-400/20'
      case 'processing': return 'text-yellow-400 bg-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <Image
              src="/images/products/hoodies/hoodie-1-main.jpg"
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 bg-accent-500 rounded-full p-1">
              <CheckCircleIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome back, John!</h2>
            <p className="text-primary-200">Premium Member since 2023</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-sm font-semibold">
                VIP Status
              </span>
              <span className="text-primary-300 text-sm">Next reward at ₹5,000</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="bg-primary-800/30 rounded-lg p-4 mb-2">
                <stat.icon className="w-6 h-6 text-accent-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <p className="text-primary-300 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Recent Orders</h3>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-accent-400 hover:text-accent-300 font-semibold text-sm flex items-center"
          >
            View All <ArrowRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {recentOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-primary-800/30 rounded-xl">
              <div className="flex items-center space-x-4">
                <Image
                  src={order.image}
                  alt="Order"
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{order.id}</p>
                  <p className="text-primary-300 text-sm">{order.items} items • ₹{order.total}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
                <p className="text-primary-300 text-sm mt-1">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveTab('wishlist')}
          className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-primary-900/50 transition-all"
        >
          <HeartIcon className="w-8 h-8 text-accent-400 mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">My Wishlist</h4>
          <p className="text-primary-300 text-sm">8 items saved for later</p>
        </button>

        <button className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-primary-900/50 transition-all">
          <TruckIcon className="w-8 h-8 text-accent-400 mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Track Orders</h4>
          <p className="text-primary-300 text-sm">2 orders in transit</p>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left hover:bg-primary-900/50 transition-all"
        >
          <BellIcon className="w-8 h-8 text-accent-400 mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Notifications</h4>
          <p className="text-primary-300 text-sm">Manage preferences</p>
        </button>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Order History</h3>
      <div className="space-y-6">
        {recentOrders.map((order) => (
          <div key={order.id} className="border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{order.id}</h4>
                <p className="text-primary-300">Placed on {order.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src={order.image}
                  alt="Order"
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div>
                  <p className="text-white">{order.items} items</p>
                  <p className="text-accent-400 font-semibold">₹{order.total}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="btn btn-ghost btn-sm text-accent-400 border-accent-400/30">
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button className="btn btn-ghost btn-sm text-white border-white/30">
                  Reorder
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview()
      case 'orders': return renderOrders()
      case 'wishlist': 
        return (
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">My Wishlist</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-primary-800/30 rounded-xl p-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={200}
                    height={200}
                    className="rounded-lg mb-4 w-full object-cover"
                  />
                  <h4 className="text-white font-semibold mb-2">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-accent-400 font-bold">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-primary-400 line-through ml-2 text-sm">₹{item.originalPrice}</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${item.inStock ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default: 
        return (
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
            <p className="text-primary-300">This section is under development.</p>
          </div>
        )
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">My Account</h1>
          <p className="text-primary-200">Manage your profile, orders, and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-1"
          >
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-400/30'
                        : 'text-primary-200 hover:bg-primary-800/30 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-white/10">
                <Link 
                  href="/collections/all" 
                  className="w-full btn btn-glass btn-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </main>
  )
}