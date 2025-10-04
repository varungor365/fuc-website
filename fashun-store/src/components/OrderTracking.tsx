'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  TruckIcon,
  ClockIcon,
  PhoneIcon,
  MapPinIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'

interface TrackingEvent {
  id: string
  status: string
  title: string
  description: string
  location: string
  timestamp: string
  isCompleted: boolean
  isCurrent: boolean
}

interface OrderNotification {
  id: string
  type: 'sms' | 'email' | 'push' | 'whatsapp'
  title: string
  message: string
  sentAt: string
  isRead: boolean
}

interface CourierInfo {
  name: string
  trackingUrl: string
  phone: string
  estimatedTime: string
  vehicleType: 'bike' | 'van' | 'truck'
  courierRating: number
}

interface OrderTrackingProps {
  orderId?: string
  trackingNumber?: string
}

export default function OrderTracking({ orderId, trackingNumber }: OrderTrackingProps) {
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showReschedule, setShowReschedule] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [liveUpdates, setLiveUpdates] = useState(true)

  // Mock data
  const mockData = {
    tracking: {
      id: 'track-1',
      orderId: 'ORD-001',
      status: 'out_for_delivery',
      currentLocation: 'Andheri West Distribution Center, Mumbai',
      estimatedDelivery: '2025-01-16T18:00:00Z',
      trackingNumber: 'FUC123456789',
      courier: 'Delhivery',
      courierLogo: '/api/placeholder/100/40',
      timeline: [
        {
          id: 'event-1',
          status: 'order_placed',
          title: 'Order Placed',
          description: 'Your order has been successfully placed',
          location: 'FASHUN.CO.IN',
          timestamp: '2025-01-14T10:30:00Z',
          isCompleted: true,
          isCurrent: false
        },
        {
          id: 'event-2',
          status: 'payment_confirmed',
          title: 'Payment Confirmed',
          description: 'Payment of ₹2,699 received successfully',
          location: 'Payment Gateway',
          timestamp: '2025-01-14T10:32:00Z',
          isCompleted: true,
          isCurrent: false
        },
        {
          id: 'event-3',
          status: 'processing',
          title: 'Order Processing',
          description: 'Your order is being prepared at our warehouse',
          location: 'Mumbai Warehouse',
          timestamp: '2025-01-14T14:00:00Z',
          isCompleted: true,
          isCurrent: false
        },
        {
          id: 'event-4',
          status: 'packed',
          title: 'Order Packed',
          description: 'Your items have been carefully packed and quality checked',
          location: 'Mumbai Warehouse',
          timestamp: '2025-01-15T09:15:00Z',
          isCompleted: true,
          isCurrent: false
        },
        {
          id: 'event-5',
          status: 'shipped',
          title: 'Order Shipped',
          description: 'Your package is on its way to the delivery hub',
          location: 'Mumbai Warehouse',
          timestamp: '2025-01-15T16:30:00Z',
          isCompleted: true,
          isCurrent: false
        },
        {
          id: 'event-6',
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Your package is out for delivery and will arrive today',
          location: 'Andheri West Distribution Center',
          timestamp: '2025-01-16T08:00:00Z',
          isCompleted: false,
          isCurrent: true
        },
        {
          id: 'event-7',
          status: 'delivered',
          title: 'Delivered',
          description: 'Your package will be delivered to your address',
          location: 'Your Address',
          timestamp: '',
          isCompleted: false,
          isCurrent: false
        }
      ]
    },
    courierInfo: {
      name: 'Raj Kumar',
      trackingUrl: 'https://delhivery.com/track',
      phone: '+91 98765 43210',
      estimatedTime: '3:00 PM - 6:00 PM',
      vehicleType: 'bike',
      courierRating: 4.8
    },
    progress: {
      percentage: 85,
      completedSteps: 6,
      totalSteps: 7,
      currentStep: 'Out for Delivery'
    },
    delivery: {
      estimatedHours: 4,
      isDelayed: false,
      canReschedule: true
    },
    notifications: [
      {
        id: 'notif-2',
        type: 'whatsapp',
        title: 'Out for Delivery',
        message: 'Good news! Your package is out for delivery and will arrive today between 3-6 PM',
        sentAt: '2025-01-16T08:05:00Z',
        isRead: false
      },
      {
        id: 'notif-1',
        type: 'sms',
        title: 'Order Shipped',
        message: 'Your FASHUN order ORD-001 has been shipped. Track: FUC123456789',
        sentAt: '2025-01-15T16:35:00Z',
        isRead: true
      }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTracking(mockData)
      setLoading(false)
    }, 1000)

    // Set up live updates
    if (liveUpdates) {
      const interval = setInterval(() => {
        // Simulate live updates (in real app, this would be WebSocket or polling)
        console.log('Checking for tracking updates...')
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [liveUpdates])

  const getStatusIcon = (status: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircleSolid className="w-6 h-6 text-green-500" />
    } else if (isCurrent) {
      return (
        <div className="w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        </div>
      )
    } else {
      return <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
    }
  }

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'bike':
        return '🏍️'
      case 'van':
        return '🚐'
      case 'truck':
        return '🚛'
      default:
        return '🚚'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return '💬'
      case 'sms':
        return '📱'
      case 'email':
        return '📧'
      case 'push':
        return '🔔'
      default:
        return '📢'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Tracking Information Not Found</h2>
          <p className="text-gray-400">Please check your order ID or tracking number.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Track Your Order</h1>
              <p className="text-gray-400">Order #{tracking.tracking.orderId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <BellIcon className="w-6 h-6" />
                {tracking.notifications.some((n: any) => !n.isRead) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setLiveUpdates(!liveUpdates)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liveUpdates ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm">Live Updates</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {tracking.progress.currentStep}
                </h3>
                <p className="text-gray-400">
                  Step {tracking.progress.completedSteps} of {tracking.progress.totalSteps}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  {tracking.progress.percentage}%
                </div>
                <p className="text-gray-400 text-sm">Complete</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-green-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tracking.progress.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span>Current: {tracking.tracking.currentLocation}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <ClockIcon className="w-4 h-4" />
                <span>
                  ETA: {tracking.delivery.estimatedHours > 0 
                    ? `${tracking.delivery.estimatedHours} hours` 
                    : 'Today'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Tracking Timeline</h2>
              
              <div className="space-y-6">
                {tracking.tracking.timeline.map((event: TrackingEvent, index: number) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(event.status, event.isCompleted, event.isCurrent)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${
                          event.isCompleted ? 'text-white' : 
                          event.isCurrent ? 'text-blue-400' : 'text-gray-500'
                        }`}>
                          {event.title}
                        </h3>
                        {event.timestamp && (
                          <span className="text-sm text-gray-500">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm mt-1 ${
                        event.isCompleted ? 'text-gray-300' : 
                        event.isCurrent ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {event.description}
                      </p>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {event.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tracking Number</span>
                  <span className="font-mono text-sm">{tracking.tracking.trackingNumber}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Courier</span>
                  <div className="flex items-center space-x-2">
                    <span>{tracking.tracking.courier}</span>
                    {tracking.tracking.courierLogo && (
                      <Image
                        src={tracking.tracking.courierLogo}
                        alt={tracking.tracking.courier}
                        width={30}
                        height={20}
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Expected Delivery</span>
                  <span>{new Date(tracking.tracking.estimatedDelivery).toLocaleDateString()}</span>
                </div>

                {tracking.delivery.isDelayed && (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                      <span className="text-yellow-400 font-medium">Delivery Delayed</span>
                    </div>
                    <p className="text-sm text-yellow-300 mt-1">
                      Your package is running behind schedule. New ETA will be updated soon.
                    </p>
                  </div>
                )}
              </div>

              {tracking.delivery.canReschedule && (
                <button
                  onClick={() => setShowReschedule(true)}
                  className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CalendarDaysIcon className="w-5 h-5" />
                  <span>Reschedule Delivery</span>
                </button>
              )}
            </div>

            {/* Courier Info */}
            {tracking.courierInfo && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Your Delivery Partner</h3>
                
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h4 className="font-medium">{tracking.courierInfo.name}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-400">
                        {tracking.courierInfo.courierRating}/5.0
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl ml-auto">
                    {getVehicleIcon(tracking.courierInfo.vehicleType)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Delivery Window</span>
                    <span className="text-sm">{tracking.courierInfo.estimatedTime}</span>
                  </div>
                  
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <PhoneIcon className="w-5 h-5" />
                    <span>Call Delivery Partner</span>
                  </button>
                  
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span>Chat with Support</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Refresh Tracking</span>
                </button>
                
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Share Tracking Info
                </button>
                
                <button className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowNotifications(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  {tracking.notifications.map((notification: OrderNotification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.isRead 
                          ? 'bg-gray-700 border-gray-600' 
                          : 'bg-blue-900/20 border-blue-600'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{notification.title}</h4>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimestamp(notification.sentAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reschedule Modal */}
        <AnimatePresence>
          {showReschedule && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowReschedule(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">Reschedule Delivery</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">New Delivery Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Reason (Optional)</label>
                    <select className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                      <option value="">Select reason</option>
                      <option value="not_available">Won't be available</option>
                      <option value="holiday">Holiday/Vacation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowReschedule(false)}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}