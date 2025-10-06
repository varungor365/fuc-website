// Google Analytics helper functions
export const GA_TRACKING_ID = 'G-PG5EQP2E0W';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track product views
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
}) => {
  // Track in Google Analytics
  event({
    action: 'view_item',
    category: 'ecommerce',
    label: product.name,
    value: product.price,
  });

  // Save to recently viewed
  if (typeof window !== 'undefined') {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = viewed.filter((p: any) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  }
};

// Track add to cart
export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: product.name,
    value: product.price * product.quantity,
  });
};

// Track purchase
export const trackPurchase = (orderId: string, total: number, items: any[]) => {
  event({
    action: 'purchase',
    category: 'ecommerce',
    label: orderId,
    value: total,
  });
};
