'use client'

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon, HeartIcon, StarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import ParticleBackground from '@/components/animations/ParticleBackground';
import FloatingElements from '@/components/animations/FloatingElements';
import HeroAnimation from '@/components/animations/HeroAnimation';
import MorphingShape from '@/components/animations/MorphingShape';
import ProductCardAnimation from '@/components/animations/ProductCardAnimation';
import InteractiveHero from '@/components/animations/InteractiveHero';
import ScrollReveal from '@/components/animations/ScrollReveal';
import ProductHoverEffect from '@/components/animations/ProductHoverEffect';

const categories = [
  { name: 'T-Shirts', image: '/images/products/t-shirts/tshirt-1-main.jpg', href: '/collections/tshirts', count: '200+ Styles' },
  { name: 'Hoodies', image: '/images/products/hoodies/hoodie-1-main.jpg', href: '/collections/hoodies', count: '150+ Styles' },
  { name: 'Jackets', image: '/images/products/jackets/jacket-1-main.jpg', href: '/collections/jackets', count: '100+ Styles' },
  { name: 'Jeans', image: '/images/products/jeans/jeans-1-main.jpg', href: '/collections/jeans', count: '120+ Styles' },
];

const featuredProducts = [
  { id: 1, name: 'Oversized Graphic Hoodie', price: 1999, originalPrice: 2999, image: '/images/products/hoodies/hoodie-1-main.jpg', badge: 'Bestseller', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Premium Cotton T-Shirt', price: 799, originalPrice: 1299, image: '/images/products/t-shirts/tshirt-1-main.jpg', badge: 'New', rating: 4.9, reviews: 189 },
  { id: 3, name: 'Denim Jacket', price: 2499, originalPrice: 3999, image: '/images/products/jackets/jacket-1-main.jpg', badge: 'Trending', rating: 4.7, reviews: 156 },
  { id: 4, name: 'Slim Fit Jeans', price: 1499, originalPrice: 2499, image: '/images/products/jeans/jeans-1-main.jpg', badge: 'Sale', rating: 4.6, reviews: 203 },
];

const testimonials = [
  { name: 'Rahul Sharma', rating: 5, text: 'Amazing quality! The fabric is so comfortable and the fit is perfect.', image: '/images/avatar-1.jpg' },
  { name: 'Priya Patel', rating: 5, text: 'Fast delivery and great customer service. Will definitely order again!', image: '/images/avatar-2.jpg' },
  { name: 'Amit Kumar', rating: 5, text: 'Best streetwear collection in India. Highly recommended!', image: '/images/avatar-3.jpg' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
        <ParticleBackground />
        <FloatingElements />
        <HeroAnimation />
        <InteractiveHero />
        <MorphingShape />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              ✨ New Collection 2024
            </motion.div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              STREET
              <span className="block text-yellow-300">STYLE</span>
              <span className="block text-5xl md:text-6xl">REVOLUTION</span>
            </h1>
            
            <p className="text-2xl mb-8 text-white/90 max-w-2xl">
              Premium streetwear that defines your style. Shop the latest trends with free shipping on orders over ₹2,999.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                href="/collections/all"
                className="group magnetic-button px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-orange-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-orange-500/50 animate-glow flex items-center gap-2"
              >
                Shop Now
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/collections/new-arrivals"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all flex items-center gap-2"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-4xl font-bold">50K+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div>
                <div className="text-4xl font-bold">4.8★</div>
                <div className="text-white/80">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div>
                <div className="text-4xl font-bold">1000+</div>
                <div className="text-white/80">Products</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-gray-900 text-white">
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
                className="flex items-center gap-4"
              >
                <feature.icon className="w-10 h-10 text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600">Discover your perfect style</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={cat.href}
                  className="group relative block aspect-[3/4] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all card-hover image-zoom"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-3xl font-bold mb-2">{cat.name}</h3>
                    <p className="text-white/80 mb-4">{cat.count}</p>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">Trending Now</h2>
            <p className="text-xl text-gray-600">Handpicked favorites from our collection</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <ProductCardAnimation key={product.id} index={i}>
                <ProductHoverEffect>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gray-100 image-zoom gpu-accelerated">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-sm font-bold rounded-full pulse-glow">
                      {product.badge}
                    </span>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <HeartIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="absolute inset-x-4 bottom-4 py-3 bg-white text-center font-bold rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-orange-500 hover:text-white magnetic-button animate-slide-up"
                  >
                    Quick View
                  </Link>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-bold text-green-600">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                </div>
                </ProductHoverEffect>
              </ProductCardAnimation>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collections/all"
              className="inline-block px-10 py-4 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all transform hover:scale-105 shadow-xl"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Join 50,000+ happy customers</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-xl card-hover gpu-accelerated"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">Verified Buyer</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Upgrade Your Style?</h2>
            <p className="text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
              Join 50,000+ fashion enthusiasts. Get exclusive deals and early access to new collections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-10 py-5 bg-white text-orange-600 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-orange-700 transition-all transform hover:scale-105 shadow-2xl"
              >
                Sign Up Now
              </Link>
              <Link
                href="/collections/all"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all"
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
