'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  KeyIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed?: string
  createdAt: string
  isActive: boolean
}

const permissions = [
  'orders:read',
  'orders:write',
  'products:read',
  'products:write',
  'customers:read',
  'customers:write',
  'analytics:read',
  'webhooks:manage'
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [] as string[]
  })

  // Load API keys
  useEffect(() => {
    // Simulate loading API keys
    setApiKeys([
      {
        id: '1',
        name: 'Main API Key',
        key: 'sk_live_51HZ2qEL...',
        permissions: ['orders:read', 'products:read'],
        lastUsed: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        isActive: true
      },
      {
        id: '2',
        name: 'Analytics Key',
        key: 'sk_live_52AB3fGM...',
        permissions: ['analytics:read'],
        lastUsed: '2024-01-14T15:45:00Z',
        createdAt: '2024-01-05T00:00:00Z',
        isActive: true
      }
    ])
  }, [])

  const generateApiKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = 'sk_live_'
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const createApiKey = () => {
    if (!newKey.name || newKey.permissions.length === 0) return

    const apiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKey.name,
      key: generateApiKey(),
      permissions: newKey.permissions,
      createdAt: new Date().toISOString(),
      isActive: true
    }

    setApiKeys(prev => [...prev, apiKey])
    setNewKey({ name: '', permissions: [] })
    setShowCreateForm(false)
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id))
  }

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const copyToClipboard = async (key: string, id: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(id)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const togglePermission = (permission: string) => {
    setNewKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
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
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent-500/20 p-3 rounded-xl">
              <KeyIcon className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white">API Keys</h1>
              <p className="text-primary-300">Manage API keys for third-party integrations</p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-glass flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Create New Key
          </button>
        </motion.div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-primary-900/90 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Create New API Key</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-2">
                    Key Name
                  </label>
                  <input
                    type="text"
                    value={newKey.name}
                    onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter a descriptive name"
                    className="w-full bg-primary-800/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-200 mb-3">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {permissions.map(permission => (
                      <label
                        key={permission}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={newKey.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="w-4 h-4 text-accent-500 bg-primary-800/30 border-white/10 rounded focus:ring-accent-400/50"
                        />
                        <span className="text-sm text-primary-200">{permission}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  disabled={!newKey.name || newKey.permissions.length === 0}
                  className="flex-1 btn btn-glass disabled:opacity-50"
                >
                  Create Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* API Keys List */}
        <div className="grid gap-6">
          {apiKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-3xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{apiKey.name}</h3>
                  <p className="text-sm text-primary-300">
                    Created {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                  {apiKey.lastUsed && (
                    <p className="text-xs text-primary-400">
                      Last used {new Date(apiKey.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apiKey.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* API Key Display */}
              <div className="bg-primary-800/30 border border-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 font-mono text-sm text-primary-200">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                  </div>
                  
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-1 text-primary-400 hover:text-white transition-colors"
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeSlashIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    className="p-1 text-primary-400 hover:text-white transition-colors"
                  >
                    {copiedKey === apiKey.id ? (
                      <CheckIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-sm font-medium text-primary-200 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map(permission => (
                    <span
                      key={permission}
                      className="bg-accent-500/20 text-accent-400 px-2 py-1 rounded text-xs font-medium"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {apiKeys.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                <KeyIcon className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">No API Keys</h3>
                <p className="text-primary-300 mb-8">
                  Create your first API key to start integrating with external services.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn btn-glass"
                >
                  Create API Key
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6"
        >
          <div className="flex gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Security Best Practices</h4>
              <ul className="text-sm text-yellow-300/80 space-y-1">
                <li>• Store API keys securely and never expose them in client-side code</li>
                <li>• Use the minimum required permissions for each key</li>
                <li>• Rotate keys regularly and revoke unused ones</li>
                <li>• Monitor API key usage and set up alerts for unusual activity</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}