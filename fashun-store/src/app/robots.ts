import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
          '/dashboard/*',
          '/ai-dashboard',
          '/ai-dashboard/*',
          '/_next/*',
          '/studio',
          '/studio/*',
          '/test-auth',
          '/test-auth/*',
          '/demo',
          '/demo/*',
          '/freepik-test',
          '/freepik-test/*',
          '/reliability-demo',
          '/reliability-demo/*',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
          '/dashboard/*',
          '/ai-dashboard',
          '/ai-dashboard/*',
          '/_next/*',
          '/studio',
          '/studio/*',
        ],
      },
    ],
    sitemap: 'https://fashun.co/sitemap.xml',
  }
}
