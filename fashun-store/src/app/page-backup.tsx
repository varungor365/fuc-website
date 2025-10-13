'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon, HeartIcon, StarIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  badge: string | null;
}

const categories = [
  { name: 'T-Shirts', image: '/images/products/t-shirts/tshirt-1-main.jpg', href: '/collections/tshirts', count: '200+' },
  { name: 'Hoodies', image: '/images/products/hoodies/hoodie-1-main.jpg', href: '/collections/hoodies', count: '150+' },
  { name: 'Jackets', image: '/images/products/jackets/jacket-1-main.jpg', href: '/collections/jackets', count: '100+' },
  { name: 'Jeans', image: '/images/products/jeans/jeans-1-main.jpg', href: '/collections/jeans', count: '120+' },
];

const collections = [
  { name: 'New Arrivals', desc: 'Latest drops & fresh designs', icon: SparklesIcon, href: '/collections/new-arrivals' },
  { name: 'Best Sellers', desc: 'Customer favorites', icon: StarIcon, href: '/collections/best-sellers' },
  { name: 'Sale', desc: 'Up to 50% off', icon: ShoppingBagIcon, href: '/collections/sale' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        title: 'Urban Streetwear Hoodie',
        price: 2499,
        originalPrice: 3499,
        image: '/images/products/hoodies/hoodie-1-main.jpg',
        rating: 4.8,
        reviews: 124,
        badge: 'Bestseller'
      },
      {
        id: '2',
        title: 'Graphic Print Tee',
        price: 899,
        originalPrice: 1299,
        image: '/images/products/t-shirts/tshirt-1-main.jpg',
        rating: 4.6,
        reviews: 89,
        badge: 'New'
      },
      {
        id: '3',
        title: 'Denim Jacket Classic',
        price: 3999,
        originalPrice: 5499,
        image: '/images/products/jackets/jacket-1-main.jpg',
        rating: 4.9,
        reviews: 67,
        badge: 'Sale'
      },
      {
        id: '4',
        title: 'Slim Fit Jeans',
        price: 1999,
        originalPrice: 2999,
        image: '/images/products/jeans/jeans-1-main.jpg',
        rating: 4.7,
        reviews: 156,
        badge: null
      }
    ];
    setFeaturedProducts(mockProducts);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Clean and Modern */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#3b82f6_1px,_transparent_1px)] bg-[size:3rem_3rem]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold"
                >
                  ✨ New Collection 2024
                </motion.span>
                
                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                  Express Your
                  <span className="block text-blue-600">Style</span>
                  <span className="block text-2xl lg:text-3xl font-normal text-gray-600 mt-2">
                    with Premium Streetwear
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg">
                  Discover premium quality clothing that speaks your language. 
                  From casual tees to statement hoodies.
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/collections/all"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Shop Now
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/customize"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Customize Yourself
                  </Link>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.8★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-gray-600">Products</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="/images/products/hoodies/hoodie-1-main.jpg"
                  alt="Hero Product"
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDYwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMzUwSDM1MFY0NTBIMjUwVjM1MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMzAwIiB5PSI1NTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SGVybyBQcm9kdWN0PC90ZXh0Pgo8L3N2Zz4=';
                  }}
                />
              </div>
              
              {/* Subtle Background Decorations */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-20" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-200 rounded-full opacity-20" />
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

      {/* Collections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Collection</h2>
            <p className="text-xl text-gray-600">Curated collections for every style</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={col.href}
                  className="group block p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <col.icon className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{col.name}</h3>
                  <p className="text-gray-600">{col.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover your perfect style</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={cat.href}
                  className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjAwSDI1MFYzMDBIMTUwVjIwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMjAwIiB5PSI0MDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2F0ZWdvcnk8L3RleHQ+Cjwvc3ZnPg==';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                    <p className="text-white/80 mb-3">{cat.count} Styles</p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                      Shop Now <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-xl text-gray-600">Handpicked favorites from our collection</p>
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
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDQwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMjAwSDI1MFYzMDBIMTUwVjIwMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHR5cHQgeD0iMjAwIiB5PSI0MDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+';
                    }}
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">{product.title}</h3>
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

          <div className="text-center mt-12">
            <Link
              href="/collections/all"
              className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Style?</h2>
            <p className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto">
              Join 50,000+ fashion enthusiasts. Get exclusive deals and early access to new collections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign Up Now
              </Link>
              <Link
                href="/collections/all"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-all"
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}