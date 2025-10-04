'use client';

import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Copy, Plus, Trash2, Shield, AlertTriangle } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: string | null;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  usage: {
    requests: number;
    limit: number;
  };
}

const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const availablePermissions = [
    'read:products',
    'write:products',
    'read:orders',
    'write:orders',
    'read:customers',
    'write:customers',
    'read:analytics',
    'admin:all'
  ];

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production API',
          key: 'sk_live_51H8vK2SIyUcF2cxYyR9Qx...',
          permissions: ['read:products', 'write:products', 'read:orders'],
          lastUsed: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          isActive: true,
          usage: { requests: 1250, limit: 10000 }
        },
        {
          id: '2',
          name: 'Development API',
          key: 'sk_test_51H8vK2SIyUcF2cxYyR9Qx...',
          permissions: ['read:products', 'read:orders'],
          lastUsed: '2024-01-14T15:45:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          isActive: true,
          usage: { requests: 456, limit: 1000 }
        }
      ];
      setApiKeys(mockKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim() || newKeyPermissions.length === 0) return;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 15)}...`,
      permissions: newKeyPermissions,
      lastUsed: null,
      createdAt: new Date().toISOString(),
      isActive: true,
      usage: { requests: 0, limit: 1000 }
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setNewKeyPermissions([]);
    setShowCreateForm(false);
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const togglePermission = (permission: string) => {
    setNewKeyPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const getPermissionBadgeColor = (permission: string) => {
    if (permission.includes('write') || permission === 'admin:all') {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  const getUsagePercentage = (usage: ApiKey['usage']) => {
    return (usage.requests / usage.limit) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-500/20 rounded-lg border border-accent-500/30">
            <Key className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">API Key Management</h2>
            <p className="text-gray-400">Manage API keys and their permissions</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 
                   text-white rounded-lg transition-all duration-200 font-medium"
        >
          <Plus className="w-4 h-4" />
          Create API Key
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-400 text-sm font-medium">Active Keys</p>
              <p className="text-2xl font-bold text-white">
                {apiKeys.filter(k => k.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Key className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-white">
                {apiKeys.reduce((sum, key) => sum + key.usage.requests, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-medium">Near Limit</p>
              <p className="text-2xl font-bold text-white">
                {apiKeys.filter(k => getUsagePercentage(k.usage) > 80).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Form */}
      {showCreateForm && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New API Key</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-accent-500 focus:border-transparent"
                placeholder="Enter key name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availablePermissions.map(permission => (
                  <button
                    key={permission}
                    onClick={() => togglePermission(permission)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      newKeyPermissions.includes(permission)
                        ? getPermissionBadgeColor(permission)
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {permission}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={createApiKey}
                disabled={!newKeyName.trim() || newKeyPermissions.length === 0}
                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-600 
                         disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
              >
                Create Key
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 
                         rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map(apiKey => (
          <div key={apiKey.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{apiKey.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apiKey.isActive 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {apiKey.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                  {apiKey.lastUsed && (
                    <span> • Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                  )}
                </p>
              </div>

              <button
                onClick={() => deleteApiKey(apiKey.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 
                         rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* API Key Value */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-300">API Key</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-black/20 rounded-lg border border-white/10">
                <code className="flex-1 text-sm text-white font-mono">
                  {visibleKeys.has(apiKey.id) ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                </code>
                <button
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(apiKey.key)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Usage</span>
                <span className="text-sm text-gray-400">
                  {apiKey.usage.requests.toLocaleString()} / {apiKey.usage.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getUsagePercentage(apiKey.usage) > 80 
                      ? 'bg-red-500' 
                      : getUsagePercentage(apiKey.usage) > 60 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(getUsagePercentage(apiKey.usage), 100)}%` }}
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <span className="text-sm font-medium text-gray-300 mb-2 block">Permissions</span>
              <div className="flex flex-wrap gap-2">
                {apiKey.permissions.map(permission => (
                  <span
                    key={permission}
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPermissionBadgeColor(permission)}`}
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <div className="text-center py-12">
          <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No API keys found</p>
          <p className="text-gray-500 text-sm">Create your first API key to get started</p>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManagement;