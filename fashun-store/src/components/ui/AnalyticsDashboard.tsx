'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  EyeIcon,
  UserIcon,
  ShoppingCartIcon,
  CursorArrowRaysIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { analytics, trackEvent, trackPageView } from '@/lib/analytics';
import { pagefonts } from '@/lib/simpleFonts';

interface AnalyticsStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    // Verify analytics on component mount
    const status = analytics.verify();
    setIsTrackingEnabled(status.googleAnalytics);
  }, []);

  const mockStats: AnalyticsStat[] = [
    {
      title: 'Page Views',
      value: '12,543',
      change: '+12.5%',
      changeType: 'positive',
      icon: EyeIcon
    },
    {
      title: 'Unique Visitors',
      value: '8,432',
      change: '+8.2%',
      changeType: 'positive',
      icon: UserIcon
    },
    {
      title: 'Cart Additions',
      value: '1,234',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingCartIcon
    },
    {
      title: 'Click Rate',
      value: '3.45%',
      change: '-2.1%',
      changeType: 'negative',
      icon: CursorArrowRaysIcon
    },
    {
      title: 'Avg. Session',
      value: '2m 34s',
      change: '+5.7%',
      changeType: 'positive',
      icon: ClockIcon
    },
    {
      title: 'Mobile Users',
      value: '68.2%',
      change: '+3.2%',
      changeType: 'positive',
      icon: DevicePhoneMobileIcon
    }
  ];

  const runAnalyticsTest = () => {
    const results: string[] = [];
    
    try {
      // Test page view tracking
      trackPageView(window.location.href, 'Analytics Dashboard Test');
      results.push('✅ Page view tracked');

      // Test custom event
      trackEvent('test_event', 'Dashboard', 'Analytics Test', 1);
      results.push('✅ Custom event tracked');

      // Test e-commerce event (mock)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'INR',
          value: 2999,
          items: [{
            item_id: 'test-hoodie-001',
            item_name: 'Test Analytics Hoodie',
            category: 'hoodies',
            quantity: 1,
            price: 2999,
          }],
        });
        results.push('✅ E-commerce event tracked');
      }

      results.push(`📊 Analytics Status: ${isTrackingEnabled ? 'Active' : 'Inactive'}`);
      results.push(`⏰ Test completed at: ${new Date().toLocaleTimeString()}`);
      
    } catch (error) {
      results.push(`❌ Error: ${error}`);
    }

    setTestResults(results);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 mb-4"
        >
          <ChartBarIcon className="w-8 h-8 text-purple-400" />
          <h1 className={`${pagefonts.headers.primary.className} text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent`}>
            Analytics Dashboard
          </h1>
        </motion.div>
        <p className={`${pagefonts.homepage.secondary.className} text-xl text-gray-300 max-w-3xl mx-auto`}>
          Real-time tracking and insights for FASHUN.CO with Google Analytics Integration
        </p>
        
        {/* Status Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            isTrackingEnabled 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isTrackingEnabled ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="text-sm font-medium">
              Google Analytics: {isTrackingEnabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            ID: G-PG5EQP2E0W
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
        {mockStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-400' :
                stat.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Test Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`${pagefonts.headers.secondary.className} text-2xl font-bold text-white mb-2`}>
              Analytics Testing
            </h2>
            <p className="text-gray-400">
              Test Google Analytics tracking functionality and view real-time events
            </p>
          </div>
          <motion.button
            onClick={runAnalyticsTest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2"
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>Run Test</span>
          </motion.button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 p-4 bg-black/20 rounded-xl border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-3">Test Results:</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm text-gray-300 font-mono">
                  {result}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-purple-600/10 border border-purple-500/30 rounded-xl">
          <h3 className="text-lg font-semibold text-purple-300 mb-3">📊 Analytics Setup Complete!</h3>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• Google Analytics tracking code (G-PG5EQP2E0W) is installed in the site header</p>
            <p>• Page views, events, and e-commerce actions are being tracked</p>
            <p>• Check your Google Analytics dashboard for real-time data</p>
            <p>• All user interactions with cart, login, and products are monitored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;