'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import GlassCard from '@/components/admin/GlassCard'
import { useErrorTracking } from '@/lib/errorTracking'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  salePrice?: number
  status: 'active' | 'inactive' | 'draft' | 'out_of_stock'
  stock: number
  images: string[]
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
  aiScore?: number
  tags: string[]
}

interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  attributes: { [key: string]: string }
}

interface ProductFilters {
  status: string
  category: string
  priceRange: { min: number; max: number }
  sortBy: 'name' | 'price' | 'stock' | 'created' | 'ai_score'
  sortOrder: 'asc' | 'desc'
  search: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const { logError, addBreadcrumb } = useErrorTracking()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [filters, setFilters] = useState<ProductFilters>({
    status: 'all',
    category: 'all',
    priceRange: { min: 0, max: 1000 },
    sortBy: 'created',
    sortOrder: 'desc',
    search: ''
  })

  // Mock categories for filter
  const categories = [
    'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shoes', 'Accessories'
  ]

  useEffect(() => {
    addBreadcrumb('navigation', 'Accessed Products Management')
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Streetwear Hoodie',
          sku: 'HOOD-001',
          category: 'Hoodies',
          price: 89.99,
          salePrice: 69.99,
          status: 'active',
          stock: 25,
          images: ['/api/placeholder/400/400'],
          variants: [
            { id: 'v1', name: 'Small Black', sku: 'HOOD-001-S-BLK', price: 89.99, stock: 10, attributes: { size: 'S', color: 'Black' } },
            { id: 'v2', name: 'Medium Black', sku: 'HOOD-001-M-BLK', price: 89.99, stock: 15, attributes: { size: 'M', color: 'Black' } }
          ],
          createdAt: '2024-01-15T08:00:00Z',
          updatedAt: '2024-01-20T10:30:00Z',
          aiScore: 94,
          tags: ['premium', 'streetwear', 'winter']
        },
        {
          id: '2',
          name: 'Limited Edition Graphic Tee',
          sku: 'TEE-002',
          category: 'T-Shirts',
          price: 49.99,
          status: 'active',
          stock: 0,
          images: ['/api/placeholder/400/400'],
          variants: [],
          createdAt: '2024-01-10T12:00:00Z',
          updatedAt: '2024-01-18T15:45:00Z',
          aiScore: 88,
          tags: ['limited', 'graphic', 'cotton']
        },
        {
          id: '3',
          name: 'Designer Denim Jacket',
          sku: 'JACK-003',
          category: 'Jackets',
          price: 159.99,
          status: 'draft',
          stock: 12,
          images: ['/api/placeholder/400/400'],
          variants: [],
          createdAt: '2024-01-12T09:15:00Z',
          updatedAt: '2024-01-19T11:20:00Z',
          aiScore: 91,
          tags: ['designer', 'denim', 'casual']
        }
      ]
      
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate loading
      setProducts(mockProducts)
    } catch (error) {
      logError(error as Error, { context: 'fetchProducts' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10'
      case 'inactive': return 'text-gray-400 bg-gray-400/10'
      case 'draft': return 'text-yellow-400 bg-yellow-400/10'
      case 'out_of_stock': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-400' }
    if (stock < 10) return { text: 'Low Stock', color: 'text-yellow-400' }
    return { text: 'In Stock', color: 'text-green-400' }
  }

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    try {
      addBreadcrumb('user', `Bulk action: ${action}`, { productCount: selectedProducts.length })
      
      switch (action) {
        case 'activate':
          // TODO: Implement bulk activate
          break
        case 'deactivate':
          // TODO: Implement bulk deactivate
          break
        case 'delete':
          // TODO: Implement bulk delete
          break
        case 'export':
          // TODO: Implement export
          break
      }
      
      setSelectedProducts([])
      setShowBulkActions(false)
      fetchProducts()
    } catch (error) {
      logError(error as Error, { context: 'bulkAction', action })
    }
  }

  const handleQuickEdit = (productId: string, field: string, value: any) => {
    try {
      addBreadcrumb('user', `Quick edit: ${field}`, { productId, field, value })
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, [field]: value, updatedAt: new Date().toISOString() }
          : product
      ))
    } catch (error) {
      logError(error as Error, { context: 'quickEdit', productId, field })
    }
  }

  const filteredProducts = products.filter(product => {
    if (filters.status !== 'all' && product.status !== filters.status) return false
    if (filters.category !== 'all' && product.category !== filters.category) return false
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !product.sku.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false
    return true
  }).sort((a, b) => {
    const { sortBy, sortOrder } = filters
    let aVal: any, bVal: any
    
    switch (sortBy) {
      case 'name': aVal = a.name; bVal = b.name; break
      case 'price': aVal = a.price; bVal = b.price; break
      case 'stock': aVal = a.stock; bVal = b.stock; break
      case 'ai_score': aVal = a.aiScore || 0; bVal = b.aiScore || 0; break
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
            <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
            <p className="text-white/60">Manage your product catalog with intelligent insights</p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/products/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Add Product
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-200"
              onClick={() => {/* TODO: Implement import */}}
            >
              Import
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Active Products</p>
                <p className="text-2xl font-bold text-white">{products.filter(p => p.status === 'active').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-white">{products.filter(p => p.stock > 0 && p.stock < 10).length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Avg AI Score</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(products.reduce((acc, p) => acc + (p.aiScore || 0), 0) / products.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters & Search */}
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-desc">Price High-Low</option>
                <option value="price-asc">Price Low-High</option>
                <option value="stock-desc">Stock High-Low</option>
                <option value="ai_score-desc">AI Score High-Low</option>
              </select>
            </div>

            {/* Actions */}
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
                    checked={selectedProducts.length === products.length}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                  />
                  <span className="text-white">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Products Table */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white/60">Loading products...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-6 text-white/80 font-medium">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={handleSelectAll}
                        className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left p-6 text-white/80 font-medium">Product</th>
                    <th className="text-left p-6 text-white/80 font-medium">SKU</th>
                    <th className="text-left p-6 text-white/80 font-medium">Category</th>
                    <th className="text-left p-6 text-white/80 font-medium">Price</th>
                    <th className="text-left p-6 text-white/80 font-medium">Stock</th>
                    <th className="text-left p-6 text-white/80 font-medium">Status</th>
                    <th className="text-left p-6 text-white/80 font-medium">AI Score</th>
                    <th className="text-left p-6 text-white/80 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-6">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                          className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                        />
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="text-sm text-white/60">{product.tags.join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <span className="font-mono text-white/80">{product.sku}</span>
                      </td>
                      
                      <td className="p-6">
                        <span className="text-white/80">{product.category}</span>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex flex-col">
                          {product.salePrice ? (
                            <>
                              <span className="text-green-400 font-medium">${product.salePrice}</span>
                              <span className="text-white/40 line-through text-sm">${product.price}</span>
                            </>
                          ) : (
                            <span className="text-white font-medium">${product.price}</span>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getStockStatus(product.stock).color}`}>
                            {product.stock}
                          </span>
                          <span className={`text-sm ${getStockStatus(product.stock).color}`}>
                            {getStockStatus(product.stock).text}
                          </span>
                        </div>
                      </td>
                      
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                          {product.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      
                      <td className="p-6">
                        {product.aiScore && (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{ width: `${product.aiScore}%` }}
                              ></div>
                            </div>
                            <span className="text-white/80 text-sm font-medium">{product.aiScore}%</span>
                          </div>
                        )}
                      </td>
                      
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </motion.button>
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                            onClick={() => {/* TODO: Implement duplicate */}}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            onClick={() => {/* TODO: Implement delete */}}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    </div>
  )
}