import { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import NewArrivals from '@/components/home/NewArrivals';
import TrendingProducts from '@/components/home/TrendingProducts';
import BrandStory from '@/components/home/BrandStory';
import InstagramFeed from '@/components/home/InstagramFeed';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import TrustBadges from '@/components/home/TrustBadges';

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Streetwear & Custom T-Shirts | India\'s Hottest Fashion Brand',
  description: 'India\'s #1 Streetwear Brand! Shop premium printed tees, oversized hoodies, custom designs & exclusive collections. Free shipping, 30-day returns, and unbeatable vibes. Fashion that speaks your language.',
  keywords: [
    'streetwear India',
    'custom t-shirts',
    'oversized hoodies',
    'printed tees',
    'fashion India',
    'trendy clothing',
    'premium streetwear',
    'custom designs',
    'fashun.co'
  ],
  openGraph: {
    title: 'FASHUN.CO - Premium Streetwear & Custom T-Shirts',
    description: 'India\'s Hottest T-Shirt Brand! From Printed Tees to Oversized Hoodies - Premium Quality, Killer Designs.',
    url: 'https://fashun.co',
    siteName: 'FASHUN.CO',
    images: [
      {
        url: 'https://fashun.co/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FASHUN.CO - Premium Streetwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FASHUN.CO - Premium Streetwear & Custom T-Shirts',
    description: 'India\'s Hottest T-Shirt Brand! From Printed Tees to Oversized Hoodies.',
    images: ['https://fashun.co/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://fashun.co',
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
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white transition-colors">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Hero Slider - Main Banner */}
      <HeroSlider />
      
      {/* Featured Collections */}
      <section className="py-12 md:py-16">
        <FeaturedCollections />
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 md:py-16 bg-gray-50">
        <NewArrivals />
      </section>
      
      {/* Trending Products */}
      <section className="py-12 md:py-16">
        <TrendingProducts />
      </section>
      
      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <BrandStory />
      </section>
      
      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <TestimonialsSection />
      </section>
      
      {/* Instagram Feed */}
      <section className="py-12 md:py-16 bg-gray-50">
        <InstagramFeed />
      </section>
      
      {/* Trust Badges */}
      <section className="py-8 md:py-12">
        <TrustBadges />
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <NewsletterSignup />
      </section>
    </main>
  );
}
