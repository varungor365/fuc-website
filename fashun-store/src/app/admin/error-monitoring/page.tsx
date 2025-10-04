'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import GlassCard from '@/components/admin/GlassCard'

interface ErrorLog {
  id: string
  type: 'javascript' | 'api' | 'network' | 'render'
  message: string
  stack: string
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'new' | 'acknowledged' | 'resolved' | 'ignored'
  count: number
  firstSeen: string
  lastSeen: string
  metadata?: {
    componentStack?: string
    apiEndpoint?: string
    statusCode?: number
    breadcrumbs?: Array<{
      timestamp: string
      category: string
      message: string
      data?: any
    }>
    userContext?: {
      email: string
      name: string
      role: string
    }
    deviceInfo?: {
      browser: string
      os: string
      screenSize: string
    }
    performanceMetrics?: {
      loadTime: number
      apiResponseTime: number
    }
  }
}

interface ErrorStats {
  totalToday: number
  totalWeek: number
  totalMonth: number
  errorRate: number
  affectedUsers: number
  criticalErrors: number
}

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/50',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/50'
}

const statusColors = {
  new: 'bg-red-500/20 text-red-400',
  acknowledged: 'bg-yellow-500/20 text-yellow-400',
  resolved: 'bg-green-500/20 text-green-400',
  ignored: 'bg-gray-500/20 text-gray-400'
}

export default function ErrorMonitoringPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats | null>(null)
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    type: 'all',
    timeRange: '24h'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    fetchErrors()
    fetchStats()
  }, [filters])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchErrors()
        fetchStats()
      }, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, filters])

  const fetchErrors = async () => {
    try {
      const params = new URLSearchParams(filters as any)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/admin/errors?${params}`)
      if (response.ok) {
        const data = await response.json()
        setErrors(data.errors)
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/errors/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch error stats:', error)
    }
  }

  const updateErrorStatus = async (errorId: string, status: string) => {
    try {
      await fetch(`/api/admin/errors/${errorId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchErrors()
    } catch (error) {
      console.error('Failed to update error status:', error)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
      case 'medium':
        return <InformationCircleIcon className="w-5 h-5 text-yellow-400" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />
    }
  }

  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredErrors = errors.filter(error => {
    if (searchQuery && !error.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filters.severity !== 'all' && error.severity !== filters.severity) {
      return false
    }
    if (filters.status !== 'all' && error.status !== filters.status) {
      return false
    }
    if (filters.type !== 'all' && error.type !== filters.type) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Error Monitoring
            </h1>
            <p className="text-gray-300">
              Real-time error tracking and monitoring dashboard.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                autoRefresh
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <ArrowPathIcon className="w-4 h-4 inline mr-2" />
              Auto Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.totalToday}</p>
                <p className="text-gray-400 text-sm">Errors Today</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{stats.totalWeek}</p>
                <p className="text-gray-400 text-sm">This Week</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{stats.totalMonth}</p>
                <p className="text-gray-400 text-sm">This Month</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.errorRate.toFixed(2)}</p>
                <p className="text-gray-400 text-sm">Errors/Min</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{stats.affectedUsers}</p>
                <p className="text-gray-400 text-sm">Affected Users</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{stats.criticalErrors}</p>
                <p className="text-gray-400 text-sm">Critical</p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search errors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Filters */}
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="ignored">Ignored</option>
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="javascript">JavaScript</option>
                <option value="api">API</option>
                <option value="network">Network</option>
                <option value="render">Render</option>
              </select>
            </div>
          </GlassCard>
        </motion.div>

        {/* Error List */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <GlassCard>
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading errors...</p>
              </div>
            </GlassCard>
          ) : filteredErrors.length === 0 ? (
            <GlassCard>
              <div className="text-center py-8">
                <CheckIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Errors Found</h3>
                <p className="text-gray-400">
                  {searchQuery || Object.values(filters).some(f => f !== 'all') 
                    ? 'Try adjusting your filters or search query.'
                    : 'Your application is running smoothly!'}
                </p>
              </div>
            </GlassCard>
          ) : (
            filteredErrors.map((error) => (
              <GlassCard key={error.id} hover onClick={() => setSelectedError(error)}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getSeverityIcon(error.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${severityColors[error.severity]}`}>
                        {error.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[error.status]}`}>
                        {error.status.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-xs">{error.type}</span>
                      {error.count > 1 && (
                        <span className="bg-red-500/20 text-red-400 px-2 py-1 text-xs rounded-full">
                          {error.count}x
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-medium mb-1 truncate">{error.message}</h3>
                    <p className="text-gray-400 text-sm mb-2 truncate">{error.url}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>First: {getRelativeTime(error.firstSeen)}</span>
                      <span>Last: {getRelativeTime(error.lastSeen)}</span>
                      {error.userId && <span>User: {error.userId}</span>}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateErrorStatus(error.id, error.status === 'acknowledged' ? 'resolved' : 'acknowledged')
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <CheckIcon className="w-4 h-4 text-green-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedError(error)
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </motion.div>

        {/* Error Detail Modal */}
        {selectedError && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Error Details</h2>
                <button
                  onClick={() => setSelectedError(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                {/* Error Info */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Error Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div><span className="text-gray-400">Message:</span> <span className="text-white">{selectedError.message}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white">{selectedError.type}</span></div>
                    <div><span className="text-gray-400">Severity:</span> <span className="text-white">{selectedError.severity}</span></div>
                    <div><span className="text-gray-400">URL:</span> <span className="text-blue-400">{selectedError.url}</span></div>
                    <div><span className="text-gray-400">User Agent:</span> <span className="text-white text-sm">{selectedError.userAgent}</span></div>
                  </div>
                </div>

                {/* Stack Trace */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Stack Trace</h3>
                  <pre className="bg-black/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                    {selectedError.stack}
                  </pre>
                </div>

                {/* Metadata */}
                {selectedError.metadata && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3">Additional Information</h3>
                    <pre className="bg-black/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                      {JSON.stringify(selectedError.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}