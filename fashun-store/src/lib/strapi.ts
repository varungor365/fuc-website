import axios from 'axios'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export interface Product {
  id: number
  attributes: {
    name: string
    description: string
    price: number
    sku: string
    stock_quantity: number
    status: 'active' | 'inactive' | 'out_of_stock'
    category: string
    tags: string[]
    seo_title?: string
    seo_description?: string
    images?: {
      data: Array<{
        id: number
        attributes: {
          name: string
          url: string
          alternativeText?: string
        }
      }>
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Category {
  id: number
  attributes: {
    name: string
    description: string
    slug: string
    status: 'active' | 'inactive'
    sort_order: number
    image?: {
      data: {
        id: number
        attributes: {
          name: string
          url: string
          alternativeText?: string
        }
      }
    }
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export interface Order {
  id: number
  attributes: {
    order_number: string
    customer_name: string
    customer_email: string
    customer_phone?: string
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    total_amount: number
    items: any[]
    shipping_address: any
    billing_address: any
    notes?: string
    createdAt: string
    updatedAt: string
  }
}

class StrapiAPI {
  private baseURL: string

  constructor() {
    this.baseURL = STRAPI_URL
  }

  // Products API
  async getProducts(params?: {
    pagination?: { page: number; pageSize: number }
    sort?: string[]
    filters?: any
    populate?: string[]
  }): Promise<{ data: Product[]; meta: any }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/products`, {
        params: {
          ...params,
          populate: params?.populate?.join(',') || 'images'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      // Return mock data if Strapi is not available
      return this.getMockProducts(params)
    }
  }

  async getProduct(id: number, populate?: string[]): Promise<{ data: Product }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/products/${id}`, {
        params: {
          populate: populate?.join(',') || 'images'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  async createProduct(data: Partial<Product['attributes']>): Promise<{ data: Product }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/products`, { data })
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  async updateProduct(id: number, data: Partial<Product['attributes']>): Promise<{ data: Product }> {
    try {
      const response = await axios.put(`${this.baseURL}/api/products/${id}`, { data })
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/api/products/${id}`)
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Categories API
  async getCategories(params?: {
    pagination?: { page: number; pageSize: number }
    sort?: string[]
    filters?: any
    populate?: string[]
  }): Promise<{ data: Category[]; meta: any }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/categories`, {
        params: {
          ...params,
          populate: params?.populate?.join(',') || 'image'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      return this.getMockCategories(params)
    }
  }

  async createCategory(data: Partial<Category['attributes']>): Promise<{ data: Category }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/categories`, { data })
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  async updateCategory(id: number, data: Partial<Category['attributes']>): Promise<{ data: Category }> {
    try {
      const response = await axios.put(`${this.baseURL}/api/categories/${id}`, { data })
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  async deleteCategory(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseURL}/api/categories/${id}`)
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  // Orders API
  async getOrders(params?: {
    pagination?: { page: number; pageSize: number }
    sort?: string[]
    filters?: any
  }): Promise<{ data: Order[]; meta: any }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/orders`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching orders:', error)
      return this.getMockOrders(params)
    }
  }

  async createOrder(data: Partial<Order['attributes']>): Promise<{ data: Order }> {
    try {
      const response = await axios.post(`${this.baseURL}/api/orders`, { data })
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async updateOrder(id: number, data: Partial<Order['attributes']>): Promise<{ data: Order }> {
    try {
      const response = await axios.put(`${this.baseURL}/api/orders/${id}`, { data })
      return response.data
    } catch (error) {
      console.error('Error updating order:', error)
      throw error
    }
  }

  // Mock data fallbacks when Strapi is not available
  private getMockProducts(params?: any): { data: Product[]; meta: any } {
    const mockProducts: Product[] = [
      {
        id: 1,
        attributes: {
          name: 'Premium Cotton T-Shirt',
          description: 'High-quality cotton t-shirt with premium finish',
          price: 2500,
          sku: 'TCT-001',
          stock_quantity: 50,
          status: 'active',
          category: 'T-Shirts',
          tags: ['cotton', 'premium', 'casual'],
          seo_title: 'Premium Cotton T-Shirt - FashUn',
          seo_description: 'Comfortable and stylish premium cotton t-shirt',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          publishedAt: '2024-01-01T00:00:00.000Z'
        }
      },
      {
        id: 2,
        attributes: {
          name: 'Vintage Denim Jacket',
          description: 'Classic vintage-style denim jacket',
          price: 4500,
          sku: 'VDJ-002',
          stock_quantity: 25,
          status: 'active',
          category: 'Jackets',
          tags: ['denim', 'vintage', 'casual'],
          seo_title: 'Vintage Denim Jacket - FashUn',
          seo_description: 'Stylish vintage denim jacket for all occasions',
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          publishedAt: '2024-01-02T00:00:00.000Z'
        }
      }
    ]

    return {
      data: mockProducts,
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: mockProducts.length
        }
      }
    }
  }

  private getMockCategories(params?: any): { data: Category[]; meta: any } {
    const mockCategories: Category[] = [
      {
        id: 1,
        attributes: {
          name: 'T-Shirts',
          description: 'Comfortable t-shirts for everyday wear',
          slug: 't-shirts',
          status: 'active',
          sort_order: 1,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          publishedAt: '2024-01-01T00:00:00.000Z'
        }
      },
      {
        id: 2,
        attributes: {
          name: 'Jackets',
          description: 'Stylish jackets for all seasons',
          slug: 'jackets',
          status: 'active',
          sort_order: 2,
          createdAt: '2024-01-02T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
          publishedAt: '2024-01-02T00:00:00.000Z'
        }
      }
    ]

    return {
      data: mockCategories,
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: mockCategories.length
        }
      }
    }
  }

  private getMockOrders(params?: any): { data: Order[]; meta: any } {
    const mockOrders: Order[] = [
      {
        id: 1,
        attributes: {
          order_number: 'ORD-2024-001',
          customer_name: 'Aarav Sharma',
          customer_email: 'aarav.sharma@email.com',
          customer_phone: '+91 98765 43210',
          status: 'delivered',
          payment_status: 'paid',
          total_amount: 7500,
          items: [
            { product_id: 1, name: 'Premium Cotton T-Shirt', quantity: 2, price: 2500 },
            { product_id: 2, name: 'Vintage Denim Jacket', quantity: 1, price: 4500 }
          ],
          shipping_address: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            postal_code: '400001',
            country: 'India'
          },
          billing_address: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            postal_code: '400001',
            country: 'India'
          },
          notes: 'Please handle with care',
          createdAt: '2024-01-10T10:30:00.000Z',
          updatedAt: '2024-01-15T14:20:00.000Z'
        }
      }
    ]

    return {
      data: mockOrders,
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: mockOrders.length
        }
      }
    }
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/products?pagination[pageSize]=1`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  // Transform Strapi product to simplified format
  transformProduct(product: Product): any {
    return {
      id: product.id,
      name: product.attributes.name,
      description: product.attributes.description,
      price: product.attributes.price,
      sku: product.attributes.sku,
      stock_quantity: product.attributes.stock_quantity,
      status: product.attributes.status,
      category: product.attributes.category,
      categorySlug: product.attributes.category?.toLowerCase().replace(/\s+/g, '-'),
      tags: product.attributes.tags,
      images: product.attributes.images?.data?.map(img => ({
        id: img.id,
        url: img.attributes.url,
        alt: img.attributes.alternativeText || product.attributes.name
      })) || [],
      seo_title: product.attributes.seo_title,
      seo_description: product.attributes.seo_description,
      createdAt: product.attributes.createdAt,
      updatedAt: product.attributes.updatedAt
    }
  }

  // Transform multiple products
  transformProducts(response: { data: Product[] }): any[] {
    return response.data.map(product => this.transformProduct(product))
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<{ data: Product[] }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/products?filters[slug][$eq]=${slug}&populate=*`)
      return response.data
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      throw error
    }
  }

  // Get products by category
  async getProductsByCategory(categorySlug: string, params?: any): Promise<{ data: Product[] }> {
    try {
      const queryParams = new URLSearchParams({
        'filters[category][$containsi]': categorySlug,
        'populate': '*',
        ...params
      })
      
      const response = await axios.get(`${this.baseURL}/api/products?${queryParams}`)
      return response.data
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  }
}

export const strapiAPI = new StrapiAPI()
export default strapiAPI
