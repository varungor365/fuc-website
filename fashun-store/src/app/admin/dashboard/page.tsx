'use client';

import React from 'react';
import GlassCard from '@/components/admin/GlassCard';
import { motion } from 'framer-motion';

// Inspired by Empire, Prestige, Pipeline themes - comprehensive dashboard overview
export default function AdminDashboard() {
  const metrics = [
    {
      title: "Today's Revenue",
      value: "₹85,420",
      change: "+12.5%",
      trend: "up",
      icon: "💰",
      sparkline: [40, 45, 52, 48, 65, 72, 85]
    },
    {
      title: "Total Orders",
      value: "247",
      change: "+8.3%",
      trend: "up",
      icon: "📦",
      breakdown: { pending: 12, processing: 45, completed: 180, cancelled: 10 }
    },
    {
      title: "Active Users",
      value: "1,432",
      change: "+15.2%",
      trend: "up",
      icon: "👥",
      details: { bounceRate: "32%", sessionDuration: "4:23" }
    },
    {
      title: "Total Customers",
      value: "8,924",
      change: "+5.7%",
      trend: "up",
      icon: "🛍️",
      newToday: 23
    }
  ];

  const revenueData = [
    { day: 'Mon', revenue: 12400 },
    { day: 'Tue', revenue: 15600 },
    { day: 'Wed', revenue: 18200 },
    { day: 'Thu', revenue: 16800 },
    { day: 'Fri', revenue: 22300 },
    { day: 'Sat', revenue: 28600 },
    { day: 'Sun', revenue: 25400 }
  ];

  const ordersByStatus = [
    { status: 'Completed', count: 180, color: '#10B981' },
    { status: 'Processing', count: 45, color: '#F59E0B' },
    { status: 'Pending', count: 12, color: '#EF4444' },
    { status: 'Cancelled', count: 10, color: '#6B7280' }
  ];

  const services = [
    { name: 'Frontend', status: 'online', responseTime: '124ms', uptime: '99.9%' },
    { name: 'Backend', status: 'online', responseTime: '87ms', uptime: '99.8%' },
    { name: 'Strapi', status: 'online', responseTime: '156ms', uptime: '99.7%' },
    { name: 'AI Service', status: 'online', responseTime: '234ms', uptime: '98.9%' },
    { name: 'Payment Gateway', status: 'online', responseTime: '89ms', uptime: '99.9%' }
  ];

  const aiMetrics = [
    { title: 'Recommendations Generated', value: '12,456', ctr: '8.4%', trend: 'up' },
    { title: 'Visual Search Queries', value: '3,892', success: '92%', trend: 'up' },
    { title: 'Chatbot Interactions', value: '8,234', resolution: '87%', trend: 'up' },
    { title: 'Size Recommendations', value: '5,678', accuracy: '94%', trend: 'up' }
  ];

  const quickActions = [
    { title: 'Add Product', icon: '➕', badge: '', href: '/admin/products/new' },
    { title: 'Process Orders', icon: '📋', badge: '12', href: '/admin/orders' },
    { title: 'View Analytics', icon: '📊', badge: '', href: '/admin/analytics' },
    { title: 'Manage API Keys', icon: '🔑', badge: '', href: '/admin/api-keys' },
    { title: 'System Settings', icon: '⚙️', badge: '', href: '/admin/settings' },
    { title: 'Error Monitoring', icon: '🚨', badge: '3', href: '/admin/error-monitoring' }
  ];

  const recentOrders = [
    { id: '#ORD-2024-1001', customer: 'Arjun Sharma', amount: '₹2,450', status: 'completed', time: '2 mins ago' },
    { id: '#ORD-2024-1002', customer: 'Priya Singh', amount: '₹1,890', status: 'processing', time: '5 mins ago' },
    { id: '#ORD-2024-1003', customer: 'Raj Patel', amount: '₹3,200', status: 'pending', time: '8 mins ago' },
    { id: '#ORD-2024-1004', customer: 'Sneha Gupta', amount: '₹1,650', status: 'completed', time: '12 mins ago' },
    { id: '#ORD-2024-1005', customer: 'Vikram Kumar', amount: '₹4,100', status: 'processing', time: '15 mins ago' }
  ];

  const recentSignups = [
    { name: 'Ankit Verma', email: 'ankit@example.com', time: '1 min ago' },
    { name: 'Pooja Sharma', email: 'pooja@example.com', time: '3 mins ago' },
    { name: 'Rohit Singh', email: 'rohit@example.com', time: '7 mins ago' },
    { name: 'Kavya Nair', email: 'kavya@example.com', time: '10 mins ago' },
    { name: 'Amit Joshi', email: 'amit@example.com', time: '14 mins ago' }
  ];

  const topProducts = [
    { 
      image: '/images/products/t-shirts/tshirt-1-main.jpg',
      name: 'Holographic Tech Tee',
      sold: 156,
      revenue: '₹23,400',
      stock: 'In Stock',
      aiScore: 94
    },
    {
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      name: 'Cyber Punk Hoodie',
      sold: 98,
      revenue: '₹44,100',
      stock: 'Low Stock',
      aiScore: 89
    },
    {
      image: '/images/products/hoodies/hoodie-2-main.jpg',
      name: 'Quantum Bomber Jacket',
      sold: 87,
      revenue: '₹52,200',
      stock: 'In Stock',
      aiScore: 92
    },
    {
      image: '/images/products/t-shirts/tshirt-2-main.jpg',
      name: 'Neon Glow Hoodie',
      sold: 73,
      revenue: '₹38,900',
      stock: 'In Stock',
      aiScore: 88
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-white/70 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Auto-refresh: ON</span>
          </div>
          <div className="text-sm text-white/70">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="hover:scale-105 transition-all duration-200" hover>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{metric.icon}</div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  metric.trend === 'up' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {metric.change}
                </div>
              </div>
              
              <div className="mb-2">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-white/70">{metric.title}</div>
              </div>

              {/* Mini sparkline for revenue */}
              {metric.sparkline && (
                <div className="flex items-end space-x-1 h-8">
                  {metric.sparkline.map((value, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-purple-500 to-pink-400 rounded-sm flex-1"
                      style={{ height: `${(value / Math.max(...metric.sparkline)) * 100}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Additional details */}
              {metric.breakdown && (
                <div className="text-xs text-white/60 mt-2">
                  Pending: {metric.breakdown.pending} | Processing: {metric.breakdown.processing}
                </div>
              )}
              
              {metric.details && (
                <div className="text-xs text-white/60 mt-2">
                  Bounce: {metric.details.bounceRate} | Avg: {metric.details.sessionDuration}
                </div>
              )}

              {metric.newToday && (
                <div className="text-xs text-white/60 mt-2">
                  +{metric.newToday} new today
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">7-Day Revenue Trend</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                Export CSV
              </button>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {revenueData.map((item, index) => (
                <div key={item.day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-pink-300"
                    style={{ 
                      height: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200}px` 
                    }}
                  />
                  <div className="text-xs text-white/70 mt-2">{item.day}</div>
                  <div className="text-xs text-white/50">₹{(item.revenue / 1000).toFixed(1)}k</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Orders by Status</h3>
              <button className="text-sm text-purple-400 hover:text-purple-300">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {ordersByStatus.map((item, index) => (
                <div key={item.status} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-white/80">{item.status}</span>
                    <span className="text-white font-medium">{item.count}</span>
                  </div>
                  <div className="w-24 ml-4 bg-white/10 rounded-full h-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(item.count / ordersByStatus.reduce((sum, s) => sum + s.count, 0)) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* System Health Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">System Health</h3>
            <div className="flex items-center space-x-2 text-sm text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>All Systems Operational</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service) => (
              <div key={service.name} className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  service.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <div className="text-white font-medium text-sm">{service.name}</div>
                <div className="text-xs text-white/60 mt-1">{service.responseTime}</div>
                <div className="text-xs text-white/60">{service.uptime}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Intelligent Insights Performance</h3>
            <button className="text-sm text-purple-400 hover:text-purple-300">
              View Details
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiMetrics.map((metric) => (
              <div key={metric.title} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-bold text-white">{metric.value}</div>
                  <div className="text-xs text-green-400">
                    {metric.trend === 'up' ? '↗️' : '↘️'}
                  </div>
                </div>
                <div className="text-sm text-white/70 mb-1">{metric.title}</div>
                <div className="text-xs text-white/50">
                  {metric.ctr && `CTR: ${metric.ctr}`}
                  {metric.success && `Success: ${metric.success}`}
                  {metric.resolution && `Resolution: ${metric.resolution}`}
                  {metric.accuracy && `Accuracy: ${metric.accuracy}`}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="relative p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-105 text-center group"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-white group-hover:text-purple-300">
                  {action.title}
                </div>
                {action.badge && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {action.badge}
                  </div>
                )}
              </a>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
              <a href="/admin/orders" className="text-sm text-purple-400 hover:text-purple-300">
                View All Orders
              </a>
            </div>
            
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-white">{order.id}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="text-sm text-white/70 mt-1">{order.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">{order.amount}</div>
                    <div className="text-xs text-white/60">{order.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Signups */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Signups</h3>
              <a href="/admin/customers" className="text-sm text-purple-400 hover:text-purple-300">
                View All Customers
              </a>
            </div>
            
            <div className="space-y-3">
              {recentSignups.map((signup, index) => (
                <div key={signup.email} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {signup.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{signup.name}</div>
                    <div className="text-xs text-white/70">{signup.email}</div>
                  </div>
                  <div className="text-xs text-white/60">{signup.time}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Top Performing Products</h3>
            <a href="/admin/products" className="text-sm text-purple-400 hover:text-purple-300">
              Manage Products
            </a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-sm font-medium text-white/70 pb-3">Product</th>
                  <th className="text-left text-sm font-medium text-white/70 pb-3">Units Sold</th>
                  <th className="text-left text-sm font-medium text-white/70 pb-3">Revenue</th>
                  <th className="text-left text-sm font-medium text-white/70 pb-3">Stock</th>
                  <th className="text-left text-sm font-medium text-white/70 pb-3">AI Score</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-sm text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-white">{product.sold}</td>
                    <td className="py-3 text-sm text-white font-medium">{product.revenue}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.stock === 'In Stock' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-white/20 rounded-full h-2">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"
                            style={{ width: `${product.aiScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/70">{product.aiScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}