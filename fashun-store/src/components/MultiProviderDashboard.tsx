'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  CloudIcon,
  BeakerIcon,
  ScissorsIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ProviderStatus {
  status: string;
  latency?: number;
  error?: string;
}

interface ProviderHealth {
  [key: string]: ProviderStatus;
}

const providerInfo = {
  freepik: {
    name: 'Freepik API',
    description: 'Premium AI-generated fashion images with professional quality',
    icon: CpuChipIcon,
    color: 'from-blue-500 to-purple-500',
    tier: 'Primary',
    features: ['Professional Models', 'Fashion Optimized', 'Commercial Use']
  },
  pexels: {
    name: 'Pexels',
    description: 'High-quality free stock photos with generous API limits',
    icon: CloudIcon,
    color: 'from-teal-500 to-green-500',
    tier: 'Secondary',
    features: ['Free High-Res', 'No Attribution Required', 'High Daily Limits']
  },
  hugging_face: {
    name: 'Hugging Face',
    description: 'Open-source AI models with generous free tier',
    icon: BeakerIcon,
    color: 'from-green-500 to-teal-500',
    tier: 'Tertiary',
    features: ['Free Tier', 'Multiple Models', 'Community Driven']
  },
  replicate: {
    name: 'Replicate',
    description: 'Latest cutting-edge models via simple API',
    icon: CloudIcon,
    color: 'from-orange-500 to-red-500',
    tier: 'Quaternary',
    features: ['Latest Models', 'Easy Integration', 'High Quality']
  },
  clipdrop: {
    name: 'ClipDrop API',
    description: 'Stability AI suite with image tools and generation',
    icon: ScissorsIcon,
    color: 'from-purple-500 to-pink-500',
    tier: 'Final Fallback',
    features: ['Multiple Tools', 'Background Removal', 'AI Upscaling']
  }
};

const MultiProviderDashboard = () => {
  const [providerHealth, setProviderHealth] = useState<ProviderHealth>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchProviderHealth = async () => {
    try {
      const response = await fetch('/api/ai-generate');
      const data = await response.json();
      
      if (data.success) {
        setProviderHealth(data.providers);
        setLastUpdate(new Date(data.timestamp));
      }
    } catch (error) {
      console.error('Failed to fetch provider health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderHealth();
    
    if (autoRefresh) {
      const interval = setInterval(fetchProviderHealth, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'unhealthy':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'unhealthy':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
    }
  };

  const getLatencyColor = (latency?: number) => {
    if (!latency) return 'text-gray-500';
    if (latency < 1000) return 'text-green-600';
    if (latency < 3000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const healthyProviders = Object.values(providerHealth).filter(p => p.status === 'healthy').length;
  const totalProviders = Object.keys(providerHealth).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <ShieldCheckIcon className="w-6 h-6" />
            Multi-Provider AI Dashboard
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            🤖 AI Provider Health
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Monitor the health and performance of all AI generation providers. 
            Automatic fallback ensures 100% uptime for your design needs.
          </motion.p>
        </div>

        {/* System Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">System Status</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh</span>
              </label>
              <button
                onClick={fetchProviderHealth}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {healthyProviders}/{totalProviders}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Healthy Providers</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((healthyProviders / Math.max(totalProviders, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Object.values(providerHealth).reduce((avg, p) => avg + (p.latency || 0), 0) / Math.max(totalProviders, 1)}ms
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Update</div>
            </div>
          </div>
        </div>

        {/* Provider Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(providerInfo).map(([key, info]) => {
            const status = providerHealth[key];
            const IconComponent = info.icon;
            
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Object.keys(providerInfo).indexOf(key) }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{info.name}</h4>
                      <div className={`text-xs px-2 py-1 rounded-full ${info.tier === 'Primary' ? 'bg-green-100 text-green-700' : info.tier === 'Secondary' ? 'bg-blue-100 text-blue-700' : info.tier === 'Tertiary' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                        {info.tier}
                      </div>
                    </div>
                  </div>
                  
                  {status && (
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status.status)}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(status.status)}`}>
                        {status.status}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{info.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {info.features.map((feature, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                
                {status && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    {status.latency && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Response Time:</span>
                        <span className={`text-sm font-medium ${getLatencyColor(status.latency)}`}>
                          {status.latency}ms
                        </span>
                      </div>
                    )}
                    
                    {status.error && (
                      <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {status.error}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Fallback Flow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Automatic Fallback Flow</h3>
          
          <div className="flex items-center justify-between overflow-x-auto">
            {Object.entries(providerInfo).map(([key, info], index) => {
              const status = providerHealth[key];
              const isHealthy = status?.status === 'healthy';
              
              return (
                <React.Fragment key={key}>
                  <div className="flex flex-col items-center min-w-0 flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-colors ${
                      isHealthy 
                        ? 'border-green-500 bg-green-100 dark:bg-green-900/20' 
                        : 'border-red-500 bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <info.icon className={`w-8 h-8 ${isHealthy ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div className="text-center mt-2">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{info.name}</div>
                      <div className="text-xs text-gray-500">{info.tier}</div>
                    </div>
                  </div>
                  
                  {index < Object.entries(providerInfo).length - 1 && (
                    <div className="flex items-center px-4">
                      <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="w-0 h-0 border-l-8 border-l-gray-300 border-y-4 border-y-transparent ml-1"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>How it works:</strong> When you request AI generation, the system automatically tries providers in order. 
              If the primary provider fails, it instantly falls back to the next available provider, ensuring your request always succeeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiProviderDashboard;