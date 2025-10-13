'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import GlassCard from '@/components/admin/GlassCard'

interface APIKey {
  id: string
  service: string
  keyName: string
  keyValue: string
  secretValue?: string
  status: 'active' | 'inactive' | 'expired'
  lastTested?: string
  createdAt: string
  updatedAt: string
}

interface ServiceConfig {
  name: string
  icon: string
  fields: Array<{
    name: string
    label: string
    type: 'password' | 'text' | 'url'
    required: boolean
    placeholder: string
  }>
  testable: boolean
  category: string
}

const serviceConfigs: Record<string, ServiceConfig> = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'sk-...' }
    ],
    testable: true,
    category: 'ai'
  },
  razorpay: {
    name: 'Razorpay',
    icon: '💳',
    fields: [
      { name: 'keyId', label: 'Key ID', type: 'text', required: true, placeholder: 'rzp_test_...' },
      { name: 'keySecret', label: 'Key Secret', type: 'password', required: true, placeholder: 'secret_...' }
    ],
    testable: true,
    category: 'payment'
  },
  stripe: {
    name: 'Stripe',
    icon: '💰',
    fields: [
      { name: 'publishableKey', label: 'Publishable Key', type: 'text', required: true, placeholder: 'pk_test_...' },
      { name: 'secretKey', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_test_...' }
    ],
    testable: true,
    category: 'payment'
  },
  strapi: {
    name: 'Strapi',
    icon: '📊',
    fields: [
      { name: 'apiToken', label: 'API Token', type: 'password', required: true, placeholder: 'Bearer token...' },
      { name: 'url', label: 'Strapi URL', type: 'url', required: true, placeholder: 'http://localhost:1337' }
    ],
    testable: true,
    category: 'cms'
  },
  googleAnalytics: {
    name: 'Google Analytics',
    icon: '📈',
    fields: [
      { name: 'measurementId', label: 'Measurement ID', type: 'text', required: true, placeholder: 'G-...' }
    ],
    testable: false,
    category: 'analytics'
  },
  sendgrid: {
    name: 'SendGrid',
    icon: '📧',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', required: true, placeholder: 'SG...' }
    ],
    testable: true,
    category: 'email'
  }
}

