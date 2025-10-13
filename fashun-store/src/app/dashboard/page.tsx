'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CubeIcon,
  ChartBarIcon,
  BellIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  MegaphoneIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: number;
  priority?: 'high' | 'medium' | 'low';
}

export default function Dashboard() {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showOrderProcessModal, setShowOrderProcessModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [pendingOrders] = useState(12);
  const [supportTickets] = useState(7);

  const metrics: MetricCard[] = [
    {
      title: 'Total Orders',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: ShoppingBagIcon,
      color: 'blue'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      title: 'Customers',
      value: '2,847',
      change: '+15%',
      trend: 'up',
      icon: UsersIcon,
      color: 'purple'
    },
    {
      title: 'Products',
      value: '156',
      change: '+3%',
      trend: 'up',
      icon: CubeIcon,
      color: 'orange'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: ArrowTrendingUpIcon,
      color: 'red'
    },
    {
      title: 'AI Generations',
      value: '8,942',
      change: '+45%',
      trend: 'up',
      icon: SparklesIcon,
      color: 'indigo'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: 'Add New Product',
      description: 'Create a new product listing',
      onClick: () => setShowAddProductModal(true),
      icon: PlusIcon,
      color: 'green',
      priority: 'high'
    },
    {
      title: 'Process Orders',
      description: 'Manage pending orders',
      onClick: () => setShowOrderProcessModal(true),
      icon: ClipboardDocumentListIcon,
      color: 'blue',
      badge: pendingOrders,
      priority: 'high'
    },
    {
      title: 'AI Analytics',
      description: 'View AI-powered insights',
      href: '/dashboard/ai-insights',
      icon: SparklesIcon,
      color: 'purple'
    },
    {
      title: 'Customer Support',
      description: 'Handle customer queries',
      onClick: () => setShowSupportModal(true),
      icon: ChatBubbleLeftIcon,
      color: 'orange',
      badge: supportTickets,
      priority: 'high'
    }
  ];

  const recentActivity = [
    { action: 'New order #1247 received', time: '2 minutes ago', type: 'order' },
    { action: 'AI design generated for customer', time: '5 minutes ago', type: 'ai' },
    { action: 'Product "Streetwear Hoodie" updated', time: '12 minutes ago', type: 'product' },
    { action: 'Customer review submitted', time: '18 minutes ago', type: 'review' },
    { action: 'Marketing campaign launched', time: '1 hour ago', type: 'marketing' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500 text-blue-600 border-blue-200',
      green: 'bg-green-500 text-green-600 border-green-200',
      purple: 'bg-purple-500 text-purple-600 border-purple-200',
      orange: 'bg-orange-500 text-orange-600 border-orange-200',
      red: 'bg-red-500 text-red-600 border-red-200',
      indigo: 'bg-indigo-500 text-indigo-600 border-indigo-200',
      pink: 'bg-pink-500 text-pink-600 border-pink-200',
      yellow: 'bg-yellow-500 text-yellow-600 border-yellow-200',
      teal: 'bg-teal-500 text-teal-600 border-teal-200',
      cyan: 'bg-cyan-500 text-cyan-600 border-cyan-200',
      gray: 'bg-gray-500 text-gray-600 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString()}
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <Link 
                href="/dashboard/settings"
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <CogIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const colorClasses = getColorClasses(metric.color);
            const iconBgColor = colorClasses.split(' ')[0];
            const textColor = colorClasses.split(' ')[1];
            
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-3 ${iconBgColor} bg-opacity-10 rounded-lg`}>
                    <metric.icon className={`h-6 w-6 ${textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const colorClasses = getColorClasses(action.color);
                const iconBgColor = colorClasses.split(' ')[0];
                const textColor = colorClasses.split(' ')[1];
                
                if (action.href) {
                  return (
                    <Link
                      key={index}
                      href={action.href}
                      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 group relative block w-full text-left"
                    >
                      {action.badge && (
                        <div className={`absolute -top-2 -right-2 h-6 w-6 ${action.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                          {action.badge}
                        </div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 ${iconBgColor} bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors relative`}>
                          <action.icon className={`h-6 w-6 ${textColor}`} />
                          {action.priority === 'high' && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 flex items-center">
                            {action.title}
                            {action.priority === 'high' && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                Priority
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 group relative block w-full text-left"
                    >
                      {action.badge && (
                        <div className={`absolute -top-2 -right-2 h-6 w-6 ${action.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                          {action.badge}
                        </div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 ${iconBgColor} bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors relative`}>
                          <action.icon className={`h-6 w-6 ${textColor}`} />
                          {action.priority === 'high' && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 flex items-center">
                            {action.title}
                            {action.priority === 'high' && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                Priority
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                }
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Link 
                    href="/dashboard/analytics"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all activity →
                  </Link>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Freepik API</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pexels API</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AI Generation</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Gateway</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Testing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Select category</option>
                    <option>T-Shirts</option>
                    <option>Hoodies</option>
                    <option>Jackets</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="ai-generated" className="rounded" />
                <label htmlFor="ai-generated" className="text-sm text-gray-700">AI-Generated Design</label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Orders Modal */}
      {showOrderProcessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Process Pending Orders ({pendingOrders})</h3>
              <button
                onClick={() => setShowOrderProcessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order #ORD-{1240 + order}</p>
                      <p className="text-sm text-gray-600">Customer: John Doe • $89.99 • 2 items</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Process
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-6 border-t">
              <Link
                href="/dashboard/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={() => setShowOrderProcessModal(false)}
              >
                View All Orders →
              </Link>
              <button
                onClick={() => setShowOrderProcessModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Customer Support Queue ({supportTickets})</h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              {[
                { id: 1, customer: 'Sarah Chen', issue: 'Order delivery issue', priority: 'high', time: '5 min ago' },
                { id: 2, customer: 'Mike Johnson', issue: 'Product size question', priority: 'medium', time: '12 min ago' },
                { id: 3, customer: 'Emma Wilson', issue: 'Payment not processed', priority: 'high', time: '18 min ago' },
                { id: 4, customer: 'Alex Rodriguez', issue: 'AI design request', priority: 'low', time: '25 min ago' }
              ].map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <ChatBubbleLeftIcon className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ticket.customer}</p>
                      <p className="text-sm text-gray-600">{ticket.issue}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">{ticket.time}</span>
                    <button className="px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700">
                      Respond
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t">
              <button
                onClick={() => setShowSupportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700">
                Open Support Center
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}