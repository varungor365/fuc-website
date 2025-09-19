import { Suspense } from 'react'
import { motion } from 'framer-motion'
import KPIGrid from './components/KPIGrid'
import RecentOrdersWidget from './components/RecentOrdersWidget'
import TopProductsWidget from './components/TopProductsWidget'
import LiveActivityWidget from './components/LiveActivityWidget'
import RevenueChart from './components/RevenueChart'
import ConversionFunnel from './components/ConversionFunnel'
import LowStockAlerts from './components/LowStockAlerts'

// Loading components
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 bg-[#1C1C1E] rounded-xl animate-pulse"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-64 bg-[#1C1C1E] rounded-xl animate-pulse"></div>
      ))}
    </div>
  </div>
)

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section with Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-xl bg-[#1C1C1E] border border-gray-800"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/api/placeholder/1200/300" 
            alt="Fashion Dashboard"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#E4C590]/10 to-transparent"></div>
        </div>

        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-['Montserrat'] text-[#E8E8E8] mb-2">
                Welcome back, Admin 👋
              </h1>
              <p className="text-gray-400 font-['Inter'] text-lg mb-6">
                Here's what's happening with FASHUN.CO today
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#E4C590] text-black font-medium rounded-lg hover:bg-[#E4C590]/90 transition-colors"
                >
                  Add Product
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#1C1C1E] border border-gray-700 text-[#E8E8E8] font-medium rounded-lg hover:border-[#E4C590]/50 transition-colors"
                >
                  View Reports
                </motion.button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F0F10]/80 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-[#E4C590]">₹47,580</p>
                <p className="text-emerald-400 text-sm">+15.2%</p>
              </div>
              <div className="bg-[#0F0F10]/80 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <p className="text-gray-400 text-sm">Live Visitors</p>
                <p className="text-2xl font-bold text-emerald-400">156</p>
                <p className="text-blue-400 text-sm">3 in cart</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main KPI Grid */}
      <Suspense fallback={<DashboardSkeleton />}>
        <KPIGrid />
      </Suspense>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-80 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<div className="h-80 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <ConversionFunnel />
        </Suspense>
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div className="h-96 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <RecentOrdersWidget />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <TopProductsWidget />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <LowStockAlerts />
        </Suspense>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-64 bg-[#1C1C1E] rounded-xl animate-pulse"></div>}>
          <LiveActivityWidget />
        </Suspense>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold font-['Montserrat'] text-[#E8E8E8] mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Create Campaign', color: 'from-purple-500 to-pink-500' },
              { name: 'Add Discount', color: 'from-blue-500 to-cyan-500' },
              { name: 'Manage Stock', color: 'from-green-500 to-emerald-500' },
              { name: 'View Analytics', color: 'from-orange-500 to-red-500' },
            ].map((action, index) => (
              <motion.button
                key={action.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className={`p-4 rounded-lg bg-gradient-to-r ${action.color} text-white font-medium text-sm hover:shadow-lg transition-all duration-300`}
              >
                {action.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage