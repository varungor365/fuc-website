import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { MedusaProvider } from '@/contexts/MedusaContext';
import { inter, montserrat, playfair } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://fashun.co.in'),
  title: {
    default: 'FASHUN.CO - Premium Streetwear | T-Shirts, Hoodies & Custom Apparel',
    template: '%s | FASHUN.CO'
  },
  description: 'India\'s premier streetwear destination. Shop premium printed t-shirts, oversized hoodies, and custom apparel. Free shipping on orders ₹999+. 30-day returns.',
  keywords: ['streetwear india', 'printed t-shirts', 'oversized hoodies', 'custom apparel', 'premium clothing', 'fashun.co.in', 'online fashion store'],
  authors: [{ name: 'FASHUN.CO', url: 'https://fashun.co.in' }],
  creator: 'FASHUN.CO',
  publisher: 'FASHUN.CO',
  openGraph: {
    title: 'FASHUN.CO - Premium Streetwear | T-Shirts, Hoodies & Custom Apparel',
    description: 'India\'s premier streetwear destination. Shop premium printed t-shirts, oversized hoodies, and custom apparel.',
    url: 'https://fashun.co.in',
    siteName: 'FASHUN.CO',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630,
      alt: 'FASHUN.CO Premium Streetwear'
    }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fashunco',
    creator: '@fashunco',
    title: 'FASHUN.CO - Premium Streetwear',
    description: 'India\'s premier streetwear destination',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'fashion',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://fashun.co.in',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E4C590',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} ${montserrat.variable} ${playfair.variable} font-sans`}>
        <MedusaProvider>
          {children}
          <Toaster position="top-right" />
        </MedusaProvider>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "FASHUN.CO",
              "url": "https://fashun.co",
              "logo": "https://fashun.co/logo.png",
              "sameAs": [
                "https://instagram.com/fashunco",
                "https://twitter.com/fashunco",
                "https://facebook.com/fashunco"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
