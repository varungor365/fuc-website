'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GlassCard from '@/components/admin/GlassCard'
import { useErrorTracking } from '@/lib/errorTracking'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
    timeline: { date: string; value: number }[]
  }
  orders: {
    total: number
    completed: number
    pending: number
    cancelled: number
    timeline: { date: string; orders: number; revenue: number }[]
  }
  customers: {
    total: number
    new: number
    returning: number
    churnRate: number
    timeline: { date: string; new: number; returning: number }[]
  }
  products: {
    totalViews: number
    topProducts: { id: string; name: string; views: number; revenue: number; image: string }[]
    categoryBreakdown: { category: string; sales: number; revenue: number }[]
  }
  traffic: {
    totalVisits: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
    sources: { source: string; visitors: number; percentage: number }[]
  }
  conversion: {
    rate: number
    funnel: { step: string; visitors: number; percentage: number }[]
  }
}

interface DateRange {
  start: Date
  end: Date
  label: string
}

const DATE_RANGES: DateRange[] = [
  { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date(), label: 'Last 7 days' },
  { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date(), label: 'Last 30 days' },
  { start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), end: new Date(), label: 'Last 3 months' },
  { start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), end: new Date(), label: 'Last year' }
]

export default function AdminAnalyticsPage() {
  const { logError, addBreadcrumb } = useErrorTracking()
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_RANGES[1])
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders' | 'customers' | 'traffic'>('revenue')

  useEffect(() => {
    addBreadcrumb('navigation', 'Accessed Analytics Dashboard')
    fetchAnalyticsData()
  }, [selectedDateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual API call
      const mockData: AnalyticsData = {
        revenue: {
          current: 24567.89,
          previous: 21234.56,
          change: 15.7,
          timeline: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            value: Math.floor(Math.random() * 2000) + 500
          })).reverse()
        },
        orders: {
          total: 432,
          completed: 387,
          pending: 28,
          cancelled: 17,
          timeline: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            orders: Math.floor(Math.random() * 20) + 5,
            revenue: Math.floor(Math.random() * 2000) + 500
          })).reverse()
        },
        customers: {
          total: 1247,
          new: 89,
          returning: 158,
          churnRate: 12.3,
          timeline: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new: Math.floor(Math.random() * 10) + 2,
            returning: Math.floor(Math.random() * 15) + 3
          })).reverse()
        },
        products: {
          totalViews: 12547,
          topProducts: [
            { id: '1', name: 'Premium Streetwear Hoodie', views: 1247, revenue: 8934.56, image: '/api/placeholder/60/60' },
            { id: '2', name: 'Limited Edition Graphic Tee', views: 987, revenue: 4567.89, image: '/api/placeholder/60/60' },
            { id: '3', name: 'Designer Denim Jacket', views: 876, revenue: 6789.34, image: '/api/placeholder/60/60' },
            { id: '4', name: 'Urban Cargo Pants', views: 654, revenue: 3456.78, image: '/api/placeholder/60/60' },
            { id: '5', name: 'Street Classic Sneakers', views: 543, revenue: 5432.10, image: '/api/placeholder/60/60' }
          ],
          categoryBreakdown: [
            { category: 'Hoodies', sales: 156, revenue: 14234.56 },
            { category: 'T-Shirts', sales: 243, revenue: 8976.34 },
            { category: 'Jackets', sales: 87, revenue: 12456.78 },
            { category: 'Pants', sales: 134, revenue: 7654.32 },
            { category: 'Shoes', sales: 98, revenue: 9876.54 }
          ]
        },
        traffic: {
          totalVisits: 15678,
          uniqueVisitors: 8934,
          bounceRate: 34.5,
          avgSessionDuration: 245, // seconds
          sources: [
            { source: 'Organic Search', visitors: 4523, percentage: 50.6 },
            { source: 'Direct', visitors: 2134, percentage: 23.9 },
            { source: 'Social Media', visitors: 1456, percentage: 16.3 },
            { source: 'Email', visitors: 567, percentage: 6.3 },
            { source: 'Referral', visitors: 254, percentage: 2.9 }
          ]
        },
        conversion: {
          rate: 3.42,
          funnel: [
            { step: 'Visitors', visitors: 8934, percentage: 100 },
            { step: 'Product Views', visitors: 6234, percentage: 69.8 },
            { step: 'Add to Cart', visitors: 1456, percentage: 23.4 },
            { step: 'Checkout Started', visitors: 567, percentage: 38.9 },
            { step: 'Purchase Completed', visitors: 305, percentage: 53.8 }
          ]
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnalyticsData(mockData)
    } catch (error) {
      logError(error as Error, { context: 'fetchAnalyticsData' })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400'
    if (change < 0) return 'text-red-400'
    return 'text-white/60'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗'
    if (change < 0) return '↘'
    return '→'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="text-white/60">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-400 mb-4">Failed to load analytics data</p>
            <button
              onClick={() => fetchAnalyticsData()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-white/60">Track performance and gain intelligent insights</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Date Range Selector */}
            <select
              value={selectedDateRange.label}
              onChange={(e) => {
                const range = DATE_RANGES.find(r => r.label === e.target.value)
                if (range) setSelectedDateRange(range)
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {DATE_RANGES.map((range) => (
                <option key={range.label} value={range.label} className="bg-gray-800">
                  {range.label}
                </option>
              ))}
            </select>
            
            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              onClick={() => {/* TODO: Implement export */}}
            >
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className={`flex items-center text-sm font-medium ${getChangeColor(analyticsData.revenue.change)}`}>
                <span>{getChangeIcon(analyticsData.revenue.change)}</span>
                <span className="ml-1">{Math.abs(analyticsData.revenue.change)}%</span>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.revenue.current)}</p>
              <p className="text-white/60 text-xs mt-1">vs {formatCurrency(analyticsData.revenue.previous)} last period</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex items-center text-sm font-medium text-blue-400">
                <span>↗</span>
                <span className="ml-1">8.2%</span>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Orders</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.orders.total)}</p>
              <p className="text-white/60 text-xs mt-1">{analyticsData.orders.completed} completed</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex items-center text-sm font-medium text-purple-400">
                <span>↗</span>
                <span className="ml-1">12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Customers</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.customers.total)}</p>
              <p className="text-white/60 text-xs mt-1">{analyticsData.customers.new} new this period</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex items-center text-sm font-medium text-orange-400">
                <span>↗</span>
                <span className="ml-1">3.4%</span>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{analyticsData.conversion.rate}%</p>
              <p className="text-white/60 text-xs mt-1">From {formatNumber(analyticsData.traffic.uniqueVisitors)} visitors</p>
            </div>
          </GlassCard>
        </div>

        {/* Metric Toggle Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['revenue', 'orders', 'customers', 'traffic'] as const).map((metric) => (
            <motion.button
              key={metric}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveMetric(metric)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                activeMetric === metric
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 h-96">
              <h3 className="text-xl font-semibold text-white mb-4 capitalize">{activeMetric} Timeline</h3>
              
              {/* Simple Chart Visualization */}
              <div className="relative h-64 flex items-end gap-1 overflow-hidden">
                {activeMetric === 'revenue' && analyticsData.revenue.timeline.map((point, index) => {
                  const maxValue = Math.max(...analyticsData.revenue.timeline.map(p => p.value))
                  const height = (point.value / maxValue) * 100
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.02 }}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-sm min-w-[8px] hover:from-blue-500 hover:to-purple-400 transition-colors"
                      title={`${point.date}: ${formatCurrency(point.value)}`}
                    />
                  )
                })}
                
                {activeMetric === 'orders' && analyticsData.orders.timeline.map((point, index) => {
                  const maxValue = Math.max(...analyticsData.orders.timeline.map(p => p.orders))
                  const height = (point.orders / maxValue) * 100
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.02 }}
                      className="flex-1 bg-gradient-to-t from-green-600 to-emerald-500 rounded-t-sm min-w-[8px] hover:from-green-500 hover:to-emerald-400 transition-colors"
                      title={`${point.date}: ${point.orders} orders`}
                    />
                  )
                })}
                
                {activeMetric === 'customers' && analyticsData.customers.timeline.map((point, index) => {
                  const maxValue = Math.max(...analyticsData.customers.timeline.map(p => p.new + p.returning))
                  const height = ((point.new + point.returning) / maxValue) * 100
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.02 }}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm min-w-[8px] hover:from-purple-500 hover:to-pink-400 transition-colors"
                      title={`${point.date}: ${point.new} new, ${point.returning} returning`}
                    />
                  )
                })}
                
                {activeMetric === 'traffic' && analyticsData.revenue.timeline.map((point, index) => {
                  const maxValue = Math.max(...analyticsData.revenue.timeline.map(p => p.value))
                  const height = (point.value / maxValue) * 100
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: index * 0.02 }}
                      className="flex-1 bg-gradient-to-t from-orange-600 to-yellow-500 rounded-t-sm min-w-[8px] hover:from-orange-500 hover:to-yellow-400 transition-colors"
                      title={`${point.date}: Traffic data`}
                    />
                  )
                })}
              </div>
              
              <p className="text-white/60 text-sm mt-4">
                Hover over bars to see detailed values • Data for {selectedDateRange.label.toLowerCase()}
              </p>
            </GlassCard>
          </div>

          {/* Traffic Sources */}
          <div>
            <GlassCard className="p-6 h-96">
              <h3 className="text-xl font-semibold text-white mb-4">Traffic Sources</h3>
              
              <div className="space-y-4">
                {analyticsData.traffic.sources.map((source, index) => (
                  <motion.div
                    key={source.source}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{source.source}</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${source.percentage}%` }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-white text-sm">{formatNumber(source.visitors)}</p>
                      <p className="text-white/60 text-xs">{source.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Top Products</h3>
            
            <div className="space-y-4">
              {analyticsData.products.topProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{product.name}</p>
                    <p className="text-white/60 text-sm">{formatNumber(product.views)} views</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-green-400 text-sm">#{index + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Conversion Funnel */}
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Conversion Funnel</h3>
            
            <div className="space-y-3">
              {analyticsData.conversion.funnel.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{step.step}</span>
                    <div className="text-right">
                      <span className="text-white">{formatNumber(step.visitors)}</span>
                      <span className="text-white/60 text-sm ml-2">({step.percentage}%)</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${step.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                      className={`h-3 rounded-full ${
                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        index === 2 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                        index === 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}