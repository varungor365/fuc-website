import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { MedusaProvider } from '@/contexts/MedusaContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Streetwear',
  description: 'Discover premium streetwear and exclusive drops at FASHUN.CO',
  keywords: 'streetwear, fashion, clothing, premium, exclusive',
  authors: [{ name: 'FASHUN.CO' }],
  openGraph: {
    title: 'FASHUN.CO - Premium Streetwear',
    description: 'Discover premium streetwear and exclusive drops',
    url: 'https://fashun.co',
    siteName: 'FASHUN.CO',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FASHUN.CO - Premium Streetwear',
    description: 'Discover premium streetwear and exclusive drops',
    images: ['/og-image.jpg'],
  },
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
    canonical: 'https://fashun.co',
  },
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
      <body className={inter.className}>
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
