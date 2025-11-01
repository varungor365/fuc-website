'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ShoppingBag, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  tagged_products?: {
    id: string;
    name: string;
    price: number;
    slug: string;
  }[];
}

interface ShoppableInstagramFeedProps {
  accessToken?: string;
  maxPosts?: number;
}

export default function ShoppableInstagramFeed({
  accessToken,
  maxPosts = 12
}: ShoppableInstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (accessToken) {
      fetchInstagramPosts();
    } else {
      // Use mock data for demonstration
      setPosts(mockInstagramPosts);
      setLoading(false);
    }
  }, [accessToken]);

  const fetchInstagramPosts = async () => {
    try {
      setLoading(true);
      
      // Fetch posts from Instagram Graph API
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,permalink,timestamp,like_count,comments_count&access_token=${accessToken}&limit=${maxPosts}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      
      // Fetch tagged products from your backend for each post
      const postsWithProducts = await Promise.all(
        data.data.map(async (post: any) => {
          try {
            const productsResponse = await fetch(`/api/instagram/tagged-products?post_id=${post.id}`);
            const productsData = await productsResponse.json();
            return {
              ...post,
              tagged_products: productsData.products || []
            };
          } catch {
            return {
              ...post,
              tagged_products: []
            };
          }
        })
      );

      setPosts(postsWithProducts);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
      setError('Failed to load Instagram feed');
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(posts.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(posts.length / 4)) % Math.ceil(posts.length / 4));
  };

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mb-4">
              <Instagram className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-gray-400">Loading Instagram feed...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silently fail - don't show error to users
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30 mb-6">
            <Instagram className="w-6 h-6 text-orange-400" />
            <span className="text-orange-400 font-bold">@fashun.co.in</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Shop Our <span className="text-gradient-primary">Instagram</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get inspired by our latest drops and shop directly from our feed
          </p>
        </motion.div>

        {/* Instagram Grid with Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {posts.length > 4 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all -ml-6 hidden md:block"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all -mr-6 hidden md:block"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Posts Grid */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${currentSlide * 100}%` }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="flex"
            >
              {Array.from({ length: Math.ceil(posts.length / 4) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {posts.slice(slideIndex * 4, slideIndex * 4 + 4).map((post, index) => (
                    <InstagramPostCard
                      key={post.id}
                      post={post}
                      index={index}
                      onClick={() => setSelectedPost(post)}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slide Indicators */}
          {posts.length > 4 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(posts.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'w-8 bg-orange-500' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com/fashun.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover-gradient-lift transition-all shadow-gradient-neon"
          >
            <Instagram className="w-6 h-6" />
            Follow Us on Instagram
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <InstagramPostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function InstagramPostCard({ post, index, onClick }: { post: InstagramPost; index: number; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 hover:border-orange-500 transition-colors">
        {/* Post Image */}
        <Image
          src={post.media_url}
          alt={post.caption || 'Instagram post'}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
            {/* Engagement Stats */}
            <div className="flex items-center gap-6 text-white">
              {post.like_count && (
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="font-bold">{post.like_count}</span>
                </div>
              )}
              {post.comments_count && (
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-bold">{post.comments_count}</span>
                </div>
              )}
            </div>

            {/* Products Badge */}
            {post.tagged_products && post.tagged_products.length > 0 && (
              <div className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {post.tagged_products.length} {post.tagged_products.length === 1 ? 'Product' : 'Products'}
              </div>
            )}
          </div>
        </div>

        {/* Instagram Icon */}
        <div className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full">
          <Instagram className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function InstagramPostModal({ post, onClose }: { post: InstagramPost; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9998]"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl glass-gradient-frosted rounded-3xl border border-white/20 shadow-gradient-glow overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="relative aspect-square md:aspect-auto bg-black">
                <Image
                  src={post.media_url}
                  alt={post.caption || 'Instagram post'}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Right: Details & Products */}
              <div className="p-8 flex flex-col max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold">@fashun.co.in</span>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span className="text-2xl text-white">×</span>
                  </button>
                </div>

                {/* Caption */}
                {post.caption && (
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {post.caption}
                  </p>
                )}

                {/* Tagged Products */}
                {post.tagged_products && post.tagged_products.length > 0 && (
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-white mb-4">
                      Shop This Look
                    </h3>
                    
                    <div className="space-y-4">
                      {post.tagged_products.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500 transition-all group"
                        >
                          <ShoppingBag className="w-12 h-12 text-orange-400 group-hover:scale-110 transition-transform" />
                          <div className="flex-1">
                            <h4 className="text-white font-bold group-hover:text-orange-400 transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-2xl font-black text-gradient-primary">
                              ₹{product.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* View on Instagram */}
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full btn-gradient-primary text-white font-bold py-4 rounded-xl hover-gradient-lift transition-all flex items-center justify-center gap-2"
                >
                  View on Instagram
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// Mock data for demonstration (remove when using real API)
const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    caption: 'New drop alert! 🔥 Check out our latest streetwear collection',
    media_url: '/images/instagram/post1.jpg',
    media_type: 'IMAGE',
    permalink: 'https://instagram.com/p/example1',
    timestamp: '2025-11-01T10:00:00Z',
    like_count: 1234,
    comments_count: 56,
    tagged_products: [
      { id: '1', name: 'Flame Tee', price: 1299, slug: 'flame-tee' }
    ]
  },
  // Add more mock posts...
];
