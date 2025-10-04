'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TruckIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  CubeIcon as PackageIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface OrderData {
  orderNumber: string
  status: string
  estimatedDelivery: string
  customer: {
    name: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    method: string
    carrier: string
    trackingNumber: string
  }
  items: Array<{
    id: number
    name: string
    variant: string
    quantity: number
    price: number
    image: string
  }>
  total: number
  timeline: Array<{
    status: string
    date: string
    time: string
    location?: string
    description: string
    icon: any
    completed: boolean
    current?: boolean
  }>
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState('')

  // Mock order data for demonstration
  const mockOrderData = {
    orderNumber: 'FN-2024-001234',
    status: 'In Transit',
    estimatedDelivery: '2024-10-06',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210'
    },
    shipping: {
      address: '123 Main Street, Apartment 4B, Mumbai, Maharashtra 400001',
      method: 'Express Delivery',
      carrier: 'Blue Dart',
      trackingNumber: 'BD123456789IN'
    },
    items: [
      {
        id: 1,
        name: 'Urban Explorer Hoodie',
        variant: 'Black / Large',
        quantity: 1,
        price: 2499,
        image: '/images/products/hoodies/hoodie-1-main.jpg'
      },
      {
        id: 2,
        name: 'Essential Tee',
        variant: 'White / Medium',
        quantity: 2,
        price: 1299,
        image: '/images/products/t-shirts/tshirt-1-main.jpg'
      }
    ],
    total: 5097,
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-10-02',
        time: '2:30 PM',
        description: 'Your order has been successfully placed',
        icon: CheckCircleIcon,
        completed: true
      },
      {
        status: 'Order Confirmed',
        date: '2024-10-02',
        time: '3:15 PM',
        description: 'Payment verified and order confirmed',
        icon: CheckCircleIcon,
        completed: true
      },
      {
        status: 'Processing',
        date: '2024-10-03',
        time: '10:00 AM',
        description: 'Order is being prepared for shipment',
        icon: CheckCircleIcon,
        completed: true
      },
      {
        status: 'Shipped',
        date: '2024-10-04',
        time: '4:45 PM',
        description: 'Package has been dispatched from our warehouse',
        icon: CheckCircleIcon,
        completed: true
      },
      {
        status: 'In Transit',
        date: '2024-10-05',
        time: '9:20 AM',
        description: 'Package is on its way to your location',
        icon: TruckIcon,
        completed: true,
        current: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-10-06',
        time: 'Expected',
        description: 'Package will be delivered today',
        icon: MapPinIcon,
        completed: false
      },
      {
        status: 'Delivered',
        date: '2024-10-06',
        time: 'Expected',
        description: 'Package delivered successfully',
        icon: PackageIcon,
        completed: false
      }
    ]
  }

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!orderNumber || !email) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (orderNumber.toLowerCase().includes('fn-2024')) {
        setOrderData(mockOrderData)
      } else {
        setError('Order not found. Please check your order number and email.')
      }
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-400'
      case 'in transit': 
      case 'out for delivery': return 'text-blue-400'
      case 'shipped': return 'text-accent-400'
      case 'processing': return 'text-yellow-400'
      default: return 'text-primary-300'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TruckIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Track Your
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Order
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Enter your order details below to get real-time updates on your shipment.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!orderData ? (
          /* Tracking Form */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="text-center mb-8">
                <MagnifyingGlassIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Find Your Order</h2>
                <p className="text-primary-200">
                  Enter your order number and email to track your shipment
                </p>
              </div>

              <form onSubmit={handleTrackOrder} className="space-y-6">
                <div>
                  <label htmlFor="orderNumber" className="block text-sm font-medium text-primary-200 mb-2">
                    Order Number
                  </label>
                  <div className="relative">
                    <PackageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20 transition-all"
                      placeholder="e.g. FN-2024-001234"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center text-red-400 text-sm bg-red-500/10 border border-red-400/20 rounded-xl p-3">
                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-glass"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-primary-900 border-t-transparent rounded-full animate-spin mr-2" />
                      Tracking Order...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                      Track Order
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-8 p-4 bg-primary-800/20 border border-white/10 rounded-xl">
                <h3 className="text-white font-semibold mb-3">Demo Order Numbers:</h3>
                <div className="space-y-2 text-sm text-primary-300">
                  <p>• <span className="text-accent-400 font-mono">FN-2024-001234</span> - In Transit</p>
                  <p>• Use any email address for demo</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Order Details */
          <div className="space-y-8">
            {/* Order Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Order #{orderData.orderNumber}
                  </h2>
                  <p className="text-primary-200">
                    Estimated delivery: {new Date(orderData.estimatedDelivery).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    orderData.status === 'Delivered' 
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                  }`}>
                    <TruckIcon className="w-4 h-4 mr-2" />
                    {orderData.status}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Customer</h3>
                  <p className="text-primary-200 text-sm">{orderData.customer.name}</p>
                  <p className="text-primary-300 text-sm">{orderData.customer.email}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Shipping Method</h3>
                  <p className="text-primary-200 text-sm">{orderData.shipping.method}</p>
                  <p className="text-primary-300 text-sm">{orderData.shipping.carrier}</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Tracking Number</h3>
                  <p className="text-accent-400 text-sm font-mono">{orderData.shipping.trackingNumber}</p>
                </div>
              </div>
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-8">Order Timeline</h2>
              <div className="space-y-8">
                {orderData.timeline.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className="relative flex items-start">
                      {/* Timeline Line */}
                      {index < orderData.timeline.length - 1 && (
                        <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                          step.completed ? 'bg-accent-400' : 'bg-primary-600'
                        }`} />
                      )}
                      
                      {/* Status Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        step.current 
                          ? 'bg-accent-500/20 border-accent-400 text-accent-400 ring-4 ring-accent-400/20'
                          : step.completed 
                            ? 'bg-green-500/20 border-green-400 text-green-400'
                            : 'bg-primary-800/30 border-primary-600 text-primary-400'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      {/* Status Details */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${
                            step.current ? 'text-accent-400' : 
                            step.completed ? 'text-white' : 'text-primary-400'
                          }`}>
                            {step.status}
                          </h3>
                          <div className="text-primary-300 text-sm">
                            {step.date} {step.time && `• ${step.time}`}
                          </div>
                        </div>
                        <p className="text-primary-200 text-sm">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-primary-800/30 rounded-xl">
                    <div className="w-16 h-16 bg-primary-700 rounded-lg flex items-center justify-center">
                      <PackageIcon className="w-8 h-8 text-primary-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-primary-300 text-sm">{item.variant}</p>
                      <p className="text-primary-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-accent-400 font-bold">₹{item.price}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Order Total</span>
                  <span className="text-accent-400 font-bold text-xl">₹{orderData.total}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button 
                onClick={() => setOrderData(null)}
                className="btn btn-ghost text-white border-white/30 hover:bg-white/10"
              >
                Track Another Order
              </button>
              <button className="btn btn-glass">
                Contact Support
              </button>
            </motion.div>
          </div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Need Help with Your Order?</h2>
          <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to help with any questions 
            about your order or delivery.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <PhoneIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Call Us</h3>
              <p className="text-primary-300 text-sm mb-4">+91 1800-123-4567</p>
              <p className="text-primary-400 text-xs">24/7 Support Available</p>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <EnvelopeIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Email Us</h3>
              <p className="text-primary-300 text-sm mb-4">support@fashun.co</p>
              <p className="text-primary-400 text-xs">Response within 4 hours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}