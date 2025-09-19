/** @type {import('next').NextConfig} */
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true,
//   scope: '/',
//   sw: 'sw.js',
//   customWorkerDir: 'public',
//   runtimeCaching: [
//     {
//       urlPattern: /^https?.*\.(png|jpe?g|webp|svg|gif|ico)$/,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'images',
//         expiration: {
//           maxEntries: 64,
//           maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
//         }
//       }
//     },
//     {
//       urlPattern: /^https?.*\.(js|css)$/,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'static-resources',
//         expiration: {
//           maxEntries: 32,
//           maxAgeSeconds: 24 * 60 * 60 // 1 day
//         }
//       }
//     },
//     {
//       urlPattern: /^https?:\/\/localhost:1337\/api\/products/,
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'api-products',
//         expiration: {
//           maxEntries: 100,
//           maxAgeSeconds: 5 * 60 // 5 minutes
//         }
//       }
//     },
//     {
//       urlPattern: /^https?:\/\/localhost:1337\/api\/(categories|collections)/,
//       handler: 'CacheFirst',
//       options: {
//         cacheName: 'api-static',
//         expiration: {
//           maxEntries: 50,
//           maxAgeSeconds: 60 * 60 // 1 hour
//         }
//       }
//     }
//   ]
// })

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https', 
        hostname: 'fashun.co.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Bundle optimization configuration
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
    optimizePackageImports: ['@heroicons/react', 'lucide-react', 'framer-motion'],
  },
  // Webpack optimization for bundle size
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Analyze bundle size in development
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
        })
      );
    }

    // Simplified optimization - let Next.js handle tree shaking
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    };

    // Optimize imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    return config;
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com *.google-analytics.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' *.vercel-analytics.com *.google-analytics.com;",
          },
          // HTTP/2+ Performance Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Enable Server Push for critical resources
          {
            key: 'Link',
            value: '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin, </fonts/montserrat.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
          },
          // Compression headers
          {
            key: 'Content-Encoding',
            value: 'br, gzip',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Static assets cache headers for HTTP/2 optimization
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images cache optimization
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/shipping',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/returns',
        destination: '/return-policy',
        permanent: true,
      },
      {
        source: '/collections/tees',
        destination: '/collections/tshirts',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
// module.exports = withPWA(nextConfig);
