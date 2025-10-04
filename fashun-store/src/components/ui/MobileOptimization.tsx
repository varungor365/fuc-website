'use client'

import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/24/outline'

interface MobileOptimizationMetrics {
  mobileTraffic: number
  mobileConversions: number
  mobilePageSpeed: number
  mobileUsability: number
  touchOptimization: number
  deviceBreakdown: {
    smartphone: number
    tablet: number
    desktop: number
  }
  popularPages: {
    path: string
    views: number
    bounceRate: number
  }[]
  performanceIssues: {
    type: 'speed' | 'layout' | 'usability' | 'touch'
    message: string
    severity: 'low' | 'medium' | 'high'
    page?: string
  }[]
}

interface MobileOptimizationProps {
  className?: string
  onOptimizationApplied?: (type: string) => void
}

export default function MobileOptimization({ 
  className = '',
  onOptimizationApplied 
}: MobileOptimizationProps) {
  const [metrics, setMetrics] = useState<MobileOptimizationMetrics | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<'smartphone' | 'tablet' | 'desktop'>('smartphone')
  const [isOptimizing, setIsOptimizing] = useState<string | null>(null)
  const [optimizationResults, setOptimizationResults] = useState<string[]>([])

  // Mock data - replace with real analytics
  useEffect(() => {
    const mockMetrics: MobileOptimizationMetrics = {
      mobileTraffic: 68.5,
      mobileConversions: 12.3,
      mobilePageSpeed: 78,
      mobileUsability: 85,
      touchOptimization: 92,
      deviceBreakdown: {
        smartphone: 58.2,
        tablet: 10.3,
        desktop: 31.5
      },
      popularPages: [
        { path: '/products', views: 15420, bounceRate: 32.1 },
        { path: '/collections/hoodies', views: 8930, bounceRate: 28.5 },
        { path: '/checkout', views: 3210, bounceRate: 45.2 },
        { path: '/cart', views: 2890, bounceRate: 52.1 }
      ],
      performanceIssues: [
        {
          type: 'speed',
          message: 'Image optimization needed on product pages',
          severity: 'medium',
          page: '/products'
        },
        {
          type: 'layout',
          message: 'Checkout form not optimized for mobile',
          severity: 'high',
          page: '/checkout'
        },
        {
          type: 'usability',
          message: 'Touch targets too small in navigation',
          severity: 'medium'
        }
      ]
    }
    
    setMetrics(mockMetrics)
  }, [])

  const optimizationStrategies = [
    {
      id: 'image-optimization',
      title: 'Image Optimization',
      description: 'Compress and resize images for mobile devices',
      impact: 'High',
      effort: 'Medium',
      speedImprovement: '+15-25%',
      action: async () => {
        setIsOptimizing('image-optimization')
        // Simulate optimization process
        await new Promise(resolve => setTimeout(resolve, 3000))
        setOptimizationResults(prev => [...prev, 'Images optimized for mobile devices'])
        setIsOptimizing(null)
        onOptimizationApplied?.('image-optimization')
      }
    },
    {
      id: 'touch-targets',
      title: 'Touch Target Optimization',
      description: 'Ensure all interactive elements are touch-friendly (44px minimum)',
      impact: 'High',
      effort: 'Low',
      speedImprovement: 'UX Improvement',
      action: async () => {
        setIsOptimizing('touch-targets')
        await new Promise(resolve => setTimeout(resolve, 2000))
        setOptimizationResults(prev => [...prev, 'Touch targets optimized for better mobile usability'])
        setIsOptimizing(null)
        onOptimizationApplied?.('touch-targets')
      }
    },
    {
      id: 'lazy-loading',
      title: 'Lazy Loading Implementation',
      description: 'Load images and content as users scroll',
      impact: 'Medium',
      effort: 'Low',
      speedImprovement: '+10-20%',
      action: async () => {
        setIsOptimizing('lazy-loading')
        await new Promise(resolve => setTimeout(resolve, 2500))
        setOptimizationResults(prev => [...prev, 'Lazy loading implemented for better performance'])
        setIsOptimizing(null)
        onOptimizationApplied?.('lazy-loading')
      }
    },
    {
      id: 'responsive-forms',
      title: 'Responsive Form Optimization',
      description: 'Optimize forms for mobile input and validation',
      impact: 'High',
      effort: 'Medium',
      speedImprovement: 'Conversion +15%',
      action: async () => {
        setIsOptimizing('responsive-forms')
        await new Promise(resolve => setTimeout(resolve, 4000))
        setOptimizationResults(prev => [...prev, 'Forms optimized for mobile conversion'])
        setIsOptimizing(null)
        onOptimizationApplied?.('responsive-forms')
      }
    }
  ]

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'smartphone':
        return <DevicePhoneMobileIcon className="w-5 h-5" />
      case 'tablet':
        return <DeviceTabletIcon className="w-5 h-5" />
      case 'desktop':
        return <ComputerDesktopIcon className="w-5 h-5" />
      default:
        return <DevicePhoneMobileIcon className="w-5 h-5" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-50 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  if (!metrics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mobile Optimization Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Optimize your site for mobile users and improve conversion rates
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.mobileTraffic}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Traffic</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Of total visitors</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.mobileConversions}%
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Conversions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Conversion rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(metrics.mobilePageSpeed)}`}>
              {metrics.mobilePageSpeed}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Page Speed Score</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Google PageSpeed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <EyeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className={`text-2xl font-bold ${getScoreColor(metrics.mobileUsability)}`}>
              {metrics.mobileUsability}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Usability Score</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mobile experience</p>
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Device Breakdown
        </h3>
        
        <div className="flex space-x-2 mb-4">
          {(['smartphone', 'tablet', 'desktop'] as const).map((device) => (
            <button
              key={device}
              onClick={() => setSelectedDevice(device)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                selectedDevice === device
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {getDeviceIcon(device)}
              <span className="capitalize">{device}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics.deviceBreakdown).map(([device, percentage]) => (
            <div key={device} className="text-center">
              <div className="mb-2">
                {getDeviceIcon(device)}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {percentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {device}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Issues */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Issues
        </h3>
        
        <div className="space-y-3">
          {metrics.performanceIssues.map((issue, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{issue.message}</p>
                  {issue.page && (
                    <p className="text-sm opacity-75">Page: {issue.page}</p>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase px-2 py-1 rounded">
                  {issue.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Strategies */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Optimization Strategies
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationStrategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {strategy.title}
                </h4>
                <div className="flex space-x-2 text-xs">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    {strategy.impact} Impact
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                    {strategy.effort} Effort
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {strategy.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {strategy.speedImprovement}
                </span>
                
                <button
                  onClick={strategy.action}
                  disabled={isOptimizing === strategy.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isOptimizing === strategy.id
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-wait'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                  }`}
                >
                  {isOptimizing === strategy.id ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span>Optimizing...</span>
                    </div>
                  ) : (
                    'Apply Optimization'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optimization Results */}
      {optimizationResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            ✅ Optimization Results
          </h3>
          <ul className="space-y-2">
            {optimizationResults.map((result, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2 text-green-700 dark:text-green-300"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>{result}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Popular Mobile Pages */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Popular Mobile Pages
        </h3>
        
        <div className="space-y-3">
          {metrics.popularPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{page.path}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {page.views.toLocaleString()} views
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  page.bounceRate > 40 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {page.bounceRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">bounce rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}