import { Metadata } from 'next';
import HeroSlider from '@/components/home/HeroSlider';
import AnnouncementBar from '@/components/home/AnnouncementBar';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import NewArrivals from '@/components/home/NewArrivals';
import TrendingProducts from '@/components/home/TrendingProducts';
import BrandStory from '@/components/home/BrandStory';
import PhygitalIdentity from '@/components/home/PhygitalIdentity';
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden transition-colors">
      {/* Premium Background Texture */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Announcement Bar */}
        <AnnouncementBar />
        
        {/* Hero Slider - Main Banner */}
        <HeroSlider />
        
        {/* Featured Collections */}
        <section className="py-12 md:py-16">
          <FeaturedCollections />
        </section>
        
        {/* New Arrivals */}
        <section className="py-12 md:py-16 bg-black/20 backdrop-blur-sm">
          <NewArrivals />
        </section>
        
        {/* Trending Products */}
        <section className="py-12 md:py-16">
          <TrendingProducts />
        </section>
        
        {/* Brand Story */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white/5 to-gray-900/30 backdrop-blur-sm">
          <BrandStory />
        </section>
        
        {/* Phygital Identity */}
        <section className="py-16 md:py-24">
          <PhygitalIdentity />
        </section>
        
        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <TestimonialsSection />
        </section>
        
        {/* Instagram Feed */}
        <section className="py-12 md:py-16 bg-black/20 backdrop-blur-sm">
          <InstagramFeed />
        </section>
        
        {/* Trust Badges */}
        <section className="py-8 md:py-12">
          <TrustBadges />
        </section>
        
        {/* Newsletter Signup */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-white/10 to-gray-800/20 backdrop-blur-sm">
          <NewsletterSignup />
        </section>
      </div>
    </main>
  );
}
