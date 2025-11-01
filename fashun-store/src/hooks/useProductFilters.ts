'use client';

import { useMemo } from 'react';
import { ActiveFilters } from '@/components/products/ProductFilters';

interface Product {
  id: string;
  name: string;
  price: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  category?: string;
  createdAt?: string;
  popularity?: number;
}

export function useProductFilters(products: Product[], filters: ActiveFilters) {
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by size
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes?.some(size => filters.sizes.includes(size))
      );
    }

    // Filter by color
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors?.some(color => filters.colors.includes(color.name))
      );
    }

    // Filter by product type
    if (filters.productTypes.length > 0) {
      filtered = filtered.filter(product =>
        product.category && filters.productTypes.includes(product.category)
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }

    return filtered;
  }, [products, filters]);

  return { filteredProducts, totalCount: products.length, filteredCount: filteredProducts.length };
}
