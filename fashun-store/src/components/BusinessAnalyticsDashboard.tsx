'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  CalendarIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  FunnelIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline'

interface DashboardOverview {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  conversionRate: number
  revenueGrowth: number
  orderGrowth: number
  customerGrowth: number
  profitMargin: number
}

interface QuickMetrics {
  todayRevenue: number
  todayOrders: number
  activeUsers: number
  conversionRate: number
}

interface TopProduct {
  id: number
  name: string
  sku: string
  unitsSold: number
  revenue: number
  profitMargin: number
  stockLevel: number
  trend: 'up' | 'down' | 'stable'
}

interface RecentActivity {
  type: string
  message: string
  time: string
}

interface Alert {
  type: 'warning' | 'info' | 'success' | 'error'
  message: string
  priority: 'high' | 'medium' | 'low'
}

export default function BusinessAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [salesData, setSalesData] = useState<any>(null)
  const [customerData, setCustomerData] = useState<any>(null)
  const [productData, setProductData] = useState<any>(null)
  const [trafficData, setTrafficData] = useState<any>(null)
  const [financialData, setFinancialData] = useState<any>(null)
  const [predictionsData, setPredictionsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const [
        dashboardRes,
        salesRes,
        customerRes,
        productRes,
        trafficRes,
        financialRes,
        predictionsRes
      ] = await Promise.all([
        fetch(`/api/analytics?period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=sales&period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=customers&period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=products&period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=traffic&period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=financial&period=${selectedPeriod}`),
        fetch(`/api/analytics?metric=predictions&period=${selectedPeriod}`)
      ])

      const [
        dashboard,
        sales,
        customer,
        product,
        traffic,
        financial,
        predictions
      ] = await Promise.all([
        dashboardRes.json(),
        salesRes.json(),
        customerRes.json(),
        productRes.json(),
        trafficRes.json(),
        financialRes.json(),
        predictionsRes.json()
      ])

      setDashboardData(dashboard.data)
      setSalesData(sales.data)
      setCustomerData(customer.data)
      setProductData(product.data)
      setTrafficData(traffic.data)
      setFinancialData(financial.data)
      setPredictionsData(predictions.data)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchAnalyticsData()
    setRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600'
    if (growth < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowTrendingUpIcon className="h-4 w-4" />
    if (growth < 0) return <ArrowTrendingDownIcon className="h-4 w-4" />
    return null
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default: return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and business intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'sales', name: 'Sales', icon: CurrencyRupeeIcon },
            { id: 'customers', name: 'Customers', icon: UserGroupIcon },
            { id: 'products', name: 'Products', icon: ShoppingCartIcon },
            { id: 'traffic', name: 'Traffic', icon: GlobeAltIcon },
            { id: 'financial', name: 'Financial', icon: BanknotesIcon },
            { id: 'predictions', name: 'Predictions', icon: DocumentChartBarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.overview.totalRevenue)}</p>
                </div>
                <div className="bg-green-500 rounded-lg p-3">
                  <CurrencyRupeeIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`flex items-center mt-2 ${getGrowthColor(dashboardData.overview.revenueGrowth)}`}>
                {getGrowthIcon(dashboardData.overview.revenueGrowth)}
                <span className="text-sm font-medium ml-1">
                  {dashboardData.overview.revenueGrowth > 0 ? '+' : ''}{dashboardData.overview.revenueGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalOrders)}</p>
                </div>
                <div className="bg-blue-500 rounded-lg p-3">
                  <ShoppingCartIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`flex items-center mt-2 ${getGrowthColor(dashboardData.overview.orderGrowth)}`}>
                {getGrowthIcon(dashboardData.overview.orderGrowth)}
                <span className="text-sm font-medium ml-1">
                  {dashboardData.overview.orderGrowth > 0 ? '+' : ''}{dashboardData.overview.orderGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalCustomers)}</p>
                </div>
                <div className="bg-purple-500 rounded-lg p-3">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className={`flex items-center mt-2 ${getGrowthColor(dashboardData.overview.customerGrowth)}`}>
                {getGrowthIcon(dashboardData.overview.customerGrowth)}
                <span className="text-sm font-medium ml-1">
                  {dashboardData.overview.customerGrowth > 0 ? '+' : ''}{dashboardData.overview.customerGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.conversionRate}%</p>
                </div>
                <div className="bg-orange-500 rounded-lg p-3">
                  <CursorArrowRaysIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-sm">Profit Margin: {dashboardData.overview.profitMargin}%</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.quickMetrics.todayRevenue)}</p>
                <p className="text-sm text-gray-600">Today's Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{dashboardData.quickMetrics.todayOrders}</p>
                <p className="text-sm text-gray-600">Today's Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatNumber(dashboardData.quickMetrics.activeUsers)}</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{dashboardData.quickMetrics.conversionRate}%</p>
                <p className="text-sm text-gray-600">Live Conversion</p>
              </div>
            </div>
          </div>

          {/* Top Products & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-4">
                {dashboardData.topProducts.map((product: TopProduct, index: number) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-gray-500">{product.unitsSold} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity: RecentActivity, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              {dashboardData.alerts.map((alert: Alert, index: number) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Total Revenue</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.metrics.totalRevenue)}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(salesData.metrics.revenueGrowth)}`}>
                {getGrowthIcon(salesData.metrics.revenueGrowth)}
                <span className="text-sm ml-1">{salesData.metrics.revenueGrowth}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Total Orders</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(salesData.metrics.totalOrders)}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(salesData.metrics.orderGrowth)}`}>
                {getGrowthIcon(salesData.metrics.orderGrowth)}
                <span className="text-sm ml-1">{salesData.metrics.orderGrowth}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Avg Order Value</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.metrics.averageOrderValue)}</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(salesData.metrics.aovGrowth)}`}>
                {getGrowthIcon(salesData.metrics.aovGrowth)}
                <span className="text-sm ml-1">{salesData.metrics.aovGrowth}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Conversion Rate</h4>
              <p className="text-2xl font-bold text-gray-900">{salesData.metrics.conversionRate}%</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(salesData.metrics.conversionGrowth)}`}>
                {getGrowthIcon(salesData.metrics.conversionGrowth)}
                <span className="text-sm ml-1">{salesData.metrics.conversionGrowth}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Refund Rate</h4>
              <p className="text-2xl font-bold text-gray-900">{salesData.metrics.refundRate}%</p>
              <div className={`flex items-center mt-1 ${getGrowthColor(-salesData.metrics.refundGrowth)}`}>
                {getGrowthIcon(-salesData.metrics.refundGrowth)}
                <span className="text-sm ml-1">{salesData.metrics.refundGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Sales Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
            <p className="text-gray-600">Daily revenue and order volume for the selected period</p>
            <div className="mt-4 h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">[Revenue & Orders Chart Placeholder]</p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Total Customers</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(customerData.insights.totalCustomers)}</p>
              <p className="text-sm text-gray-500 mt-1">Lifetime value: {formatCurrency(customerData.insights.averageLifetimeValue)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">New Customers</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(customerData.insights.newCustomers)}</p>
              <p className="text-sm text-gray-500 mt-1">Acquisition cost: {formatCurrency(customerData.insights.customerAcquisitionCost)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Retention Rate</h4>
              <p className="text-2xl font-bold text-gray-900">{customerData.insights.customerRetentionRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Churn rate: {customerData.insights.churnRate}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Returning Customers</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(customerData.insights.returningCustomers)}</p>
              <p className="text-sm text-gray-500 mt-1">Repeat purchase rate</p>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customerData.insights.topCustomerSegments.map((segment: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{segment.segment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(segment.customers)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(segment.revenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(segment.avgOrderValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && productData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Inventory Value</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(productData.analytics.inventoryMetrics.totalValue)}</p>
              <p className="text-sm text-gray-500 mt-1">Total stock value</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Turnover Rate</h4>
              <p className="text-2xl font-bold text-gray-900">{productData.analytics.inventoryMetrics.turnoverRate}x</p>
              <p className="text-sm text-gray-500 mt-1">Annual turnover</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Avg Days to Sell</h4>
              <p className="text-2xl font-bold text-gray-900">{productData.analytics.inventoryMetrics.avgDaysToSell}</p>
              <p className="text-sm text-gray-500 mt-1">Average sell-through</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Stock Issues</h4>
              <p className="text-2xl font-bold text-gray-900">{productData.analytics.inventoryMetrics.outOfStockItems}</p>
              <p className="text-sm text-gray-500 mt-1">Out of stock items</p>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit Margin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productData.analytics.topSellingProducts.map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(product.unitsSold)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.profitMargin}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stockLevel}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.trend === 'up' ? 'bg-green-100 text-green-800' :
                          product.trend === 'down' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'} {product.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Tab */}
      {activeTab === 'traffic' && trafficData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Total Sessions</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(trafficData.analytics.totalSessions)}</p>
              <p className="text-sm text-gray-500 mt-1">Unique: {formatNumber(trafficData.analytics.uniqueVisitors)}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Page Views</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(trafficData.analytics.pageViews)}</p>
              <p className="text-sm text-gray-500 mt-1">Per session: {trafficData.engagement.pagesPerSession}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Bounce Rate</h4>
              <p className="text-2xl font-bold text-gray-900">{trafficData.analytics.bounceRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Single page visits</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Avg Session</h4>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(trafficData.analytics.avgSessionDuration / 60)}m {trafficData.analytics.avgSessionDuration % 60}s</p>
              <p className="text-sm text-gray-500 mt-1">Duration</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Active Users</h4>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(trafficData.realTime.activeUsers)}</p>
              <p className="text-sm text-gray-500 mt-1">Right now</p>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
              <div className="space-y-4">
                {trafficData.analytics.deviceBreakdown.map((device: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {device.device === 'Mobile' ? <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" /> :
                       device.device === 'Desktop' ? <ComputerDesktopIcon className="h-5 w-5 text-gray-400" /> :
                       <DeviceTabletIcon className="h-5 w-5 text-gray-400" />}
                      <span className="text-sm font-medium text-gray-900">{device.device}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatNumber(device.sessions)}</p>
                      <p className="text-xs text-gray-500">{device.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Traffic Sources</h3>
              <div className="space-y-4">
                {trafficData.analytics.topTrafficSources.slice(0, 5).map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{source.source}</p>
                      <p className="text-xs text-gray-500">{source.conversionRate}% conversion</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatNumber(source.sessions)}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(source.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && financialData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Gross Profit</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.metrics.grossProfit)}</p>
              <p className="text-sm text-gray-500 mt-1">Margin: {financialData.metrics.profitMargin}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Net Profit</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.metrics.netProfit)}</p>
              <p className="text-sm text-gray-500 mt-1">After expenses</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Operating Expenses</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.metrics.operatingExpenses)}</p>
              <p className="text-sm text-gray-500 mt-1">Monthly average</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-gray-600">Cash Flow</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(financialData.metrics.cashFlow.netFlow)}</p>
              <p className="text-sm text-gray-500 mt-1">Net flow</p>
            </div>
          </div>

          {/* Revenue by Channel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Channel</h3>
            <div className="space-y-4">
              {financialData.metrics.revenueByChannel.map((channel: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{channel.channel}</p>
                    <div className="w-64 bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${channel.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(channel.revenue)}</p>
                    <p className={`text-xs ${getGrowthColor(channel.growth)}`}>
                      {channel.growth > 0 ? '+' : ''}{channel.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && predictionsData && (
        <div className="space-y-6">
          {/* Sales Forecast */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Forecast</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predictionsData.salesForecast.map((forecast: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600">{forecast.period}</h4>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(forecast.predictedRevenue)}</p>
                  <p className="text-sm text-gray-500 mt-1">{forecast.confidence}% confidence</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Based on:</p>
                    <ul className="text-xs text-gray-500 list-disc list-inside">
                      {forecast.factors.slice(0, 2).map((factor: string, i: number) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Predictions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Predictions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Predicted Demand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recommended Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictionsData.inventoryPredictions.map((prediction: any) => (
                    <tr key={prediction.productId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prediction.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prediction.predictedDemand} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prediction.recommendedStock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prediction.reorderDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Behavior Predictions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Behavior Predictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predictionsData.customerBehaviorPredictions.map((prediction: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900">{prediction.segment}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Churn Risk:</span>
                      <span className={`text-xs font-medium ${
                        prediction.churnRisk > 40 ? 'text-red-600' :
                        prediction.churnRisk > 20 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {prediction.churnRisk}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Expected LTV:</span>
                      <span className="text-xs font-medium text-gray-900">{formatCurrency(prediction.expectedLTV)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">Recommended Actions:</p>
                    <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                      {prediction.recommendedActions.slice(0, 2).map((action: string, i: number) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}