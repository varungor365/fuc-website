'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ShoppingBagIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  LightBulbIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: number
}

const Sidebar = () => {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon, badge: 12 },
    { name: 'Products', href: '/admin/products', icon: CubeIcon },
    { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
    { name: 'AI Generator', href: '/admin/ai-generator', icon: PhotoIcon },
    { name: 'Curated Insights', href: '/admin/insights', icon: LightBulbIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Marketing', href: '/admin/marketing', icon: MegaphoneIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ]

  return (
    <div className={`
      fixed left-0 top-0 h-screen z-40 transition-all duration-500 ease-in-out
      ${isCollapsed ? 'w-20' : 'w-72'}
    `}>
      {/* Glassmorphism Sidebar */}
      <GlassCard 
        className="h-full rounded-none rounded-r-3xl border-l-0" 
        hover={false}
        gradient={true}
        border="medium"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo & Brand */}
          <motion.div 
            className="flex items-center gap-3 mb-10"
            animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg font-['Montserrat']">F</span>
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-xl font-bold font-['Montserrat'] text-white">
                  FASHUN
                </h1>
                <p className="text-xs text-white/60 font-['Inter']">Admin Panel</p>
              </motion.div>
            )}
          </motion.div>

          {/* Quick Search */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors font-['Inter']"
                />
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20 text-white border border-white/30 shadow-lg' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                      
                      {!isCollapsed && (
                        <>
                          <span className="font-medium font-['Inter'] text-sm">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </motion.li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-white/20 pt-6 space-y-3">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <BellIcon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium font-['Inter'] text-sm">
                  Notifications
                </span>
              )}
              {!isCollapsed && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              )}
            </motion.button>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-300
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="font-medium font-['Inter'] text-sm">
                  Logout
                </span>
              )}
            </motion.button>
          </div>

          {/* Collapse Toggle */}
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute -right-4 top-8 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.div>
          </motion.button>
        </div>
      </GlassCard>
    </div>
  )
}

export default Sidebar