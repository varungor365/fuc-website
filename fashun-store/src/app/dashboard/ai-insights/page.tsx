'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeftIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ChartBarIcon,
  PhotoIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  LightBulbIcon,
  ClockIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface AIInsight {
  id: string;
  type: 'trend' | 'prediction' | 'recommendation' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  data: any;
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
}

interface TrendData {
  period: string;
  value: number;
  change: number;
}

const mockInsights: AIInsight[] = [
  {
    id: 'AI-001',
    type: 'trend',
    title: 'Streetwear Surge Detected',
    description: 'AI analysis shows a 45% increase in streetwear-related searches and purchases over the past 30 days. This trend is expected to continue for the next 2 months.',
    confidence: 92,
    impact: 'high',
    category: 'Fashion Trends',
    data: {
      growth: 45,
      duration: '30 days',
      prediction: '2 months',
      relatedProducts: ['hoodies', 'graphic tees', 'sneakers']
    },
    createdAt: '2024-01-15',
    status: 'new'
  },
  {
    id: 'AI-002',
    type: 'prediction',
    title: 'Inventory Optimization Opportunity',
    description: 'Based on historical data and current trends, you should increase hoodie inventory by 30% and reduce formal wear stock by 15% for optimal sales.',
    confidence: 87,
    impact: 'high',
    category: 'Inventory Management',
    data: {
      increaseItems: [{ item: 'Hoodies', percentage: 30 }, { item: 'Graphic Tees', percentage: 20 }],
      decreaseItems: [{ item: 'Formal Wear', percentage: 15 }, { item: 'Dress Shirts', percentage: 10 }]
    },
    createdAt: '2024-01-14',
    status: 'reviewed'
  },
  {
    id: 'AI-003',
    type: 'recommendation',
    title: 'AI-Generated Design Styles',
    description: 'Customer data suggests high demand for cyberpunk and retro-futuristic designs. AI can generate 50+ unique designs in these styles within 24 hours.',
    confidence: 78,
    impact: 'medium',
    category: 'Product Development',
    data: {
      styles: ['Cyberpunk', 'Retro-Futuristic', 'Neon Aesthetics'],
      potentialDesigns: 50,
      estimatedRevenue: 15000
    },
    createdAt: '2024-01-13',
    status: 'implemented'
  },
  {
    id: 'AI-004',
    type: 'opportunity',
    title: 'Premium Customer Segment',
    description: 'AI identified 12% of customers willing to pay 40% more for exclusive AI-generated designs. Consider launching a premium tier.',
    confidence: 84,
    impact: 'high',
    category: 'Business Strategy',
    data: {
      customerPercentage: 12,
      priceIncrease: 40,
      potentialRevenue: 25000,
      exclusivityFeatures: ['Limited editions', 'Custom AI avatars', 'Priority support']
    },
    createdAt: '2024-01-12',
    status: 'new'
  },
  {
    id: 'AI-005',
    type: 'trend',
    title: 'Color Palette Shift',
    description: 'Emerging trend towards earth tones and sustainable color palettes. AI recommends updating design generation to include more browns, greens, and natural colors.',
    confidence: 71,
    impact: 'medium',
    category: 'Design Trends',
    data: {
      trendingColors: ['Forest Green', 'Earth Brown', 'Ocean Blue', 'Sunset Orange'],
      growthRate: 25,
      seasonality: 'Spring/Summer'
    },
    createdAt: '2024-01-11',
    status: 'reviewed'
  }
];

