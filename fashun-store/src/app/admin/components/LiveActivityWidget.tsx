'use client'

import { motion } from 'framer-motion'
import { 
  UserIcon,
  ShoppingCartIcon,
  EyeIcon,
  CreditCardIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface Activity {
  id: string
  type: 'user_signup' | 'order_placed' | 'product_view' | 'payment_completed' | 'page_visit' | 'mobile_app'
  user: string
  action: string
  time: string
  value?: number
  location?: string
}

const activityIcons = {
  user_signup: { icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  order_placed: { icon: ShoppingCartIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
  product_view: { icon: EyeIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  payment_completed: { icon: CreditCardIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  page_visit: { icon: GlobeAltIcon, color: 'text-gray-400', bg: 'bg-gray-500/10' },
  mobile_app: { icon: DevicePhoneMobileIcon, color: 'text-pink-400', bg: 'bg-pink-500/10' }
}

const LiveActivityWidget = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [liveCount, setLiveCount] = useState(47)

  // Mock real-time activities
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'order_placed',
        user: 'Priya S.',
        action: 'placed an order',
        time: 'just now',
        value: 1299,
        location: 'Mumbai'
      },
      {
        id: '2',
        type: 'user_signup',
        user: 'Rahul K.',
        action: 'signed up',
        time: '1 min ago',
        location: 'Delhi'
      },
      {
        id: '3',
        type: 'product_view',
        user: 'Sneha G.',
        action: 'viewed Oversized Hoodie',
        time: '2 min ago',
        location: 'Bangalore'
      },
      {
        id: '4',
        type: 'payment_completed',
        user: 'Arjun P.',
        action: 'completed payment',
        time: '3 min ago',
        value: 2340,
        location: 'Chennai'
      },
      {
        id: '5',
        type: 'mobile_app',
        user: 'Kavya M.',
        action: 'opened mobile app',
        time: '4 min ago',
        location: 'Pune'
      },
      {
        id: '6',
        type: 'page_visit',
        user: 'Vikram S.',
        action: 'visited homepage',
        time: '5 min ago',
        location: 'Hyderabad'
      }
    ]

    setActivities(mockActivities)

    // Simulate live updates
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3) - 1)
      
      // Occasionally add new activity
      if (Math.random() > 0.7) {
        const newActivity: Activity = {
          id: Date.now().toString(),
          type: 'product_view',
          user: `User ${Math.floor(Math.random() * 1000)}`,
          action: 'viewed a product',
          time: 'just now',
          location: 'India'
        }
        
        setActivities(prev => [newActivity, ...prev.slice(0, 5)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center relative">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Live Activity
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              Real-time user actions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 font-medium font-['Inter']">
            {liveCount} online
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => {
          const ActivityIcon = activityIcons[activity.type].icon
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#0F0F10] border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${activityIcons[activity.type].bg} flex items-center justify-center flex-shrink-0`}>
                <ActivityIcon className={`w-4 h-4 ${activityIcons[activity.type].color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#E8E8E8] font-medium font-['Inter'] text-sm">
                      <span className="text-[#E4C590]">{activity.user}</span> {activity.action}
                    </p>
                    {activity.value && (
                      <p className="text-green-400 text-xs font-medium">
                        ₹{activity.value.toLocaleString()}
                      </p>
                    )}
                    {activity.location && (
                      <p className="text-gray-500 text-xs">
                        from {activity.location}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-lg bg-[#0F0F10]">
            <p className="text-gray-400 text-xs mb-1">Active Sessions</p>
            <p className="text-[#E8E8E8] font-semibold text-lg">
              {liveCount}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#0F0F10]">
            <p className="text-gray-400 text-xs mb-1">Avg. Session</p>
            <p className="text-[#E8E8E8] font-semibold text-lg">4:32</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LiveActivityWidget