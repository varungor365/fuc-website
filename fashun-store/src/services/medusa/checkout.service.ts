import { medusaClient } from '@/lib/medusa-client';

export const MedusaCheckoutService = {
  async addShippingAddress(cartId: string, address: any) {
    const { cart } = await medusaClient.carts.update(cartId, {
      shipping_address: address
    });
    return cart;
  },

  async addBillingAddress(cartId: string, address: any) {
    const { cart } = await medusaClient.carts.update(cartId, {
      billing_address: address
    });
    return cart;
  },

  async addEmail(cartId: string, email: string) {
    const { cart } = await medusaClient.carts.update(cartId, { email });
    return cart;
  },

  async getShippingOptions(cartId: string) {
    const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId);
    return shipping_options;
  },

  async addShippingMethod(cartId: string, optionId: string) {
    const { cart } = await medusaClient.carts.addShippingMethod(cartId, {
      option_id: optionId
    });
    return cart;
  },

  async createPaymentSessions(cartId: string) {
    const { cart } = await medusaClient.carts.createPaymentSessions(cartId);
    return cart;
  },

  async setPaymentSession(cartId: string, providerId: string) {
    const { cart } = await medusaClient.carts.setPaymentSession(cartId, {
      provider_id: providerId
    });
    return cart;
  },

  async completeCart(cartId: string) {
    const { type, data } = await medusaClient.carts.complete(cartId);
    if (type === 'order') {
      localStorage.removeItem('cart_id');
    }
    return { type, order: data };
  }
};
