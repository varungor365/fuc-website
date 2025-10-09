'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  SparklesIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '@/components/layout/AdminLayout';
import GlassCard from '@/components/ui/premium/GlassCard';
import NeonButton from '@/components/ui/premium/NeonButton';
import HolographicText from '@/components/ui/premium/HolographicText';
import FloatingElement from '@/components/ui/premium/FloatingElement';

// Mock data - in production this would come from your API
const dashboardStats = [
  {
    title: 'Total Revenue',
    value: '₹12,45,678',
    change: '+12.5%',
    trend: 'up',
    icon: CurrencyDollarIcon,
    color: 'green',
    description: 'Last 30 days'
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingBagIcon,
    color: 'blue',
    description: 'This month'
  },
  {
    title: 'Active Users',
    value: '45,678',
    change: '+15.3%',
    trend: 'up',
    icon: UserGroupIcon,
    color: 'purple',
    description: 'Monthly active'
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    change: '-2.1%',
    trend: 'down',
    icon: ChartBarIcon,
    color: 'orange',
    description: 'Last 7 days'
  }
];

const recentActivities = [
  {
    type: 'order',
    message: 'New order #12345 received',
    time: '2 minutes ago',
    status: 'success',
    amount: '₹2,499'
  },
  {
    type: 'user',
    message: 'New user registration',
    time: '5 minutes ago',
    status: 'info',
    amount: null
  },
  {
    type: 'product',
    message: 'Product "Neon Hoodie" low stock',
    time: '10 minutes ago',
    status: 'warning',
    amount: '5 units left'
  },
  {
    type: 'payment',
    message: 'Payment failed for order #12344',
    time: '15 minutes ago',
    status: 'error',
    amount: '₹1,999'
  },
  {
    type: 'review',
    message: 'New 5-star review received',
    time: '20 minutes ago',
    status: 'success',
    amount: null
  }
];

const quickActions = [
  {
    title: 'Add New Product',
    description: 'Create a new product listing',
    icon: ShoppingBagIcon,
    color: 'blue',
    href: '/admin/products/new'
  },
  {
    title: 'Process Orders',
    description: 'Manage pending orders',
    icon: TruckIcon,
    color: 'green',
    href: '/admin/orders'
  },
  {
    title: 'AI Analytics',
    description: 'View AI-powered insights',
    icon: SparklesIcon,
    color: 'purple',
    href: '/admin/ai-analytics'
  },
  {
    title: 'Customer Support',
    description: 'Handle customer queries',
    icon: HeartIcon,
    color: 'pink',
    href: '/admin/support'
  }
];

const topProducts = [
  {
    name: 'Neon Cyber Hoodie',
    sales: 234,
    revenue: '₹58,500',
    image: '/images/products/hoodies/hoodie-1-main.jpg'
  },
  {
    name: 'Holographic T-Shirt',
    sales: 189,
    revenue: '₹37,800',
    image: '/images/products/t-shirts/tshirt-1-main.jpg'
  },
  {
    name: 'Quantum Jacket',
    sales: 156,
    revenue: '₹78,000',
    image: '/images/products/jackets/jacket-1-main.jpg'
  },
  {
    name: 'Future Jeans',
    sales: 142,
    revenue: '₹42,600',
    image: '/images/products/jeans/jeans-1-main.jpg'
  }
];

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <HolographicText variant="cyber" size="2xl" className="mb-2">
            Welcome back, Admin!
          </HolographicText>
          <p className="text-white/70 text-lg">
            Here's what's happening with your store today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {dashboardStats.map((stat, index) => (
            <FloatingElement key={index} floatIntensity="gentle" glowEffect>
              <GlassCard variant="crystal" glowColor={stat.color as any} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  <p className="text-white/60 text-sm">{stat.title}</p>
                  <p className="text-white/40 text-xs">{stat.description}</p>
                </div>
              </GlassCard>
            </FloatingElement>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GlassCard variant="blur" glowColor={action.color as any} className="p-6 cursor-pointer group">
                  <action.icon className={`w-10 h-10 text-${action.color}-400 mb-4 group-hover:animate-bounce`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                  <p className="text-white/60 text-sm">{action.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <GlassCard variant="frost" className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'warning' ? 'bg-yellow-400' :
                        activity.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-white font-medium">{activity.message}</p>
                        <p className="text-white/60 text-sm">{activity.time}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-white/80 font-semibold">{activity.amount}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Top Products */}
          <motion.div variants={itemVariants}>
            <GlassCard variant="crystal" className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Top Products</h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{product.name}</h3>
                      <p className="text-white/60 text-xs">{product.sales} sales</p>
                    </div>
                    <span className="text-green-400 font-semibold text-sm">{product.revenue}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="blur" glowColor="purple" className="p-8">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                <SparklesIcon className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-4">AI-Powered Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Recommendation</h3>
                    <p className="text-white/80">
                      Consider running a flash sale on hoodies. AI predicts 35% increase in conversions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">Trend Alert</h3>
                    <p className="text-white/80">
                      Neon colors are trending up 127% this week. Consider promoting neon products.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-pink-400 mb-2">Opportunity</h3>
                    <p className="text-white/80">
                      Customer segment 'Tech Enthusiasts' shows high purchase intent for AR-enabled products.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <NeonButton variant="primary" size="md" glowIntensity="high">
                    View Full AI Report
                  </NeonButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}