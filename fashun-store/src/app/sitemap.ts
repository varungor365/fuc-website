import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://fashun.co';
  
  const staticPages = [
    '',
    '/collections/all',
    '/about',
    '/contact',
    '/blog',
    '/faq',
    '/shipping-policy',
    '/returns-policy',
    '/privacy-policy',
    '/terms-of-service',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch products from Medusa
  const products = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/products`)
    .then(res => res.json())
    .then(data => data.products || [])
    .catch(() => []);

  const productPages = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
