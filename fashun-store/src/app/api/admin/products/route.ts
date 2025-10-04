import { NextRequest, NextResponse } from 'next/server'

// Mock database - In production, replace with actual database
let products = [
  {
    id: '1',
    name: 'Premium Streetwear Hoodie',
    slug: 'premium-streetwear-hoodie',
    sku: 'HOOD-001',
    category: 'Hoodies',
    description: 'Premium quality streetwear hoodie made from organic cotton blend.',
    price: 89.99,
    salePrice: 69.99,
    status: 'active',
    stock: 25,
    images: [
      '/api/placeholder/400/400',
      '/api/placeholder/400/401',
      '/api/placeholder/400/402'
    ],
    variants: [
      {
        id: 'v1',
        name: 'Small Black',
        sku: 'HOOD-001-S-BLK',
        price: 89.99,
        stock: 10,
        attributes: { size: 'S', color: 'Black' }
      },
      {
        id: 'v2',
        name: 'Medium Black',
        sku: 'HOOD-001-M-BLK',
        price: 89.99,
        stock: 15,
        attributes: { size: 'M', color: 'Black' }
      },
      {
        id: 'v3',
        name: 'Large Black',
        sku: 'HOOD-001-L-BLK',
        price: 89.99,
        stock: 8,
        attributes: { size: 'L', color: 'Black' }
      },
      {
        id: 'v4',
        name: 'Small White',
        sku: 'HOOD-001-S-WHT',
        price: 89.99,
        stock: 12,
        attributes: { size: 'S', color: 'White' }
      }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    aiScore: 94,
    tags: ['premium', 'streetwear', 'winter', 'cotton', 'organic'],
    seoTitle: 'Premium Streetwear Hoodie - FASHUN.CO',
    seoDescription: 'Shop our premium streetwear hoodie made from organic cotton. Available in multiple sizes and colors.',
    weight: 0.8,
    dimensions: { length: 70, width: 55, height: 2 },
    vendor: 'FASHUN',
    collections: ['streetwear', 'hoodies', 'winter-2024']
  },
  {
    id: '2',
    name: 'Limited Edition Graphic Tee',
    slug: 'limited-edition-graphic-tee',
    sku: 'TEE-002',
    category: 'T-Shirts',
    description: 'Limited edition graphic t-shirt with exclusive FASHUN artwork.',
    price: 49.99,
    status: 'active',
    stock: 0,
    images: ['/api/placeholder/400/403'],
    variants: [
      {
        id: 'v5',
        name: 'Small Black',
        sku: 'TEE-002-S-BLK',
        price: 49.99,
        stock: 0,
        attributes: { size: 'S', color: 'Black' }
      }
    ],
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-18T15:45:00Z',
    aiScore: 88,
    tags: ['limited', 'graphic', 'cotton', 'exclusive'],
    seoTitle: 'Limited Edition Graphic Tee - FASHUN.CO',
    seoDescription: 'Get our exclusive limited edition graphic tee before it\'s gone.',
    weight: 0.2,
    dimensions: { length: 75, width: 50, height: 1 },
    vendor: 'FASHUN',
    collections: ['limited-edition', 't-shirts', 'graphics']
  },
  {
    id: '3',
    name: 'Designer Denim Jacket',
    slug: 'designer-denim-jacket',
    sku: 'JACK-003',
    category: 'Jackets',
    description: 'Premium designer denim jacket with modern streetwear styling.',
    price: 159.99,
    status: 'draft',
    stock: 12,
    images: ['/api/placeholder/400/404'],
    variants: [
      {
        id: 'v6',
        name: 'Medium Blue',
        sku: 'JACK-003-M-BLU',
        price: 159.99,
        stock: 12,
        attributes: { size: 'M', color: 'Blue' }
      }
    ],
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
    aiScore: 91,
    tags: ['designer', 'denim', 'casual', 'jacket'],
    seoTitle: 'Designer Denim Jacket - FASHUN.CO',
    seoDescription: 'Elevate your style with our premium designer denim jacket.',
    weight: 1.2,
    dimensions: { length: 65, width: 60, height: 3 },
    vendor: 'FASHUN',
    collections: ['designer', 'jackets', 'denim']
  }
]

// Helper function to generate slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// Helper function to generate SKUs
function generateSKU(category: string, name: string): string {
  const categoryCode = category.toUpperCase().substring(0, 4)
  const timestamp = Date.now().toString().slice(-4)
  return `${categoryCode}-${timestamp}`
}

// GET - Fetch all products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    
    // Filter products
    let filteredProducts = [...products]
    
    // Status filter
    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.status === status)
    }
    
    // Category filter
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Price range filter
    filteredProducts = filteredProducts.filter(product => {
      const price = product.salePrice || product.price
      return price >= minPrice && price <= maxPrice
    })
    
    // Sorting
    filteredProducts.sort((a, b) => {
      let aVal: any, bVal: any
      
      switch (sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'price':
          aVal = a.salePrice || a.price
          bVal = b.salePrice || b.price
          break
        case 'stock':
          aVal = a.stock
          bVal = b.stock
          break
        case 'aiScore':
          aVal = a.aiScore || 0
          bVal = b.aiScore || 0
          break
        case 'updatedAt':
          aVal = new Date(a.updatedAt)
          bVal = new Date(b.updatedAt)
          break
        default:
          aVal = new Date(a.createdAt)
          bVal = new Date(b.createdAt)
          break
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }
    })
    
    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
    
    // Calculate totals
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / limit)
    
    return NextResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: totalProducts,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          status,
          category,
          search,
          sortBy,
          sortOrder,
          priceRange: { min: minPrice, max: maxPrice }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'price', 'description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }
    
    // Generate new product
    const newProduct = {
      id: (products.length + 1).toString(),
      name: body.name,
      slug: body.slug || generateSlug(body.name),
      sku: body.sku || generateSKU(body.category, body.name),
      category: body.category,
      description: body.description,
      price: parseFloat(body.price),
      salePrice: body.salePrice ? parseFloat(body.salePrice) : undefined,
      status: body.status || 'draft',
      stock: parseInt(body.stock) || 0,
      images: body.images || [],
      variants: body.variants || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiScore: body.aiScore || Math.floor(Math.random() * 20) + 80, // Random AI score for demo
      tags: body.tags || [],
      seoTitle: body.seoTitle || `${body.name} - FASHUN.CO`,
      seoDescription: body.seoDescription || body.description.substring(0, 160),
      weight: parseFloat(body.weight) || 0,
      dimensions: body.dimensions || { length: 0, width: 0, height: 0 },
      vendor: body.vendor || 'FASHUN',
      collections: body.collections || []
    }
    
    // Add to products array
    products.push(newProduct)
    
    return NextResponse.json({
      success: true,
      data: { product: newProduct },
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const productIndex = products.findIndex(product => product.id === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }
    
    // Update slug if name changed
    if (body.name && body.name !== products[productIndex].name) {
      updatedProduct.slug = body.slug || generateSlug(body.name)
    }
    
    products[productIndex] = updatedProduct
    
    return NextResponse.json({
      success: true,
      data: { product: updatedProduct },
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')?.split(',') || []
    
    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No product IDs provided' },
        { status: 400 }
      )
    }
    
    // Filter out products with matching IDs
    const deletedProducts = products.filter(product => ids.includes(product.id))
    products = products.filter(product => !ids.includes(product.id))
    
    if (deletedProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No products found with provided IDs' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { 
        deletedCount: deletedProducts.length,
        deletedProducts: deletedProducts.map(p => ({ id: p.id, name: p.name }))
      },
      message: `${deletedProducts.length} product(s) deleted successfully`
    })
  } catch (error) {
    console.error('Error deleting products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete products' },
      { status: 500 }
    )
  }
}