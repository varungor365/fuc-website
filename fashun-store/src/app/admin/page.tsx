'use client'

import dynamic from 'next/dynamic'
import { Suspense, memo } from 'react'
import { motion } from 'framer-motion'
import { SparklesIcon, ChartBarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

// Lazy load heavy components
const KPIGrid = dynamic(() => import('./components/KPIGrid'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-3 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  )
})

const RevenueChart = dynamic(() => import('./components/RevenueChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-80 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="h-64 bg-gray-700 rounded"></div>
    </div>
  )
})

const RecentOrdersWidget = dynamic(() => import('./components/RecentOrdersWidget'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
})

const TopProductsWidget = dynamic(() => import('./components/TopProductsWidget'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
})

const LiveActivityWidget = dynamic(() => import('./components/LiveActivityWidget'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
})

const ConversionFunnel = dynamic(() => import('./components/ConversionFunnel'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-80 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
})

const LowStockAlerts = dynamic(() => import('./components/LowStockAlerts'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-700 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-700 rounded"></div>
        ))}
      </div>
    </div>
  )
})

// Memoized Hero component to prevent unnecessary re-renders
const HeroSection = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] border border-gray-800"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-[#E4C590]/5 to-transparent" />
    <div className="relative px-8 py-12">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E4C590] to-[#B8860B] flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-black" />
        </div>
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold font-['Montserrat'] text-[#E8E8E8]"
          >
            Welcome back to FASHUN.CO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-['Inter']"
          >
            Monitor your fashion empire with real-time insights and analytics
          </motion.p>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-6 text-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 font-medium">System Online</span>
        </div>
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-4 h-4 text-blue-400" />
          <span className="text-gray-400">Analytics Active</span>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingBagIcon className="w-4 h-4 text-purple-400" />
          <span className="text-gray-400">Orders Processing</span>
        </div>
      </motion.div>
    </div>
  </motion.div>
))

HeroSection.displayName = 'HeroSection'

// Memoized Quick Actions component
const QuickActions = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
  >
    <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8] mb-6">
      Quick Actions
    </h3>
    
    <div className="grid grid-cols-2 gap-4">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-lg bg-[#0F0F10] border border-gray-700 hover:border-[#E4C590]/50 transition-all duration-300 group"
      >
        <ShoppingBagIcon className="w-8 h-8 text-[#E4C590] mb-3 group-hover:scale-110 transition-transform" />
        <p className="text-[#E8E8E8] font-medium mb-1">New Order</p>
        <p className="text-gray-400 text-sm">Create manual order</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-lg bg-[#0F0F10] border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
      >
        <SparklesIcon className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
        <p className="text-[#E8E8E8] font-medium mb-1">Add Product</p>
        <p className="text-gray-400 text-sm">Launch new item</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-lg bg-[#0F0F10] border border-gray-700 hover:border-green-500/50 transition-all duration-300 group"
      >
        <ChartBarIcon className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
        <p className="text-[#E8E8E8] font-medium mb-1">View Report</p>
        <p className="text-gray-400 text-sm">Generate analytics</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-lg bg-[#0F0F10] border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
      >
        <SparklesIcon className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
        <p className="text-[#E8E8E8] font-medium mb-1">AI Insights</p>
        <p className="text-gray-400 text-sm">Smart analysis</p>
      </motion.button>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-6 p-4 rounded-lg bg-gradient-to-r from-[#E4C590]/10 to-transparent border border-[#E4C590]/20"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#E4C590]/20 flex items-center justify-center">
          <SparklesIcon className="w-4 h-4 text-[#E4C590]" />
        </div>
        <div>
          <p className="text-[#E8E8E8] font-medium text-sm">Pro Tip</p>
          <p className="text-gray-400 text-xs">Use AI insights to predict trending styles and optimize inventory</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
))

QuickActions.displayName = 'QuickActions'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* KPI Grid */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold font-['Montserrat'] text-[#E8E8E8] mb-6"
        >
          Key Performance Indicators
        </motion.h2>
        <Suspense fallback={<div>Loading KPIs...</div>}>
          <KPIGrid />
        </Suspense>
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns on XL screens */}
        <div className="xl:col-span-2">
          <Suspense fallback={<div>Loading chart...</div>}>
            <RevenueChart />
          </Suspense>
        </div>

        {/* Recent Orders - Right sidebar */}
        <div>
          <Suspense fallback={<div>Loading orders...</div>}>
            <RecentOrdersWidget />
          </Suspense>
        </div>
      </section>

      {/* Secondary Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Top Products */}
        <div>
          <Suspense fallback={<div>Loading products...</div>}>
            <TopProductsWidget />
          </Suspense>
        </div>

        {/* Live Activity */}
        <div>
          <Suspense fallback={<div>Loading activity...</div>}>
            <LiveActivityWidget />
          </Suspense>
        </div>

        {/* Conversion Funnel */}
        <div>
          <Suspense fallback={<div>Loading funnel...</div>}>
            <ConversionFunnel />
          </Suspense>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Low Stock Alerts - Full width on mobile, half on desktop */}
        <div>
          <Suspense fallback={<div>Loading alerts...</div>}>
            <LowStockAlerts />
          </Suspense>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </section>
    </div>
  )
}