'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  image?: string
  productCount: number
  isActive: boolean
  createdAt: string
}

// Mock data for now - this will be replaced with Strapi API
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Comfortable and stylish t-shirts for all occasions',
    productCount: 15,
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Warm and cozy hoodies perfect for casual wear',
    productCount: 8,
    isActive: true,
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Jeans',
    slug: 'jeans',
    description: 'Premium quality denim jeans in various fits',
    productCount: 12,
    isActive: true,
    createdAt: '2024-01-25'
  },
  {
    id: 4,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories to complete your look',
    productCount: 5,
    isActive: false,
    createdAt: '2024-02-01'
  }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDeleteCategory = (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }
    setCategories(categories.filter(c => c.id !== categoryId))
  }

  const handleToggleStatus = (categoryId: number) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Categories ({filteredCategories.length})</h2>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <div key={category.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <TagIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{category.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{category.productCount} products</span>
                        <span>•</span>
                        <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-blue-600">/{category.slug}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(category.id)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        category.isActive
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm font-medium"
                    >
                      <PencilIcon className="h-4 w-4 inline mr-1" />
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium"
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
          <div className="p-12 text-center">
            <TagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by creating your first category.'}
            </p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Your First Category</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c.productCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
