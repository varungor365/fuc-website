import { medusaClient } from '@/lib/medusa-client';

export const MedusaCartService = {
  async createCart(regionId?: string) {
    const { cart } = await medusaClient.carts.create({ region_id: regionId });
    localStorage.setItem('cart_id', cart.id);
    return cart;
  },

  async getCart(cartId: string) {
    const { cart } = await medusaClient.carts.retrieve(cartId);
    return cart;
  },

  async addItem(cartId: string, variantId: string, quantity: number) {
    const { cart } = await medusaClient.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity
    });
    return cart;
  },

  async updateItem(cartId: string, lineId: string, quantity: number) {
    const { cart } = await medusaClient.carts.lineItems.update(cartId, lineId, { quantity });
    return cart;
  },

  async removeItem(cartId: string, lineId: string) {
    const { cart } = await medusaClient.carts.lineItems.delete(cartId, lineId);
    return cart;
  },

  async getOrCreateCart() {
    const cartId = localStorage.getItem('cart_id');
    if (cartId) {
      try {
        return await this.getCart(cartId);
      } catch {
        return await this.createCart();
      }
    }
    return await this.createCart();
  }
};
