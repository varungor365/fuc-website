'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  orders: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  customers: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  pageViews: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  conversionRate: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
  avgOrderValue: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
}

interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  orders: number;
  views: number;
  conversionRate: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  revenue: number;
}

const EnhancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({ desktop: 0, mobile: 0, tablet: 0 });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        revenue: {
          current: 125430,
          previous: 98750,
          trend: 'up',
          percentage: 27.0
        },
        orders: {
          current: 1247,
          previous: 1089,
          trend: 'up',
          percentage: 14.5
        },
        customers: {
          current: 892,
          previous: 756,
          trend: 'up',
          percentage: 18.0
        },
        pageViews: {
          current: 45678,
          previous: 42150,
          trend: 'up',
          percentage: 8.4
        },
        conversionRate: {
          current: 2.73,
          previous: 2.58,
          trend: 'up',
          percentage: 5.8
        },
        avgOrderValue: {
          current: 100.55,
          previous: 90.68,
          trend: 'up',
          percentage: 10.9
        }
      };

      const mockDeviceStats: DeviceStats = {
        desktop: 45,
        mobile: 42,
        tablet: 13
      };

      const mockTopProducts: TopProduct[] = [
        {
          id: '1',
          name: 'Premium Streetwear Hoodie',
          revenue: 15420,
          orders: 186,
          views: 3421,
          conversionRate: 5.4
        },
        {
          id: '2',
          name: 'Designer Cargo Pants',
          revenue: 12340,
          orders: 142,
          views: 2987,
          conversionRate: 4.8
        },
        {
          id: '3',
          name: 'Limited Edition Sneakers',
          revenue: 18750,
          orders: 125,
          views: 4567,
          conversionRate: 2.7
        },
        {
          id: '4',
          name: 'Oversized Graphic Tee',
          revenue: 8920,
          orders: 214,
          views: 2156,
          conversionRate: 9.9
        }
      ];

      const mockTrafficSources: TrafficSource[] = [
        { source: 'Organic Search', visitors: 18750, percentage: 42.1, revenue: 52340 },
        { source: 'Direct', visitors: 12340, percentage: 27.7, revenue: 38920 },
        { source: 'Social Media', visitors: 8920, percentage: 20.0, revenue: 22150 },
        { source: 'Paid Ads', visitors: 3450, percentage: 7.7, revenue: 15230 },
        { source: 'Email', visitors: 1120, percentage: 2.5, revenue: 8450 }
      ];

      setAnalyticsData(mockData);
      setDeviceStats(mockDeviceStats);
      setTopProducts(mockTopProducts);
      setTrafficSources(mockTrafficSources);
      
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'stable':
        return <div className="w-4 h-4 border-t-2 border-gray-400"></div>;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'stable':
        return 'text-gray-400';
    }
  };

  const getDeviceIcon = (device: keyof DeviceStats) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
    }
  };

  if (loading || !analyticsData) {
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
            <BarChart3 className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Enhanced Analytics</h2>
            <p className="text-gray-400">Comprehensive performance insights and metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white
                     focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 
                           text-white rounded-lg transition-all duration-200">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            {getTrendIcon(analyticsData.revenue.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatCurrency(analyticsData.revenue.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.revenue.trend)}`}>
            <span>{analyticsData.revenue.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.revenue.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            {getTrendIcon(analyticsData.orders.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Orders</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatNumber(analyticsData.orders.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.orders.trend)}`}>
            <span>{analyticsData.orders.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.orders.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            {getTrendIcon(analyticsData.customers.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">New Customers</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatNumber(analyticsData.customers.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.customers.trend)}`}>
            <span>{analyticsData.customers.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.customers.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Eye className="w-5 h-5 text-yellow-400" />
            </div>
            {getTrendIcon(analyticsData.pageViews.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Page Views</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatNumber(analyticsData.pageViews.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.pageViews.trend)}`}>
            <span>{analyticsData.pageViews.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.pageViews.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            {getTrendIcon(analyticsData.conversionRate.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatPercentage(analyticsData.conversionRate.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.conversionRate.trend)}`}>
            <span>{analyticsData.conversionRate.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.conversionRate.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-pink-400" />
            </div>
            {getTrendIcon(analyticsData.avgOrderValue.trend)}
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Avg Order Value</h3>
          <p className="text-2xl font-bold text-white mb-1">
            {formatCurrency(analyticsData.avgOrderValue.current)}
          </p>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.avgOrderValue.trend)}`}>
            <span>{analyticsData.avgOrderValue.trend === 'up' ? '+' : ''}{formatPercentage(analyticsData.avgOrderValue.percentage)}</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Device Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(deviceStats).map(([device, percentage]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getDeviceIcon(device as keyof DeviceStats)}
                  <span className="text-white capitalize">{device}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div
                      className="bg-accent-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-white font-medium w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Traffic Sources</h3>
          </div>
          
          <div className="space-y-3">
            {trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between py-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{source.source}</span>
                    <span className="text-gray-400 text-sm">{formatNumber(source.visitors)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-white/10 rounded-full h-1.5 mr-3">
                      <div
                        className="bg-gradient-to-r from-accent-500 to-accent-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs min-w-fit">
                      {formatCurrency(source.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-accent-400" />
            <h3 className="text-lg font-semibold text-white">Top Performing Products</h3>
          </div>
          <button className="text-accent-400 hover:text-accent-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-sm font-medium text-gray-400">Product</th>
                <th className="text-right py-3 text-sm font-medium text-gray-400">Revenue</th>
                <th className="text-right py-3 text-sm font-medium text-gray-400">Orders</th>
                <th className="text-right py-3 text-sm font-medium text-gray-400">Views</th>
                <th className="text-right py-3 text-sm font-medium text-gray-400">Conv. Rate</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="text-white font-medium">{product.name}</div>
                  </td>
                  <td className="py-4 text-right text-white font-medium">
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="py-4 text-right text-gray-300">
                    {formatNumber(product.orders)}
                  </td>
                  <td className="py-4 text-right text-gray-300">
                    {formatNumber(product.views)}
                  </td>
                  <td className="py-4 text-right">
                    <span className={`font-medium ${
                      product.conversionRate > 5 ? 'text-green-400' : 
                      product.conversionRate > 3 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(product.conversionRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAnalytics;