import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from '@/contexts/theme-context';
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
  title: 'FASHUN.CO.IN - Premium Streetwear',
  description: 'India\'s Hottest T-Shirt Brand! From Printed Tees to Oversized Hoodies - Premium Quality, Killer Designs, Unbeatable Vibes!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}