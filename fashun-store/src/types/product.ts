// Canonical product type definitions for FASHUN platform
// All components must use these interfaces for consistency

export interface ColorVariant {
  id: string;
  name: string;
  colorCode: string;
  image?: string;
  stock: number;
}

export interface SizeVariant {
  id: string;
  name: string;
  stock: number;
  price?: number; // Additional price for this size variant
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isMain?: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful?: number;
}

export interface ProductFeature {
  id: string;
  name: string;
  description?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface ProductTag {
  id: string;
  name: string;
  color?: string;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  slug: string;
}

export interface ProductPricing {
  price: number;
  originalPrice?: number;
  currency: string;
  compareAtPrice?: number;
  costPrice?: number;
}

export interface ProductInventory {
  sku: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity?: number;
  allowBackorder: boolean;
  lowStockThreshold?: number;
}

export interface ProductShipping {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  requiresShipping: boolean;
  shippingClass?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: ProductInventory;
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  images: ProductImage[];
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  
  // Categorization
  category: string;
  subcategory?: string;
  tags: ProductTag[];
  collections?: string[];
  
  // Pricing and Inventory
  pricing: ProductPricing;
  inventory: ProductInventory;
  
  // Media
  images: ProductImage[];
  
  // Variants
  colors: ColorVariant[];
  sizes: SizeVariant[];
  variants?: ProductVariant[];
  
  // Features and Attributes
  features: ProductFeature[];
  materials?: string[];
  careInstructions?: string[];
  
  // Status and Flags
  status: 'draft' | 'active' | 'archived';
  inStock: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  
  // Reviews and Ratings
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
  
  // SEO and Meta
  seo: ProductSEO;
  
  // Shipping
  shipping: ProductShipping;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Collection and Category interfaces
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productIds: string[];
  isActive: boolean;
  sortOrder?: number;
  seo?: ProductSEO;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  subcategories?: string[];
  productCount?: number;
  isActive: boolean;
  sortOrder?: number;
  seo?: ProductSEO;
}

// Utility types for data transformation
export type ProductListItem = Pick<Product, 
  | 'id' 
  | 'name' 
  | 'pricing' 
  | 'images' 
  | 'rating' 
  | 'reviewCount'
  | 'inStock'
  | 'isNew'
  | 'isLimited'
  | 'isFeatured'
  | 'isOnSale'
  | 'seo'
>;

export type ProductCardData = ProductListItem & {
  category: string;
  colors: ColorVariant[];
  sizes: SizeVariant[];
};

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  price: number;
  name: string;
  image: string;
};

// API Response types
export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    categories: Category[];
    priceRange: { min: number; max: number };
    sizes: string[];
    colors: string[];
  };
}

export interface ProductSearchParams {
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'rating' | 'newest' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Data transformation utilities
export class ProductTransformer {
  static toLegacyFormat(product: Product): any {
    return {
      id: product.id,
      name: product.name,
      price: product.pricing.price,
      originalPrice: product.pricing.originalPrice,
      description: product.description,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      category: product.category,
      subcategory: product.subcategory,
      images: product.images.map(img => img.url),
      colors: product.colors.map(color => color.name),
      sizes: product.sizes.map(size => size.name),
      features: product.features.map(feature => feature.name),
      isNew: product.isNew,
      isLimited: product.isLimited,
      tags: product.tags.map(tag => tag.name),
      sku: product.inventory.sku
    };
  }

  static fromLegacyFormat(legacyProduct: any): Product {
    return {
      id: legacyProduct.id,
      name: legacyProduct.name,
      description: legacyProduct.description || '',
      category: legacyProduct.category || 'uncategorized',
      subcategory: legacyProduct.subcategory,
      
      pricing: {
        price: legacyProduct.price || 0,
        originalPrice: legacyProduct.originalPrice,
        currency: 'INR'
      },
      
      inventory: {
        sku: legacyProduct.sku || `SKU-${legacyProduct.id}`,
        trackQuantity: true,
        quantity: legacyProduct.stock || 0,
        allowBackorder: false
      },
      
      images: (legacyProduct.images || []).map((url: string, index: number) => ({
        id: `${legacyProduct.id}-img-${index}`,
        url,
        alt: legacyProduct.name,
        isMain: index === 0
      })),
      
      colors: (legacyProduct.colors || []).map((colorName: string, index: number) => ({
        id: `color-${index}`,
        name: colorName,
        colorCode: '#000000', // Default, should be updated with actual color codes
        stock: 10 // Default stock
      })),
      
      sizes: (legacyProduct.sizes || []).map((sizeName: string, index: number) => ({
        id: `size-${index}`,
        name: sizeName,
        stock: 10 // Default stock
      })),
      
      features: (legacyProduct.features || []).map((featureName: string, index: number) => ({
        id: `feature-${index}`,
        name: featureName
      })),
      
      tags: (legacyProduct.tags || []).map((tagName: string, index: number) => ({
        id: `tag-${index}`,
        name: tagName
      })),
      
      status: 'active',
      inStock: legacyProduct.inStock ?? true,
      isNew: legacyProduct.isNew,
      isLimited: legacyProduct.isLimited,
      isFeatured: legacyProduct.isFeatured,
      isOnSale: !!legacyProduct.originalPrice,
      
      rating: legacyProduct.rating,
      reviewCount: legacyProduct.reviewCount || 0,
      
      seo: {
        slug: legacyProduct.slug || legacyProduct.id,
        title: legacyProduct.name,
        description: legacyProduct.description
      },
      
      shipping: {
        requiresShipping: true,
        weight: 0.5 // Default weight
      },
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static toCardData(product: Product): ProductCardData {
    return {
      id: product.id,
      name: product.name,
      pricing: product.pricing,
      images: product.images,
      rating: product.rating,
      reviewCount: product.reviewCount,
      inStock: product.inStock,
      isNew: product.isNew,
      isLimited: product.isLimited,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      seo: product.seo,
      category: product.category,
      colors: product.colors,
      sizes: product.sizes
    };
  }
}