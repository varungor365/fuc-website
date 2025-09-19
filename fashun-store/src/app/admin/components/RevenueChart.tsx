'use client'

import { motion } from 'framer-motion'
import { 
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface RevenueData {
  month: string
  revenue: number
  profit: number
  growth: number
}

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  // Mock data - in production, this would come from your API
  const revenueData: RevenueData[] = [
    { month: 'Jan', revenue: 85000, profit: 12750, growth: 12 },
    { month: 'Feb', revenue: 92000, profit: 13800, growth: 8.2 },
    { month: 'Mar', revenue: 78000, profit: 11700, growth: -15.2 },
    { month: 'Apr', revenue: 105000, profit: 15750, growth: 34.6 },
    { month: 'May', revenue: 125000, profit: 18750, growth: 19.0 },
    { month: 'Jun', revenue: 142000, profit: 21300, growth: 13.6 }
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalProfit = revenueData.reduce((sum, d) => sum + d.profit, 0)
  const avgGrowth = revenueData.reduce((sum, d) => sum + d.growth, 0) / revenueData.length

  const periods = ['1M', '3M', '6M', '1Y']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <CurrencyRupeeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Revenue Chart
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              Monthly revenue & profit
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-[#E4C590] text-black'
                  : 'text-gray-400 hover:text-[#E8E8E8]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-[#E8E8E8] font-bold text-xl font-['Inter']">
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Total Profit</p>
          <p className="text-green-400 font-bold text-xl font-['Inter']">
            ₹{(totalProfit / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-1">Avg Growth</p>
          <div className="flex items-center justify-center gap-1">
            {avgGrowth > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
            )}
            <p className={`font-bold text-xl font-['Inter'] ${
              avgGrowth > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {avgGrowth.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 mb-4">
        <div className="flex items-end justify-between h-full gap-2">
          {revenueData.map((data, index) => {
            const heightPercentage = (data.revenue / maxRevenue) * 100
            const profitHeightPercentage = (data.profit / maxRevenue) * 100
            
            return (
              <div
                key={data.month}
                className="flex-1 flex flex-col items-center group"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-16 bg-[#0F0F10] border border-gray-700 rounded-lg p-3 text-xs whitespace-nowrap z-10"
                  >
                    <p className="text-[#E8E8E8] font-medium">{data.month}</p>
                    <p className="text-[#E4C590]">Revenue: ₹{(data.revenue / 1000).toFixed(0)}k</p>
                    <p className="text-green-400">Profit: ₹{(data.profit / 1000).toFixed(0)}k</p>
                    <p className={`${data.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      Growth: {data.growth > 0 ? '+' : ''}{data.growth}%
                    </p>
                  </motion.div>
                )}
                
                {/* Bar */}
                <div className="relative w-full max-w-12 h-full flex flex-col justify-end">
                  {/* Revenue Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-[#E4C590] to-[#E4C590]/70 rounded-t-sm group-hover:from-[#E4C590] group-hover:to-[#E4C590] transition-all duration-300"
                  />
                  
                  {/* Profit Bar Overlay */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${profitHeightPercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm opacity-80"
                  />
                </div>
                
                {/* Month Label */}
                <p className="text-gray-400 text-xs mt-2 font-['Inter']">{data.month}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-[#E4C590] to-[#E4C590]/70 rounded-sm" />
          <span className="text-gray-400">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-sm" />
          <span className="text-gray-400">Profit</span>
        </div>
      </div>
    </motion.div>
  )
}

export default RevenueChart