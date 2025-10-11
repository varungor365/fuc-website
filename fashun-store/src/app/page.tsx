'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon, 
  HeartIcon, 
  StarIcon, 
  ArrowRightIcon, 
  SparklesIcon,
  EyeIcon,
  PlusIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { useFreepikImage, useFreepikImages } from '@/hooks/useFreepik';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string | null;
  trendScore?: number;
  views?: number;
  cartAdds?: number;
  sizes?: string;
}

interface Collection {
  name: string;
  description: string;
  productCount: number;
  image: string;
  href: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  purchase: string;
  avatar: string;
}

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
  caption: string;
}

const curatedCollections: Collection[] = [
  { 
    name: 'Premium Streetwear', 
    description: 'Urban fashion meets premium quality', 
    productCount: 45, 
    image: '/api/freepik?term=urban streetwear fashion&limit=1&type=photo&orientation=horizontal', 
    href: '/collections/streetwear' 
  },
  { 
    name: 'Essential Basics', 
    description: 'Timeless pieces for everyday wear', 
    productCount: 32, 
    image: '/api/freepik?term=basic t-shirt fashion&limit=1&type=photo&orientation=horizontal', 
    href: '/collections/basics' 
  },
  { 
    name: 'Limited Edition', 
    description: 'Exclusive drops you won\'t find anywhere else', 
    productCount: 18, 
    image: '/api/freepik?term=exclusive fashion collection&limit=1&type=photo&orientation=horizontal', 
    href: '/collections/limited-edition' 
  },
  { 
    name: 'Seasonal Collection', 
    description: 'Perfect for the current season', 
    productCount: 28, 
    image: '/api/freepik?term=seasonal fashion trend&limit=1&type=photo&orientation=horizontal', 
    href: '/collections/seasonal' 
  }
];

