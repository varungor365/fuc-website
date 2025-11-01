import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialProof from '@/components/notifications/SocialProof';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { FloatingDock } from '@/components/ui/dock-navigation';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FASHUN.CO - Premium Streetwear & Custom T-Shirts | India\'s Hottest Fashion Brand',
    template: '%s | FASHUN.CO'
  },
  description: 'India\'s #1 Streetwear Brand! Shop premium printed tees, oversized hoodies, custom designs & exclusive collections. Free shipping, 30-day returns, and unbeatable vibes.',
  keywords: [
    'streetwear India',
    'custom t-shirts',
    'oversized hoodies',
    'printed tees',
    'fashion India',
    'trendy clothing',
    'premium streetwear',
    'custom designs',
    'fashun.co',
    'online shopping India'
  ],
  authors: [{ name: 'FASHUN.CO' }],
  creator: 'FASHUN.CO',
  publisher: 'FASHUN.CO',
  metadataBase: new URL('https://fashun.co'),
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://fashun.co',
    siteName: 'FASHUN.CO',
    title: 'FASHUN.CO - Premium Streetwear & Custom T-Shirts',
    description: 'India\'s Hottest T-Shirt Brand! From Printed Tees to Oversized Hoodies - Premium Quality, Killer Designs.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fashun_co',
    creator: '@fashun_co',
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
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/brand/logo-small.svg', type: 'image/svg+xml', sizes: '32x32' }
    ],
    apple: [
      { url: '/images/brand/logo-small.svg', sizes: '180x180' }
    ],
    shortcut: '/favicon.svg'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <LoadingProvider>
              <Header />
              {children}
              <Footer />
              <SocialProof />
              <FloatingDock
                items={[
                  { 
                    title: 'Home', 
                    icon: <HomeIcon className="w-6 h-6" />, 
                    href: '/' 
                  },
                  { 
                    title: 'Shop', 
                    icon: <ShoppingBagIcon className="w-6 h-6" />, 
                    href: '/products' 
                  },
                  { 
                    title: 'Search', 
                    icon: <MagnifyingGlassIcon className="w-6 h-6" />, 
                    href: '/search' 
                  },
                  { 
                    title: 'Wishlist', 
                    icon: <HeartIcon className="w-6 h-6" />, 
                    href: '/wishlist' 
                  },
                  { 
                    title: 'Account', 
                    icon: <UserIcon className="w-6 h-6" />, 
                    href: '/account' 
                  },
                ]}
              />
              <SpeedInsights />
              <Analytics />
            </LoadingProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}