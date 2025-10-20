'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  QrCode,
  Globe,
  Smartphone,
  Clock,
  Calendar,
  Download,
  Share2,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topSources: Array<{ source: string; count: number; percentage: number }>;
  topCountries: Array<{ country: string; count: number; percentage: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  hourlyDistribution: Record<string, number>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
    clicks: number;
    qrScans: number;
  }>;
}

interface RealtimeStats {
  activeVisitors: number;
  viewsToday: number;
  clicksToday: number;
  qrScansToday: number;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      const [analyticsResponse, realtimeResponse] = await Promise.all([
        fetch(`/api/analytics/dashboard?days=${selectedPeriod}`),
        fetch('/api/analytics/realtime')
      ]);

      if (analyticsResponse.ok) {
        const data = await analyticsResponse.json();
        setAnalyticsData(data);
      }

      if (realtimeResponse.ok) {
        const data = await realtimeResponse.json();
        setRealtimeStats(data);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Format duration in seconds to readable format
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate percentage change (mock for demo)
  const getPercentageChange = () => Math.floor(Math.random() * 30) - 10;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your profile performance and visitor insights</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            
            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}

        {/* Real-time Stats Cards */}
        {realtimeStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Visitors</p>
                  <p className="text-2xl font-bold text-green-600">{realtimeStats.activeVisitors}</p>
                  <div className="flex items-center mt-1">
                    <Activity className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">Live now</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Views Today</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(realtimeStats.viewsToday)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600">+{getPercentageChange()}%</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clicks Today</p>
                  <p className="text-2xl font-bold text-purple-600">{formatNumber(realtimeStats.clicksToday)}</p>
                  <div className="flex items-center mt-1">
                    <MousePointer className="w-4 h-4 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600">+{getPercentageChange()}%</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MousePointer className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">QR Scans Today</p>
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(realtimeStats.qrScansToday)}</p>
                  <div className="flex items-center mt-1">
                    <QrCode className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-xs text-orange-600">+{getPercentageChange()}%</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <QrCode className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Analytics */}
        {analyticsData && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalViews)}</p>
                    <p className="text-xs text-gray-500 mt-1">Last {selectedPeriod} days</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Eye className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.uniqueVisitors)}</p>
                    <p className="text-xs text-gray-500 mt-1">Unique sessions</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(analyticsData.avgSessionDuration)}</p>
                    <p className="text-xs text-gray-500 mt-1">Time on profile</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Clock className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.bounceRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">Single page visits</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Daily Traffic Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Traffic</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {analyticsData.dailyStats.slice(-7).map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900 w-20">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-40">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(10, (day.views / Math.max(...analyticsData.dailyStats.map(d => d.views))) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-16 text-right">
                        {formatNumber(day.views)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Device Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
                  <Smartphone className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {Object.entries(analyticsData.deviceBreakdown).map(([device, count]) => {
                    const percentage = (count / analyticsData.totalViews) * 100;
                    const deviceIcon = device === 'mobile' ? '📱' : device === 'tablet' ? '📱' : '💻';
                    
                    return (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{deviceIcon}</span>
                          <div className="text-sm font-medium text-gray-900 capitalize w-20">
                            {device}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(10, percentage)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Traffic Sources and Countries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Traffic Sources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
                  <Globe className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {analyticsData.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {source.source}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(source.count)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {source.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Countries */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {analyticsData.topCountries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-semibold text-green-600">
                          {index + 1}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {country.country}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatNumber(country.count)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hourly Activity Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Activity by Hour</h3>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="grid grid-cols-12 gap-2">
                {Object.entries(analyticsData.hourlyDistribution).map(([hour, count]) => {
                  const maxCount = Math.max(...Object.values(analyticsData.hourlyDistribution));
                  const intensity = maxCount > 0 ? (count / maxCount) : 0;
                  
                  return (
                    <div key={hour} className="text-center">
                      <div
                        className="w-full h-8 rounded mb-1 transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${Math.max(0.1, intensity)})`,
                        }}
                        title={`${hour}:00 - ${count} views`}
                      />
                      <div className="text-xs text-gray-500">
                        {hour.padStart(2, '0')}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>12 AM</span>
                <span>12 PM</span>
                <span>11 PM</span>
              </div>
            </motion.div>
          </>
        )}

        {/* Loading State */}
        {isLoading && !analyticsData && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !analyticsData && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
            <p className="text-gray-600">Start sharing your profile to see analytics data here.</p>
          </div>
        )}
      </div>
    </div>
  );
}