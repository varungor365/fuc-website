import { medusaClient } from '@/lib/medusa-client';
import { Product } from '@medusajs/medusa';

// Define PricedProduct locally if it's not correctly exported or causing conflicts
// This is a simplified version, you might need to add more properties based on actual Medusa API response
interface CustomPricedProduct extends Product {
  variants: any[]; // Replace 'any' with a more specific type if available
  prices: any[]; // Replace 'any' with a more specific type if available
  // Add other properties that come with PricedProduct if needed
}

export const MedusaProductService = {
  async getProducts(): Promise<CustomPricedProduct[]> {
    const { products } = await medusaClient.products.list();
    return products as CustomPricedProduct[];
  },

  async getProduct(id: string): Promise<CustomPricedProduct | null> {
    try {
      const { product } = await medusaClient.products.retrieve(id);
      return product as CustomPricedProduct;
    } catch (error) {
      console.error(`Failed to retrieve product with ID ${id}:`, error);
      return null;
    }
  }
};

// Export individual functions for backward compatibility
export const getProducts = MedusaProductService.getProducts;
export const getProduct = MedusaProductService.getProduct;
