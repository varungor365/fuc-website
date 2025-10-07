// Medusa client with mock fallback

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
