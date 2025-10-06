import { medusaClient } from '@/lib/medusa-client';

export const BundleService = {
  async suggestBundle(productId: string) {
    try {
      const { product } = await medusaClient.products.retrieve(productId);
      
      const category = product.categories?.[0]?.id;
      const tags = product.tags?.map(t => t.value) || [];
      
      const { products } = await medusaClient.products.list({
        category_id: category ? [category] : undefined,
        limit: 5,
      });
      
      const complementary = products.filter(p => 
        p.id !== productId && 
        this.isComplementary(product, p)
      );
      
      return complementary.map(p => ({
        ...p,
        bundleDiscount: 15,
        bundlePrice: Math.round(p.variants[0].prices[0].amount * 0.85)
      }));
    } catch (error) {
      return [];
    }
  },

  isComplementary(product1: any, product2: any) {
    const complementaryPairs: Record<string, string[]> = {
      'hoodie': ['cap', 'joggers', 'sneakers'],
      'tshirt': ['jeans', 'shorts', 'cap'],
      'jacket': ['hoodie', 'jeans', 'boots'],
      'cap': ['hoodie', 'tshirt', 'jacket'],
    };
    
    const type1 = product1.type?.value?.toLowerCase() || '';
    const type2 = product2.type?.value?.toLowerCase() || '';
    
    return complementaryPairs[type1]?.includes(type2) || false;
  },

  async createBundle(productIds: string[]) {
    const bundleDiscount = 0.15;
    const products = await Promise.all(
      productIds.map(id => medusaClient.products.retrieve(id))
    );
    
    const totalPrice = products.reduce((sum, { product }) => 
      sum + product.variants[0].prices[0].amount, 0
    );
    
    return {
      products: products.map(p => p.product),
      originalPrice: totalPrice,
      bundlePrice: Math.round(totalPrice * (1 - bundleDiscount)),
      savings: Math.round(totalPrice * bundleDiscount),
      discount: bundleDiscount * 100
    };
  }
};
