'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  PhotoIcon,
  LightBulbIcon,
  MegaphoneIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon, badge: 12 },
  { name: 'Products', href: '/admin/products', icon: TagIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'AI Insights', href: '/admin/ai-insights', icon: LightBulbIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Marketing', href: '/admin/marketing', icon: MegaphoneIcon },
  { name: 'Inventory', href: '/admin/inventory', icon: ClipboardDocumentListIcon },
  { name: 'UGC', href: '/admin/ugc', icon: PhotoIcon },
  { name: 'SEO Tools', href: '/admin/seo', icon: BeakerIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="h-screen flex overflow-hidden bg-[#0F0F10]">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1C1E] border-r border-gray-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E4C590] to-[#B8860B] flex items-center justify-center">
                <span className="text-black font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="text-lg font-bold font-['Montserrat'] text-[#E8E8E8]">FASHUN</h1>
                <p className="text-xs text-gray-400">Admin Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-[#E8E8E8]"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#E4C590]/10 text-[#E4C590] border border-[#E4C590]/20'
                        : 'text-gray-400 hover:text-[#E8E8E8] hover:bg-gray-800/50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#E8E8E8] truncate">Admin User</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-[#1C1C1E] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-[#E8E8E8]"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-80 pl-10 pr-4 py-2 bg-[#0F0F10] border border-gray-700 rounded-lg text-[#E8E8E8] placeholder-gray-400 focus:outline-none focus:border-[#E4C590] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-[#E8E8E8] hover:bg-gray-800/50 transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-sm font-medium">156 Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-[#0F0F10] p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
