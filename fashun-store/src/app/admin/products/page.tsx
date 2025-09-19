'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline'
import strapiService, { Product as StrapiProduct } from '@/lib/strapi'

interface Product {
  id: number
  name: string
  description: string
  price: number
  sale_price?: number
  stock_quantity: number
  image?: string
  category?: {
    name: string
  }
  inStock: boolean
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [sortBy, setSortBy] = useState('createdAt:desc')

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [searchTerm, categoryFilter, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      const params: any = {
        'populate[0]': 'category',
        'populate[1]': 'image',
        'sort[0]': sortBy
      }

      if (searchTerm) {
        params['filters[name][$containsi]'] = searchTerm
      }

      if (categoryFilter) {
        params['filters[category][name][$eq]'] = categoryFilter
      }

      const response = await strapiService.getProducts(params)
      const transformedProducts: Product[] = (response.data || []).map((product: StrapiProduct) => ({
        id: product.id,
        name: product.attributes.name,
        description: product.attributes.description,
        price: product.attributes.price,
        stock_quantity: product.attributes.stock_quantity,
        image: product.attributes.images?.data?.[0]?.attributes?.url,
        category: { name: product.attributes.category },
        inStock: product.attributes.status === 'active' && product.attributes.stock_quantity > 0,
        createdAt: product.attributes.createdAt
      }))
      setProducts(transformedProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await strapiService.getCategories()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await strapiService.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !categoryFilter || 
      product.category?.name === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.attributes?.name || category.name}>
                {category.attributes?.name || category.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="name:asc">Name A-Z</option>
            <option value="name:desc">Name Z-A</option>
            <option value="price:asc">Price Low to High</option>
            <option value="price:desc">Price High to Low</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-600">
            <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                {/* Category */}
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2">
                    {product.category.name}
                  </span>
                )}

                {/* Price */}
                <div className="flex items-center space-x-2 mb-2">
                  {product.sale_price ? (
                    <>
                      <span className="text-lg font-bold text-green-600">₹{product.sale_price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm text-center transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 inline mr-1" />
                    View
                  </Link>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded text-sm text-center transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded text-sm transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter 
              ? 'Try adjusting your search criteria or filters.' 
              : 'Get started by creating your first product.'}
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  )
}
