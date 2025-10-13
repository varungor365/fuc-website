import Medusa from '@medusajs/medusa-js';

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
});

// You can still keep the mock functions if they are used elsewhere as a fallback,
// but they won't be used by product.service.ts or cart.service.ts anymore.
// For now, I'll remove them to avoid confusion, as the services are now directly using medusaClient.
/*
export async function getProducts(params?: any) {
  return { success: true, data: [] };
}

export async function getProduct(id: string) {
  return { success: true, data: null };
}

export async function createCart() {
  return { success: true, data: { id: 'mock-cart' } };
}

export async function addToCart(cartId: string, variantId: string, quantity: number) {
  return { success: true, data: null };
}

export async function createOrder(cartId: string) {
  return { success: true, data: null };
}

export async function getOrder(id: string) {
  return { success: true, data: null };
}

export async function trackOrder(orderId: string) {
  return { success: true, data: null };
}

export default { getProducts, getProduct, createCart, addToCart, createOrder, getOrder, trackOrder };
*/