const trendData: TrendData[] = [
  { period: 'Week 1', value: 1200, change: 8 },
  { period: 'Week 2', value: 1350, change: 12.5 },
  { period: 'Week 3', value: 1180, change: -12.6 },
  { period: 'Week 4', value: 1420, change: 20.3 },
  { period: 'Week 5', value: 1680, change: 18.3 },
  { period: 'Week 6', value: 1950, change: 16.1 }
];

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>(mockInsights);
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const insightTypes = ['all', 'trend', 'prediction', 'recommendation', 'opportunity'];
  const statuses = ['all', 'new', 'reviewed', 'implemented', 'dismissed'];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <ArrowTrendingUpIcon className="h-6 w-6" />;
      case 'prediction':
        return <ChartBarIcon className="h-6 w-6" />;
      case 'recommendation':
        return <LightBulbIcon className="h-6 w-6" />;
      case 'opportunity':
        return <ArrowTrendingUpIcon className="h-6 w-6" />;
      default:
        return <SparklesIcon className="h-6 w-6" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const badgeClasses = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[impact as keyof typeof badgeClasses]}`}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      new: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      implemented: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const updateInsightStatus = (insightId: string, newStatus: AIInsight['status']) => {
    setInsights(insights.map(insight => 
      insight.id === insightId ? { ...insight, status: newStatus } : insight
    ));
    if (selectedInsight && selectedInsight.id === insightId) {
      setSelectedInsight({ ...selectedInsight, status: newStatus });
    }
  };

  const filteredInsights = insights.filter(insight => {
    const matchesType = filterType === 'all' || insight.type === filterType;
    const matchesStatus = filterStatus === 'all' || insight.status === filterStatus;
    return matchesType && matchesStatus;
  });

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
                  <SparklesIcon className="h-8 w-8 text-purple-600" />
                  <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
                </div>
              </div>
              <p className="text-gray-600 mt-1">
                AI-powered analytics and business intelligence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <button className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate New Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Insights Generated</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                <p className="text-2xl font-bold text-gray-900">87.3%</p>
                <p className="text-xs text-green-600">+2.1% improvement</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CubeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Predictions Implemented</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-xs text-green-600">94% success rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-2xl font-bold text-gray-900">$47.2K</p>
                <p className="text-xs text-green-600">From AI recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Generation Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {trendData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                  style={{ height: `${(data.value / 2000) * 100}%` }}
                />
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-900">{data.value}</p>
                  <p className="text-xs text-gray-500">{data.period}</p>
                  <p className={`text-xs ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.change > 0 ? '+' : ''}{data.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {insightTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInsights.length} insights found
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'trend' ? 'bg-blue-100 text-blue-600' :
                    insight.type === 'prediction' ? 'bg-green-100 text-green-600' :
                    insight.type === 'recommendation' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600">{insight.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getImpactBadge(insight.impact)}
                  {getStatusBadge(insight.status)}
                </div>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{insight.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Confidence: </span>
                    <span className={`font-semibold ${
                      insight.confidence >= 80 ? 'text-green-600' :
                      insight.confidence >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {insight.confidence}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedInsight(insight)}
                    className="p-2 text-gray-400 hover:text-purple-600"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <select
                    value={insight.status}
                    onChange={(e) => updateInsightStatus(insight.id, e.target.value as AIInsight['status'])}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="implemented">Implemented</option>
                    <option value="dismissed">Dismissed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredInsights.length === 0 && (
          <div className="text-center py-12">
            <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or generate new AI insights.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Generate Insights
            </button>
          </div>
        )}
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  selectedInsight.type === 'trend' ? 'bg-blue-100 text-blue-600' :
                  selectedInsight.type === 'prediction' ? 'bg-green-100 text-green-600' :
                  selectedInsight.type === 'recommendation' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {getInsightIcon(selectedInsight.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedInsight.title}</h3>
                  <p className="text-gray-600">{selectedInsight.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInsight(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{selectedInsight.confidence}%</p>
                <p className="text-sm text-gray-600">Confidence</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedInsight.impact}</p>
                <p className="text-sm text-gray-600">Impact Level</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedInsight.status}</p>
                <p className="text-sm text-gray-600">Status</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Description</h4>
              <p className="text-gray-700">{selectedInsight.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">AI Analysis Data</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(selectedInsight.data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedInsight(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => updateInsightStatus(selectedInsight.id, 'implemented')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Mark as Implemented
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}