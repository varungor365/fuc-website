'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import OrderTracking from '@/components/OrderTracking'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [trackingInput, setTrackingInput] = useState('')
  const [showTracking, setShowTracking] = useState(false)
  
  // Get tracking info from URL params
  const orderId = searchParams.get('orderId')
  const trackingNumber = searchParams.get('trackingNumber')

  // Show tracking if we have URL params
  const hasTrackingParams = orderId || trackingNumber

  const handleTrackOrder = () => {
    if (trackingInput.trim()) {
      setShowTracking(true)
    }
  }

  if (hasTrackingParams || showTracking) {
    return (
      <OrderTracking 
        orderId={orderId || undefined}
        trackingNumber={trackingNumber || trackingInput}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
            <p className="text-gray-400 text-lg">
              Enter your order ID or tracking number to get real-time updates
            </p>
          </div>

          {/* Tracking Input */}
          <div className="bg-gray-800/50 rounded-2xl p-8 mb-8">
            <div className="mb-6">
              <label className="block text-white font-medium mb-4 text-left">
                Order ID or Tracking Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g., ORD-001 or FUC123456789"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTrackOrder()
                    }
                  }}
                />
                <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleTrackOrder}
              disabled={!trackingInput.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Track Order
            </button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold text-white mb-2">Recent Orders</h3>
              <p className="text-gray-400 text-sm mb-4">
                View your recent orders and their tracking status
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium">
                View Orders →
              </button>
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Contact our support team for assistance
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-medium">
                Get Support →
              </button>
            </div>
          </div>

          {/* Information */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">How to Track Your Order</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <p className="text-gray-300">
                  Enter your order ID (found in your confirmation email) or tracking number
                </p>
              </div>
              <div>
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                <p className="text-gray-300">
                  View real-time updates, delivery timeline, and courier information
                </p>
              </div>
              <div>
                <div className="bg-purple-600/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <p className="text-gray-300">
                  Get notifications and manage delivery preferences
                </p>
              </div>
            </div>
          </div>

          {/* Sample Tracking */}
          <div className="mt-12">
            <p className="text-gray-500 text-sm mb-4">
              Want to see how tracking works? Try with sample order:
            </p>
            <button
              onClick={() => {
                setTrackingInput('ORD-001')
                setShowTracking(true)
              }}
              className="bg-gray-700 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Try Sample: ORD-001
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}