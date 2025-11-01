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
    <main className="min-h-screen">
      <AnnouncementBar />
      <FeaturedCollections />
      <NewArrivals />
      <TrendingProducts />
      <BrandStory />
      <TestimonialsSection />
      <InstagramFeed />
      <TrustBadges />
      <NewsletterSignup />
    </main>
  );
}
