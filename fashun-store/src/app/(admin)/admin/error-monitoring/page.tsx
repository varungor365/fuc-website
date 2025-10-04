'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  BugAntIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface ErrorLog {
  id: string
  level: 'error' | 'warning' | 'info'
  message: string
  stack?: string
  timestamp: string
  source: string
  userAgent?: string
  userId?: string
  resolved: boolean
  count: number
}

interface ErrorStats {
  total: number
  errors: number
  warnings: number
  info: number
  resolved: number
  lastHour: number
  last24Hours: number
}

export default function ErrorMonitoringPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats>({
    total: 0,
    errors: 0,
    warnings: 0,
    info: 0,
    resolved: 0,
    lastHour: 0,
    last24Hours: 0
  })
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading error logs
  useEffect(() => {
    setTimeout(() => {
      const mockErrors: ErrorLog[] = [
        {
          id: '1',
          level: 'error',
          message: 'Failed to process payment',
          stack: 'Error: Payment gateway timeout\n    at processPayment (payment.js:45:12)\n    at checkout (checkout.js:123:8)',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          source: '/api/payments/process',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          userId: 'user123',
          resolved: false,
          count: 3
        },
        {
          id: '2',
          level: 'warning',
          message: 'Slow database query detected',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          source: '/api/products/search',
          resolved: false,
          count: 15
        },
        {
          id: '3',
          level: 'error',
          message: 'Image upload failed',
          stack: 'Error: File size exceeds limit\n    at validateFile (upload.js:23:5)',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          source: '/api/upload',
          resolved: true,
          count: 1
        },
        {
          id: '4',
          level: 'info',
          message: 'High memory usage detected',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          source: 'system',
          resolved: false,
          count: 8
        }
      ]

      setErrors(mockErrors)
      setStats({
        total: mockErrors.length,
        errors: mockErrors.filter(e => e.level === 'error').length,
        warnings: mockErrors.filter(e => e.level === 'warning').length,
        info: mockErrors.filter(e => e.level === 'info').length,
        resolved: mockErrors.filter(e => e.resolved).length,
        lastHour: mockErrors.filter(e => Date.now() - new Date(e.timestamp).getTime() < 3600000).length,
        last24Hours: mockErrors.length
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredErrors = errors.filter(error => {
    if (selectedLevel === 'all') return true
    return error.level === selectedLevel
  })

  const markAsResolved = (id: string) => {
    setErrors(prev => prev.map(error =>
      error.id === id ? { ...error, resolved: true } : error
    ))
  }

  const clearResolved = () => {
    setErrors(prev => prev.filter(error => !error.resolved))
  }

  const getErrorIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-400" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />
      default:
        return <BugAntIcon className="w-5 h-5 text-primary-400" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'info':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default:
        return 'text-primary-400 bg-primary-500/20 border-primary-500/30'
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <ArrowPathIcon className="w-8 h-8 text-accent-400 animate-spin mx-auto mb-4" />
              <p className="text-primary-300">Loading error logs...</p>
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
              <div className="bg-red-500/20 p-3 rounded-xl">
                <BugAntIcon className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">Error Monitoring</h1>
                <p className="text-primary-300">Real-time application error tracking</p>
              </div>
            </div>

            <button
              onClick={clearResolved}
              className="btn btn-outline text-sm"
            >
              Clear Resolved
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-primary-300">Total</div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
              <div className="text-sm text-red-300">Errors</div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
              <div className="text-2xl font-bold text-yellow-400">{stats.warnings}</div>
              <div className="text-sm text-yellow-300">Warnings</div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <div className="text-2xl font-bold text-blue-400">{stats.info}</div>
              <div className="text-sm text-blue-300">Info</div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
              <div className="text-sm text-green-300">Resolved</div>
            </div>

            <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">{stats.lastHour}</div>
              <div className="text-sm text-primary-300">Last Hour</div>
            </div>

            <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-bold text-white">{stats.last24Hours}</div>
              <div className="text-sm text-primary-300">Last 24h</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-primary-400" />
            <div className="flex gap-2">
              {['all', 'error', 'warning', 'info'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-accent-500 text-primary-900'
                      : 'bg-primary-800/30 text-primary-300 hover:text-white'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error List */}
        <div className="space-y-4">
          {filteredErrors.map((error, index) => (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-accent-400/30 transition-all ${
                error.resolved ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedError(error)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {getErrorIcon(error.level)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(error.level)}`}>
                        {error.level.toUpperCase()}
                      </span>
                      
                      {error.count > 1 && (
                        <span className="bg-primary-700/30 text-primary-300 px-2 py-1 rounded text-xs">
                          {error.count}x
                        </span>
                      )}
                      
                      {error.resolved && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                          <CheckCircleIcon className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-medium mb-1">{error.message}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-primary-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {new Date(error.timestamp).toLocaleString()}
                      </div>
                      
                      <div>Source: {error.source}</div>
                      
                      {error.userId && (
                        <div>User: {error.userId}</div>
                      )}
                    </div>
                  </div>
                </div>

                {!error.resolved && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsResolved(error.id)
                    }}
                    className="btn btn-outline text-sm"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {filteredErrors.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">No Errors Found</h3>
                <p className="text-primary-300">
                  {selectedLevel === 'all' 
                    ? 'Great! No errors to display.' 
                    : `No ${selectedLevel} logs found.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Detail Modal */}
        {selectedError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedError(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-primary-900/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getErrorIcon(selectedError.level)}
                  <h2 className="text-xl font-semibold text-white">Error Details</h2>
                </div>
                
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-primary-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-primary-200 mb-2">Message</h3>
                  <p className="text-white bg-primary-800/30 rounded-xl p-4">{selectedError.message}</p>
                </div>

                {selectedError.stack && (
                  <div>
                    <h3 className="text-sm font-medium text-primary-200 mb-2">Stack Trace</h3>
                    <pre className="text-sm text-primary-300 bg-primary-800/30 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-primary-200 mb-2">Timestamp</h3>
                    <p className="text-white">{new Date(selectedError.timestamp).toLocaleString()}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-primary-200 mb-2">Source</h3>
                    <p className="text-white">{selectedError.source}</p>
                  </div>

                  {selectedError.userId && (
                    <div>
                      <h3 className="text-sm font-medium text-primary-200 mb-2">User ID</h3>
                      <p className="text-white">{selectedError.userId}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-primary-200 mb-2">Occurrences</h3>
                    <p className="text-white">{selectedError.count}</p>
                  </div>
                </div>

                {selectedError.userAgent && (
                  <div>
                    <h3 className="text-sm font-medium text-primary-200 mb-2">User Agent</h3>
                    <p className="text-sm text-primary-300 bg-primary-800/30 rounded-xl p-4 break-all">
                      {selectedError.userAgent}
                    </p>
                  </div>
                )}
              </div>

              {!selectedError.resolved && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => {
                      markAsResolved(selectedError.id)
                      setSelectedError(null)
                    }}
                    className="btn btn-glass"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  )
}