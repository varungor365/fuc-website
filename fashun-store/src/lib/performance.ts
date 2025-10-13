export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    const { name, value, id } = metric;
    
    // Send to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(name === 'CLS' ? value * 1000 : value),
        event_label: id,
        non_interaction: true,
      });
    }

    // Log critical metrics
    if (name === 'LCP' && value > 2500) {
      console.warn(`LCP is slow: ${value}ms`);
    }
    if (name === 'FID' && value > 100) {
      console.warn(`FID is slow: ${value}ms`);
    }
    if (name === 'CLS' && value > 0.1) {
      console.warn(`CLS is high: ${value}`);
    }
  }
}

export function preloadImage(src: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

export function prefetchRoute(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}
