'use client'

import { motion } from 'framer-motion'
import { 
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ShippingPolicyPage() {
  const shippingOptions = [
    {
      name: 'Standard Delivery',
      duration: '5-7 Business Days',
      cost: 'Free on orders above ₹999',
      description: 'Perfect for regular orders with no rush',
      icon: TruckIcon,
      features: ['Free on ₹999+', 'Tracking included', 'Secure packaging']
    },
    {
      name: 'Express Delivery',
      duration: '2-3 Business Days',
      cost: '₹149 (Free on orders above ₹2499)',
      description: 'Faster delivery for when you need it sooner',
      icon: ClockIcon,
      features: ['Priority handling', 'SMS updates', 'Faster processing']
    },
    {
      name: 'Same Day Delivery',
      duration: 'Within 24 Hours',
      cost: '₹299',
      description: 'Available in select cities for urgent orders',
      icon: MapPinIcon,
      features: ['Mumbai, Delhi, Bangalore', 'Order by 2 PM', 'Evening delivery']
    }
  ]

  const deliveryZones = [
    {
      zone: 'Metro Cities',
      cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
      duration: '2-4 Days',
      sameDayAvailable: true
    },
    {
      zone: 'Tier 1 Cities',
      cities: ['Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'],
      duration: '3-5 Days',
      sameDayAvailable: false
    },
    {
      zone: 'Tier 2 Cities',
      cities: ['Indore', 'Bhopal', 'Vadodara', 'Coimbatore', 'Kochi', 'Vishakhapatnam'],
      duration: '4-6 Days',
      sameDayAvailable: false
    },
    {
      zone: 'Remote Areas',
      cities: ['Hill Stations', 'Remote Towns', 'Island Areas'],
      duration: '7-10 Days',
      sameDayAvailable: false
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TruckIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Shipping &
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Delivery
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Fast, secure, and reliable delivery across India. 
              Choose the shipping option that works best for you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Shipping Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Delivery Options</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:border-accent-400/50 transition-all"
                >
                  <div className="bg-accent-500/20 rounded-2xl p-4 w-fit mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{option.name}</h3>
                  <p className="text-accent-400 font-bold text-lg mb-2">{option.duration}</p>
                  <p className="text-primary-200 mb-6">{option.description}</p>
                  <div className="bg-primary-800/30 rounded-2xl p-4 mb-6">
                    <p className="text-white font-semibold">{option.cost}</p>
                  </div>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-primary-200 text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-accent-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Delivery Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Order Processing Timeline</h2>
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-400 font-bold text-xl">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Order Placed</h3>
                <p className="text-primary-300 text-sm">You receive order confirmation via email & SMS</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-400 font-bold text-xl">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Processing</h3>
                <p className="text-primary-300 text-sm">Order is verified and prepared for shipment (2-24 hours)</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-400 font-bold text-xl">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Shipped</h3>
                <p className="text-primary-300 text-sm">Package is dispatched with tracking details</p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500/20 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-400 font-bold text-xl">4</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Delivered</h3>
                <p className="text-primary-300 text-sm">Package arrives at your doorstep</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery Zones */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Delivery Zones</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={zone.zone}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">{zone.zone}</h3>
                  {zone.sameDayAvailable && (
                    <span className="bg-accent-500/20 text-accent-400 text-xs px-2 py-1 rounded-full">
                      Same Day
                    </span>
                  )}
                </div>
                <p className="text-accent-400 font-semibold mb-3">{zone.duration}</p>
                <div className="space-y-1">
                  {zone.cities.slice(0, 3).map((city, idx) => (
                    <p key={idx} className="text-primary-300 text-sm">• {city}</p>
                  ))}
                  {zone.cities.length > 3 && (
                    <p className="text-primary-400 text-xs">+{zone.cities.length - 3} more cities</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Charges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Shipping Charges</h2>
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-800/50">
                  <tr>
                    <th className="text-left text-white font-semibold p-6">Order Value</th>
                    <th className="text-left text-white font-semibold p-6">Standard Delivery</th>
                    <th className="text-left text-white font-semibold p-6">Express Delivery</th>
                    <th className="text-left text-white font-semibold p-6">Same Day Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">Below ₹999</td>
                    <td className="p-6 text-accent-400 font-semibold">₹99</td>
                    <td className="p-6 text-accent-400 font-semibold">₹149</td>
                    <td className="p-6 text-accent-400 font-semibold">₹299</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">₹999 - ₹2499</td>
                    <td className="p-6 text-green-400 font-semibold">FREE</td>
                    <td className="p-6 text-accent-400 font-semibold">₹149</td>
                    <td className="p-6 text-accent-400 font-semibold">₹299</td>
                  </tr>
                  <tr className="border-t border-white/10">
                    <td className="p-6 text-primary-200">Above ₹2499</td>
                    <td className="p-6 text-green-400 font-semibold">FREE</td>
                    <td className="p-6 text-green-400 font-semibold">FREE</td>
                    <td className="p-6 text-accent-400 font-semibold">₹299</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Special Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Important Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <ShieldCheckIcon className="w-8 h-8 text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Secure Packaging</h3>
              <ul className="space-y-3 text-primary-200">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  All items are carefully packed in eco-friendly materials
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Fragile items receive extra protective packaging
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Weather-resistant packaging for monsoon season
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Tamper-proof sealing for security
                </li>
              </ul>
            </div>

            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <GlobeAltIcon className="w-8 h-8 text-accent-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Tracking & Updates</h3>
              <ul className="space-y-3 text-primary-200">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Real-time tracking via SMS and email
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Delivery notifications and estimated time
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Option to reschedule delivery if needed
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  Photo proof of delivery for security
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Contact for Shipping Queries */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center">
            <TruckIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Shipping?</h2>
            <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
              Need help with your delivery? Our customer support team is available 24/7 
              to assist with tracking, rescheduling, or any shipping-related queries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-glass">
                Track Your Order
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