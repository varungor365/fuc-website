'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GlassCard from '@/components/admin/GlassCard'
import { useErrorTracking } from '@/lib/errorTracking'

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  items: OrderItem[]
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial'
  shippingMethod: string
  trackingNumber?: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  discount: number
  createdAt: string
  updatedAt: string
  shippingAddress: Address
  billingAddress: Address
  notes?: string
}

interface OrderItem {
  id: string
  productId: string
  productName: string
  productSku: string
  variantName?: string
  quantity: number
  price: number
  image: string
}

interface Address {
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
}

interface OrderFilters {
  status: string
  paymentStatus: string
  dateRange: { from: string; to: string }
  sortBy: 'created' | 'total' | 'customer' | 'status'
  sortOrder: 'asc' | 'desc'
  search: string
}

const ORDER_STATUSES = {
  pending: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Pending' },
  processing: { color: 'text-blue-400 bg-blue-400/10', label: 'Processing' },
  shipped: { color: 'text-purple-400 bg-purple-400/10', label: 'Shipped' },
  delivered: { color: 'text-green-400 bg-green-400/10', label: 'Delivered' },
  cancelled: { color: 'text-red-400 bg-red-400/10', label: 'Cancelled' },
  refunded: { color: 'text-gray-400 bg-gray-400/10', label: 'Refunded' }
}

