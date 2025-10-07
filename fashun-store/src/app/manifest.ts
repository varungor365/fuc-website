import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FASHUN.CO - Premium Streetwear',
    short_name: 'FASHUN.CO',
    description: 'India\'s premier streetwear destination with premium t-shirts, hoodies, and custom apparel',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F10',
    theme_color: '#E4C590',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
