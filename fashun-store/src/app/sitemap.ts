import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fashun.co';
  
  // Get current date (not future date)
  const currentDate = new Date().toISOString();
  
  // Only include public, indexable pages
  const staticPages = [
    { route: '', priority: 1.0, changeFreq: 'daily' as const },
    { route: '/collections/all', priority: 0.9, changeFreq: 'daily' as const },
    { route: '/about', priority: 0.7, changeFreq: 'monthly' as const },
    { route: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
    { route: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
    { route: '/faq', priority: 0.8, changeFreq: 'monthly' as const },
    { route: '/shipping-policy', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/returns-policy', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/terms-of-service', priority: 0.5, changeFreq: 'monthly' as const },
    { route: '/size-guide', priority: 0.7, changeFreq: 'monthly' as const },
    { route: '/track-order', priority: 0.6, changeFreq: 'weekly' as const },
    { route: '/store-locator', priority: 0.7, changeFreq: 'monthly' as const },
    { route: '/careers', priority: 0.6, changeFreq: 'monthly' as const },
  ].map(({ route, priority, changeFreq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: changeFreq,
    priority: priority,
  }));

  // Fetch products from Medusa
  const products = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/products`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
    .then(res => res.json())
    .then(data => data.products || [])
    .catch((error) => {
      console.error('Error fetching products for sitemap:', error);
      return [];
    });

  const productPages = products.map((product: any) => {
    // Ensure date is valid and not in the future
    let productDate = currentDate;
    try {
      const updatedDate = new Date(product.updated_at);
      if (updatedDate <= new Date()) {
        productDate = updatedDate.toISOString();
      }
    } catch (e) {
      // Use current date if product date is invalid
    }
    
    return {
      url: `${baseUrl}/products/${product.id}`,
      lastModified: productDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    };
  });

  // Fetch collections if available
  const collections = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/collections`, {
    next: { revalidate: 3600 }
  })
    .then(res => res.json())
    .then(data => data.collections || [])
    .catch(() => []);

  const collectionPages = collections.map((collection: any) => {
    let collectionDate = currentDate;
    try {
      const updatedDate = new Date(collection.updated_at);
      if (updatedDate <= new Date()) {
        collectionDate = updatedDate.toISOString();
      }
    } catch (e) {
      // Use current date if collection date is invalid
    }
    
    return {
      url: `${baseUrl}/collections/${collection.handle}`,
      lastModified: collectionDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...collectionPages, ...productPages];
}
