'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
  VideoCameraIcon,
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface CampaignTemplate {
  id: number
  name: string
  type: 'email' | 'social' | 'banner' | 'sms'
  category: string
  subject?: string
  content: string
  variables: string[]
  thumbnail: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  usage: number
  performance: {
    openRate?: number
    clickRate?: number
    conversionRate?: number
    engagement?: number
  }
}

interface Campaign {
  id: number
  name: string
  type: 'email' | 'social' | 'banner' | 'sms'
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
  templateId: number
  audience: {
    segments: string[]
    totalRecipients: number
    filters: any[]
  }
  schedule: {
    startDate: string
    endDate?: string
    frequency?: string
    timezone: string
  }
  content: {
    subject?: string
    body: string
    images: string[]
    cta: { text: string; url: string }[]
  }
  analytics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface ContentAsset {
  id: number
  name: string
  type: 'image' | 'video' | 'gif' | 'template'
  category: string
  url: string
  thumbnail: string
  size: number
  dimensions?: { width: number; height: number }
  tags: string[]
  usageCount: number
  createdAt: string
}

export default function MarketingCampaignDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<CampaignTemplate[]>([])
  const [assets, setAssets] = useState<ContentAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    category: '',
    dateRange: '30d'
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [dashboardRes, campaignsRes, templatesRes, assetsRes] = await Promise.all([
        fetch('/api/marketing/campaigns'),
        fetch('/api/marketing/campaigns?endpoint=campaigns'),
        fetch('/api/marketing/campaigns?endpoint=templates'),
        fetch('/api/marketing/campaigns?endpoint=assets')
      ])

      const [dashboard, campaignsData, templatesData, assetsData] = await Promise.all([
        dashboardRes.json(),
        campaignsRes.json(),
        templatesRes.json(),
        assetsRes.json()
      ])

      setDashboardData(dashboard.data)
      setCampaigns(campaignsData.data.campaigns)
      setTemplates(templatesData.data.templates)
      setAssets(assetsData.data.assets)
    } catch (error) {
      console.error('Failed to fetch marketing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <EnvelopeIcon className="h-5 w-5" />
      case 'social': return <MegaphoneIcon className="h-5 w-5" />
      case 'sms': return <DevicePhoneMobileIcon className="h-5 w-5" />
      case 'banner': return <PhotoIcon className="h-5 w-5" />
      default: return <ChartBarIcon className="h-5 w-5" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
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
          <h1 className="text-3xl font-bold text-gray-900">Marketing Campaigns</h1>
          <p className="text-gray-600">Manage your marketing content and campaigns</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
            { id: 'campaigns', name: 'Campaigns', icon: MegaphoneIcon },
            { id: 'templates', name: 'Templates', icon: DocumentDuplicateIcon },
            { id: 'assets', name: 'Assets', icon: PhotoIcon },
            { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon }
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 rounded-lg p-3">
                  <MegaphoneIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-lg p-3">
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeCampaigns}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 rounded-lg p-3">
                  <DocumentDuplicateIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalTemplates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-500 rounded-lg p-3">
                  <BanknotesIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.overview.totalRevenue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Open Rate</span>
                  <span className="text-sm font-medium text-gray-900">{dashboardData.overview.avgPerformance.openRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Click Rate</span>
                  <span className="text-sm font-medium text-gray-900">{dashboardData.overview.avgPerformance.clickRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Conversion Rate</span>
                  <span className="text-sm font-medium text-gray-900">{dashboardData.overview.avgPerformance.conversionRate}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(dashboardData.quickStats.emailsSent)}</p>
                  <p className="text-sm text-gray-600">Emails Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dashboardData.quickStats.socialPosts}</p>
                  <p className="text-sm text-gray-600">Social Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{formatNumber(dashboardData.quickStats.smsSent)}</p>
                  <p className="text-sm text-gray-600">SMS Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(dashboardData.quickStats.totalConversions)}</p>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
            <div className="space-y-4">
              {dashboardData.recentCampaigns.map((campaign: Campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 rounded-lg p-2">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatNumber(campaign.analytics.sent)} sent • {formatNumber(campaign.analytics.converted)} conversions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(campaign.analytics.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="email">Email</option>
                <option value="social">Social</option>
                <option value="sms">SMS</option>
                <option value="banner">Banner</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Campaigns</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                          <div className="text-sm text-gray-500">Created {new Date(campaign.createdAt).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(campaign.type)}
                          <span className="text-sm text-gray-900 capitalize">{campaign.type}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatNumber(campaign.audience.totalRecipients)} recipients</div>
                        <div className="text-sm text-gray-500">{campaign.audience.segments.join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.analytics.sent > 0 && (
                            <>
                              {((campaign.analytics.opened / campaign.analytics.sent) * 100).toFixed(1)}% open
                              <br />
                              {((campaign.analytics.clicked / campaign.analytics.sent) * 100).toFixed(1)}% click
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(campaign.analytics.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        {campaign.status === 'active' ? (
                          <button className="text-yellow-600 hover:text-yellow-900">
                            Pause
                          </button>
                        ) : (
                          <button className="text-green-600 hover:text-green-900">
                            Start
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      template.type === 'email' ? 'bg-blue-100 text-blue-800' :
                      template.type === 'social' ? 'bg-green-100 text-green-800' :
                      template.type === 'sms' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {template.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{template.usage} uses</span>
                    </div>
                    {template.performance.conversionRate && (
                      <span className="text-sm text-green-600 font-medium">
                        {template.performance.conversionRate}% conversion
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
                      Use Template
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      asset.type === 'image' ? 'bg-blue-100 text-blue-800' :
                      asset.type === 'video' ? 'bg-red-100 text-red-800' :
                      asset.type === 'gif' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {asset.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{asset.name}</h4>
                  <p className="text-xs text-gray-500">{(asset.size / 1024).toFixed(1)} KB</p>
                  <p className="text-xs text-gray-500">{asset.usageCount} uses</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open Rate</span>
                  <span className="text-sm font-medium">27.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Click Rate</span>
                  <span className="text-sm font-medium">4.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">1.0%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="text-sm font-medium">8.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Click Rate</span>
                  <span className="text-sm font-medium">2.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">0.22%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Rate</span>
                  <span className="text-sm font-medium">98.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Click Rate</span>
                  <span className="text-sm font-medium">12.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">2.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}