const shopByCategories = [
  { name: 'Hoodies', desc: 'Premium streetwear hoodies', href: '/collections/hoodies', image: '/api/freepik?term=hoodie sweatshirt urban&limit=1&type=photo&orientation=square' },
  { name: 'T-Shirts', desc: 'Graphic tees and basics', href: '/collections/t-shirts', image: '/api/freepik?term=t-shirt fashion mockup&limit=1&type=photo&orientation=square' },
  { name: 'Jackets', desc: 'Bomber jackets and outerwear', href: '/collections/jackets', image: '/api/freepik?term=jacket bomber fashion&limit=1&type=photo&orientation=square' },
  { name: 'Accessories', desc: 'Caps, bags, and more', href: '/collections/accessories', image: '/api/freepik?term=fashion accessories cap bag&limit=1&type=photo&orientation=square' }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    role: 'Creative Director',
    company: 'Urban Studios',
    location: 'Los Angeles, CA',
    content: 'The quality is absolutely insane! The AI-powered design recommendations helped me find pieces that perfectly match my style. Every item exceeded my expectations.',
    purchase: 'Ethereal Glow Hoodie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Zara Chen',
    role: 'Fashion Blogger',
    company: '',
    location: '',
    content: 'FASHUN has revolutionized my wardrobe. The sustainable materials and cutting-edge designs make every piece a statement. My followers always ask where I get my fits!',
    purchase: 'Quantum Mesh Jacket',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Alex Rivera',
    role: 'Photographer',
    company: '',
    location: '',
    content: 'As someone who\'s always on set, I need clothes that look amazing and perform. FASHUN delivers on both fronts. The attention to detail is phenomenal.',
    purchase: 'Neon Dreams Cargo Set',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

const instagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
    likes: 2847,
    comments: 94,
    caption: 'Streetwear vibes on point 🔥 #FASHUNCO #StreetStyle'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop',
    likes: 1923,
    comments: 67,
    caption: 'New drop landing tomorrow! Stay tuned 👀 #NewDrop'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    likes: 3456,
    comments: 128,
    caption: 'Behind the scenes at our latest photoshoot 📸'
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [dealOfDay, setDealOfDay] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Featured Products (New Arrivals)
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Premium Cotton Oversized Tee',
        price: 1299,
        originalPrice: 1699,
        image: '/images/products/t-shirts/tshirt-1-main.jpg',
        rating: 4.8,
        reviews: 24,
        badge: 'New',
        sizes: '+4 colors'
      },
      {
        id: '2',
        title: 'Streetwear Cargo Pants',
        price: 2499,
        originalPrice: 3199,
        image: '/images/products/jeans/jeans-1-main.jpg',
        rating: 4.6,
        reviews: 18,
        badge: 'Trending',
        sizes: '+3 colors'
      },
      {
        id: '3',
        title: 'Classic Bomber Jacket',
        price: 3999,
        originalPrice: 4999,
        image: '/images/products/jackets/jacket-1-main.jpg',
        rating: 4.9,
        reviews: 32,
        badge: 'Sale',
        sizes: '+3 colors'
      },
      {
        id: '4',
        title: 'Urban Hoodie Collection',
        price: 2199,
        originalPrice: 2799,
        image: '/images/products/hoodies/hoodie-1-main.jpg',
        rating: 4.7,
        reviews: 41,
        badge: 'Limited',
        sizes: '+4 colors'
      }
    ];
    setFeaturedProducts(mockProducts);

    // Trending Products with AI insights
    const mockTrendingProducts: Product[] = [
      {
        id: 'trend1',
        title: 'AI Curated Urban Flex Hoodie',
        price: 2799,
        originalPrice: 3599,
        image: '/images/products/hoodies/hoodie-1-main.jpg',
        rating: 4.9,
        reviews: 89,
        badge: 'AI Pick',
        trendScore: 98,
        views: 1247,
        cartAdds: 89,
        sizes: '+16 sizes'
      },
      {
        id: 'trend2',
        title: 'Smart Tech Cargo Shorts',
        price: 1899,
        originalPrice: 2399,
        image: '/images/products/jeans/jeans-1-main.jpg',
        rating: 4.7,
        reviews: 142,
        badge: 'Viral',
        trendScore: 95,
        views: 2156,
        cartAdds: 142,
        sizes: '4 sizes'
      },
      {
        id: 'trend3',
        title: 'Neo Street Jacket',
        price: 4499,
        originalPrice: 5999,
        image: '/images/products/jackets/jacket-1-main.jpg',
        rating: 4.8,
        reviews: 67,
        badge: 'Hot',
        trendScore: 92,
        views: 987,
        cartAdds: 67,
        sizes: '5 sizes'
      },
      {
        id: 'trend4',
        title: 'Minimalist Daily Tee',
        price: 999,
        originalPrice: 1299,
        image: '/images/products/t-shirts/tshirt-1-main.jpg',
        rating: 4.6,
        reviews: 198,
        badge: 'Rising',
        trendScore: 88,
        views: 3421,
        cartAdds: 198,
        sizes: '+15 sizes'
      },
      {
        id: 'trend5',
        title: 'Future Denim Jeans',
        price: 3299,
        originalPrice: 4199,
        image: '/images/products/jeans/jeans-1-main.jpg',
        rating: 4.7,
        reviews: 112,
        badge: 'Trending',
        trendScore: 90,
        views: 1678,
        cartAdds: 112,
        sizes: '6 sizes'
      },
      {
        id: 'trend6',
        title: 'Cyber Punk Sneakers',
        price: 5999,
        originalPrice: 7999,
        image: '/images/products/accessories/cap-1-main.jpg',
        rating: 4.9,
        reviews: 156,
        badge: 'Limited',
        trendScore: 96,
        views: 2834,
        cartAdds: 156,
        sizes: '6 sizes'
      }
    ];
    setTrendingProducts(mockTrendingProducts);

    // Deal of the Day
    const mockDeal: Product = {
      id: 'deal1',
      title: 'Premium Streetwear Hoodie Collection',
      price: 4499,
      originalPrice: 8999,
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      rating: 4.8,
      reviews: 127,
      badge: '-50%'
    };
    setDealOfDay(mockDeal);

    // Countdown timer
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 23);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <span>🔥 Free Shipping on Orders Above ₹999 - Limited Time Offer!</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hero Section - STREETWEAR REVOLUTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,165,0,0.1)_0%,_transparent_50%)]"
          />
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(255,165,0,0.02)_50%,_transparent_75%)] bg-[length:200%_200%]"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
          <div className="text-center w-full">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.05, 1],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    delay: 0.2,
                    scale: { duration: 2, repeat: Infinity },
                    y: { duration: 2, repeat: Infinity }
                  }}
                  className="inline-block"
                >
                  <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-bold shadow-lg shadow-orange-500/50">
                    🔥 TRENDY & FRESH 🔥
                  </span>
                </motion.div>
                
                <h1 className="text-6xl lg:text-8xl font-black text-white leading-tight">
                  <motion.span 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
                  >
                    STREETWEAR
                  </motion.span>
                  <motion.span 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="block text-white"
                  >
                    REVOLUTION
                  </motion.span>
                </h1>
                
                <div className="max-w-4xl mx-auto space-y-4">
                  <p className="text-2xl lg:text-3xl font-bold text-orange-400">
                    India's Hottest T-Shirt Brand! 🚀
                  </p>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    From Printed Tees to Oversized Hoodies - We've Got Your Streetwear Game Covered. 
                    Premium Quality, Killer Designs, Unbeatable Vibes!
                  </p>
                  <p className="text-lg text-orange-300 font-semibold">
                    ✨ Express Yourself. Stay Fresh. Be Iconic. ✨
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <Link
                    href="/collections/printed-tshirts"
                    className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50"
                  >
                    🛍️ SHOP NOW
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }}
                >
                  <Link
                    href="/collections/all"
                    className="group inline-flex items-center justify-center px-10 py-5 bg-transparent text-white rounded-xl font-bold text-xl border-2 border-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-300"
                  >
                    🎨 EXPLORE ALL
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
                {[
                  { label: 'FREE SHIPPING', desc: 'On orders ₹999+' },
                  { label: '100% AUTHENTIC', desc: 'Original designs' },
                  { label: '4.9★ REVIEWS', desc: '10k+ happy customers' },
                  { label: 'TRENDING STYLES', desc: 'Latest drops weekly' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="text-center cursor-pointer"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="text-lg font-bold text-orange-400"
                    >
                      {stat.label}
                    </motion.div>
                    <div className="text-gray-400 text-sm">{stat.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TruckIcon, title: 'Free Shipping', desc: 'On orders over ₹2,999' },
              { icon: ShieldCheckIcon, title: '30-Day Returns', desc: 'Hassle-free returns' },
              { icon: StarIcon, title: 'Premium Quality', desc: '100% authentic' },
              { icon: HeartIcon, title: '50K+ Customers', desc: 'Trusted by thousands' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                <feature.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Curated Collections</h2>
            <p className="text-xl text-gray-600">Discover our handpicked collections designed to elevate your style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {curatedCollections.map((collection, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  href={collection.href}
                  className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwSDI1MFYyMDBIMTUwVjEwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMjAwIiB5PSIyNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29sbGVjdGlvbjwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-sm font-semibold">{collection.productCount} Products</div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600 transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{collection.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-orange-600">
                        {collection.productCount} Products
                      </span>
                      <motion.div
                        className="text-orange-600 group-hover:translate-x-2 transition-transform duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        Shop Collection →
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collections"
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold mb-4">
              ✨ Fresh Drops
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-xl text-gray-600">Be the first to get your hands on our latest streetwear pieces</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjAwSDI1MFYzMDBIMTUwVjIwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMjAwIiB5PSI0MDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-3 py-1 text-white text-sm font-bold rounded-full ${
                      product.badge === 'New' ? 'bg-green-600' :
                      product.badge === 'Trending' ? 'bg-orange-600' :
                      product.badge === 'Sale' ? 'bg-red-600' :
                      product.badge === 'Limited' ? 'bg-purple-600' :
                      'bg-blue-600'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <span className="text-sm">Quick Add to Cart</span>
                  </button>
                  <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold">({product.reviews})</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors">
                      {product.title}
                    </h3>
                    {(product as any).sizes && (
                      <p className="text-sm text-gray-500">{(product as any).sizes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-green-600">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collections/new-arrivals"
              className="inline-block px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* AI-Powered Trending Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-4">
              Smart Insights Curated
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Intelligent Insights analyze customer behavior, social buzz, and style forecasts to bring you the hottest streetwear pieces
            </p>
            <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live tracking active</span>
              </div>
              <span>•</span>
              <span>Updated hourly</span>
              <span>•</span>
              <span>Global trend analysis</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Trend Score Badge */}
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {product.trendScore}% trend
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`px-3 py-1 text-white text-sm font-bold rounded-full ${
                      product.badge === 'AI Pick' ? 'bg-blue-600' :
                      product.badge === 'Viral' ? 'bg-red-600' :
                      product.badge === 'Hot' ? 'bg-orange-600' :
                      product.badge === 'Rising' ? 'bg-green-600' :
                      product.badge === 'Trending' ? 'bg-purple-600' :
                      'bg-gray-600'
                    }`}>
                      {product.badge}
                    </div>
                  </div>
                  
                  {/* Product Stats */}
                  <div className="absolute bottom-4 left-4 z-10 text-white">
                    <div className="text-sm font-semibold">{product.views}</div>
                    <div className="text-xs opacity-80">Views this week</div>
                    <div className="text-sm font-semibold mt-1">{product.cartAdds}</div>
                    <div className="text-xs opacity-80">Added to cart</div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 z-10">
                    <button className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white transition-all">
                      Quick View
                    </button>
                  </div>
                  
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjAwSDI1MFYzMDBIMTUwVjIwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMjAwIiB5PSI0MDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.sizes}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-green-600">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Want more trending picks?</h3>
              <p className="text-gray-600">Get personalized recommendations based on your style preferences</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/collections/trending"
                className="inline-block px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Explore All Trending
              </Link>
              <button className="inline-block px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all">
                Get My Picks
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative aspect-square lg:aspect-auto">
                  <img
                    src={dealOfDay?.image || '/images/products/hoodies/hoodie-1-main.jpg'}
                    alt={dealOfDay?.title || 'Deal of the Day'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMjUwSDQwMFYzNTBIMjAwVjI1MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMzAwIiB5PSI0NTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVhbCBvZiB0aGUgRGF5PC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                  <div className="absolute top-6 left-6">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      -50%
                    </div>
                  </div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-orange-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
                      Only 23 left!
                    </div>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🔥</span>
                      <span className="text-2xl font-bold text-red-600">Deal of the Day</span>
                    </div>
                    
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {dealOfDay?.title || 'Premium Streetwear Hoodie Collection'}
                    </h2>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{dealOfDay?.rating || 4.8}</span>
                      </div>
                      <span className="text-gray-500">({dealOfDay?.reviews || 127} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl font-bold text-red-600">
                        ₹{dealOfDay?.price || 4499}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{dealOfDay?.originalPrice || 8999}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        Save ₹{(dealOfDay?.originalPrice || 8999) - (dealOfDay?.price || 4499)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Countdown Timer */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Deal Expires In</h3>
                    <p className="text-gray-600 mb-4">Hurry! This exclusive offer won't last long.</p>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Days', value: timeLeft.days.toString().padStart(2, '0') },
                        { label: 'Hours', value: timeLeft.hours.toString().padStart(2, '0') },
                        { label: 'Minutes', value: timeLeft.minutes.toString().padStart(2, '0') },
                        { label: 'Seconds', value: timeLeft.seconds.toString().padStart(2, '0') }
                      ].map((time, i) => (
                        <div key={i} className="text-center">
                          <div className="bg-gray-900 text-white rounded-lg p-4 font-bold text-2xl">
                            {time.value}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">{time.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg"
                    >
                      Add to Cart
                    </motion.button>
                    
                    <Link
                      href={`/products/${dealOfDay?.id || 'premium-streetwear-hoodie'}`}
                      className="block w-full text-center bg-gray-100 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                  
                  {/* Guarantees */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <TruckIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Free Shipping</div>
                      <div className="text-xs text-gray-600">On orders over ₹2,999</div>
                    </div>
                    <div className="text-center">
                      <ArrowRightIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Easy Returns</div>
                      <div className="text-xs text-gray-600">30-day return policy</div>
                    </div>
                    <div className="text-center">
                      <ShieldCheckIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Authentic</div>
                      <div className="text-xs text-gray-600">100% genuine products</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover our curated collections of premium streetwear</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {shopByCategories.map((category, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  href={category.href}
                  className="block text-center"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-sm font-semibold">{category.desc}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-4">
              Customer Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Loved by Creators</h2>
            <p className="text-xl text-gray-600">Join thousands of creatives who've elevated their style with our AI-powered fashion platform</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{testimonial.name}</h4>
                    <p className="text-orange-600 font-semibold">{testimonial.role}</p>
                    {testimonial.company && (
                      <p className="text-gray-600 text-sm">{testimonial.company}</p>
                    )}
                    {testimonial.location && (
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    )}
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Purchased:</span> {testimonial.purchase}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">😊 25,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">⭐ 4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">🔄 87%</div>
              <div className="text-gray-600">Repeat Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">🌍 45+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Community */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Follow Us @fashun.co.in</h2>
            <h3 className="text-2xl font-semibold text-orange-400 mb-4">Street Style Community</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Join thousands of streetwear enthusiasts sharing their FASHUN.CO looks. Tag us and get featured!
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">50K+</div>
                <div className="text-gray-400">followers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">Daily</div>
                <div className="text-gray-400">interactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">User-generated</div>
                <div className="text-gray-400">content</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instagramPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                <img
                  src={post.image}
                  alt={`Instagram post ${i + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      <span className="text-white font-semibold">{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-white font-semibold">{post.comments}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <span className="text-white font-semibold">@fashun.co.in</span>
                  </div>
                  <p className="text-white text-sm">{post.caption}</p>
                  <button className="mt-3 text-orange-400 hover:text-orange-300 transition-colors text-sm font-semibold">
                    View on Instagram
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <h4 className="text-2xl font-bold mb-4">Join Our Community</h4>
            <p className="text-gray-300 mb-6">
              Follow @fashun.co.in for daily style inspiration, behind-the-scenes content, and chances to be featured in our community spotlight!
            </p>
            <Link
              href="https://instagram.com/fashun.co.in"
              className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:from-pink-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Follow @fashun.co.in
            </Link>
            <div className="mt-6">
              <p className="text-gray-400 font-semibold">Share Your Look</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Quality Guarantees */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <h3 className="text-2xl font-semibold text-orange-600 mb-4">Premium Quality Guaranteed</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your security and satisfaction are our top priorities. Experience premium service with every order.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100% Secure</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h4>
              <p className="text-gray-600">
                Bank-level encryption protects all transactions with 256-bit SSL security
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">2-3 Day Delivery</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Fast Shipping</h4>
              <p className="text-gray-600">
                Free express delivery on all orders over ₹4,500. Track your package in real-time
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.8% Quality Score</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h4>
              <p className="text-gray-600">
                Each piece is crafted with sustainable materials and undergoes rigorous quality control
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9★ Rating</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Love</h4>
              <p className="text-gray-600">
                30-day return policy and 24/7 customer support. We're here for you always
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}