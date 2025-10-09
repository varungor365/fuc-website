'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Squares2X2Icon,
  TagIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  SparklesIcon,
  EyeIcon,
  ShieldCheckIcon,
  CloudIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  CubeIcon,
  BeakerIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import GlassCard from '@/components/ui/premium/GlassCard';
import NeonButton from '@/components/ui/premium/NeonButton';
import HolographicText from '@/components/ui/premium/HolographicText';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    category: 'Overview',
    items: [
      { name: 'Dashboard', href: '/admin', icon: HomeIcon, color: 'purple' },
      { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, color: 'blue' },
      { name: 'Quick Actions', href: '/admin/quick-actions', icon: CommandLineIcon, color: 'cyan' },
    ]
  },
  {
    category: 'Commerce',
    items: [
      { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon, color: 'orange' },
      { name: 'Orders', href: '/admin/orders', icon: TruckIcon, color: 'green' },
      { name: 'Collections', href: '/admin/collections', icon: Squares2X2Icon, color: 'purple' },
      { name: 'Inventory', href: '/admin/inventory', icon: CubeIcon, color: 'blue' },
      { name: 'Pricing', href: '/admin/pricing', icon: CurrencyDollarIcon, color: 'yellow' },
    ]
  },
  {
    category: 'Customer Experience',
    items: [
      { name: 'Customers', href: '/admin/customers', icon: UsersIcon, color: 'pink' },
      { name: 'Reviews', href: '/admin/reviews', icon: ChatBubbleLeftRightIcon, color: 'cyan' },
      { name: 'AI Recommendations', href: '/admin/ai-recommendations', icon: SparklesIcon, color: 'purple' },
      { name: 'AR Try-On', href: '/admin/ar-tryon', icon: EyeIcon, color: 'blue' },
    ]
  },
  {
    category: 'Content & Design',
    items: [
      { name: 'Media Library', href: '/admin/media', icon: PhotoIcon, color: 'green' },
      { name: 'Website Design', href: '/admin/design', icon: PaintBrushIcon, color: 'purple' },
      { name: 'Customization Studio', href: '/admin/customization', icon: BeakerIcon, color: 'cyan' },
      { name: 'Campaigns', href: '/admin/campaigns', icon: LightBulbIcon, color: 'orange' },
    ]
  },
  {
    category: 'Business Intelligence',
    items: [
      { name: 'Sales Analytics', href: '/admin/sales', icon: ArrowTrendingUpIcon, color: 'green' },
      { name: 'Traffic Analytics', href: '/admin/traffic', icon: GlobeAltIcon, color: 'blue' },
      { name: 'Performance', href: '/admin/performance', icon: ChartBarIcon, color: 'purple' },
      { name: 'A/B Testing', href: '/admin/ab-testing', icon: BeakerIcon, color: 'cyan' },
    ]
  },
  {
    category: 'System',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: CogIcon, color: 'gray' },
      { name: 'Security', href: '/admin/security', icon: ShieldCheckIcon, color: 'red' },
      { name: 'Integrations', href: '/admin/integrations', icon: CloudIcon, color: 'blue' },
      { name: 'Mobile App', href: '/admin/mobile', icon: DevicePhoneMobileIcon, color: 'purple' },
    ]
  }
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(5);
  const pathname = usePathname();

  const sidebarVariants = {
    open: { width: '320px', opacity: 1 },
    closed: { width: '80px', opacity: 0.9 }
  };

  const contentVariants = {
    open: { marginLeft: '320px' },
    closed: { marginLeft: '80px' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-mesh-gradient animate-aurora opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse-slow" />
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full z-50 overflow-hidden"
      >
        <GlassCard variant="blur" className="h-full p-0 rounded-none">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <HolographicText variant="cyber" size="lg" className="font-bold">
                      FashUn Admin
                    </HolographicText>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {sidebarItems.map((category) => (
              <div key={category.category}>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3"
                    >
                      {category.category}
                    </motion.h3>
                  )}
                </AnimatePresence>
                
                <div className="space-y-2">
                  {category.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link key={item.name} href={item.href}>
                        <motion.div
                          whileHover={{ x: 5, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            flex items-center gap-3 p-3 rounded-xl transition-all
                            ${isActive 
                              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-neon-purple' 
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                            }
                          `}
                        >
                          <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? `text-${item.color}-400` : ''}`} />
                          <AnimatePresence>
                            {sidebarOpen && (
                              <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-medium"
                              >
                                {item.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Toggle */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <CogIcon className="w-6 h-6 text-white" />
              </motion.div>
            </button>
          </div>
        </GlassCard>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        variants={contentVariants}
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-10"
      >
        {/* Top Bar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/10">
          <GlassCard variant="frost" className="flex-1 max-w-xl p-4">
            <div className="flex items-center gap-3">
              <MagnifyingGlassIcon className="w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search admin panel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
              />
            </div>
          </GlassCard>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              <BellIcon className="w-6 h-6 text-white" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </motion.button>

            {/* User Profile */}
            <GlassCard variant="crystal" className="flex items-center gap-3 p-3">
              <UserCircleIcon className="w-8 h-8 text-white" />
              <div className="text-white">
                <div className="font-semibold">Admin User</div>
                <div className="text-xs text-white/60">Super Admin</div>
              </div>
            </GlassCard>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;