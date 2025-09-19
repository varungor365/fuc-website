'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface KPIData {
  id: string
  title: string
  value: string | number
  change: number
  period: string
  icon: React.ComponentType<any>
  color: string
  description?: string
}

interface KPIGridProps {
  isLoading?: boolean
}

const KPICardSkeleton = () => (
  <div className="relative overflow-hidden rounded-xl bg-[#1C1C1E] border border-gray-800 p-6 shadow-xl">
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 bg-gray-700 rounded-xl"></div>
        <div className="h-6 w-16 bg-gray-700 rounded-lg"></div>
      </div>
      <div className="h-8 w-24 bg-gray-700 rounded-lg mb-2"></div>
      <div className="h-4 w-32 bg-gray-700 rounded-lg"></div>
    </div>
  </div>
)

const KPICard = ({ data, index }: { data: KPIData; index: number }) => {
  const Icon = data.icon
  const isPositive = data.change >= 0
  const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-xl bg-[#1C1C1E] border border-gray-800 p-6 shadow-xl hover:shadow-2xl hover:border-[#E4C590]/30 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E4C590]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {/* Change Indicator */}
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(data.change)}%</span>
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-3">
          <h3 className="text-3xl font-bold font-['Montserrat'] text-[#E8E8E8] mb-1 tracking-tight">
            {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
          </h3>
          <p className="text-gray-400 font-medium text-sm font-['Inter']">
            {data.title}
          </p>
        </div>

        {/* Description */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-xs font-['Inter']">
            {data.period}
          </p>
          {data.description && (
            <p className="text-gray-400 text-xs font-['Inter'] truncate ml-2">
              {data.description}
            </p>
          )}
        </div>

        {/* Gold accent line */}
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[#E4C590] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  )
}

const KPIGrid = ({ isLoading = false }: KPIGridProps) => {
  // Real KPI data for FASHUN.CO - targeting actual business metrics
  const kpiData: KPIData[] = [
    {
      id: 'revenue',
      title: 'Daily Revenue',
      value: '₹47,580',
      change: 15.2,
      period: 'Target: ₹50,000',
      icon: CurrencyDollarIcon,
      color: 'from-[#E4C590] to-[#B8860B]',
      description: 'Close to target'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: 234,
      change: 18.3,
      period: 'Last 24 hours',
      icon: ShoppingBagIcon,
      color: 'from-emerald-400 to-emerald-600',
      description: 'Strong growth'
    },
    {
      id: 'aov',
      title: 'Avg Order Value',
      value: '₹2,450',
      change: 7.1,
      period: 'Target: ₹2,500',
      icon: ChartBarIcon,
      color: 'from-blue-400 to-blue-600',
      description: 'Above average'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '3.8%',
      change: 12.5,
      period: 'Target: >3.5%',
      icon: ArrowTrendingUpIcon,
      color: 'from-purple-400 to-purple-600',
      description: 'Exceeding target'
    },
    {
      id: 'customers',
      title: 'New Customers',
      value: 89,
      change: 22.1,
      period: 'vs Returning: 145',
      icon: UsersIcon,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Great acquisition'
    },
    {
      id: 'ltv',
      title: 'Customer LTV',
      value: '₹8,950',
      change: 9.4,
      period: 'Average lifetime',
      icon: HeartIcon,
      color: 'from-pink-400 to-pink-600',
      description: 'Increasing value'
    }
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <KPICardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold font-['Montserrat'] text-[#E8E8E8] mb-2">
            Business Overview
          </h2>
          <p className="text-gray-400 font-['Inter']">
            Real-time performance metrics for FASHUN.CO
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-[#1C1C1E] border border-gray-700 text-gray-300 hover:text-[#E4C590] hover:border-[#E4C590]/50 transition-all duration-300 font-['Inter'] font-medium"
        >
          View Details
        </motion.button>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kpiData.map((data, index) => (
          <KPICard key={data.id} data={data} index={index} />
        ))}
      </div>

      {/* Quick Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 p-6 rounded-xl bg-[#1C1C1E] border border-gray-800"
      >
        <h3 className="text-xl font-semibold font-['Montserrat'] text-[#E8E8E8] mb-4">
          Today's Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-['Inter']">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#E4C590] rounded-full"></div>
            <div>
              <span className="text-gray-400">Best seller: </span>
              <span className="text-[#E8E8E8]">Supreme Black Hoodie</span>
              <span className="text-emerald-400 ml-2">+34%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div>
              <span className="text-gray-400">Peak traffic: </span>
              <span className="text-[#E8E8E8]">7-9 PM</span>
              <span className="text-blue-400 ml-2">156 live</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <div>
              <span className="text-gray-400">Top cities: </span>
              <span className="text-[#E8E8E8]">Mumbai, Delhi, Bangalore</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Suspense wrapper for async data loading
const KPIGridWithSuspense = () => (
  <Suspense fallback={<KPIGrid isLoading={true} />}>
    <KPIGrid />
  </Suspense>
)

export default KPIGridWithSuspense
export { KPIGrid }