const PAYMENT_STATUSES = {
  pending: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Pending' },
  paid: { color: 'text-green-400 bg-green-400/10', label: 'Paid' },
  failed: { color: 'text-red-400 bg-red-400/10', label: 'Failed' },
  refunded: { color: 'text-gray-400 bg-gray-400/10', label: 'Refunded' },
  partial: { color: 'text-orange-400 bg-orange-400/10', label: 'Partial' }
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { logError, addBreadcrumb } = useErrorTracking()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    paymentStatus: 'all',
    dateRange: { from: '', to: '' },
    sortBy: 'created',
    sortOrder: 'desc',
    search: ''
  })

  useEffect(() => {
    addBreadcrumb('navigation', 'Accessed Orders Management')
    fetchOrders()
  }, [filters])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customer: {
            id: 'cust_1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: '/api/placeholder/40/40'
          },
          items: [
            {
              id: 'item_1',
              productId: 'prod_1',
              productName: 'Premium Streetwear Hoodie',
              productSku: 'HOOD-001',
              variantName: 'Large Black',
              quantity: 2,
              price: 89.99,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'processing',
          paymentStatus: 'paid',
          shippingMethod: 'Express Shipping',
          trackingNumber: 'TRK123456789',
          total: 199.97,
          subtotal: 179.98,
          shipping: 15.99,
          tax: 14.00,
          discount: 10.00,
          createdAt: '2024-01-20T10:30:00Z',
          updatedAt: '2024-01-20T14:15:00Z',
          shippingAddress: {
            name: 'John Doe',
            street1: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
            phone: '+1-555-0123'
          },
          billingAddress: {
            name: 'John Doe',
            street1: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          notes: 'Customer requested gift wrapping'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customer: {
            id: 'cust_2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          items: [
            {
              id: 'item_2',
              productId: 'prod_2',
              productName: 'Limited Edition Graphic Tee',
              productSku: 'TEE-002',
              quantity: 1,
              price: 49.99,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'shipped',
          paymentStatus: 'paid',
          shippingMethod: 'Standard Shipping',
          trackingNumber: 'TRK987654321',
          total: 59.98,
          subtotal: 49.99,
          shipping: 9.99,
          tax: 4.00,
          discount: 4.00,
          createdAt: '2024-01-19T15:45:00Z',
          updatedAt: '2024-01-20T09:20:00Z',
          shippingAddress: {
            name: 'Jane Smith',
            street1: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          billingAddress: {
            name: 'Jane Smith',
            street1: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          }
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customer: {
            id: 'cust_3',
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          items: [
            {
              id: 'item_3',
              productId: 'prod_3',
              productName: 'Designer Denim Jacket',
              productSku: 'JACK-003',
              quantity: 1,
              price: 159.99,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'pending',
          paymentStatus: 'pending',
          shippingMethod: 'Standard Shipping',
          total: 169.98,
          subtotal: 159.99,
          shipping: 9.99,
          tax: 12.80,
          discount: 12.80,
          createdAt: '2024-01-20T16:00:00Z',
          updatedAt: '2024-01-20T16:00:00Z',
          shippingAddress: {
            name: 'Mike Johnson',
            street1: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA'
          },
          billingAddress: {
            name: 'Mike Johnson',
            street1: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA'
          }
        }
      ]
      
      await new Promise(resolve => setTimeout(resolve, 800))
      setOrders(mockOrders)
    } catch (error) {
      logError(error as Error, { context: 'fetchOrders' })
    } finally {
      setLoading(false)
    }
  }

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      addBreadcrumb('user', `Bulk action: ${action}`, { orderCount: selectedOrders.length })
      
      switch (action) {
        case 'mark_processing':
          // TODO: Implement bulk status update
          break
        case 'mark_shipped':
          // TODO: Implement bulk shipping
          break
        case 'export':
          // TODO: Implement export
          break
        case 'print_labels':
          // TODO: Implement print shipping labels
          break
      }
      
      setSelectedOrders([])
      setShowBulkActions(false)
      fetchOrders()
    } catch (error) {
      logError(error as Error, { context: 'bulkAction', action })
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      addBreadcrumb('user', `Status change: ${newStatus}`, { orderId })
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
          : order
      ))
      
      // TODO: Call actual API
    } catch (error) {
      logError(error as Error, { context: 'statusChange', orderId, newStatus })
    }
  }

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
    addBreadcrumb('navigation', `Viewed order details: ${order.orderNumber}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false
    if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) return false
    if (filters.search && 
        !order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !order.customer.email.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    const { sortBy, sortOrder } = filters
    let aVal: any, bVal: any
    
    switch (sortBy) {
      case 'total': aVal = a.total; bVal = b.total; break
      case 'customer': aVal = a.customer.name; bVal = b.customer.name; break
      case 'status': aVal = a.status; bVal = b.status; break
      default: aVal = a.createdAt; bVal = b.createdAt; break
    }
    
    if (sortOrder === 'desc') [aVal, bVal] = [bVal, aVal]
    return aVal > bVal ? 1 : -1
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Orders</h1>
            <p className="text-white/60">Manage customer orders and fulfillment</p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              onClick={() => {/* TODO: Implement create order */}}
            >
              Create Order
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
              onClick={() => {/* TODO: Implement export */}}
            >
              Export
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-white">{orders.length}</p>
                <p className="text-green-400 text-sm mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'pending').length}</p>
                <p className="text-yellow-400 text-sm mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
                <p className="text-green-400 text-sm mt-1">+8% from last week</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0)}
                </p>
                <p className="text-blue-400 text-sm mt-1">+5% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>

            {/* Order Status */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Statuses</option>
                {Object.entries(ORDER_STATUSES).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Payments</option>
                {Object.entries(PAYMENT_STATUSES).map(([status, config]) => (
                  <option key={status} value={status}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-')
                  setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }))
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="total-desc">Highest Value</option>
                <option value="total-asc">Lowest Value</option>
                <option value="customer-asc">Customer A-Z</option>
                <option value="status-asc">Status</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Bulk Actions
              </motion.button>
            </div>
          </div>
        </GlassCard>

        {/* Bulk Actions Panel */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">
                    {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBulkAction('mark_processing')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => handleBulkAction('mark_shipped')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => handleBulkAction('print_labels')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Print Labels
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Orders Table */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white/60">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-6 text-white/80 font-medium">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-6 text-white/80 font-medium">Order</th>
                    <th className="text-left p-6 text-white/80 font-medium">Customer</th>
                    <th className="text-left p-6 text-white/80 font-medium">Items</th>
                    <th className="text-left p-6 text-white/80 font-medium">Total</th>
                    <th className="text-left p-6 text-white/80 font-medium">Status</th>
                    <th className="text-left p-6 text-white/80 font-medium">Payment</th>
                    <th className="text-left p-6 text-white/80 font-medium">Date</th>
                    <th className="text-left p-6 text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => showOrderDetail(order)}
                    >
                      <td className="p-6">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleOrderSelect(order.id)
                          }}
                          className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </td>
                      
                      <td className="p-6">
                        <div>
                          <p className="font-medium text-white">{order.orderNumber}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-white/60">Tracking: {order.trackingNumber}</p>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {order.customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white font-medium">{order.customer.name}</p>
                            <p className="text-white/60 text-sm">{order.customer.email}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="text-white">{order.items.length}</span>
                          <span className="text-white/60 text-sm">
                            item{order.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <span className="text-white font-medium">{formatCurrency(order.total)}</span>
                      </td>
                      
                      <td className="p-6">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleStatusChange(order.id, e.target.value)
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-0 bg-transparent ${ORDER_STATUSES[order.status].color}`}
                        >
                          {Object.entries(ORDER_STATUSES).map(([status, config]) => (
                            <option key={status} value={status} className="bg-gray-800 text-white">
                              {config.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${PAYMENT_STATUSES[order.paymentStatus].color}`}>
                          {PAYMENT_STATUSES[order.paymentStatus].label}
                        </span>
                      </td>
                      
                      <td className="p-6">
                        <span className="text-white/80">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              showOrderDetail(order)
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: Print invoice
                            }}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setShowOrderDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-primary-900/90 backdrop-blur-md border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedOrder.orderNumber}</h2>
                <p className="text-white/60">Order Details</p>
              </div>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedOrder.customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-white/60 text-sm">{selectedOrder.customer.email}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Subtotal:</span>
                      <span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Shipping:</span>
                      <span className="text-white">{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Tax:</span>
                      <span className="text-white">{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Discount:</span>
                        <span className="text-green-400">-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total:</span>
                        <span className="text-white">{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Order Items */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                      <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.productName}</p>
                        <p className="text-white/60 text-sm">SKU: {item.productSku}</p>
                        {item.variantName && (
                          <p className="text-white/60 text-sm">{item.variantName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-white">Qty: {item.quantity}</p>
                        <p className="text-white font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Shipping Address */}
              <GlassCard className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                <div className="text-white/80">
                  <p>{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.street1}</p>
                  {selectedOrder.shippingAddress.street2 && <p>{selectedOrder.shippingAddress.street2}</p>}
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  {selectedOrder.shippingAddress.phone && <p>Phone: {selectedOrder.shippingAddress.phone}</p>}
                </div>
              </GlassCard>

              {selectedOrder.notes && (
                <GlassCard className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Order Notes</h3>
                  <p className="text-white/80">{selectedOrder.notes}</p>
                </GlassCard>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}