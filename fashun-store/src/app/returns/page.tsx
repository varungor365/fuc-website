'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ReturnItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  size: string
  color: string
  quantity: number
  price: number
  reason: string
  status: 'pending' | 'approved' | 'picked_up' | 'received' | 'processed' | 'refunded'
  initiatedDate: string
  estimatedRefundDate?: string
  trackingNumber?: string
  refundAmount?: number
}

const mockReturns: ReturnItem[] = [
  {
    id: 'RET001',
    orderId: 'ORD123456',
    productId: '1',
    productName: 'Oversized Black Hoodie',
    productImage: '/api/placeholder/300/300',
    size: 'L',
    color: 'Black',
    quantity: 1,
    price: 2999,
    reason: 'Size too large',
    status: 'approved',
    initiatedDate: '2025-09-15',
    estimatedRefundDate: '2025-09-25',
    trackingNumber: 'RET123456789',
    refundAmount: 2999
  }
]

const returnReasons = [
  'Size too small',
  'Size too large',
  'Different than expected',
  'Quality issues',
  'Damaged during shipping',
  'Wrong item received',
  'Changed my mind',
  'Other'
]

const statusIcons = {
  pending: ClockIcon,
  approved: CheckCircleIcon,
  picked_up: TruckIcon,
  received: CheckCircleIcon,
  processed: CheckCircleIcon,
  refunded: CheckCircleIcon
}

const statusColors = {
  pending: 'text-yellow-400',
  approved: 'text-blue-400',
  picked_up: 'text-purple-400',
  received: 'text-green-400',
  processed: 'text-green-400',
  refunded: 'text-green-400'
}

