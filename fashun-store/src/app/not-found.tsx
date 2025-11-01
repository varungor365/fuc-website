import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search, Home, TrendingUp, ShoppingBag, Sparkles, Flame } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Page Not Found | FASHUN',
  description: 'Lost in style? Discover India\'s premium streetwear collection at fashun.co.in',
};

// Smart 404 page with product suggestions based on URL
export default function NotFound() {
  // Popular products fallback
  const popularProducts = [
    {
      id: 'oversized-graphic-hoodie',
      name: 'Oversized Graphic Hoodie',
      price: 2999,
      image: '/api/placeholder/300/400',
      category: 'Hoodies'
    },
    {
      id: 'minimalist-t-shirt',
      name: 'Minimalist T-Shirt',
      price: 1299,
      image: '/api/placeholder/300/400',
      category: 'T-Shirts'
    },
    {
      id: 'classic-denim-jacket',
      name: 'Classic Denim Jacket',
      price: 3999,
      image: '/api/placeholder/300/400',
      category: 'Jackets'
    },
    {
      id: 'streetwear-joggers',
      name: 'Streetwear Joggers',
      price: 2499,
      image: '/api/placeholder/300/400',
      category: 'Pants'
    }
  ];

  const popularCategories = [
    { name: 'Hoodies', href: '/collections/hoodies', icon: '🔥' },
    { name: 'T-Shirts', href: '/collections/tshirts', icon: '👕' },
    { name: 'Jeans', href: '/collections/jeans', icon: '👖' },
    { name: 'Sneakers', href: '/collections/sneakers', icon: '👟' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-hero-cosmic opacity-30"></div>
      <div className="absolute inset-0 pattern-gradient-dots opacity-10"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-8">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 className="text-9xl md:text-[200px] font-black text-gradient-fire mb-4 leading-none">
                404
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Page Not Found
                </h2>
                <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
              </div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Looks like you've wandered off the streetwear runway. 
              Let's get you back to the fire drops! 🔥
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 btn-gradient-primary text-white font-bold rounded-xl hover-gradient-lift transition-all shadow-gradient-neon text-lg"
            >
              <Home className="w-6 h-6 mr-2" />
              Back to Homepage
            </Link>
            <Link
              href="/collections/all"
              className="inline-flex items-center px-8 py-4 glass-gradient-dark text-white font-bold rounded-xl hover-gradient-lift transition-all border border-white/20 text-lg"
            >
              <ShoppingBag className="w-6 h-6 mr-2" />
              Shop All Products
            </Link>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-8 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <span className="text-gradient-primary">Hot Collections</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group glass-gradient-frosted rounded-2xl border border-white/20 p-8 hover-gradient-lift transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-white mb-8 text-center">
            <span className="text-gradient-fire">Trending Drops</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group glass-gradient-dark rounded-2xl border border-white/10 overflow-hidden hover-gradient-lift transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{product.category}</p>
                  <p className="font-black text-2xl text-gradient-primary">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="glass-gradient-frosted rounded-3xl border border-white/20 p-10 text-center shadow-gradient-glow">
          <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-6 animate-pulse" />
          <h3 className="text-2xl font-black text-white mb-4">
            Need Help Finding Something?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Our team is ready to help you discover the perfect streetwear pieces. 
            Hit us up!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 btn-gradient-primary text-white font-bold rounded-xl hover-gradient-lift transition-all shadow-gradient-neon"
            >
              Contact Support
            </Link>
            <Link
              href="/size-guide"
              className="inline-flex items-center px-8 py-4 glass-gradient-dark text-white font-bold rounded-xl hover-gradient-lift transition-all border border-white/20"
            >
              Size Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}