'use client'

import { motion } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  CubeIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface LowStockItem {
  id: string
  name: string
  sku: string
  currentStock: number
  minStock: number
  status: 'critical' | 'low' | 'warning'
  category: string
  lastRestocked: string
  estimatedRunout: string
  reorderPoint: number
}

const statusConfig = {
  critical: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    label: 'Critical'
  },
  low: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    label: 'Low Stock'
  },
  warning: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    label: 'Warning'
  }
}

const LowStockAlerts = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'low' | 'warning'>('all')

  // Mock data - in production, this would come from your inventory API
  const lowStockItems: LowStockItem[] = [
    {
      id: '1',
      name: 'Oversized Graphic Tee - Black',
      sku: 'TSH-001-BLK-L',
      currentStock: 2,
      minStock: 10,
      status: 'critical',
      category: 'T-Shirts',
      lastRestocked: '2024-01-10',
      estimatedRunout: '2 days',
      reorderPoint: 15
    },
    {
      id: '2',
      name: 'Streetwear Hoodie - Gray',
      sku: 'HOD-002-GRY-M',
      currentStock: 5,
      minStock: 12,
      status: 'critical',
      category: 'Hoodies',
      lastRestocked: '2024-01-08',
      estimatedRunout: '5 days',
      reorderPoint: 20
    },
    {
      id: '3',
      name: 'Vintage Denim Jacket',
      sku: 'JCK-003-BLU-L',
      currentStock: 8,
      minStock: 15,
      status: 'low',
      category: 'Jackets',
      lastRestocked: '2024-01-12',
      estimatedRunout: '1 week',
      reorderPoint: 25
    },
    {
      id: '4',
      name: 'Urban Cargo Pants - Khaki',
      sku: 'PNT-004-KHK-32',
      currentStock: 12,
      minStock: 20,
      status: 'warning',
      category: 'Pants',
      lastRestocked: '2024-01-14',
      estimatedRunout: '2 weeks',
      reorderPoint: 30
    },
    {
      id: '5',
      name: 'Basic Cotton Tee - White',
      sku: 'TSH-005-WHT-M',
      currentStock: 7,
      minStock: 25,
      status: 'low',
      category: 'T-Shirts',
      lastRestocked: '2024-01-11',
      estimatedRunout: '1 week',
      reorderPoint: 35
    }
  ]

  const filteredItems = filter === 'all' 
    ? lowStockItems 
    : lowStockItems.filter(item => item.status === filter)

  const criticalCount = lowStockItems.filter(item => item.status === 'critical').length
  const lowCount = lowStockItems.filter(item => item.status === 'low').length
  const warningCount = lowStockItems.filter(item => item.status === 'warning').length

  const handleReorder = (itemId: string) => {
    // In production, this would trigger a reorder process
    console.log(`Reordering item: ${itemId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative">
            <ExclamationTriangleIcon className="w-5 h-5 text-white" />
            {criticalCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{criticalCount}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Low Stock Alerts
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              Inventory warnings
            </p>
          </div>
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-[#0F0F10] border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-[#E4C590]"
        >
          <option value="all">All ({lowStockItems.length})</option>
          <option value="critical">Critical ({criticalCount})</option>
          <option value="low">Low ({lowCount})</option>
          <option value="warning">Warning ({warningCount})</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-400 font-bold text-lg">{criticalCount}</p>
          <p className="text-red-400 text-xs">Critical</p>
        </div>
        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
          <p className="text-orange-400 font-bold text-lg">{lowCount}</p>
          <p className="text-orange-400 text-xs">Low Stock</p>
        </div>
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
          <p className="text-yellow-400 font-bold text-lg">{warningCount}</p>
          <p className="text-yellow-400 text-xs">Warning</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredItems.map((item, index) => {
          const config = statusConfig[item.status]
          const stockPercentage = (item.currentStock / item.reorderPoint) * 100
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg bg-[#0F0F10] border ${config.border} hover:border-gray-700 transition-colors group`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[#E8E8E8] font-medium font-['Inter'] truncate">
                      {item.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-mono">{item.sku}</p>
                  <p className="text-gray-500 text-xs">{item.category}</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReorder(item.id)}
                  className="w-8 h-8 rounded-lg bg-[#E4C590]/10 border border-[#E4C590]/20 flex items-center justify-center hover:bg-[#E4C590]/20 transition-colors"
                >
                  <ArrowPathIcon className="w-4 h-4 text-[#E4C590]" />
                </motion.button>
              </div>

              {/* Stock Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">Stock Level</span>
                  <span className="text-[#E8E8E8] text-xs font-medium">
                    {item.currentStock} / {item.reorderPoint}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stockPercentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${
                      stockPercentage < 20 ? 'bg-red-500' :
                      stockPercentage < 40 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <ClockIcon className="w-3 h-3" />
                    <span>Last Restocked</span>
                  </div>
                  <p className="text-[#E8E8E8]">
                    {new Date(item.lastRestocked).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <CubeIcon className="w-3 h-3" />
                    <span>Est. Runout</span>
                  </div>
                  <p className={`font-medium ${config.color}`}>
                    {item.estimatedRunout}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <CubeIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No items in this category</p>
        </div>
      )}
    </motion.div>
  )
}

export default LowStockAlerts