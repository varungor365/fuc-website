'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowPathIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    trend: 'up' | 'down'
  }
  orders: {
    total: number
    change: number
    trend: 'up' | 'down'
  }
  customers: {
    total: number
    change: number
    trend: 'up' | 'down'
  }
  pageViews: {
    total: number
    change: number
    trend: 'up' | 'down'
  }
  conversionRate: {
    value: number
    change: number
    trend: 'up' | 'down'
  }
  avgOrderValue: {
    value: number
    change: number
    trend: 'up' | 'down'
  }
}

interface ChartData {
  labels: string[]
  revenue: number[]
  orders: number[]
  visitors: number[]
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading analytics data
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setAnalyticsData({
        revenue: {
          total: 125000,
          change: 12.5,
          trend: 'up'
        },
        orders: {
          total: 324,
          change: -5.2,
          trend: 'down'
        },
        customers: {
          total: 1247,
          change: 8.3,
          trend: 'up'
        },
        pageViews: {
          total: 15420,
          change: 15.7,
          trend: 'up'
        },
        conversionRate: {
          value: 2.8,
          change: 0.3,
          trend: 'up'
        },
        avgOrderValue: {
          value: 386,
          change: 22.1,
          trend: 'up'
        }
      })

      setChartData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        revenue: [18000, 22000, 19500, 25000, 28000, 32000, 30000],
        orders: [45, 52, 48, 61, 68, 75, 72],
        visitors: [1200, 1450, 1380, 1650, 1820, 2100, 1950]
      })
      setIsLoading(false)
    }, 1000)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
    )
  }

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400'
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 text-accent-400 animate-spin mx-auto mb-4" />
              <p className="text-primary-300">Loading analytics...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-accent-500/20 p-3 rounded-xl">
                <ChartBarIcon className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">Analytics</h1>
                <p className="text-primary-300">Comprehensive business insights and metrics</p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              {['24h', '7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-accent-500 text-primary-900'
                      : 'text-primary-300 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {analyticsData && (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Revenue */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.revenue.trend)}`}>
                    {getTrendIcon(analyticsData.revenue.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.revenue.change > 0 ? '+' : ''}{analyticsData.revenue.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(analyticsData.revenue.total)}
                </div>
                <div className="text-sm text-primary-300">Total Revenue</div>
              </div>

              {/* Orders */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-xl">
                    <ShoppingCartIcon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.orders.trend)}`}>
                    {getTrendIcon(analyticsData.orders.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.orders.change > 0 ? '+' : ''}{analyticsData.orders.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatNumber(analyticsData.orders.total)}
                </div>
                <div className="text-sm text-primary-300">Total Orders</div>
              </div>

              {/* Customers */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <UserGroupIcon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.customers.trend)}`}>
                    {getTrendIcon(analyticsData.customers.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.customers.change > 0 ? '+' : ''}{analyticsData.customers.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatNumber(analyticsData.customers.total)}
                </div>
                <div className="text-sm text-primary-300">Total Customers</div>
              </div>

              {/* Page Views */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-500/20 p-3 rounded-xl">
                    <EyeIcon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.pageViews.trend)}`}>
                    {getTrendIcon(analyticsData.pageViews.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.pageViews.change > 0 ? '+' : ''}{analyticsData.pageViews.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatNumber(analyticsData.pageViews.total)}
                </div>
                <div className="text-sm text-primary-300">Page Views</div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-accent-500/20 p-3 rounded-xl">
                    <ChartBarIcon className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.conversionRate.trend)}`}>
                    {getTrendIcon(analyticsData.conversionRate.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.conversionRate.change > 0 ? '+' : ''}{analyticsData.conversionRate.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {analyticsData.conversionRate.value}%
                </div>
                <div className="text-sm text-primary-300">Conversion Rate</div>
              </div>

              {/* Average Order Value */}
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-pink-500/20 p-3 rounded-xl">
                    <CurrencyDollarIcon className="w-6 h-6 text-pink-400" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(analyticsData.avgOrderValue.trend)}`}>
                    {getTrendIcon(analyticsData.avgOrderValue.trend)}
                    <span className="text-sm font-medium">
                      {analyticsData.avgOrderValue.change > 0 ? '+' : ''}{analyticsData.avgOrderValue.change}%
                    </span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(analyticsData.avgOrderValue.value)}
                </div>
                <div className="text-sm text-primary-300">Avg Order Value</div>
              </div>
            </motion.div>

            {/* Charts Section */}
            {chartData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
              >
                {/* Revenue Chart */}
                <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
                  <div className="space-y-4">
                    {chartData.labels.map((label, index) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-sm text-primary-300">{label}</div>
                          <div className="w-full bg-primary-800/30 rounded-full h-2 flex-1 max-w-xs">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(chartData.revenue[index] / Math.max(...chartData.revenue)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium text-white min-w-0">
                          {formatCurrency(chartData.revenue[index])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders Chart */}
                <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Orders Trend</h3>
                  <div className="space-y-4">
                    {chartData.labels.map((label, index) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-sm text-primary-300">{label}</div>
                          <div className="w-full bg-primary-800/30 rounded-full h-2 flex-1 max-w-xs">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(chartData.orders[index] / Math.max(...chartData.orders)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium text-white min-w-0">
                          {formatNumber(chartData.orders[index])}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Top Products Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-6">Top Performing Products</h3>
              <div className="space-y-4">
                {[
                  { name: 'Premium Streetwear Hoodie', sales: 145, revenue: 21750 },
                  { name: 'Designer Cargo Pants', sales: 132, revenue: 19800 },
                  { name: 'Limited Edition Sneakers', sales: 98, revenue: 29400 },
                  { name: 'Graphic T-Shirt Collection', sales: 87, revenue: 13050 },
                  { name: 'Urban Jacket Series', sales: 76, revenue: 22800 }
                ].map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-primary-800/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-accent-400">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{product.name}</div>
                        <div className="text-sm text-primary-300">{product.sales} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{formatCurrency(product.revenue)}</div>
                      <div className="text-xs text-primary-400">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}