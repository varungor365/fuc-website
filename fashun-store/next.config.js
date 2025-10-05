/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS 
        ? process.env.NEXT_PUBLIC_IMAGE_HOSTS.split(',').map(hostname => ({
            protocol: 'https',
            hostname: hostname.trim(),
          }))
        : []
      ),
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