export default function ReturnsPortal() {
  const [activeTab, setActiveTab] = useState<'current' | 'new'>('current')
  const [returns, setReturns] = useState<ReturnItem[]>(mockReturns)
  const [showNewReturnForm, setShowNewReturnForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')
  const [newReturnData, setNewReturnData] = useState({
    productId: '',
    reason: '',
    description: '',
    images: [] as File[]
  })

  // Mock orders for return initiation
  const mockOrders = [
    {
      id: 'ORD123456',
      date: '2025-09-10',
      status: 'delivered',
      items: [
        {
          id: '1',
          name: 'Oversized Black Hoodie',
          image: '/api/placeholder/300/300',
          size: 'L',
          color: 'Black',
          price: 2999,
          quantity: 1
        },
        {
          id: '2',
          name: 'Graphic Print Tee',
          image: '/api/placeholder/300/300',
          size: 'M',
          color: 'White',
          price: 1499,
          quantity: 2
        }
      ]
    }
  ]

  const handleInitiateReturn = () => {
    if (!selectedOrder || !newReturnData.productId || !newReturnData.reason) {
      alert('Please fill in all required fields')
      return
    }

    const order = mockOrders.find(o => o.id === selectedOrder)
    const product = order?.items.find(item => item.id === newReturnData.productId)

    if (!product) return

    const newReturn: ReturnItem = {
      id: `RET${Date.now()}`,
      orderId: selectedOrder,
      productId: newReturnData.productId,
      productName: product.name,
      productImage: product.image,
      size: product.size,
      color: product.color,
      quantity: 1,
      price: product.price,
      reason: newReturnData.reason,
      status: 'pending',
      initiatedDate: new Date().toISOString().split('T')[0]
    }

    setReturns([newReturn, ...returns])
    setShowNewReturnForm(false)
    setNewReturnData({ productId: '', reason: '', description: '', images: [] })
    setSelectedOrder('')
    setActiveTab('current')
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Pending Review',
      approved: 'Return Approved',
      picked_up: 'Picked Up',
      received: 'Received at Warehouse',
      processed: 'Processing Refund',
      refunded: 'Refund Completed'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Returns & Refunds</h1>
            <p className="text-gray-400">Manage your returns and track refund status</p>
          </div>
          <Link
            href="/account/orders"
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'current'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Returns ({returns.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Start New Return
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'current' ? (
            <motion.div
              key="current"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {returns.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl p-12 text-center">
                  <TruckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Returns Yet</h3>
                  <p className="text-gray-400 mb-6">You haven't initiated any returns.</p>
                  <button
                    onClick={() => setActiveTab('new')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Your First Return
                  </button>
                </div>
              ) : (
                returns.map((returnItem) => {
                  const StatusIcon = statusIcons[returnItem.status]
                  return (
                    <motion.div
                      key={returnItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Return #{returnItem.id}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Order #{returnItem.orderId} • Initiated on {returnItem.initiatedDate}
                          </p>
                        </div>
                        <div className={`flex items-center space-x-2 ${statusColors[returnItem.status]}`}>
                          <StatusIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {getStatusText(returnItem.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4 mb-4">
                        <Image
                          src={returnItem.productImage}
                          alt={returnItem.productName}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{returnItem.productName}</h4>
                          <p className="text-gray-400 text-sm">
                            Size: {returnItem.size} • Color: {returnItem.color}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Reason: {returnItem.reason}
                          </p>
                          <p className="text-green-400 font-medium mt-1">
                            ₹{returnItem.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Return Progress */}
                      <div className="bg-gray-900 rounded-lg p-4 mb-4">
                        <h5 className="text-white font-medium mb-3">Return Progress</h5>
                        <div className="flex items-center justify-between">
                          {['pending', 'approved', 'picked_up', 'received', 'processed', 'refunded'].map((step, index) => {
                            const isCompleted = ['pending', 'approved', 'picked_up', 'received', 'processed', 'refunded'].indexOf(returnItem.status) >= index
                            const isCurrent = ['pending', 'approved', 'picked_up', 'received', 'processed', 'refunded'].indexOf(returnItem.status) === index
                            
                            return (
                              <div key={step} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isCompleted ? 'bg-green-600' : isCurrent ? 'bg-purple-600' : 'bg-gray-700'
                                }`}>
                                  {isCompleted ? (
                                    <CheckCircleIcon className="w-5 h-5 text-white" />
                                  ) : (
                                    <span className="text-xs text-white">{index + 1}</span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400 mt-1 text-center">
                                  {getStatusText(step).split(' ')[0]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {returnItem.trackingNumber && (
                          <div>
                            <span className="text-gray-400">Tracking Number:</span>
                            <p className="text-white font-medium">{returnItem.trackingNumber}</p>
                          </div>
                        )}
                        {returnItem.estimatedRefundDate && (
                          <div>
                            <span className="text-gray-400">Estimated Refund:</span>
                            <p className="text-white font-medium">{returnItem.estimatedRefundDate}</p>
                          </div>
                        )}
                        {returnItem.refundAmount && (
                          <div>
                            <span className="text-gray-400">Refund Amount:</span>
                            <p className="text-green-400 font-medium">₹{returnItem.refundAmount.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-700">
                        <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>Contact Support</span>
                        </button>
                        {returnItem.trackingNumber && (
                          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                            <TruckIcon className="w-4 h-4" />
                            <span>Track Return</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="new"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl"
            >
              <div className="bg-gray-800/50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Start New Return</h2>

                {/* Step 1: Select Order */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-3">
                    Select Order <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Choose an order...</option>
                    {mockOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id} - {order.date} ({order.items.length} items)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 2: Select Product */}
                {selectedOrder && (
                  <div className="mb-6">
                    <label className="block text-white font-medium mb-3">
                      Select Product to Return <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                      {mockOrders.find(o => o.id === selectedOrder)?.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            newReturnData.productId === item.id
                              ? 'border-purple-500 bg-purple-900/20'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                          onClick={() => setNewReturnData({...newReturnData, productId: item.id})}
                        >
                          <div className="flex items-center space-x-4">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{item.name}</h4>
                              <p className="text-gray-400 text-sm">
                                Size: {item.size} • Color: {item.color}
                              </p>
                              <p className="text-green-400 font-medium">
                                ₹{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Return Reason */}
                {newReturnData.productId && (
                  <div className="mb-6">
                    <label className="block text-white font-medium mb-3">
                      Reason for Return <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={newReturnData.reason}
                      onChange={(e) => setNewReturnData({...newReturnData, reason: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select a reason...</option>
                      {returnReasons.map((reason) => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 4: Additional Details */}
                {newReturnData.reason && (
                  <div className="mb-6">
                    <label className="block text-white font-medium mb-3">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={newReturnData.description}
                      onChange={(e) => setNewReturnData({...newReturnData, description: e.target.value})}
                      placeholder="Please provide any additional details about the return..."
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {/* Step 5: Upload Photos */}
                {newReturnData.reason && (
                  <div className="mb-8">
                    <label className="block text-white font-medium mb-3">
                      Upload Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                      <PhotoIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">
                        Drag and drop photos here, or click to browse
                      </p>
                      <p className="text-gray-500 text-sm">
                        Upload clear photos of the product to help us process your return faster
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setNewReturnData({
                              ...newReturnData,
                              images: Array.from(e.target.files)
                            })
                          }
                        }}
                      />
                    </div>
                    {newReturnData.images.length > 0 && (
                      <p className="text-green-400 text-sm mt-2">
                        {newReturnData.images.length} file(s) selected
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleInitiateReturn}
                    disabled={!selectedOrder || !newReturnData.productId || !newReturnData.reason}
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Initiate Return
                  </button>
                  <button
                    onClick={() => setActiveTab('current')}
                    className="bg-gray-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                {/* Return Policy Notice */}
                <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-blue-400 font-medium mb-1">Return Policy</h4>
                      <p className="text-gray-300 text-sm">
                        Returns are accepted within 30 days of delivery. Items must be in original condition with tags attached. 
                        Refunds will be processed within 5-7 business days after we receive your return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}