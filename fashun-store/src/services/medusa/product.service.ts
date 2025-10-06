import { medusaClient } from '@/lib/medusa-client';

export const MedusaProductService = {
  async getProducts(params: any = {}) {
    const { products, count } = await medusaClient.products.list(params);
    return { products, count };
  },

  async getProduct(id: string) {
    const { product } = await medusaClient.products.retrieve(id);
    return product;
  },

  async searchProducts(query: string) {
    const { products } = await medusaClient.products.search({ q: query });
    return products;
  },

  async getProductsByCategory(categoryId: string) {
    const { products } = await medusaClient.products.list({
      category_id: [categoryId]
    });
    return products;
  },

  async getProductsByCollection(collectionId: string) {
    const { products } = await medusaClient.products.list({
      collection_id: [collectionId]
    });
    return products;
  }
};
