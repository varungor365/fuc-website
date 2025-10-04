'use client'

import { motion } from 'framer-motion'
import { 
  ArrowPathIcon,
  ShieldCheckIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function ReturnsPolicyPage() {
  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Log into your account and select the item you want to return',
      icon: ArrowPathIcon,
      timeframe: 'Within 30 days'
    },
    {
      step: 2,
      title: 'Select Reason',
      description: 'Choose the reason for return and provide any additional details',
      icon: TagIcon,
      timeframe: '2 minutes'
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'Choose a convenient time for our team to collect the item',
      icon: TruckIcon,
      timeframe: 'Next day pickup'
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'We inspect the item to ensure it meets return conditions',
      icon: ShieldCheckIcon,
      timeframe: '2-3 business days'
    },
    {
      step: 5,
      title: 'Refund Processed',
      description: 'Your refund is processed to the original payment method',
      icon: CurrencyRupeeIcon,
      timeframe: '5-7 business days'
    }
  ]

  const eligibleItems = [
    'Unworn items with original tags attached',
    'Items in original packaging',
    'Products without damage, stains, or odors',
    'Accessories in original condition',
    'Items purchased within the last 30 days'
  ]

  const nonEligibleItems = [
    'Worn or used items',
    'Items without original tags',
    'Damaged or stained products',
    'Custom or personalized items',
    'Items purchased more than 30 days ago',
    'Sale items (unless defective)',
    'Undergarments and intimate wear'
  ]

  const exchangeReasons = [
    {
      reason: 'Size Issues',
      description: 'Wrong size? Exchange for the right fit within 30 days',
      processing: 'Same day processing',
      shipping: 'Free exchange shipping'
    },
    {
      reason: 'Color Preference',
      description: 'Different color preference? Exchange for available colors',
      processing: '1-2 business days',
      shipping: 'Free for first exchange'
    },
    {
      reason: 'Defective Product',
      description: 'Manufacturing defect? Immediate replacement guaranteed',
      processing: 'Priority processing',
      shipping: 'Free expedited shipping'
    },
    {
      reason: 'Damaged in Transit',
      description: 'Item damaged during delivery? Full replacement provided',
      processing: 'Immediate processing',
      shipping: 'Free express replacement'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/t-shirts/tshirt-2-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ArrowPathIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Returns &
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Exchanges
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Not completely satisfied? No worries! Easy returns and exchanges 
              within 30 days of purchase.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <ClockIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">30 Days</h3>
              <p className="text-primary-300 text-sm">Return window</p>
            </div>
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <TruckIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Free Pickup</h3>
              <p className="text-primary-300 text-sm">We collect from you</p>
            </div>
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <ShieldCheckIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-primary-300 text-sm">Full quality check</p>
            </div>
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
              <CurrencyRupeeIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Quick Refund</h3>
              <p className="text-primary-300 text-sm">5-7 business days</p>
            </div>
          </div>
        </motion.div>

        {/* Return Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Returns Work</h2>
          <div className="space-y-6">
            {returnProcess.map((step, index) => {
              const IconComponent = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-start space-x-6">
                    <div className="bg-accent-500/20 rounded-full p-3 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-accent-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">
                          Step {step.step}: {step.title}
                        </h3>
                        <span className="bg-primary-800/50 text-accent-400 text-sm px-3 py-1 rounded-full">
                          {step.timeframe}
                        </span>
                      </div>
                      <p className="text-primary-200">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Exchange Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Exchange Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {exchangeReasons.map((exchange, index) => (
              <motion.div
                key={exchange.reason}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-3">{exchange.reason}</h3>
                <p className="text-primary-200 mb-4">{exchange.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-300 text-sm">Processing Time:</span>
                    <span className="text-accent-400 font-semibold text-sm">{exchange.processing}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-300 text-sm">Shipping:</span>
                    <span className="text-green-400 font-semibold text-sm">{exchange.shipping}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eligibility Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Return Eligibility</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Eligible Items */}
            <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <CheckCircleIcon className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Eligible Items */}
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/20 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <XCircleIcon className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <XCircleIcon className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-primary-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Refund Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Refund Information</h2>
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-800/50">
                  <tr>
                    <th className="text-left text-white font-semibold p-6">Payment Method</th>
                    <th className="text-left text-white font-semibold p-6">Refund Time</th>
                    <th className="text-left text-white font-semibold p-6">Processing Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">Credit/Debit Card</td>
                    <td className="p-6 text-accent-400 font-semibold">5-7 Business Days</td>
                    <td className="p-6 text-green-400 font-semibold">Free</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">UPI/Digital Wallet</td>
                    <td className="p-6 text-accent-400 font-semibold">1-3 Business Days</td>
                    <td className="p-6 text-green-400 font-semibold">Free</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">Net Banking</td>
                    <td className="p-6 text-accent-400 font-semibold">3-5 Business Days</td>
                    <td className="p-6 text-green-400 font-semibold">Free</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">Cash on Delivery</td>
                    <td className="p-6 text-accent-400 font-semibold">7-10 Business Days</td>
                    <td className="p-6 text-yellow-400 font-semibold">₹25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-3xl p-8">
            <div className="flex items-start">
              <InformationCircleIcon className="w-8 h-8 text-blue-400 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Important Notes</h3>
                <ul className="space-y-3 text-primary-200">
                  <li>• Return window starts from the date of delivery, not the date of purchase</li>
                  <li>• Items must be in original condition with all tags, labels, and packaging</li>
                  <li>• Custom or personalized items cannot be returned unless defective</li>
                  <li>• Sale items can only be returned if they are defective or damaged</li>
                  <li>• We reserve the right to refuse returns that don't meet our criteria</li>
                  <li>• Refunds are processed after quality inspection of returned items</li>
                  <li>• Multiple exchanges may incur shipping charges after the first free exchange</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center">
            <ArrowPathIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Need to Return Something?</h2>
            <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
              Start your return or exchange process now. It only takes a few minutes, 
              and we'll handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-glass">
                Start Return Process
              </button>
              <button className="btn btn-ghost text-white border-white/30 hover:bg-white/10">
                Contact Support
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}