const SEO = {
  title: 'FashUn.Co.in - Premium Streetwear & Custom Apparel',
  description: 'Discover premium streetwear and custom apparel at FashUn.Co.in. Oversized hoodies, tees, and unique prints designed for Gen-Z fashion lovers.',
  canonical: 'https://fashun.co.in',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://fashun.co.in',
    siteName: 'FashUn.Co.in',
    title: 'FashUn.Co.in - Premium Streetwear & Custom Apparel',
    description: 'Discover premium streetwear and custom apparel at FashUn.Co.in. Oversized hoodies, tees, and unique prints designed for Gen-Z fashion lovers.',
    images: [
      {
        url: 'https://fashun.co.in/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FashUn.Co.in - Premium Streetwear',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@fashunco',
    site: '@fashunco',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    {
      name: 'theme-color',
      content: '#0F0F10',
    },
    {
      name: 'msapplication-TileColor',
      content: '#0F0F10',
    },
    {
      name: 'keywords',
      content: 'streetwear, fashion, hoodies, t-shirts, custom apparel, oversized, prints, gen-z fashion, india',
    },
    {
      name: 'author',
      content: 'FashUn.Co.in',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
}

export default SEO
