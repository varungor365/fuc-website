'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import GlassCard from './GlassCard'

interface TopBarProps {
  title?: string
  subtitle?: string
}

const TopBar = ({ title = "Dashboard", subtitle }: TopBarProps) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, text: "New order #1247 received", time: "2 min ago", type: "order" },
    { id: 2, text: "Low stock alert: Supreme Hoodie", time: "5 min ago", type: "warning" },
    { id: 3, text: "Payment successful for order #1246", time: "10 min ago", type: "success" }
  ]

  return (
    <div className="sticky top-0 z-30 ml-72 transition-all duration-500">
      <GlassCard 
        className="rounded-none rounded-b-2xl border-t-0" 
        hover={false}
        blur="md"
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Left Side - Title & Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl font-bold font-['Montserrat'] text-white mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/60 font-['Inter'] text-sm">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Right Side - Actions & User */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {/* Global Search */}
              <div className="relative hidden md:block">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="w-80 pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 font-['Inter'] text-sm"
                />
              </div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
                >
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white/20"></span>
                </motion.button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 z-50"
                  >
                    <GlassCard border="strong" className="p-4">
                      <h3 className="text-lg font-semibold font-['Montserrat'] text-white mb-3">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'order' ? 'bg-blue-400' :
                              notification.type === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-['Inter']">
                                {notification.text}
                              </p>
                              <p className="text-white/50 text-xs font-['Inter'] mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-3 py-2 text-center text-white/70 hover:text-white text-sm font-['Inter'] transition-colors">
                        View all notifications
                      </button>
                    </GlassCard>
                  </motion.div>
                )}
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </motion.button>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                <div className="text-right hidden sm:block">
                  <p className="text-white font-medium font-['Inter'] text-sm">
                    Admin User
                  </p>
                  <p className="text-white/50 font-['Inter'] text-xs">
                    Super Admin
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center shadow-lg">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white/20"></div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default TopBar