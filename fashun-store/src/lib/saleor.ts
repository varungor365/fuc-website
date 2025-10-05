/**
 * Saleor GraphQL API Client for FASHUN.CO
 * High-performance, GraphQL-first headless e-commerce integration
 */

import { GraphQLClient } from 'graphql-request';

// Saleor GraphQL Client Configuration
const SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL || 'http://localhost:8000/graphql/';
const SALEOR_CHANNEL_SLUG = process.env.SALEOR_CHANNEL_SLUG || 'default-channel';
const SALEOR_AUTH_TOKEN = process.env.SALEOR_AUTH_TOKEN || '';

// Create GraphQL client
const graphQLClient = new GraphQLClient(SALEOR_API_URL, {
  headers: {
    'Authorization': SALEOR_AUTH_TOKEN ? `Bearer ${SALEOR_AUTH_TOKEN}` : '',
    'Content-Type': 'application/json',
  },
});

// TypeScript Interfaces for Saleor
export interface SaleorProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  pricing?: {
    priceRange?: {
      start?: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
  };
  thumbnail?: {
    url: string;
    alt?: string;
  };
  images?: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  collections?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  variants?: Array<{
    id: string;
    name: string;
    sku?: string;
    pricing?: {
      price?: {
        gross: {
          amount: number;
          currency: string;
        };
      };
    };
    quantityAvailable?: number;
  }>;
  attributes: Array<{
    attribute: {
      id: string;
      name: string;
      slug: string;
    };
    values: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
  isAvailable?: boolean;
  availableForPurchase?: string;
  weight?: {
    unit: string;
    value: number;
  };
  rating?: number;
  created: string;
  updatedAt: string;
}

export interface SaleorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: {
    edges: Array<{
      node: SaleorCategory;
    }>;
  };
  products?: {
    totalCount?: number;
    edges: Array<{
      node: SaleorProduct;
    }>;
  };
}

export interface SaleorCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  products?: {
    totalCount?: number;
    edges: Array<{
      node: SaleorProduct;
    }>;
  };
}

export interface SaleorCheckout {
  id: string;
  token: string;
  email?: string;
  shippingAddress?: SaleorAddress;
  billingAddress?: SaleorAddress;
  isShippingRequired: boolean;
  availableShippingMethods: Array<{
    id: string;
    name: string;
    price: {
      amount: number;
      currency: string;
    };
  }>;
  availablePaymentGateways: Array<{
    id: string;
    name: string;
    currencies: string[];
  }>;
  lines: Array<{
    id: string;
    quantity: number;
    variant: {
      id: string;
      name: string;
      product: {
        name: string;
        thumbnail?: {
          url: string;
        };
      };
      pricing?: {
        price?: {
          gross: {
            amount: number;
            currency: string;
          };
        };
      };
    };
    totalPrice: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  }>;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  subtotalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  shippingPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
}

export interface SaleorAddress {
  id?: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  postalCode: string;
  country: {
    code: string;
    country: string;
  };
  countryArea?: string;
  phone?: string;
  companyName?: string;
}

export interface SaleorOrder {
  id: string;
  number: string;
  status: string;
  created: string;
  userEmail?: string;
  shippingAddress?: SaleorAddress;
  billingAddress?: SaleorAddress;
  lines: Array<{
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: {
      gross: {
        amount: number;
        currency: string;
      };
    };
    totalPrice: {
      gross: {
        amount: number;
        currency: string;
      };
    };
  }>;
  total: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  shippingPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  paymentStatus: string;
  fulfillments: Array<{
    id: string;
    status: string;
    trackingNumber?: string;
  }>;
}

// GraphQL Queries
export const PRODUCTS_QUERY = `
  query Products($first: Int, $channel: String!, $filter: ProductFilterInput, $sortBy: ProductOrder) {
    products(first: $first, channel: $channel, filter: $filter, sortBy: $sortBy) {
      edges {
        node {
          id
          name
          slug
          description
          seoTitle
          seoDescription
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          thumbnail {
            url
            alt
          }
          images {
            id
            url
            alt
          }
          category {
            id
            name
            slug
          }
          collections {
            id
            name
            slug
          }
          variants {
            id
            name
            sku
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
            quantityAvailable
          }
          attributes {
            attribute {
              id
              name
              slug
            }
            values {
              id
              name
              slug
            }
          }
          isAvailable
          availableForPurchase
          weight {
            unit
            value
          }
          rating
          created
          updatedAt
        }
      }
      totalCount
    }
  }
`;

export const PRODUCT_QUERY = `
  query Product($id: ID, $slug: String, $channel: String!) {
    product(id: $id, slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      seoTitle
      seoDescription
      pricing {
        priceRange {
          start {
            gross {
              amount
              currency
            }
          }
        }
      }
      thumbnail {
        url
        alt
      }
      images {
        id
        url
        alt
      }
      category {
        id
        name
        slug
      }
      collections {
        id
        name
        slug
      }
      variants {
        id
        name
        sku
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
        }
        quantityAvailable
      }
      attributes {
        attribute {
          id
          name
          slug
        }
        values {
          id
          name
          slug
        }
      }
      isAvailable
      availableForPurchase
      weight {
        unit
        value
      }
      rating
      created
      updatedAt
    }
  }
`;

