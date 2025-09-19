'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  BuildingStorefrontIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
  MapPinIcon,
  CogIcon,
  DocumentTextIcon,
  BeakerIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import { 
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  CheckCircleIcon as CheckCircleSolid 
} from '@heroicons/react/24/solid'

interface InventoryDashboardProps {
  userRole?: 'admin' | 'manager' | 'staff'
}

export default function InventoryDashboard({ userRole = 'admin' }: InventoryDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewPOModal, setShowNewPOModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showStockAdjustModal, setShowStockAdjustModal] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { id: 'inventory', label: 'Inventory', icon: CubeIcon },
    { id: 'warehouses', label: 'Warehouses', icon: BuildingStorefrontIcon },
    { id: 'alerts', label: 'Alerts', icon: ExclamationTriangleIcon },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ClipboardDocumentListIcon },
    { id: 'transfers', label: 'Transfers', icon: ArrowsRightLeftIcon },
    { id: 'movements', label: 'Stock Movements', icon: ArchiveBoxIcon }
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventoryData()
    }
  }, [activeTab, selectedWarehouse, searchQuery])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inventory?action=dashboard')
      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInventoryData = async () => {
    try {
      const params = new URLSearchParams()
      params.append('action', 'inventory')
      if (selectedWarehouse !== 'all') params.append('warehouseId', selectedWarehouse)
      if (searchQuery) params.append('search', searchQuery)

      const response = await fetch(`/api/inventory?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setInventoryData(result.data)
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { status: 'out-of-stock', color: 'text-red-400', bg: 'bg-red-500/20' }
    if (quantity <= reorderLevel) return { status: 'low-stock', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    return { status: 'in-stock', color: 'text-green-400', bg: 'bg-green-500/20' }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
      case 'approved':
        return <CheckCircleSolid className="w-4 h-4 text-green-400" />
      case 'pending':
      case 'in_transit':
      case 'processing':
        return <ClockIcon className="w-4 h-4 text-yellow-400" />
      case 'cancelled':
      case 'failed':
      case 'inactive':
        return <XCircleIcon className="w-4 h-4 text-red-400" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading inventory dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-gray-400">Manage stock levels, warehouses, and supply chain operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNewPOModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Purchase Order</span>
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ArrowsRightLeftIcon className="w-5 h-5" />
                <span>Transfer Stock</span>
              </button>
              <button
                onClick={() => setShowStockAdjustModal(true)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <CogIcon className="w-5 h-5" />
                <span>Adjust Stock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-xl p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && dashboardData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <CubeIcon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Total Stock Items</h3>
                  <p className="text-2xl font-bold text-white">{dashboardData.overview.totalStock.toLocaleString()}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <BanknotesIcon className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Total Inventory Value</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(dashboardData.overview.totalValue)}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Low Stock Items</h3>
                  <p className="text-2xl font-bold text-white">{dashboardData.overview.lowStockItems}</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-500/20 p-3 rounded-lg">
                      <ExclamationTriangleSolid className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <h3 className="text-gray-400 text-sm mb-1">Active Alerts</h3>
                  <p className="text-2xl font-bold text-white">{dashboardData.overview.activeAlerts}</p>
                </div>
              </div>

              {/* Warehouse Utilization */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Warehouse Utilization</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.warehouses.map((warehouse: any, index: number) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{warehouse.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          warehouse.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {warehouse.status}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Utilization</span>
                          <span className="text-white">{warehouse.utilization}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${warehouse.utilization}%` }}
                          />
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        Capacity: {warehouse.capacity.toLocaleString()} units
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Alerts */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Alerts</h2>
                    <Link href="#" className="text-purple-400 hover:text-purple-300">View All</Link>
                  </div>
                  
                  <div className="space-y-4">
                    {dashboardData.recentAlerts.map((alert: any) => (
                      <div key={alert.id} className={`p-4 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}>
                        <div className="flex items-start space-x-3">
                          <ExclamationTriangleIcon className={`w-5 h-5 mt-0.5 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{alert.productName}</h4>
                            <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{alert.warehouseName}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                                alert.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {alert.severity.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products by Value */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Top Products by Value</h2>
                    <Link href="#" className="text-purple-400 hover:text-purple-300">View All</Link>
                  </div>
                  
                  <div className="space-y-4">
                    {dashboardData.topProducts.map((product: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                            <CubeIcon className="w-5 h-5 text-gray-300" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{product.name}</h4>
                            <p className="text-sm text-gray-400">{product.sku}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">{formatCurrency(product.value)}</p>
                          <p className="text-sm text-gray-400">{product.quantity} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products, SKUs..."
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  
                  <select 
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Warehouses</option>
                    <option value="wh-mumbai-001">Mumbai Central</option>
                    <option value="wh-delhi-002">Delhi North</option>
                    <option value="wh-bangalore-003">Bangalore South</option>
                  </select>
                  
                  <button className="bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
                    <FunnelIcon className="w-5 h-5" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="bg-gray-800/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 text-gray-300 font-medium">Product</th>
                        <th className="text-left p-4 text-gray-300 font-medium">SKU</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Warehouse</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Stock</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Value</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Location</th>
                        <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryData?.items?.map((item: any) => {
                        const stockStatus = getStockStatus(item.quantity, item.reorderLevel)
                        return (
                          <tr key={item.id} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                            <td className="p-4">
                              <div>
                                <h4 className="font-medium text-white">{item.productName}</h4>
                                <p className="text-sm text-gray-400">{item.size} • {item.color}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <code className="text-sm bg-gray-700/50 px-2 py-1 rounded text-gray-300">
                                {item.sku}
                              </code>
                            </td>
                            <td className="p-4 text-gray-300">{item.warehouseName}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium text-white">{item.quantity}</p>
                                <p className="text-xs text-gray-400">Available: {item.availableQuantity}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                                {stockStatus.status.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="p-4 text-white font-medium">{formatCurrency(item.totalValue)}</td>
                            <td className="p-4">
                              <div className="text-sm text-gray-400">
                                <p>{item.location.zone}-{item.location.aisle}-{item.location.shelf}</p>
                                <p>Bin: {item.location.bin}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 p-1">
                                  <CogIcon className="w-4 h-4" />
                                </button>
                                <button className="text-purple-400 hover:text-purple-300 p-1">
                                  <DocumentTextIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs will show placeholder content for now */}
          {activeTab !== 'dashboard' && activeTab !== 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/50 rounded-xl p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                {activeTab === 'warehouses' && <BuildingStorefrontIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                {activeTab === 'alerts' && <ExclamationTriangleIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                {activeTab === 'purchase-orders' && <ClipboardDocumentListIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                {activeTab === 'transfers' && <ArrowsRightLeftIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                {activeTab === 'movements' && <ArchiveBoxIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {tabs.find(tab => tab.id === activeTab)?.label} Coming Soon
                </h3>
                <p className="text-gray-400">
                  This section is under development and will be available soon.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals would go here */}
        {/* New Purchase Order Modal */}
        {/* Stock Transfer Modal */}
        {/* Stock Adjustment Modal */}
      </div>
    </div>
  )
}