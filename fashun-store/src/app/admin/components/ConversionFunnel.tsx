'use client'

import { motion } from 'framer-motion'
import { 
  FunnelIcon,
  EyeIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface FunnelStep {
  step: string
  icon: React.ElementType
  count: number
  percentage: number
  color: string
  bgColor: string
}

const ConversionFunnel = () => {
  // Mock data - in production, this would come from your analytics
  const funnelData: FunnelStep[] = [
    {
      step: 'Page Views',
      icon: EyeIcon,
      count: 12450,
      percentage: 100,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      step: 'Product Views',
      icon: EyeIcon,
      count: 8920,
      percentage: 71.6,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      step: 'Add to Cart',
      icon: ShoppingCartIcon,
      count: 3240,
      percentage: 36.3,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      step: 'Checkout',
      icon: CreditCardIcon,
      count: 1650,
      percentage: 50.9,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      step: 'Purchase',
      icon: CheckCircleIcon,
      count: 1089,
      percentage: 66.0,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ]

  const overallConversion = ((funnelData[4].count / funnelData[0].count) * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <FunnelIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Conversion Funnel
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              User journey analysis
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-gray-400 text-sm">Overall Rate</p>
          <p className="text-[#E4C590] font-bold text-xl font-['Inter']">
            {overallConversion}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {funnelData.map((step, index) => {
          const isFirst = index === 0
          const dropOff = index > 0 ? funnelData[index - 1].count - step.count : 0
          const dropOffPercentage = index > 0 ? ((dropOff / funnelData[index - 1].count) * 100).toFixed(1) : '0'
          
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Drop-off indicator */}
              {!isFirst && (
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-red-400 text-xs font-medium">
                      -{dropOff.toLocaleString()} ({dropOffPercentage}% drop)
                    </span>
                  </div>
                </div>
              )}
              
              {/* Funnel Step */}
              <div className="relative overflow-hidden">
                {/* Background bar */}
                <div className="w-full h-16 bg-[#0F0F10] border border-gray-800 rounded-lg" />
                
                {/* Progress bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`absolute top-0 left-0 h-16 ${step.bgColor} border border-gray-700 rounded-lg`}
                />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${step.bgColor} flex items-center justify-center`}>
                      <step.icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                    <div>
                      <p className="text-[#E8E8E8] font-medium font-['Inter']">
                        {step.step}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Step {index + 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[#E8E8E8] font-bold text-lg font-['Inter']">
                      {step.count.toLocaleString()}
                    </p>
                    <p className={`text-sm font-medium ${step.color}`}>
                      {step.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-[#0F0F10]">
            <p className="text-gray-400 text-xs mb-1">Avg. Cart Value</p>
            <p className="text-[#E8E8E8] font-semibold text-lg">₹1,847</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-[#0F0F10]">
            <p className="text-gray-400 text-xs mb-1">Revenue/Visitor</p>
            <p className="text-green-400 font-semibold text-lg">₹162</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ConversionFunnel