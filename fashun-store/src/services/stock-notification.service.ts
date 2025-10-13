export const StockNotificationService = {
  async subscribe(email: string, productId: string, variantId: string) {
    const response = await fetch('/api/stock-notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, productId, variantId })
    });
    return response.json();
  },

  async unsubscribe(email: string, productId: string) {
    await fetch('/api/stock-notifications/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, productId })
    });
  },

  async notifySubscribers(productId: string, variantId: string) {
    await fetch('/api/stock-notifications/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, variantId })
    });
  }
};
