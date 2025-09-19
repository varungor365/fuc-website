'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  LightBulbIcon,
  DocumentTextIcon,
  TagIcon,
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

interface SEOProduct {
  id: number
  name: string
  slug: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  score: number
  issues: string[]
  suggestions: string[]
}

interface SEOAnalysis {
  overall_score: number
  total_products: number
  products_with_issues: number
  common_issues: string[]
  recommendations: string[]
}

export default function SEOToolsPage() {
  const [products, setProducts] = useState<SEOProduct[]>([])
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<SEOProduct | null>(null)
  const [generatingFor, setGeneratingFor] = useState<number | null>(null)

  // Mock data for SEO analysis
  const mockProducts: SEOProduct[] = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-t-shirt',
      seo_title: 'Premium Cotton T-Shirt - Comfortable Daily Wear',
      seo_description: 'High-quality cotton t-shirt perfect for everyday wear. Soft, breathable, and durable.',
      seo_keywords: 'cotton t-shirt, premium shirt, comfortable wear',
      score: 85,
      issues: ['Meta description too short'],
      suggestions: ['Add more keywords', 'Improve meta description length']
    },
    {
      id: 2,
      name: 'Vintage Denim Jacket',
      slug: 'vintage-denim-jacket',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      score: 25,
      issues: ['Missing SEO title', 'Missing meta description', 'No keywords'],
      suggestions: ['Generate complete SEO package', 'Add product-specific keywords']
    },
    {
      id: 3,
      name: 'Casual Sneakers',
      slug: 'casual-sneakers',
      seo_title: 'Casual Sneakers for Everyday Comfort',
      seo_description: 'Stylish and comfortable casual sneakers perfect for daily activities. Available in multiple colors.',
      seo_keywords: 'casual sneakers, comfortable shoes, daily wear',
      score: 92,
      issues: [],
      suggestions: ['Add seasonal keywords', 'Consider long-tail keywords']
    }
  ]

  const mockAnalysis: SEOAnalysis = {
    overall_score: 67,
    total_products: 45,
    products_with_issues: 23,
    common_issues: [
      'Missing meta descriptions',
      'Short SEO titles',
      'Insufficient keywords',
      'Duplicate content issues'
    ],
    recommendations: [
      'Generate SEO content for products missing meta data',
      'Optimize existing content for better search rankings',
      'Add location-based keywords for local SEO',
      'Implement structured data markup'
    ]
  }

  useEffect(() => {
    // Simulate loading SEO data
    setTimeout(() => {
      setProducts(mockProducts)
      setAnalysis(mockAnalysis)
      setLoading(false)
    }, 1000)
  }, [])

  const generateSEOContent = async (productId: number) => {
    setGeneratingFor(productId)
    
    // Simulate AI generation
    setTimeout(() => {
      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            seo_title: `${product.name} - Premium Fashion | FUC Store`,
            seo_description: `Discover our ${product.name.toLowerCase()} featuring premium quality materials and modern design. Perfect for fashion-forward individuals. Shop now with free shipping.`,
            seo_keywords: `${product.name.toLowerCase()}, fashion, premium quality, modern design, clothing, style`,
            score: 88,
            issues: [],
            suggestions: ['Consider adding seasonal keywords', 'Add color variants to keywords']
          }
        }
        return product
      }))
      setGeneratingFor(null)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SEO Tools</h1>
        <p className="text-gray-600">Optimize your product SEO for better search rankings</p>
      </div>

      {/* SEO Overview */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreColor(analysis.overall_score)}`}>
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.overall_score}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.total_products}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products with Issues</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.products_with_issues}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Optimized Products</p>
                <p className="text-2xl font-bold text-gray-900">{analysis.total_products - analysis.products_with_issues}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product SEO List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Product SEO Status</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  Bulk Optimize
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreBadgeColor(product.score)}`}>
                          {product.score}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">/{product.slug}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full ${
                          product.seo_title ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.seo_title ? '✓ Title' : '✗ No Title'}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          product.seo_description ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.seo_description ? '✓ Description' : '✗ No Description'}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          product.seo_keywords ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.seo_keywords ? '✓ Keywords' : '✗ No Keywords'}
                        </span>
                      </div>

                      {product.issues.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-red-600">Issues: {product.issues.join(', ')}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        <MagnifyingGlassIcon className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => generateSEOContent(product.id)}
                        disabled={generatingFor === product.id}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        {generatingFor === product.id ? (
                          <>
                            <div className="animate-spin h-4 w-4 inline mr-1 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <SparklesIcon className="h-4 w-4 inline mr-1" />
                            Generate
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Insights Sidebar */}
        <div className="space-y-6">
          {/* Common Issues */}
          {analysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Issues</h3>
              <div className="space-y-3">
                {analysis.common_issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <LightBulbIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Tips */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">SEO Tips</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-4 w-4 mt-0.5" />
                <span>Keep titles between 50-60 characters</span>
              </div>
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-4 w-4 mt-0.5" />
                <span>Meta descriptions should be 150-160 characters</span>
              </div>
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-4 w-4 mt-0.5" />
                <span>Use relevant keywords naturally</span>
              </div>
              <div className="flex items-start space-x-2">
                <InformationCircleIcon className="h-4 w-4 mt-0.5" />
                <span>Include location keywords for local SEO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">SEO Details: {selectedProduct.name}</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={selectedProduct.seo_title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter SEO title..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedProduct.seo_title.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <textarea
                  rows={3}
                  value={selectedProduct.seo_description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter meta description..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {selectedProduct.seo_description.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={selectedProduct.seo_keywords}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter keywords separated by commas..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
