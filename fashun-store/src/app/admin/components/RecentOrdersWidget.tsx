'use client'

import { motion } from 'framer-motion'
import { 
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  time: string
  items: number
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20'
}

const RecentOrdersWidget = () => {
  // Mock data - in production, this would come from your API
  const recentOrders: Order[] = [
    {
      id: '#ORD-1247',
      customer: 'Arjun Patel',
      amount: 2340,
      status: 'processing',
      time: '2 min ago',
      items: 2
    },
    {
      id: '#ORD-1246',
      customer: 'Priya Sharma',
      amount: 1650,
      status: 'shipped',
      time: '5 min ago',
      items: 1
    },
    {
      id: '#ORD-1245',
      customer: 'Rahul Kumar',
      amount: 890,
      status: 'delivered',
      time: '12 min ago',
      items: 1
    },
    {
      id: '#ORD-1244',
      customer: 'Sneha Gupta',
      amount: 3200,
      status: 'pending',
      time: '18 min ago',
      items: 3
    },
    {
      id: '#ORD-1243',
      customer: 'Vikram Singh',
      amount: 1450,
      status: 'processing',
      time: '25 min ago',
      items: 1
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <ShoppingBagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Recent Orders
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              Latest customer orders
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-[#E4C590] transition-colors"
        >
          <ArrowTrendingUpIcon className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recentOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-[#0F0F10] border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[#E8E8E8] font-medium font-['Inter']">
                  {order.id}
                </p>
                <p className="text-gray-400 text-sm font-['Inter']">
                  {order.customer}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                {order.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[#E4C590] font-medium font-['Inter']">
                  ₹{order.amount.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">
                  {order.items} items
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <ClockIcon className="w-3 h-3" />
                <span>{order.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full mt-4 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-[#E8E8E8] hover:border-[#E4C590]/50 transition-all duration-300 font-['Inter']"
      >
        View All Orders
      </motion.button>
    </motion.div>
  )
}

export default RecentOrdersWidget