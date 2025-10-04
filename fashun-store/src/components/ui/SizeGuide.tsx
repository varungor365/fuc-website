'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  InformationCircleIcon,
  RulerIcon
} from '@heroicons/24/outline'

interface SizeData {
  size: string
  chest?: number
  waist?: number
  hips?: number
  length?: number
  shoulder?: number
  sleeve?: number
}

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  category: 'hoodies' | 'tshirts' | 'oversized-tshirts' | 'sweatshirts' | 'polo-shirts'
  productType?: string
}

export default function SizeGuide({ isOpen, onClose, category, productType = '' }: SizeGuideProps) {
  const [selectedUnit, setSelectedUnit] = useState<'cm' | 'inches'>('cm')
  const [selectedSize, setSelectedSize] = useState<string>('')

  const sizeCharts: Record<string, SizeData[]> = {
    hoodies: [
      { size: 'XS', chest: 92, length: 63, shoulder: 42, sleeve: 59 },
      { size: 'S', chest: 97, length: 66, shoulder: 44, sleeve: 61 },
      { size: 'M', chest: 102, length: 69, shoulder: 46, sleeve: 63 },
      { size: 'L', chest: 107, length: 72, shoulder: 48, sleeve: 65 },
      { size: 'XL', chest: 112, length: 75, shoulder: 50, sleeve: 67 },
      { size: 'XXL', chest: 117, length: 78, shoulder: 52, sleeve: 69 }
    ],
    tshirts: [
      { size: 'XS', chest: 86, length: 66, shoulder: 40, sleeve: 18 },
      { size: 'S', chest: 91, length: 68, shoulder: 42, sleeve: 19 },
      { size: 'M', chest: 96, length: 70, shoulder: 44, sleeve: 20 },
      { size: 'L', chest: 101, length: 72, shoulder: 46, sleeve: 21 },
      { size: 'XL', chest: 106, length: 74, shoulder: 48, sleeve: 22 },
      { size: 'XXL', chest: 111, length: 76, shoulder: 50, sleeve: 23 }
    ],
    'oversized-tshirts': [
      { size: 'XS', chest: 104, length: 68, shoulder: 48, sleeve: 20 },
      { size: 'S', chest: 109, length: 70, shoulder: 50, sleeve: 21 },
      { size: 'M', chest: 114, length: 72, shoulder: 52, sleeve: 22 },
      { size: 'L', chest: 119, length: 74, shoulder: 54, sleeve: 23 },
      { size: 'XL', chest: 124, length: 76, shoulder: 56, sleeve: 24 },
      { size: 'XXL', chest: 129, length: 78, shoulder: 58, sleeve: 25 }
    ],
    sweatshirts: [
      { size: 'XS', chest: 94, length: 64, shoulder: 43, sleeve: 58 },
      { size: 'S', chest: 99, length: 67, shoulder: 45, sleeve: 60 },
      { size: 'M', chest: 104, length: 70, shoulder: 47, sleeve: 62 },
      { size: 'L', chest: 109, length: 73, shoulder: 49, sleeve: 64 },
      { size: 'XL', chest: 114, length: 76, shoulder: 51, sleeve: 66 },
      { size: 'XXL', chest: 119, length: 79, shoulder: 53, sleeve: 68 }
    ],
    'polo-shirts': [
      { size: 'XS', chest: 88, length: 65, shoulder: 41, sleeve: 19 },
      { size: 'S', chest: 93, length: 67, shoulder: 43, sleeve: 20 },
      { size: 'M', chest: 98, length: 69, shoulder: 45, sleeve: 21 },
      { size: 'L', chest: 103, length: 71, shoulder: 47, sleeve: 22 },
      { size: 'XL', chest: 108, length: 73, shoulder: 49, sleeve: 23 },
      { size: 'XXL', chest: 113, length: 75, shoulder: 51, sleeve: 24 }
    ]
  }

  const convertToInches = (cm: number): number => {
    return Number((cm / 2.54).toFixed(1))
  }

  const getValue = (cm: number): string => {
    return selectedUnit === 'cm' ? `${cm}` : `${convertToInches(cm)}`
  }

  const getUnit = (): string => {
    return selectedUnit === 'cm' ? 'cm' : '"'
  }

  const categoryNames: Record<string, string> = {
    hoodies: 'Hoodies',
    tshirts: 'T-Shirts',
    'oversized-tshirts': 'Oversized T-Shirts',
    sweatshirts: 'Sweatshirts',
    'polo-shirts': 'Polo Shirts'
  }

  const measurementTips = [
    {
      title: 'Chest',
      description: 'Measure around the fullest part of your chest, keeping the tape horizontal.'
    },
    {
      title: 'Length', 
      description: 'Measure from the highest point of the shoulder to the hem.'
    },
    {
      title: 'Shoulder',
      description: 'Measure from shoulder seam to shoulder seam across the back.'
    },
    {
      title: 'Sleeve',
      description: 'Measure from shoulder seam to the end of the sleeve.'
    }
  ]

  const sizeRecommendations = {
    'XS': 'Best for: 5\'2" - 5\'6" (157-168cm), 45-55kg',
    'S': 'Best for: 5\'4" - 5\'8" (163-173cm), 55-65kg', 
    'M': 'Best for: 5\'6" - 5\'10" (168-178cm), 65-75kg',
    'L': 'Best for: 5\'8" - 6\'0" (173-183cm), 75-85kg',
    'XL': 'Best for: 5\'10" - 6\'2" (178-188cm), 85-95kg',
    'XXL': 'Best for: 6\'0" - 6\'4" (183-193cm), 95-105kg'
  }

  const currentChart = sizeCharts[category] || sizeCharts.tshirts

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Size Guide Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              exit={{ y: 50 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <div className="flex items-center space-x-3">
                  <RulerIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Size Guide
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {categoryNames[category]} {productType && `- ${productType}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Unit Toggle */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setSelectedUnit('cm')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        selectedUnit === 'cm'
                          ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      CM
                    </button>
                    <button
                      onClick={() => setSelectedUnit('inches')}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                        selectedUnit === 'inches'
                          ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      IN
                    </button>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
                {/* Size Chart */}
                <div className="lg:w-2/3 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Size Chart
                      </h3>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                Size
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                Chest ({getUnit()})
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                Length ({getUnit()})
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                Shoulder ({getUnit()})
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                                Sleeve ({getUnit()})
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentChart.map((row, index) => (
                              <motion.tr
                                key={row.size}
                                className={`border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                                  selectedSize === row.size
                                    ? 'bg-purple-50 dark:bg-purple-900/30'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                                onClick={() => setSelectedSize(selectedSize === row.size ? '' : row.size)}
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400">
                                  {row.size}
                                </td>
                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                  {row.chest && getValue(row.chest)}
                                </td>
                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                  {row.length && getValue(row.length)}
                                </td>
                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                  {row.shoulder && getValue(row.shoulder)}
                                </td>
                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                  {row.sleeve && getValue(row.sleeve)}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {selectedSize && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                          Size {selectedSize} Recommendation
                        </h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                          {sizeRecommendations[selectedSize as keyof typeof sizeRecommendations]}
                        </p>
                      </motion.div>
                    )}

                    {/* Size Guide Visual */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        How to Measure
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {measurementTips.map((tip, index) => (
                          <motion.div
                            key={tip.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                          >
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {tip.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tip.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Panel */}
                <div className="lg:w-1/3 bg-gray-50 dark:bg-gray-800 p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Fit Information
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              Regular Fit
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              True to size with comfortable room for movement. Perfect for everyday wear.
                            </p>
                          </div>
                        </div>
                      </div>

                      {category === 'oversized-tshirts' && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <InformationCircleIcon className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                Oversized Fit
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Intentionally loose and relaxed fit. Consider sizing down for a more fitted look.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Care Instructions
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>• Machine wash cold (30°C)</li>
                          <li>• Do not bleach</li>
                          <li>• Tumble dry low</li>
                          <li>• Iron on low heat</li>
                        </ul>
                      </div>

                      <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Material & Features
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <li>• 100% Premium Cotton</li>
                          <li>• Pre-shrunk fabric</li>
                          <li>• Reinforced seams</li>
                          <li>• Soft hand feel</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Need Help?
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Still unsure about sizing? Our customer support team is here to help!
                    </p>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}