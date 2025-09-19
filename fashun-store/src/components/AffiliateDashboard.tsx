'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  LinkIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  BellIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknotesIcon,
  GiftIcon,
  MegaphoneIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid, StarIcon } from '@heroicons/react/24/solid'

interface AffiliateDashboardProps {
  affiliateId?: string
}

export default function AffiliateDashboard({ affiliateId = 'aff-1' }: AffiliateDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showPayoutModal, setShowPayoutModal] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'commissions', label: 'Commissions', icon: CurrencyRupeeIcon },
    { id: 'payouts', label: 'Payouts', icon: BanknotesIcon },
    { id: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
    { id: 'promotional', label: 'Content', icon: PhotoIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon }
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [affiliateId])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/affiliate?affiliateId=${affiliateId}&action=dashboard`)
      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyAffiliateLink = async () => {
    if (dashboardData?.affiliate) {
      const affiliateLink = `https://fashun.co.in?ref=${dashboardData.affiliate.affiliateCode}`
      await navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'approved':
        return 'bg-green-500/20 text-green-400'
      case 'paid':
        return 'bg-blue-500/20 text-blue-400'
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'completed':
        return <CheckCircleSolid className="w-4 h-4" />
      case 'pending':
      case 'processing':
        return <ClockIcon className="w-4 h-4" />
      case 'failed':
      case 'suspended':
        return <XCircleIcon className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading affiliate dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Dashboard Not Available</h2>
          <p className="text-gray-400">Unable to load affiliate dashboard data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Affiliate Dashboard</h1>
              <p className="text-gray-400">Welcome back, {dashboardData.affiliate.personalInfo.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border text-sm font-medium ${getStatusColor(dashboardData.affiliate.status)}`}>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(dashboardData.affiliate.status)}
                  <span className="capitalize">{dashboardData.affiliate.status}</span>
                </div>
              </div>
              <button className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Affiliate Info Card */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Your Affiliate Code</h3>
                <div className="flex items-center space-x-4">
                  <code className="bg-black/30 px-4 py-2 rounded-lg text-purple-300 font-mono">
                    {dashboardData.affiliate.affiliateCode}
                  </code>
                  <button
                    onClick={copyAffiliateLink}
                    className="flex items-center space-x-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Commission Rate</p>
                <p className="text-2xl font-bold text-green-400">{dashboardData.affiliate.commissionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Earnings Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <CurrencyRupeeIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Total Earnings</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(dashboardData.earnings.total)}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Pending Earnings</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(dashboardData.earnings.pending)}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <UsersIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Total Clicks</h3>
                  <p className="text-2xl font-bold text-white">{dashboardData.affiliate.performance.clickCount.toLocaleString()}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <ChartBarIcon className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-white">{dashboardData.affiliate.performance.conversionRate}%</p>
                </div>
              </div>

              {/* Recent Commissions */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Commissions</h2>
                  <Link href="#" className="text-purple-400 hover:text-purple-300">View All</Link>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentCommissions.map((commission: any) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                          <GiftIcon className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{commission.productName}</h4>
                          <p className="text-sm text-gray-400">Order {commission.orderId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{formatCurrency(commission.commissionAmount)}</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(commission.status)}`}>
                          {getStatusIcon(commission.status)}
                          <span className="capitalize">{commission.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Content */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Available Content</h2>
                  <Link href="#" className="text-purple-400 hover:text-purple-300">View All</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboardData.promotionalContent.slice(0, 2).map((content: any) => (
                    <div key={content.id} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-white">{content.title}</h4>
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                          {content.type.replace('_', ' ')}
                        </span>
                      </div>
                      {content.content.imageUrl && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                          <Image
                            src={content.content.imageUrl}
                            alt={content.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm text-gray-300 mb-3">{content.content.description}</p>
                      <div className="flex items-center space-x-2">
                        <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                          Download
                        </button>
                        <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-500 transition-colors">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'commissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Commission History</h2>
              {/* Commission history table would go here */}
              <div className="text-center py-12">
                <ChartBarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Commission history component will be implemented here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'payouts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Payout Summary */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Payout Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Available Balance</h3>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(dashboardData.earnings.total - (dashboardData.earnings.lastPayout?.amount || 0))}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Last Payout</h3>
                    <p className="text-xl font-semibold text-white">
                      {dashboardData.earnings.lastPayout ? formatCurrency(dashboardData.earnings.lastPayout.amount) : 'None'}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-gray-400 text-sm mb-1">Min. Payout</h3>
                    <p className="text-xl font-semibold text-white">{formatCurrency(1000)}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Request Payout
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Performance Analytics</h2>
              <div className="text-center py-12">
                <ArrowTrendingUpIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Analytics charts and metrics will be implemented here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'promotional' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Promotional Content</h2>
              <div className="text-center py-12">
                <PhotoIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Promotional content library will be implemented here</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="text-center py-12">
                <CogIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Settings panel will be implemented here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payout Modal */}
        <AnimatePresence>
          {showPayoutModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPayoutModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Request Payout</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Payment Method</label>
                    <select className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}