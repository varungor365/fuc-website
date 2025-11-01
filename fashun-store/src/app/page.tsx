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

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Announcement Bar */}
      <AnnouncementBar />
      
      {/* Hero Slider - Main Banner */}
      <HeroSlider />
      
      {/* Featured Collections */}
      <section className="py-12 md:py-16">
        <FeaturedCollections />
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <NewArrivals />
      </section>
      
      {/* Trending Products */}
      <section className="py-12 md:py-16">
        <TrendingProducts />
      </section>
      
      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900/20">
        <BrandStory />
      </section>
      
      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <TestimonialsSection />
      </section>
      
      {/* Instagram Feed */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
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
