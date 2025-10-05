/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://fashun.co.in',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/cart',
          '/checkout',
          '/account',
          '/track-order',
          '/_next/',
          '/api/auth/',
          '/api/orders/',
          '/api/payments/',
          '/private',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/cart',
          '/checkout', 
          '/account',
          '/track-order',
        ],
      },
    ],
    // Remove non-existent additional sitemaps to avoid 404s
    // additionalSitemaps: [
    //   'https://fashun.co.in/server-sitemap-index.xml',
    // ],
  },
  exclude: [
    '/cart',
    '/checkout',
    '/account',
    '/account/*',
    '/track-order',
    '/api/*',
    '/admin/*',
    '/_next/*',
    '/private',
  ],
  additionalPaths: async (config) => {
    const result = []

    // Add dynamic product pages - these would come from Strapi in production
    const products = [
      'oversized-graphic-hoodie',
      'distressed-denim-jeans', 
      'platform-sneakers',
      'minimalist-t-shirt',
      'classic-denim-jacket',
      'designer-leather-jacket',
      'vintage-band-tee',
      'streetwear-joggers'
    ]

    products.forEach((productSlug) => {
      result.push({
        loc: `/products/${productSlug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })
    })

    // Add all collection pages
    const collections = [
      'all',
      'hoodies', 
      'tshirts',
      'jeans',
      'sneakers',
      'jackets',
      'accessories',
      'tees',
      'polos'
    ]

    collections.forEach((collection) => {
      result.push({
        loc: `/collections/${collection}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      })
    })

    // Add feature pages
    const featurePages = [
      '/lookbook',
      '/designer',
      '/contests', 
      '/shop-the-look',
      '/ugc',
      '/search'
    ]

    featurePages.forEach((page) => {
      result.push({
        loc: page,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      })
    })

    // Add static pages
    const staticPages = [
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
      '/shipping-policy', 
      '/return-policy',
      '/size-guide',
      '/faq'
    ]

    staticPages.forEach((page) => {
      result.push({
        loc: page,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      })
    })

    return result
  },
  transform: async (config, path) => {
    // Custom priority and change frequency for different page types
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          {
            href: 'https://fashun.co.in',
            hreflang: 'en',
          },
        ],
      }
    }

    if (path.startsWith('/collections/')) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/products/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    if (['/lookbook', '/designer', '/contests', '/shop-the-look'].includes(path)) {
      return {
        loc: path,
        changefreq: 'weekly', 
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }

    if (['/about', '/contact', '/privacy-policy', '/terms-of-service', '/shipping-policy', '/return-policy'].includes(path)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      }
    }

    // Default
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: new Date().toISOString(),
    }
  },
}