const categories = {
  ai: 'AI Services',
  payment: 'Payment Gateways',
  cms: 'CMS',
  analytics: 'Analytics',
  email: 'Email Services'
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, APIKey>>({})
  const [activeTab, setActiveTab] = useState('ai')
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; responseTime?: number }>>({})
  const [loading, setLoading] = useState(false)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const fetchAPIKeys = async () => {
    try {
      const response = await fetch('/api/admin/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
    }
  }

  const toggleKeyVisibility = (service: string, field: string) => {
    const keyId = `${service}-${field}`
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const testConnection = async (service: string) => {
    setLoading(true)
    try {
      const existingKey = apiKeys[service]
      if (!existingKey) {
        setTestResults(prev => ({ 
          ...prev, 
          [service]: { success: false, message: 'No API key configured' } 
        }))
        return
      }

      // Get the current form data for the service or use existing stored keys
      const config = serviceConfigs[service]
      let keyValue = ''
      let secretValue = ''
      
      if (editingService === service) {
        // Use form data if currently editing
        if (service === 'razorpay') {
          keyValue = formData.keyId || ''
          secretValue = formData.keySecret || ''
        } else if (service === 'stripe') {
          keyValue = formData.publishableKey || ''
          secretValue = formData.secretKey || ''
        } else if (service === 'strapi') {
          keyValue = formData.apiToken || ''
          secretValue = formData.url || ''
        } else {
          const firstField = config.fields[0]
          keyValue = formData[firstField.name] || ''
        }
      } else {
        // Use stored keys (they will be decrypted on the server)
        keyValue = existingKey.keyValue || ''
        secretValue = existingKey.secretValue || ''
      }

      const response = await fetch(`/api/admin/api-keys/${service}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyValue, secretValue })
      })
      
      const result = await response.json()
      setTestResults(prev => ({ ...prev, [service]: result }))
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [service]: { success: false, message: 'Connection failed' } 
      }))
    } finally {
      setLoading(false)
    }
  }

  const saveAPIKey = async (service: string) => {
    setLoading(true)
    try {
      const config = serviceConfigs[service]
      
      // Map form data to standard format
      let keyValue = ''
      let secretValue = ''
      let keyName = 'API Key'
      
      if (service === 'razorpay') {
        keyValue = formData.keyId || ''
        secretValue = formData.keySecret || ''
        keyName = 'Razorpay Keys'
      } else if (service === 'stripe') {
        keyValue = formData.publishableKey || ''
        secretValue = formData.secretKey || ''
        keyName = 'Stripe Keys'
      } else if (service === 'strapi') {
        keyValue = formData.apiToken || ''
        secretValue = formData.url || ''
        keyName = 'Strapi Config'
      } else {
        // For services with single field (openai, sendgrid, etc.)
        const firstField = config.fields[0]
        keyValue = formData[firstField.name] || ''
        keyName = firstField.label
      }

      const response = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service,
          keyName,
          keyValue,
          secretValue: secretValue || undefined
        })
      })

      if (response.ok) {
        await fetchAPIKeys()
        setEditingService(null)
        setFormData({})
      } else {
        const error = await response.json()
        console.error('Failed to save API key:', error)
      }
    } catch (error) {
      console.error('Failed to save API key:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (service: string) => {
    setEditingService(service)
    const existing = apiKeys[service]
    if (existing) {
      // Pre-populate form with existing data (masked)
      const config = serviceConfigs[service]
      const newFormData: Record<string, string> = {}
      config.fields.forEach(field => {
        newFormData[field.name] = existing.keyValue || ''
      })
      setFormData(newFormData)
    }
  }

  const maskKey = (key: string) => {
    if (!key || key.length <= 8) return key
    return key.slice(0, 4) + '••••••••' + key.slice(-4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-yellow-400'
      case 'expired': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon className="w-4 h-4" />
      case 'inactive': return <ClockIcon className="w-4 h-4" />
      case 'expired': return <ExclamationTriangleIcon className="w-4 h-4" />
      default: return <XMarkIcon className="w-4 h-4" />
    }
  }

  const filteredServices = Object.entries(serviceConfigs).filter(
    ([, config]) => config.category === activeTab
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
            API Key Management
          </h1>
          <p className="text-gray-300">
            Configure and manage API keys for external services and integrations.
          </p>
        </div>

        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(([serviceKey, config]) => {
            const existingKey = apiKeys[serviceKey]
            const isEditing = editingService === serviceKey
            const testResult = testResults[serviceKey]

            return (
              <motion.div
                key={serviceKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard hover>
                  {/* Service Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{config.name}</h3>
                        {existingKey && (
                          <div className={`flex items-center space-x-1 text-sm ${getStatusColor(existingKey.status)}`}>
                            {getStatusIcon(existingKey.status)}
                            <span className="capitalize">{existingKey.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {existingKey?.lastTested && (
                      <div className="text-xs text-gray-400">
                        Last tested: {new Date(existingKey.lastTested).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Configuration Form */}
                  {isEditing ? (
                    <div className="space-y-4">
                      {config.fields.map((field) => (
                        <div key={field.name}>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                          <div className="relative">
                            <input
                              type={field.type === 'password' && !visibleKeys.has(`${serviceKey}-${field.name}`) ? 'password' : 'text'}
                              value={formData[field.name] || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                              placeholder={field.placeholder}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            {field.type === 'password' && (
                              <button
                                type="button"
                                onClick={() => toggleKeyVisibility(serviceKey, field.name)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              >
                                {visibleKeys.has(`${serviceKey}-${field.name}`) ? (
                                  <EyeSlashIcon className="w-4 h-4" />
                                ) : (
                                  <EyeIcon className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => saveAPIKey(serviceKey)}
                          disabled={loading}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Existing Keys Display */}
                      {existingKey ? (
                        <div className="space-y-2">
                          {config.fields.map((field) => (
                            <div key={field.name} className="flex items-center justify-between">
                              <span className="text-gray-300 text-sm">{field.label}:</span>
                              <span className="text-white font-mono text-sm">
                                {maskKey(existingKey.keyValue)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-400">No API key configured</p>
                        </div>
                      )}

                      {/* Test Result */}
                      {testResult && (
                        <div className={`p-3 rounded-lg ${testResult.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          <div className="flex items-center justify-between">
                            <span className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                              {testResult.success ? '✓ Connected' : '✗ Failed'}
                            </span>
                            {testResult.responseTime && (
                              <span className="text-gray-400 text-sm">{testResult.responseTime}ms</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{testResult.message}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(serviceKey)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          {existingKey ? 'Edit' : 'Configure'}
                        </button>
                        {config.testable && existingKey && (
                          <button
                            onClick={() => testConnection(serviceKey)}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            <ShieldCheckIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Security Notice */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Security Notice</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• API keys are encrypted before storage</li>
                  <li>• Only the last 4 characters are displayed for security</li>
                  <li>• All API key changes are logged with timestamps</li>
                  <li>• Use strong, unique keys for each service</li>
                  <li>• Rotate keys regularly for enhanced security</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}