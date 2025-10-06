import Medusa from '@medusajs/medusa-js';

const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000',
  maxRetries: 3,
});

export async function getProducts(params?: any) {
  try {
    const { products } = await medusaClient.products.list(params);
    return { success: true, data: products };
  } catch (error: any) {
    console.error('Medusa products fetch failed:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getProduct(id: string) {
  try {
    const { product } = await medusaClient.products.retrieve(id);
    return { success: true, data: product };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function createCart() {
  try {
    const { cart } = await medusaClient.carts.create();
    return { success: true, data: cart };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  try {
    const { cart } = await medusaClient.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity
    });
    return { success: true, data: cart };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function createOrder(cartId: string) {
  try {
    const { order } = await medusaClient.carts.complete(cartId);
    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function getOrder(id: string) {
  try {
    const { order } = await medusaClient.orders.retrieve(id);
    return { success: true, data: order };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export async function trackOrder(orderId: string) {
  try {
    const { order } = await medusaClient.orders.retrieve(orderId);
    return {
      success: true,
      data: {
        status: order.fulfillment_status,
        trackingNumber: order.fulfillments?.[0]?.tracking_numbers?.[0]?.value,
        trackingUrl: order.fulfillments?.[0]?.tracking_links?.[0]?.url,
        carrier: order.fulfillments?.[0]?.provider_id
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message, data: null };
  }
}

export default medusaClient;
