import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/data/products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Get query parameters
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sizes = searchParams.get('sizes')?.split(',') || []
  const colors = searchParams.get('colors')?.split(',') || []
  const brands = searchParams.get('brands')?.split(',') || []
  const sortBy = searchParams.get('sortBy') || 'relevance'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '24')
  const inStock = searchParams.get('inStock') === 'true'

  try {
    // Filter products
    let filteredProducts = products.filter(product => {
      // Text search
      if (query) {
        const searchText = query.toLowerCase()
        const matchesText = 
          product.name.toLowerCase().includes(searchText) ||
          product.description?.toLowerCase().includes(searchText) ||
          product.category.toLowerCase().includes(searchText) ||
          product.subcategory?.toLowerCase().includes(searchText) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchText))
        
        if (!matchesText) return false
      }

      // Category filter
      if (category && product.category !== category) return false

      // Price filter
      if (minPrice && product.price < parseInt(minPrice)) return false
      if (maxPrice && product.price > parseInt(maxPrice)) return false

      // Size filter
      if (sizes.length > 0) {
        const hasSize = sizes.some(size => 
          product.sizes.includes(size.toUpperCase())
        )
        if (!hasSize) return false
      }

      // Color filter
      if (colors.length > 0) {
        const hasColor = colors.some(color =>
          product.colors.some(productColor =>
            productColor.toLowerCase().includes(color.toLowerCase())
          )
        )
        if (!hasColor) return false
      }

      // Brand filter
      if (brands.length > 0 && (product as any).brand) {
        if (!brands.includes((product as any).brand)) return false
      }

      // Stock filter
      if (inStock && !product.inStock) return false

      return true
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popularity':
        filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        break
      case 'featured':
        filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
      default:
        // Relevance - keep original order or implement relevance scoring
        break
    }

    // Calculate pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / limit)
    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)

    // Calculate facets for filtering
    const facets = {
      categories: Array.from(new Set(products.map(p => p.category))).map(cat => ({
        value: cat,
        count: filteredProducts.filter(p => p.category === cat).length
      })),
      brands: Array.from(new Set(products.map(p => (p as any).brand).filter(Boolean))).map(brand => ({
        value: brand,
        count: filteredProducts.filter(p => (p as any).brand === brand).length
      })),
      sizes: Array.from(new Set(products.flatMap(p => p.sizes))).map(size => ({
        value: size,
        count: filteredProducts.filter(p => p.sizes.includes(size)).length
      })),
      colors: Array.from(new Set(products.flatMap(p => p.colors))).map(color => ({
        value: color,
        count: filteredProducts.filter(p => p.colors.includes(color)).length
      })),
      priceRanges: [
        { 
          label: 'Under ₹1,000', 
          value: '0-1000',
          count: filteredProducts.filter(p => p.price < 1000).length 
        },
        { 
          label: '₹1,000 - ₹2,500', 
          value: '1000-2500',
          count: filteredProducts.filter(p => p.price >= 1000 && p.price <= 2500).length 
        },
        { 
          label: '₹2,500 - ₹5,000', 
          value: '2500-5000',
          count: filteredProducts.filter(p => p.price >= 2500 && p.price <= 5000).length 
        },
        { 
          label: '₹5,000 - ₹10,000', 
          value: '5000-10000',
          count: filteredProducts.filter(p => p.price >= 5000 && p.price <= 10000).length 
        },
        { 
          label: 'Over ₹10,000', 
          value: '10000+',
          count: filteredProducts.filter(p => p.price > 10000).length 
        }
      ]
    }

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      facets,
      filters: {
        query,
        category,
        minPrice,
        maxPrice,
        sizes,
        colors,
        brands,
        sortBy,
        inStock
      }
    })

  } catch (error) {
    console.error('Search API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST endpoint for advanced search with complex filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      query = '',
      filters = {},
      sort = 'relevance',
      page = 1,
      limit = 24,
      facets = true
    } = body

    // Advanced filtering logic
    let filteredProducts = products.filter(product => {
      // Text search with scoring
      if (query) {
        const searchText = query.toLowerCase()
        const nameMatch = product.name.toLowerCase().includes(searchText)
        const descMatch = product.description?.toLowerCase().includes(searchText)
        const categoryMatch = product.category.toLowerCase().includes(searchText)
        const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(searchText))
        
        if (!nameMatch && !descMatch && !categoryMatch && !tagMatch) {
          return false
        }
      }

      // Apply complex filters
      for (const [key, value] of Object.entries(filters)) {
        switch (key) {
          case 'categories':
            if (Array.isArray(value) && value.length > 0) {
              if (!value.includes(product.category)) return false
            }
            break
          case 'priceRange':
            if (value && typeof value === 'object') {
              const { min, max } = value as { min?: number; max?: number }
              if (min !== undefined && product.price < min) return false
              if (max !== undefined && product.price > max) return false
            }
            break
          case 'sizes':
            if (Array.isArray(value) && value.length > 0) {
              const hasSize = value.some(size => 
                product.sizes.includes(size.toUpperCase())
              )
              if (!hasSize) return false
            }
            break
          case 'colors':
            if (Array.isArray(value) && value.length > 0) {
              const hasColor = value.some(color =>
                product.colors.some(productColor =>
                  productColor.toLowerCase().includes(color.toLowerCase())
                )
              )
              if (!hasColor) return false
            }
            break
          case 'brands':
            if (Array.isArray(value) && value.length > 0 && (product as any).brand) {
              if (!value.includes((product as any).brand)) return false
            }
            break
          case 'rating':
            if (typeof value === 'number') {
              if (!product.rating || product.rating < value) return false
            }
            break
          case 'inStock':
            if (value === true && !product.inStock) return false
            break
          case 'isNew':
            if (value === true && !product.isNew) return false
            break
          case 'isFeatured':
            if (value === true && !product.isFeatured) return false
            break
        }
      }

      return true
    })

    // Advanced sorting
    switch (sort) {
      case 'relevance':
        // Implement relevance scoring based on query match
        if (query) {
          filteredProducts.sort((a, b) => {
            const aScore = getRelevanceScore(a, query)
            const bScore = getRelevanceScore(b, query)
            return bScore - aScore
          })
        }
        break
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popularity':
        filteredProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        break
    }

    // Pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / limit)
    const startIndex = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit)

    const response: any = {
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }

    // Add facets if requested
    if (facets) {
      response.facets = {
        categories: Array.from(new Set(products.map(p => p.category))).map(cat => ({
          value: cat,
          count: filteredProducts.filter(p => p.category === cat).length
        })),
        brands: Array.from(new Set(products.map(p => (p as any).brand).filter(Boolean))).map(brand => ({
          value: brand,
          count: filteredProducts.filter(p => (p as any).brand === brand).length
        })),
        sizes: Array.from(new Set(products.flatMap(p => p.sizes))).map(size => ({
          value: size,
          count: filteredProducts.filter(p => p.sizes.includes(size)).length
        })),
        colors: Array.from(new Set(products.flatMap(p => p.colors))).map(color => ({
          value: color,
          count: filteredProducts.filter(p => p.colors.includes(color)).length
        }))
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Advanced Search API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate relevance score
function getRelevanceScore(product: any, query: string): number {
  const searchText = query.toLowerCase()
  let score = 0

  // Name matches get highest score
  if (product.name.toLowerCase().includes(searchText)) {
    score += 10
    // Exact match gets bonus
    if (product.name.toLowerCase() === searchText) {
      score += 20
    }
  }

  // Category matches
  if (product.category.toLowerCase().includes(searchText)) {
    score += 5
  }

  // Description matches
  if (product.description?.toLowerCase().includes(searchText)) {
    score += 3
  }

  // Tag matches
  if (product.tags?.some((tag: string) => tag.toLowerCase().includes(searchText))) {
    score += 2
  }

  // Brand matches
  if ((product as any).brand?.toLowerCase().includes(searchText)) {
    score += 7
  }

  return score
}