'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  TruckIcon,
  EyeIcon,
  PrinterIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  items_count: number
  shipping_address: string
  created_at: string
  updated_at: string
  tracking_number?: string
  notes?: string
}

interface OrderStats {
  total_orders: number
  pending_orders: number
  shipped_orders: number
  total_revenue: number
  avg_order_value: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Mock data
  const mockOrders: Order[] = [
    {
      id: '1',
      order_number: 'ORD-2024-001',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      total_amount: 2499,
      status: 'processing',
      payment_status: 'paid',
      items_count: 3,
      shipping_address: '123 Main St, City, State 12345',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T14:20:00Z',
      tracking_number: 'TRK123456789',
      notes: 'Customer requested express delivery'
    },
    {
      id: '2',
      order_number: 'ORD-2024-002',
      customer_name: 'Jane Smith',
      customer_email: 'jane@example.com',
      total_amount: 1899,
      status: 'shipped',
      payment_status: 'paid',
      items_count: 2,
      shipping_address: '456 Oak Ave, City, State 67890',
      created_at: '2024-01-14T09:15:00Z',
      updated_at: '2024-01-16T11:45:00Z',
      tracking_number: 'TRK987654321'
    },
    {
      id: '3',
      order_number: 'ORD-2024-003',
      customer_name: 'Mike Johnson',
      customer_email: 'mike@example.com',
      total_amount: 3299,
      status: 'pending',
      payment_status: 'pending',
      items_count: 4,
      shipping_address: '789 Pine St, City, State 13579',
      created_at: '2024-01-16T16:20:00Z',
      updated_at: '2024-01-16T16:20:00Z'
    },
    {
      id: '4',
      order_number: 'ORD-2024-004',
      customer_name: 'Sarah Wilson',
      customer_email: 'sarah@example.com',
      total_amount: 1599,
      status: 'delivered',
      payment_status: 'paid',
      items_count: 1,
      shipping_address: '321 Elm Dr, City, State 24680',
      created_at: '2024-01-12T08:30:00Z',
      updated_at: '2024-01-18T12:00:00Z',
      tracking_number: 'TRK555666777'
    },
    {
      id: '5',
      order_number: 'ORD-2024-005',
      customer_name: 'David Brown',
      customer_email: 'david@example.com',
      total_amount: 899,
      status: 'cancelled',
      payment_status: 'refunded',
      items_count: 1,
      shipping_address: '654 Maple Ave, City, State 97531',
      created_at: '2024-01-13T14:45:00Z',
      updated_at: '2024-01-14T10:30:00Z',
      notes: 'Customer requested cancellation due to size issue'
    }
  ]

  const mockStats: OrderStats = {
    total_orders: 125,
    pending_orders: 23,
    shipped_orders: 45,
    total_revenue: 287500,
    avg_order_value: 2300
  }

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [searchTerm, statusFilter, orders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
        : order
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Export</span>
          </button>
          <Link
            href="/admin/orders/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>Create Order</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <TruckIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shipped_orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.total_revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.avg_order_value}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredOrders.length} orders found
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                      <div className="text-sm text-gray-500">{order.items_count} items</div>
                      {order.tracking_number && (
                        <div className="text-xs text-blue-600">Tracking: {order.tracking_number}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PrinterIcon className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Order Details: {selectedOrder.order_number}</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer_email}</p>
                    <p><span className="font-medium">Address:</span> {selectedOrder.shipping_address}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p><span className="font-medium">Last Updated:</span> {formatDate(selectedOrder.updated_at)}</p>
                    <p><span className="font-medium">Items:</span> {selectedOrder.items_count}</p>
                    <p><span className="font-medium">Total:</span> ₹{selectedOrder.total_amount.toLocaleString()}</p>
                    {selectedOrder.tracking_number && (
                      <p><span className="font-medium">Tracking:</span> {selectedOrder.tracking_number}</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Update Status</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200"
                  >
                    Mark as Processing
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm hover:bg-indigo-200"
                  >
                    Mark as Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
