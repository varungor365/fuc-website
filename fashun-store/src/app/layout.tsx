import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialProof from '@/components/notifications/SocialProof';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FASHUN.CO.IN - Premium Streetwear E-Commerce',
  description: 'Shop premium streetwear, custom t-shirts, hoodies & more. Free shipping on orders over ₹2,999. 30-day returns.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <SocialProof />
      </body>
    </html>
  );
}
