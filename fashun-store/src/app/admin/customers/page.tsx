'use client'

import { useState, useEffect } from 'react'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  GiftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  registration_date: string
  last_order_date: string
  total_orders: number
  total_spent: number
  average_order_value: number
  status: 'active' | 'inactive' | 'vip' | 'blocked'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  lifetime_value: number
  notes: string
  tags: string[]
}

interface CustomerStats {
  total_customers: number
  new_this_month: number
  active_customers: number
  vip_customers: number
  average_lifetime_value: number
  churn_rate: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<CustomerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showAddCustomer, setShowAddCustomer] = useState(false)

  // Mock data
  const mockStats: CustomerStats = {
    total_customers: 1,
    new_this_month: 125,
    active_customers: 756,
    vip_customers: 45,
    average_lifetime_value: 2850,
    churn_rate: 12.5
  }

  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@email.com',
      phone: '+91 98765 43210',
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India'
      },
      registration_date: '2023-01-15',
      last_order_date: '2024-01-10',
      total_orders: 15,
      total_spent: 45600,
      average_order_value: 3040,
      status: 'vip',
      tier: 'gold',
      lifetime_value: 52000,
      notes: 'Frequent buyer, prefers premium products',
      tags: ['premium', 'loyal', 'fashion-forward']
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 87654 32109',
      address: {
        street: '456 Brigade Road',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '560001',
        country: 'India'
      },
      registration_date: '2023-03-22',
      last_order_date: '2024-01-08',
      total_orders: 8,
      total_spent: 22400,
      average_order_value: 2800,
      status: 'active',
      tier: 'silver',
      lifetime_value: 28000,
      notes: 'Loves accessories and bags',
      tags: ['accessories', 'regular']
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@email.com',
      phone: '+91 76543 21098',
      address: {
        street: '789 Connaught Place',
        city: 'Delhi',
        state: 'Delhi',
        postal_code: '110001',
        country: 'India'
      },
      registration_date: '2023-06-10',
      last_order_date: '2023-12-15',
      total_orders: 3,
      total_spent: 8500,
      average_order_value: 2833,
      status: 'inactive',
      tier: 'bronze',
      lifetime_value: 12000,
      notes: 'Price-sensitive buyer',
      tags: ['casual', 'price-conscious']
    },
    {
      id: '4',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@email.com',
      phone: '+91 65432 10987',
      address: {
        street: '321 Park Street',
        city: 'Kolkata',
        state: 'West Bengal',
        postal_code: '700016',
        country: 'India'
      },
      registration_date: '2023-02-28',
      last_order_date: '2024-01-12',
      total_orders: 25,
      total_spent: 78500,
      average_order_value: 3140,
      status: 'vip',
      tier: 'platinum',
      lifetime_value: 95000,
      notes: 'VIP customer, expects premium service',
      tags: ['vip', 'premium', 'high-value']
    },
    {
      id: '5',
      name: 'Arjun Singh',
      email: 'arjun.singh@email.com',
      phone: '+91 54321 09876',
      address: {
        street: '654 Anna Salai',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postal_code: '600002',
        country: 'India'
      },
      registration_date: '2023-08-05',
      last_order_date: '2024-01-05',
      total_orders: 6,
      total_spent: 15800,
      average_order_value: 2633,
      status: 'active',
      tier: 'bronze',
      lifetime_value: 18500,
      notes: 'Interested in sportswear',
      tags: ['sportswear', 'young']
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCustomers(mockCustomers)
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    const matchesTier = tierFilter === 'all' || customer.tier === tierFilter
    
    return matchesSearch && matchesStatus && matchesTier
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'vip': return 'bg-purple-100 text-purple-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-100 text-orange-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'platinum': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierStars = (tier: string) => {
    const starCount = { bronze: 1, silver: 2, gold: 3, platinum: 4 }[tier] || 1
    return Array.from({ length: starCount }, (_, i) => (
      <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
    ))
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
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customer relationships and insights</p>
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_customers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PlusIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new_this_month}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_customers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.vip_customers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <GiftIcon className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Lifetime Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.average_lifetime_value.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.churn_rate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders & Spending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lifetime Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status.toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTierColor(customer.tier)}`}>
                          {customer.tier.toUpperCase()}
                        </span>
                        <div className="flex">{getTierStars(customer.tier)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.total_orders} orders</div>
                    <div className="text-sm text-gray-500">₹{customer.total_spent.toLocaleString()} total</div>
                    <div className="text-sm text-gray-500">₹{customer.average_order_value.toLocaleString()} avg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{customer.lifetime_value.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(customer.last_order_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowDetails(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Phone</label>
                      <p className="text-sm font-medium text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Registration Date</label>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedCustomer.registration_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
                  <p className="text-sm text-gray-900">
                    {selectedCustomer.address.street}<br />
                    {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postal_code}<br />
                    {selectedCustomer.address.country}
                  </p>
                </div>

                {/* Order History */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Order Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-lg font-bold text-gray-900">{selectedCustomer.total_orders}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-lg font-bold text-gray-900">₹{selectedCustomer.total_spent.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Lifetime Value</p>
                      <p className="text-lg font-bold text-gray-900">₹{selectedCustomer.lifetime_value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Tags and Notes */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tags & Notes</h4>
                  <div className="mb-3">
                    <label className="block text-sm text-gray-600 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Notes</label>
                    <p className="text-sm text-gray-900">{selectedCustomer.notes}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
