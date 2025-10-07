import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SocialProof from '@/components/notifications/SocialProof';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FASHUN.CO.IN - Next-Gen Streetwear Platform',
  description: 'Premium streetwear e-commerce with AI-powered features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SocialProof />
      </body>
    </html>
  );
}
