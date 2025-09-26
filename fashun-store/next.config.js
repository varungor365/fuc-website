/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      }
    ],
  },
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  webpack: (config, { isServer }) => {
    // Handle client-side only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
      };
    }

    // External packages that should not be bundled
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'fabric': 'fabric',
        'konva': 'konva',
        'canvas': 'canvas'
      });
    }

    return config;
  },
}

module.exports = nextConfig