export const CATEGORIES_QUERY = `
  query Categories($first: Int) {
    categories(first: $first) {
      edges {
        node {
          id
          name
          slug
          description
          seoTitle
          seoDescription
          backgroundImage {
            url
            alt
          }
          parent {
            id
            name
            slug
          }
          children {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
          products {
            totalCount
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($first: Int, $channel: String!) {
    collections(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          slug
          description
          seoTitle
          seoDescription
          backgroundImage {
            url
            alt
          }
          products {
            totalCount
          }
        }
      }
    }
  }
`;

export const CHECKOUT_CREATE_MUTATION = `
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        token
        email
        isShippingRequired
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              name
              thumbnail {
                url
              }
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          totalPrice {
            gross {
              amount
              currency
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
        subtotalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const CHECKOUT_LINE_ADD_MUTATION = `
  mutation CheckoutLinesAdd($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(checkoutId: $checkoutId, lines: $lines) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              name
              thumbnail {
                url
              }
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          totalPrice {
            gross {
              amount
              currency
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Saleor Service Class
export class SaleorService {
  private client: GraphQLClient;
  private channel: string;

  constructor() {
    this.client = graphQLClient;
    this.channel = SALEOR_CHANNEL_SLUG;
  }

  // Products
  async getProducts(params?: {
    first?: number;
    search?: string;
    category?: string;
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    sortBy?: {
      field: string;
      direction: 'ASC' | 'DESC';
    };
  }): Promise<SaleorProduct[]> {
    try {
      const variables: any = {
        first: params?.first || 12,
        channel: this.channel,
        filter: {},
        sortBy: params?.sortBy || { field: 'CREATED_AT', direction: 'DESC' }
      };

      if (params?.search) {
        variables.filter.search = params.search;
      }

      if (params?.category) {
        variables.filter.categories = [params.category];
      }

      if (params?.collection) {
        variables.filter.collections = [params.collection];
      }

      if (params?.minPrice || params?.maxPrice) {
        variables.filter.price = {};
        if (params.minPrice) variables.filter.price.gte = params.minPrice;
        if (params.maxPrice) variables.filter.price.lte = params.maxPrice;
      }

      if (params?.isAvailable !== undefined) {
        variables.filter.isAvailable = params.isAvailable;
      }

      const data = await this.client.request(PRODUCTS_QUERY, variables);
      return (data as any).products.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error fetching products from Saleor:', error);
      throw error;
    }
  }

  async getProduct(id?: string, slug?: string): Promise<SaleorProduct | null> {
    try {
      const variables: any = {
        channel: this.channel
      };

      if (id) variables.id = id;
      if (slug) variables.slug = slug;

      const data = await this.client.request(PRODUCT_QUERY, variables);
      return (data as any).product;
    } catch (error) {
      console.error('Error fetching product from Saleor:', error);
      throw error;
    }
  }

  async searchProducts(query: string, limit: number = 20): Promise<SaleorProduct[]> {
    return this.getProducts({
      first: limit,
      search: query
    });
  }

  // Categories
  async getCategories(first: number = 20): Promise<SaleorCategory[]> {
    try {
      const data = await this.client.request(CATEGORIES_QUERY, { first });
      return (data as any).categories.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error fetching categories from Saleor:', error);
      throw error;
    }
  }

  // Collections
  async getCollections(first: number = 20): Promise<SaleorCollection[]> {
    try {
      const data = await this.client.request(COLLECTIONS_QUERY, { 
        first, 
        channel: this.channel 
      });
      return (data as any).collections.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error fetching collections from Saleor:', error);
      throw error;
    }
  }

  // Checkout Operations
  async createCheckout(lines: Array<{ variantId: string; quantity: number }>): Promise<SaleorCheckout> {
    try {
      const variables = {
        input: {
          channel: this.channel,
          lines: lines.map(line => ({
            variantId: line.variantId,
            quantity: line.quantity
          }))
        }
      };

      const data = await this.client.request(CHECKOUT_CREATE_MUTATION, variables);
      
      if ((data as any).checkoutCreate.errors.length > 0) {
        throw new Error((data as any).checkoutCreate.errors[0].message);
      }

      return (data as any).checkoutCreate.checkout;
    } catch (error) {
      console.error('Error creating checkout in Saleor:', error);
      throw error;
    }
  }

  async addToCheckout(checkoutId: string, lines: Array<{ variantId: string; quantity: number }>): Promise<SaleorCheckout> {
    try {
      const variables = {
        checkoutId,
        lines: lines.map(line => ({
          variantId: line.variantId,
          quantity: line.quantity
        }))
      };

      const data = await this.client.request(CHECKOUT_LINE_ADD_MUTATION, variables);
      
      if ((data as any).checkoutLinesAdd.errors.length > 0) {
        throw new Error((data as any).checkoutLinesAdd.errors[0].message);
      }

      return (data as any).checkoutLinesAdd.checkout;
    } catch (error) {
      console.error('Error adding to checkout in Saleor:', error);
      throw error;
    }
  }

  // Utility Methods
  formatPrice(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  }

  getImageUrl(url: string, size?: string): string {
    if (!url) return '';
    
    // Saleor supports image transformations via URL parameters
    if (size && url.includes('/media/')) {
      const [base, filename] = url.split('/media/');
      return `${base}/media/__sized__/${size}/${filename}`;
    }
    
    return url;
  }
}

// Export singleton instance
export const saleorService = new SaleorService();

// Export default instance
export default saleorService;