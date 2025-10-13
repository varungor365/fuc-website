export const trackEvent = (eventName: string, properties?: any) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(eventName, properties);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track('pageview', { url });
  }
};

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('product_view', {
    product_id: productId,
    product_name: productName,
  });
};

export const trackAddToCart = (productId: string, quantity: number, price: number) => {
  trackEvent('add_to_cart', {
    product_id: productId,
    quantity,
    price,
  });
};

export const trackPurchase = (orderId: string, total: number, items: number) => {
  trackEvent('purchase', {
    order_id: orderId,
    total,
    items,
  });
};

export const trackSearch = (query: string, results: number) => {
  trackEvent('search', {
    query,
    results,
  });
};
