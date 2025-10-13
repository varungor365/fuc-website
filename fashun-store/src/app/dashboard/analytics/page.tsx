'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

interface DeviceData {
  device: string;
  sessions: number;
  percentage: number;
}

const mockAnalyticsData: AnalyticsData[] = [
  { period: 'Jan 1-7', revenue: 15420, orders: 89, customers: 67, conversion: 3.2 },
  { period: 'Jan 8-14', revenue: 18750, orders: 104, customers: 82, conversion: 3.8 },
  { period: 'Jan 15-21', revenue: 16890, orders: 95, customers: 74, conversion: 3.5 },
  { period: 'Jan 22-28', revenue: 22340, orders: 126, customers: 98, conversion: 4.1 },
  { period: 'Jan 29-Feb 4', revenue: 25670, orders: 145, customers: 115, conversion: 4.3 },
  { period: 'Feb 5-11', revenue: 28450, orders: 162, customers: 128, conversion: 4.6 },
  { period: 'Feb 12-18', revenue: 31200, orders: 178, customers: 142, conversion: 4.8 }
];

const trafficSources: TrafficSource[] = [
  { source: 'Organic Search', visitors: 45230, percentage: 42.5, color: 'bg-blue-500' },
  { source: 'Direct', visitors: 28750, percentage: 27.0, color: 'bg-green-500' },
  { source: 'Social Media', visitors: 18960, percentage: 17.8, color: 'bg-purple-500' },
  { source: 'Email Marketing', visitors: 8920, percentage: 8.4, color: 'bg-yellow-500' },
  { source: 'Paid Ads', visitors: 4570, percentage: 4.3, color: 'bg-red-500' }
];

const deviceData: DeviceData[] = [
  { device: 'Mobile', sessions: 58420, percentage: 65.2 },
  { device: 'Desktop', sessions: 24680, percentage: 27.6 },
  { device: 'Tablet', sessions: 6450, percentage: 7.2 }
];

const topProducts = [
  { name: 'AI-Generated Streetwear Hoodie', sales: 156, revenue: 14040, growth: 25 },
  { name: 'Custom Graphic T-Shirt', sales: 203, revenue: 7105, growth: 18 },
  { name: 'Vintage Denim Jacket', sales: 89, revenue: 11571, growth: -5 },
  { name: 'AI Fashion Crop Top', sales: 124, revenue: 3100, growth: 42 },
  { name: 'Premium Cotton Hoodie', sales: 76, revenue: 6080, growth: 12 }
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const getCurrentPeriodData = () => {
    return mockAnalyticsData.slice(-7); // Last 7 periods for demo
  };

  const getMetricValue = (data: AnalyticsData[], metric: string) => {
    const total = data.reduce((sum, item) => sum + (item as any)[metric], 0);
    const previous = data.slice(0, -1).reduce((sum, item) => sum + (item as any)[metric], 0);
    const current = data.slice(-1)[0][metric as keyof AnalyticsData] as number;
    const change = previous > 0 ? ((current - (previous / (data.length - 1))) / (previous / (data.length - 1))) * 100 : 0;
    return { total, change };
  };

  const currentData = getCurrentPeriodData();
  const revenueData = getMetricValue(currentData, 'revenue');
  const ordersData = getMetricValue(currentData, 'orders');
  const customersData = getMetricValue(currentData, 'customers');
  const conversionData = getMetricValue(currentData, 'conversion');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  <ChevronLeftIcon className="h-5 w-5" />
                </Link>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                Detailed performance metrics and insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${revenueData.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {revenueData.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${revenueData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {revenueData.change >= 0 ? '+' : ''}{revenueData.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{ordersData.total}</p>
                <div className="flex items-center mt-2">
                  {ordersData.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${ordersData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {ordersData.change >= 0 ? '+' : ''}{ordersData.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customersData.total}</p>
                <div className="flex items-center mt-2">
                  {customersData.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${customersData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {customersData.change >= 0 ? '+' : ''}{customersData.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(conversionData.total / currentData.length).toFixed(1)}%
                </p>
                <div className="flex items-center mt-2">
                  {conversionData.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${conversionData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {conversionData.change >= 0 ? '+' : ''}{conversionData.change.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="revenue">Revenue</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
                <option value="conversion">Conversion</option>
              </select>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {currentData.map((data, index) => {
                const value = data[selectedMetric as keyof AnalyticsData] as number;
                const maxValue = Math.max(...currentData.map(d => d[selectedMetric as keyof AnalyticsData] as number));
                const height = (value / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-400"
                      style={{ height: `${height}%` }}
                      title={`${data.period}: ${value}`}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">
                        {selectedMetric === 'revenue' ? `$${(value / 1000).toFixed(0)}k` : 
                         selectedMetric === 'conversion' ? `${value}%` : value}
                      </p>
                      <p className="text-xs text-gray-500">{data.period.split(' ')[1]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h3>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-600">{source.visitors.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${source.color}`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      {product.growth >= 0 ? (
                        <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Analytics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Usage</h3>
            <div className="space-y-6">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {device.device === 'Mobile' ? (
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                    ) : device.device === 'Desktop' ? (
                      <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                    ) : (
                      <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{device.device}</span>
                      <span className="text-sm text-gray-600">{device.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{device.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}