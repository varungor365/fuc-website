import type { Product } from '@/data/mockProducts';

interface FilterOptions {
  category?: string
  priceRange?: { min: number; max: number }
  colors?: string[]
  sizes?: string[]
  brands?: string[]
  badges?: string[]  // 'new', 'bestseller', 'sale'
}

/**
 * Apply multiple filters to a product array
 */
export function applyFilters(products: Product[], filters: FilterOptions): Product[] {
  return products.filter(product => {
    // Category filter
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    // Colors filter
    if (filters.colors && filters.colors.length > 0) {
      const hasMatchingColor = product.colors.some(c => filters.colors!.includes(c.name));
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Sizes filter
    if (filters.sizes && filters.sizes.length > 0) {
      const hasMatchingSize = product.sizes.some(s => filters.sizes!.includes(s.name));
      if (!hasMatchingSize) {
        return false;
      }
    }

    // Brands filter
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // Badges filter (OR logic - product matches if it has ANY selected badge)
    if (filters.badges && filters.badges.length > 0) {
      const matchesBadge = filters.badges.some(badge => {
        switch (badge) {
          case 'new':
            return product.isNew;
          case 'bestseller':
            return product.isBestseller;
          case 'sale':
            return product.isOnSale;
          default:
            return false;
        }
      });
      if (!matchesBadge) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort products based on the selected sort strategy
 */
export function sortProducts(products: Product[], sortBy: string): Product[] {
  const sortedProducts = products.slice(); // Don't mutate original array

  switch (sortBy) {
    case 'popularity':
      return sortedProducts.sort((a, b) => 
        (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount)
      );

    case 'price_asc':
      return sortedProducts.sort((a, b) => a.price - b.price);

    case 'price_desc':
      return sortedProducts.sort((a, b) => b.price - a.price);

    case 'rating':
      return sortedProducts.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Tiebreaker: more reviews = higher ranking
        return b.reviewsCount - a.reviewsCount;
      });

    case 'newest':
      return sortedProducts.sort((a, b) => {
        // New products first
        if (a.isNew !== b.isNew) {
          return b.isNew ? 1 : -1;
        }
        // Then by ID (higher ID = newer, assuming string IDs are sequential)
        return b.id.localeCompare(a.id, undefined, { numeric: true });
      });

    case 'trending':
      return sortedProducts.sort((a, b) => {
        // Priority: bestseller > new > sale
        const getPriority = (product: Product) => {
          if (product.isBestseller) return 3;
          if (product.isNew) return 2;
          if (product.isOnSale) return 1;
          return 0;
        };
        
        const priorityDiff = getPriority(b) - getPriority(a);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Tiebreaker: rating
        return b.rating - a.rating;
      });

    default:
      return sortedProducts;
  }
}

/**
 * Extract unique filter options from a product array
 */
export function getUniqueFilterOptions(products: Product[]) {
  const colors = Array.from(
    new Set(products.flatMap(p => p.colors.map(c => c.name)))
  ).map(name => {
    const colorObj = products.flatMap(p => p.colors).find(c => c.name === name);
    return {
      name,
      value: colorObj?.value || name
    };
  });

  const sizes = Array.from(
    new Set(products.flatMap(p => p.sizes.map(s => s.name)))
  ).sort();

  const brands = Array.from(
    new Set(products.map(p => p.brand))
  ).sort();

  const prices = products.map(p => p.price);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };

  const categories = Array.from(
    new Set(products.map(p => p.category))
  );

  return {
    colors,
    sizes,
    brands,
    priceRange,
    categories
  };
}

/**
 * Build filter groups configuration for SmartFilters component
 */
export function buildFilterGroups(products: Product[]): any[] {
  const options = getUniqueFilterOptions(products);

  return [
    {
      id: 'price',
      title: 'Price Range',
      type: 'range',
      min: 0,
      max: Math.ceil(options.priceRange.max / 100) * 100, // Round up to nearest 100
      step: 100,
      value: [options.priceRange.min, options.priceRange.max]
    },
    {
      id: 'colors',
      title: 'Colors',
      type: 'color',
      options: options.colors.map(color => ({
        label: color.name,
        value: color.name,
        color: color.value
      }))
    },
    {
      id: 'sizes',
      title: 'Sizes',
      type: 'checkbox',
      options: options.sizes.map(size => ({
        label: size,
        value: size,
        count: products.filter(p => p.sizes.some(s => s.name === size)).length
      }))
    },
    {
      id: 'brands',
      title: 'Brands',
      type: 'checkbox',
      options: options.brands.map(brand => ({
        label: brand,
        value: brand,
        count: products.filter(p => p.brand === brand).length
      }))
    },
    {
      id: 'badges',
      title: 'Product Type',
      type: 'checkbox',
      options: [
        {
          label: 'New Arrivals',
          value: 'new',
          count: products.filter(p => p.isNew).length
        },
        {
          label: 'Best Sellers',
          value: 'bestseller',
          count: products.filter(p => p.isBestseller).length
        },
        {
          label: 'On Sale',
          value: 'sale',
          count: products.filter(p => p.isOnSale).length
        }
      ].filter(option => option.count > 0) // Only show badges that exist
    }
  ].filter(group => {
    // Filter out empty groups
    if (group.type === 'checkbox' && group.options.length === 0) return false;
    if (group.type === 'color' && group.options.length === 0) return false;
    return true;
  });
}

export type { FilterOptions };