'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  EyeIcon,
  SparklesIcon,
  ServerIcon,
  PlusIcon,
  DocumentTextIcon,
  CogIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import GlassCard from '../../components/admin/GlassCard'
import Link from 'next/link'

interface DashboardData {
  revenue: {
    today: number
    yesterday: number
    week: number
    month: number
    trend: number[]
    percentageChange: number
  }
  orders: {
    total: number
    pending: number
    processing: number
    completed: number
    cancelled: number
    avgValue: number
  }
  customers: {
    total: number
    new: number
    active: number
    ltv: number
  }
  products: {
    total: number
    lowStock: number
    outOfStock: number
    topSelling: Array<{
      id: string
      name: string
      image: string
      unitsSold: number
      revenue: number
    }>
  }
  traffic: {
    activeUsers: number
    pageViews: number
    topPages: Array<{ page: string; views: number }>
    bounceRate: number
  }
  ai: {
    recommendations: number
    visualSearch: number
    chatbot: number
    sizeRec: number
  }
  systemHealth: {
    services: Array<{ name: string; status: 'up' | 'down'; responseTime: number }>
    avgResponseTime: number
    errorCount: number
  }
  recentActivity: {
    orders: Array<{
      id: string
      customerName: string
      amount: number
      status: string
      time: string
    }>
    signups: Array<{
      name: string
      email: string
      time: string
    }>
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const revenueChartData = {
    labels: ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', '1d ago', 'Today'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: dashboardData?.revenue.trend || [0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const ordersChartData = {
    labels: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [
          dashboardData?.orders.pending || 0,
          dashboardData?.orders.processing || 0,
          dashboardData?.orders.completed || 0,
          dashboardData?.orders.cancelled || 0,
        ],
        backgroundColor: [
          '#F59E0B',
          '#3B82F6',
          '#10B981',
          '#EF4444',
        ],
        borderWidth: 0,
      },
    ],
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-6 flex items-center justify-center">
        <GlassCard className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </GlassCard>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            FASHUN.CO Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Key Metrics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={cardVariants}
        >
          <GlassCard hover gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-white">₹{dashboardData?.revenue.today.toLocaleString()}</p>
                <p className="text-sm text-green-400 flex items-center mt-1">
                  ↗ {dashboardData?.revenue.percentageChange.toFixed(1)}% vs yesterday
                </p>
              </div>
              <CurrencyRupeeIcon className="w-8 h-8 text-purple-400" />
            </div>
          </GlassCard>

          <GlassCard hover gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.orders.total}</p>
                <p className="text-sm text-blue-400">Avg: ₹{dashboardData?.orders.avgValue.toLocaleString()}</p>
              </div>
              <ShoppingBagIcon className="w-8 h-8 text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard hover gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.traffic.activeUsers}</p>
                <p className="text-sm text-pink-400">Bounce: {dashboardData?.traffic.bounceRate}%</p>
              </div>
              <EyeIcon className="w-8 h-8 text-pink-400" />
            </div>
          </GlassCard>

          <GlassCard hover gradient>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-white">{dashboardData?.customers.total}</p>
                <p className="text-sm text-green-400">{dashboardData?.customers.new} new today</p>
              </div>
              <UsersIcon className="w-8 h-8 text-green-400" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Charts Row */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          variants={cardVariants}
        >
          <GlassCard>
            <h3 className="text-xl font-semibold text-white mb-4">Revenue Trend (7 Days)</h3>
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Revenue Chart</p>
                <p className="text-sm text-gray-500">Chart.js integration pending</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-semibold text-white mb-4">Orders by Status</h3>
            <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="bg-yellow-500/20 p-4 rounded-lg">
                    <p className="text-yellow-400 text-2xl font-bold">{dashboardData?.orders.pending || 0}</p>
                    <p className="text-yellow-300 text-sm">Pending</p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-lg">
                    <p className="text-blue-400 text-2xl font-bold">{dashboardData?.orders.processing || 0}</p>
                    <p className="text-blue-300 text-sm">Processing</p>
                  </div>
                  <div className="bg-green-500/20 p-4 rounded-lg">
                    <p className="text-green-400 text-2xl font-bold">{dashboardData?.orders.completed || 0}</p>
                    <p className="text-green-300 text-sm">Completed</p>
                  </div>
                  <div className="bg-red-500/20 p-4 rounded-lg">
                    <p className="text-red-400 text-2xl font-bold">{dashboardData?.orders.cancelled || 0}</p>
                    <p className="text-red-300 text-sm">Cancelled</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* System Health & AI Metrics */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          variants={cardVariants}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <ServerIcon className="w-5 h-5 mr-2" />
              System Health
            </h3>
            <div className="space-y-3">
              {dashboardData?.systemHealth.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <span className="text-gray-300">{service.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{service.responseTime}ms</span>
                    <div className={`w-3 h-3 rounded-full ${service.status === 'up' ? 'bg-green-400' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              AI Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Recommendations</span>
                <span className="text-purple-400">{dashboardData?.ai.recommendations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Visual Search</span>
                <span className="text-blue-400">{dashboardData?.ai.visualSearch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Chatbot</span>
                <span className="text-pink-400">{dashboardData?.ai.chatbot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Size Rec</span>
                <span className="text-green-400">{dashboardData?.ai.sizeRec}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/products" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <PlusIcon className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-gray-300">Add Product</span>
              </Link>
              <Link href="/admin/orders" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <DocumentTextIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span className="text-gray-300">Process Orders</span>
              </Link>
              <Link href="/admin/analytics" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <ChartBarIcon className="w-4 h-4 mr-3 text-pink-400" />
                <span className="text-gray-300">View Analytics</span>
              </Link>
              <Link href="/admin/api-keys" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <KeyIcon className="w-4 h-4 mr-3 text-green-400" />
                <span className="text-gray-300">Manage API Keys</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <CogIcon className="w-4 h-4 mr-3 text-yellow-400" />
                <span className="text-gray-300">System Settings</span>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={cardVariants}
        >
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {dashboardData?.recentActivity.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">#{order.id}</p>
                    <p className="text-gray-400 text-sm">{order.customerName}</p>
                    <p className="text-gray-500 text-xs">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">₹{order.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
            <div className="space-y-3">
              {dashboardData?.products.topSelling.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">{product.unitsSold} sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  )
}