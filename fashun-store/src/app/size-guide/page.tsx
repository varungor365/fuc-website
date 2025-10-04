'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ScaleIcon as RulerIcon
} from '@heroicons/react/24/outline'

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState('hoodies')
  const [selectedSize, setSelectedSize] = useState('')

  const categories = [
    { id: 'hoodies', label: 'Hoodies & Sweatshirts', icon: '👕' },
    { id: 'tshirts', label: 'T-Shirts', icon: '👔' },
    { id: 'pants', label: 'Pants & Jeans', icon: '👖' },
    { id: 'accessories', label: 'Accessories', icon: '🧢' }
  ]

  const sizeCharts = {
    hoodies: {
      measurements: ['Chest', 'Length', 'Shoulder', 'Sleeve'],
      sizes: [
        { size: 'XS', chest: '34-36', length: '24', shoulder: '17', sleeve: '24', fit: 'Slim' },
        { size: 'S', chest: '36-38', length: '25', shoulder: '18', sleeve: '25', fit: 'Regular' },
        { size: 'M', chest: '38-40', length: '26', shoulder: '19', sleeve: '26', fit: 'Regular' },
        { size: 'L', chest: '40-42', length: '27', shoulder: '20', sleeve: '27', fit: 'Relaxed' },
        { size: 'XL', chest: '42-44', length: '28', shoulder: '21', sleeve: '28', fit: 'Relaxed' },
        { size: 'XXL', chest: '44-46', length: '29', shoulder: '22', sleeve: '29', fit: 'Oversized' },
      ]
    },
    tshirts: {
      measurements: ['Chest', 'Length', 'Shoulder'],
      sizes: [
        { size: 'XS', chest: '32-34', length: '23', shoulder: '16', fit: 'Slim' },
        { size: 'S', chest: '34-36', length: '24', shoulder: '17', fit: 'Regular' },
        { size: 'M', chest: '36-38', length: '25', shoulder: '18', fit: 'Regular' },
        { size: 'L', chest: '38-40', length: '26', shoulder: '19', fit: 'Relaxed' },
        { size: 'XL', chest: '40-42', length: '27', shoulder: '20', fit: 'Relaxed' },
        { size: 'XXL', chest: '42-44', length: '28', shoulder: '21', fit: 'Oversized' },
      ]
    },
    pants: {
      measurements: ['Waist', 'Inseam', 'Hip'],
      sizes: [
        { size: '28', waist: '28', inseam: '30', hip: '36', fit: 'Slim' },
        { size: '30', waist: '30', inseam: '30', hip: '38', fit: 'Regular' },
        { size: '32', waist: '32', inseam: '32', hip: '40', fit: 'Regular' },
        { size: '34', waist: '34', inseam: '32', hip: '42', fit: 'Relaxed' },
        { size: '36', waist: '36', inseam: '34', hip: '44', fit: 'Relaxed' },
        { size: '38', waist: '38', inseam: '34', hip: '46', fit: 'Comfort' },
      ]
    },
    accessories: {
      measurements: ['Circumference'],
      sizes: [
        { size: 'One Size', circumference: '21-24', fit: 'Adjustable' }
      ]
    }
  }

  const measurementTips = [
    {
      title: 'Chest Measurement',
      description: 'Measure around the fullest part of your chest, under your arms.',
      icon: '📏'
    },
    {
      title: 'Length Measurement',
      description: 'Measure from the highest point of the shoulder to the bottom hem.',
      icon: '📐'
    },
    {
      title: 'Shoulder Measurement',
      description: 'Measure from shoulder seam to shoulder seam across the back.',
      icon: '📏'
    },
    {
      title: 'Sleeve Measurement',
      description: 'Measure from shoulder seam to the end of the sleeve.',
      icon: '📐'
    }
  ]

  const fitGuide = [
    {
      type: 'Slim Fit',
      description: 'Close to body, tailored silhouette',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      type: 'Regular Fit',
      description: 'Comfortable, not too loose or tight',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      type: 'Relaxed Fit',
      description: 'Loose and comfortable',
      color: 'bg-yellow-500/20 text-yellow-400'
    },
    {
      type: 'Oversized Fit',
      description: 'Very loose, streetwear style',
      color: 'bg-purple-500/20 text-purple-400'
    }
  ]

  const currentChart = sizeCharts[activeCategory as keyof typeof sizeCharts]

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <RulerIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Size Guide
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Find your perfect fit with our comprehensive sizing charts and measurement guide
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                  activeCategory === category.id
                    ? 'bg-accent-500 text-primary-900'
                    : 'bg-primary-800/30 text-primary-200 hover:bg-primary-700/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Size Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-2xl mr-3">{categories.find(c => c.id === activeCategory)?.icon}</span>
                {categories.find(c => c.id === activeCategory)?.label} Size Chart
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white font-semibold py-3 px-4">Size</th>
                      {currentChart.measurements.map((measurement) => (
                        <th key={measurement} className="text-center text-white font-semibold py-3 px-4">
                          {measurement} (inches)
                        </th>
                      ))}
                      <th className="text-center text-white font-semibold py-3 px-4">Fit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentChart.sizes.map((sizeData, index) => (
                      <motion.tr
                        key={sizeData.size}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`border-b border-white/10 hover:bg-primary-800/20 cursor-pointer ${
                          selectedSize === sizeData.size ? 'bg-accent-500/20' : ''
                        }`}
                        onClick={() => setSelectedSize(sizeData.size)}
                      >
                        <td className="py-4 px-4">
                          <span className={`font-bold text-lg ${
                            selectedSize === sizeData.size ? 'text-accent-400' : 'text-white'
                          }`}>
                            {sizeData.size}
                          </span>
                        </td>
                        {currentChart.measurements.map((measurement) => {
                          const key = measurement.toLowerCase()
                          const value = (sizeData as any)[key] || '-'
                          return (
                            <td key={measurement} className="text-center py-4 px-4 text-primary-200">
                              {value}
                            </td>
                          )
                        })}
                        <td className="text-center py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            fitGuide.find(f => f.type.includes(sizeData.fit))?.color || 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {sizeData.fit}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-accent-500/10 border border-accent-400/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <InformationCircleIcon className="w-6 h-6 text-accent-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-accent-400 font-semibold mb-2">Size Note</h4>
                    <p className="text-primary-200 text-sm">
                      All measurements are in inches and may vary by ±0.5 inches. For the best fit, 
                      we recommend comparing these measurements to a similar garment that fits you well.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Measurement Guide & Fit Guide */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* How to Measure */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <UserIcon className="w-6 h-6 text-accent-400 mr-3" />
                How to Measure
              </h3>
              <div className="space-y-4">
                {measurementTips.map((tip, index) => (
                  <div key={tip.title} className="flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{tip.title}</h4>
                      <p className="text-primary-300 text-sm mt-1">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fit Guide */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-accent-400 mr-3" />
                Fit Guide
              </h3>
              <div className="space-y-3">
                {fitGuide.map((fit) => (
                  <div key={fit.type} className="flex items-center justify-between p-3 rounded-lg bg-primary-800/30">
                    <div>
                      <h4 className="text-white font-semibold text-sm">{fit.type}</h4>
                      <p className="text-primary-300 text-xs">{fit.description}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${fit.color.split(' ')[0]}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Recommendation */}
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <QuestionMarkCircleIcon className="w-6 h-6 text-accent-400 mr-3" />
                Need Help?
              </h3>
              <div className="space-y-4">
                <button className="w-full btn btn-glass btn-sm text-left">
                  📱 WhatsApp Size Consultation
                </button>
                <button className="w-full btn btn-ghost btn-sm text-white border-white/30 text-left">
                  📧 Email Size Expert
                </button>
                <button className="w-full btn btn-ghost btn-sm text-white border-white/30 text-left">
                  🎥 Watch Fit Video
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-green-400 font-semibold text-sm mb-1">Perfect Fit Guarantee</h4>
                    <p className="text-primary-200 text-xs">
                      Not happy with the fit? Free exchanges within 30 days!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Size Finder Tool */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-accent-600/20 via-accent-500/20 to-accent-600/20 backdrop-blur-sm border border-accent-400/30 rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">AI Size Finder</h2>
            <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
              Answer a few questions and let our AI recommend your perfect size based on your measurements and fit preferences.
            </p>
            <button className="btn btn-glass btn-lg">
              Find My Size
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}