'use client';

import * as React from 'react';
import { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

interface DealProduct {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  href: string;
  badge?: string;
  stockCount?: number;
}

const dealProduct: DealProduct = {
  id: 'deal-of-day-1',
  name: 'Premium Streetwear Hoodie Collection',
  originalPrice: 199.99,
  salePrice: 99.99,
  rating: 4.8,
  reviewCount: 127,
  image: '/images/products/hoodies/deal-hoodie.jpg',
  href: '/products/premium-streetwear-hoodie',
  badge: '50% OFF',
  stockCount: 23
};

const DealOfTheDay: React.FC = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = Math.round(((dealProduct.originalPrice - dealProduct.salePrice) / dealProduct.originalPrice) * 100);

  // Deal expires in 24 hours
  const dealExpiry = new Date();
  dealExpiry.setHours(dealExpiry.getHours() + 24);

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Deal of the Day
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Exclusive daily deals on premium streetwear. Limited time, limited stock.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden group">
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discount}%
                </span>
              </div>

              {/* Stock Badge */}
              {dealProduct.stockCount && dealProduct.stockCount < 50 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Only {dealProduct.stockCount} left!
                  </span>
                </div>
              )}

              <img
                src={dealProduct.image}
                alt={dealProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xODcuNSAxODcuNUgzMTIuNVYzMTIuNUgxODcuNVYxODcuNVoiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                }}
              />

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-3">
                  <Link
                    href={dealProduct.href}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`backdrop-blur-sm p-3 rounded-full transition-colors ${
                      isWishlisted
                        ? 'bg-red-500/80 text-white'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <Heart className={isWishlisted ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div>
              <Link href={dealProduct.href}>
                <h3 className="text-2xl md:text-3xl font-bold text-white hover:text-primary-400 transition-colors mb-3">
                  {dealProduct.name}
                </h3>
              </Link>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(dealProduct.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  {dealProduct.rating} ({dealProduct.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-primary-400">
                  ${dealProduct.salePrice}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ${dealProduct.originalPrice}
                </span>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save ${(dealProduct.originalPrice - dealProduct.salePrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <CountdownTimer
              targetDate={dealExpiry}
              title="Deal Expires In"
              description="Hurry! This exclusive offer won't last long."
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <Link
                href={dealProduct.href}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 px-8 rounded-lg font-bold text-lg border border-white/20 transition-colors text-center"
              >
                View Details
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-primary-400 font-bold text-lg">Free Shipping</div>
                <div className="text-gray-400 text-sm">On orders over $100</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-primary-400 font-bold text-lg">Easy Returns</div>
                <div className="text-gray-400 text-sm">30-day return policy</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-primary-400 font-bold text-lg">Authentic</div>
                <div className="text-gray-400 text-sm">100% genuine products</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;