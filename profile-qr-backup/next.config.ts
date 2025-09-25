import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for deployment independence
  output: 'standalone',
  
  // Image optimization for self-hosting
  images: {
    unoptimized: true,
    domains: [],
  },
  
  // Ensure all routes can be statically generated when possible
  experimental: {
    // Enable static optimization
    optimizeCss: true,
  },
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Disable telemetry for privacy
  telemetry: {
    disabled: true
  },
  
  // Build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Ensure independence from deployment platform
  trailingSlash: false,
  assetPrefix: '',
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
