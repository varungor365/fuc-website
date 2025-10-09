'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  ChevronLeftIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpTrayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  subcategory: string;
  tags: string[];
  images: string[];
  variants: {
    size: string[];
    color: string[];
  };
  inventory: {
    total: number;
    available: number;
    sold: number;
  };
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  createdDate: string;
  lastModified: string;
  isAIGenerated: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'AI-Generated Streetwear Hoodie',
    description: 'Premium streetwear hoodie with custom AI-generated design',
    price: 89.99,
    salePrice: 79.99,
    category: 'Hoodies',
    subcategory: 'Streetwear',
    tags: ['streetwear', 'ai-generated', 'premium', 'limited-edition'],
    images: ['/api/placeholder/400/400'],
    variants: {
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      color: ['Black', 'White', 'Gray', 'Navy']
    },
    inventory: {
      total: 100,
      available: 87,
      sold: 13
    },
    status: 'active',
    featured: true,
    createdDate: '2024-01-10',
    lastModified: '2024-01-15',
    isAIGenerated: true,
    seo: {
      title: 'AI-Generated Streetwear Hoodie - Premium Fashion',
      description: 'Unique AI-designed streetwear hoodie with premium quality materials',
      keywords: ['streetwear', 'hoodie', 'ai-fashion', 'custom-design']
    }
  },
  {
    id: 'PROD-002',
    name: 'Custom Graphic T-Shirt',
    description: 'Soft cotton t-shirt with customizable graphics',
    price: 34.99,
    category: 'T-Shirts',
    subcategory: 'Casual',
    tags: ['custom', 'cotton', 'graphic', 'everyday'],
    images: ['/api/placeholder/400/400'],
    variants: {
      size: ['XS', 'S', 'M', 'L', 'XL'],
      color: ['Black', 'White', 'Red', 'Blue', 'Green']
    },
    inventory: {
      total: 200,
      available: 156,
      sold: 44
    },
    status: 'active',
    featured: false,
    createdDate: '2024-01-08',
    lastModified: '2024-01-14',
    isAIGenerated: false,
    seo: {
      title: 'Custom Graphic T-Shirt - Personalized Fashion',
      description: 'High-quality cotton t-shirt with custom graphic designs',
      keywords: ['t-shirt', 'custom', 'graphic', 'cotton']
    }
  },
  {
    id: 'PROD-003',
    name: 'Vintage Denim Jacket',
    description: 'Classic vintage-style denim jacket with distressed finish',
    price: 129.99,
    category: 'Jackets',
    subcategory: 'Denim',
    tags: ['vintage', 'denim', 'classic', 'distressed'],
    images: ['/api/placeholder/400/400'],
    variants: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['Light Blue', 'Dark Blue', 'Black']
    },
    inventory: {
      total: 50,
      available: 23,
      sold: 27
    },
    status: 'active',
    featured: true,
    createdDate: '2024-01-05',
    lastModified: '2024-01-13',
    isAIGenerated: false,
    seo: {
      title: 'Vintage Denim Jacket - Classic Style',
      description: 'Authentic vintage denim jacket with premium distressed finish',
      keywords: ['denim', 'jacket', 'vintage', 'classic']
    }
  },
  {
    id: 'PROD-004',
    name: 'AI Fashion Crop Top',
    description: 'Trendy crop top with AI-generated artistic pattern',
    price: 24.99,
    category: 'Tops',
    subcategory: 'Crop Tops',
    tags: ['crop-top', 'ai-pattern', 'trendy', 'summer'],
    images: ['/api/placeholder/400/400'],
    variants: {
      size: ['XS', 'S', 'M', 'L'],
      color: ['Pink', 'Purple', 'Blue', 'Green']
    },
    inventory: {
      total: 80,
      available: 72,
      sold: 8
    },
    status: 'draft',
    featured: false,
    createdDate: '2024-01-12',
    lastModified: '2024-01-15',
    isAIGenerated: true,
    seo: {
      title: 'AI Fashion Crop Top - Artistic Design',
      description: 'Unique crop top featuring AI-generated artistic patterns',
      keywords: ['crop-top', 'ai-fashion', 'artistic', 'pattern']
    }
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const statuses = ['all', 'active', 'draft', 'archived'];

  const getStatusBadge = (status: string) => {
    const badgeClasses = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses[status as keyof typeof badgeClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const duplicateProduct = (productId: string) => {
    const productToDuplicate = products.find(p => p.id === productId);
    if (productToDuplicate) {
      const newProduct = {
        ...productToDuplicate,
        id: `PROD-${Date.now()}`,
        name: `${productToDuplicate.name} (Copy)`,
        status: 'draft' as const,
        featured: false,
        createdDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        inventory: { ...productToDuplicate.inventory, sold: 0 }
      };
      setProducts([newProduct, ...products]);
    }
  };

  const deleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const toggleFeatured = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, featured: !p.featured } : p
    ));
  };

  const updateProductStatus = (productId: string, newStatus: Product['status']) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof Product];
      let bValue: any = b[sortField as keyof Product];
      
      if (sortField === 'price') {
        aValue = a.salePrice || a.price;
        bValue = b.salePrice || b.price;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  <ChevronLeftIcon className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              </div>
              <p className="text-gray-600 mt-1">
                Manage your product catalog and inventory
              </p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/customize"
                className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                AI Generator
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredAndSortedProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  </div>
                )}
                {product.isAIGenerated && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <SparklesIcon className="h-3 w-3 mr-1" />
                      AI
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2">
                  {getStatusBadge(product.status)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          ${product.salePrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.inventory.available} left
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{product.category}</span>
                  <span>{product.inventory.sold} sold</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-green-600"
                      title="Edit Product"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateProduct(product.id)}
                      className="p-1 text-gray-500 hover:text-purple-600"
                      title="Duplicate Product"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                      title="Delete Product"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <select
                    value={product.status}
                    onChange={(e) => updateProductStatus(product.id, e.target.value as Product['status'])}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your filters to see more products.'
                : 'Get started by adding your first product.'
              }
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">Product Details - {selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-64 bg-gray-200 rounded-lg mb-4">
                  {selectedProduct.images[0] ? (
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Variants:</h4>
                  <p><span className="font-medium">Sizes:</span> {selectedProduct.variants.size.join(', ')}</p>
                  <p><span className="font-medium">Colors:</span> {selectedProduct.variants.color.join(', ')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Information</h4>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <div className="flex items-center space-x-2">
                    {selectedProduct.salePrice ? (
                      <>
                        <span className="text-xl font-bold text-green-600">
                          ${selectedProduct.salePrice}
                        </span>
                        <span className="text-gray-500 line-through">
                          ${selectedProduct.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">
                        ${selectedProduct.price}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Inventory</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <p className="font-medium">{selectedProduct.inventory.total}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Available:</span>
                      <p className="font-medium">{selectedProduct.inventory.available}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Sold:</span>
                      <p className="font-medium">{selectedProduct.inventory.sold}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Categories & Tags</h4>
                  <p><span className="font-medium">Category:</span> {selectedProduct.category}</p>
                  <p><span className="font-medium">Subcategory:</span> {selectedProduct.subcategory}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Edit Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}