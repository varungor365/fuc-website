// Strapi API integration service for FashUn store

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

class StrapiService {
  constructor() {
    this.baseURL = `${STRAPI_URL}/api`;
    this.headers = {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.headers,
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Strapi API Error:', error);
      
      // Return fallback data during build time if Strapi is unavailable
      if (process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
        return this.getFallbackData(endpoint);
      }
      
      throw error;
    }
  }

  getFallbackData(endpoint) {
    // Fallback data for when Strapi is unavailable during build
    if (endpoint.includes('/products')) {
      return {
        data: [
          {
            id: 1,
            attributes: {
              slug: 'oversized-graphic-hoodie',
              name: 'Oversized Graphic Hoodie',
              description: 'Comfortable oversized hoodie with unique graphic design',
              price: 2999,
              category: 'hoodies'
            }
          },
          {
            id: 2,
            attributes: {
              slug: 'minimalist-t-shirt',
              name: 'Minimalist T-Shirt',
              description: 'Clean, minimalist design t-shirt',
              price: 1299,
              category: 'tshirts'
            }
          },
          {
            id: 3,
            attributes: {
              slug: 'classic-denim-jacket',
              name: 'Classic Denim Jacket',
              description: 'Timeless denim jacket with modern fit',
              price: 3999,
              category: 'jackets'
            }
          }
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: 3
          }
        }
      };
    }
    
    if (endpoint.includes('/collections')) {
      return {
        data: [
          {
            id: 1,
            attributes: {
              slug: 'hoodies',
              name: 'Hoodies',
              description: 'Comfortable and stylish hoodies'
            }
          },
          {
            id: 2,
            attributes: {
              slug: 'tshirts',
              name: 'T-Shirts',
              description: 'Premium quality t-shirts'
            }
          }
        ]
      };
    }
    
    // Default fallback
    return { data: [] };
  }

  // Product methods
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    
    // Default population
    searchParams.append('populate[0]', 'featured_image');
    searchParams.append('populate[1]', 'gallery');
    searchParams.append('populate[2]', 'category');
    searchParams.append('populate[3]', 'subcategory');
    searchParams.append('populate[4]', 'tags');
    
    // Add custom params
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    });

    return this.request(`/products?${searchParams}`);
  }

  async getProduct(id, params = {}) {
    const searchParams = new URLSearchParams();
    
    // Full population for single product
    searchParams.append('populate[0]', 'featured_image');
    searchParams.append('populate[1]', 'gallery');
    searchParams.append('populate[2]', 'category');
    searchParams.append('populate[3]', 'subcategory');
    searchParams.append('populate[4]', 'tags');
    searchParams.append('populate[5]', 'variations');
    searchParams.append('populate[6]', 'attributes');
    searchParams.append('populate[7]', 'reviews');
    searchParams.append('populate[8]', 'related_products');
    
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    return this.request(`/products/${id}?${searchParams}`);
  }

  async getProductBySlug(slug) {
    return this.request(`/products?filters[slug][$eq]=${slug}&populate=*`);
  }

  async getFeaturedProducts() {
    return this.getProducts({
      'filters[featured][$eq]': true,
      'sort[0]': 'menu_order:asc'
    });
  }

  async getNewArrivals(limit = 12) {
    return this.getProducts({
      'filters[new_arrival][$eq]': true,
      'sort[0]': 'createdAt:desc',
      'pagination[limit]': limit
    });
  }

  async getBestsellers(limit = 12) {
    return this.getProducts({
      'filters[bestseller][$eq]': true,
      'sort[0]': 'average_rating:desc',
      'pagination[limit]': limit
    });
  }

  async getProductsByCategory(categorySlug, params = {}) {
    return this.getProducts({
      'filters[category][slug][$eq]': categorySlug,
      ...params
    });
  }

  async searchProducts(query, params = {}) {
    return this.getProducts({
      'filters[$or][0][name][$containsi]': query,
      'filters[$or][1][description][$containsi]': query,
      'filters[$or][2][short_description][$containsi]': query,
      ...params
    });
  }

  // Category methods
  async getCategories(params = {}) {
    const searchParams = new URLSearchParams();
    
    searchParams.append('populate[0]', 'image');
    searchParams.append('populate[1]', 'banner');
    searchParams.append('populate[2]', 'parent');
    searchParams.append('populate[3]', 'children');
    
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    return this.request(`/categories?${searchParams}`);
  }

  async getCategory(id) {
    return this.request(`/categories/${id}?populate=*`);
  }

  async getCategoryBySlug(slug) {
    return this.request(`/categories?filters[slug][$eq]=${slug}&populate=*`);
  }

  // Review methods
  async getProductReviews(productId, params = {}) {
    return this.request(`/reviews?filters[product][$eq]=${productId}&populate=*&${new URLSearchParams(params)}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify({ data: reviewData })
    });
  }

  // Inventory methods (admin only)
  async updateInventory(productId, inventoryData) {
    return this.request(`/products/${productId}/inventory`, {
      method: 'PUT',
      body: JSON.stringify({ data: inventoryData })
    });
  }

  async getLowStockProducts() {
    return this.request('/products/inventory/low-stock');
  }

  // CRUD operations for admin
  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify({ data: productData })
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: productData })
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE'
    });
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify({ data: categoryData })
    });
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: categoryData })
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE'
    });
  }

  // Utility methods
  getImageUrl(image) {
    if (!image) return null;
    
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${STRAPI_URL}${image}`;
    }
    
    if (image.url) {
      return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
    }
    
    return null;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Transform Strapi product data to frontend format
  transformProduct(strapiProduct) {
    if (!strapiProduct) return null;

    const { id, attributes } = strapiProduct;
    
    return {
      id,
      name: attributes.name,
      slug: attributes.slug,
      description: attributes.description,
      short_description: attributes.short_description,
      price: attributes.price,
      sale_price: attributes.sale_price,
      originalPrice: attributes.price,
      sku: attributes.sku,
      stock_quantity: attributes.stock_quantity,
      stock_status: attributes.stock_status,
      inStock: attributes.stock_status === 'in_stock',
      isLowStock: attributes.is_low_stock,
      isOutOfStock: attributes.is_out_of_stock,
      discountPercentage: attributes.discount_percentage,
      
      // Images
      image: this.getImageUrl(attributes.featured_image?.data),
      images: attributes.gallery?.data?.map(img => this.getImageUrl(img)) || [],
      
      // Category & Tags
      category: attributes.category?.data?.attributes?.name,
      categorySlug: attributes.category?.data?.attributes?.slug,
      subcategory: attributes.subcategory?.data?.attributes?.name,
      tags: attributes.tags?.data?.map(tag => tag.attributes.name) || [],
      
      // Product details
      colors: attributes.colors || [],
      sizes: attributes.sizes || [],
      materials: attributes.materials || [],
      weight: attributes.weight,
      dimensions: attributes.dimensions,
      care_instructions: attributes.care_instructions,
      
      // Reviews & Ratings
      rating: attributes.average_rating || 0,
      reviews: attributes.review_count || 0,
      
      // Status flags
      featured: attributes.featured,
      new_arrival: attributes.new_arrival,
      bestseller: attributes.bestseller,
      on_sale: attributes.on_sale,
      
      // SEO
      seo_title: attributes.seo_title,
      seo_description: attributes.seo_description,
      seo_keywords: attributes.seo_keywords,
      
      // Dates
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt
    };
  }

  transformProducts(strapiProducts) {
    if (!strapiProducts?.data) return [];
    return strapiProducts.data.map(product => this.transformProduct(product));
  }
}

export const strapiService = new StrapiService();
export default strapiService;
