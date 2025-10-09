import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialProof from '@/components/notifications/SocialProof';

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <Header />
            {children}
            <Footer />
            <SocialProof />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
