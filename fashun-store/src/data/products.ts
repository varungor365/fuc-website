// Legacy products.ts file - Re-exports from mockProducts.ts for compatibility
// This file maintains backward compatibility while we migrate to the new structure

import { mockProducts } from './mockProducts';

export * from './mockProducts';
export { mockProducts as products, mockProducts as default };

// Export categories from config with backward compatibility
export { productCategories as categories } from '../config/products';

// Legacy categories structure for backward compatibility
export const legacyCategories = {
  'hoodies': {
    name: 'Hoodies',
    description: 'Premium streetwear hoodies',
    subcategories: ['pullover-hoodies', 'zip-up-hoodies', 'oversized-hoodies']
  },
  't-shirts': {
    name: 'T-Shirts', 
    description: 'Trendy graphic tees',
    subcategories: ['graphic-tees', 'plain-tees', 'vintage-tees']
  },
  'jackets': {
    name: 'Jackets',
    description: 'Urban outerwear collection',
    subcategories: ['bomber-jackets', 'denim-jackets', 'windbreakers']
  },
  'pants': {
    name: 'Pants',
    description: 'Comfortable streetwear pants',
    subcategories: ['joggers', 'cargo-pants', 'jeans']
  },
  'shoes': {
    name: 'Shoes',
    description: 'Street-ready footwear', 
    subcategories: ['sneakers', 'boots', 'sandals']
  },
  'accessories': {
    name: 'Accessories',
    description: 'Complete your look',
    subcategories: ['hats', 'bags', 'jewelry', 'belts']
  }
};
