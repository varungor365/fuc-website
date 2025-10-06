import { medusaClient } from '@/lib/medusa-client';

export const MedusaOrderService = {
  async retrieve(id: string) {
    const { order } = await medusaClient.orders.retrieve(id);
    return order;
  },

  async retrieveByCartId(cartId: string) {
    const { order } = await medusaClient.orders.retrieveByCartId(cartId);
    return order;
  },

  async lookupOrder(data: { display_id: number; email: string }) {
    const { order } = await medusaClient.orders.lookupOrder(data);
    return order;
  }
};
