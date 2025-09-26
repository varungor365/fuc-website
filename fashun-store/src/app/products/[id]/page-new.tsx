'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon, 
  ShareIcon, 
  TruckIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Props {
  params: { id: string }
}

// Mock product data for stable testing - E-commerce focused
const mockProducts = {
  '1': {
    id: 1,
    name: 'Oversized Graphic Tee - Neon Dreams',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    description: 'Premium cotton oversized fit with vibrant neon graphics. Perfect for street style enthusiasts who want to make a statement. This tee features high-quality digital printing that won\'t fade or crack over time.',
    category: 'T-Shirts',
    badge: 'BESTSELLER',
    rating: 4.8,
    reviews: 2847,
    images: [
      '/api/placeholder/600/750',
      '/api/placeholder/600/750',
      '/api/placeholder/600/750',
      '/api/placeholder/600/750'
    ],
    colors: [
      { name: 'Black', value: '#000000', stock: 15 },
      { name: 'White', value: '#ffffff', stock: 8 },
      { name: 'Navy', value: '#1e3a8a', stock: 12 }
    ],
    sizes: [
      { name: 'S', stock: 5, chest: '36-38' },
      { name: 'M', stock: 12, chest: '38-40' },
      { name: 'L', stock: 8, chest: '40-42' },
      { name: 'XL', stock: 15, chest: '42-44' },
      { name: 'XXL', stock: 6, chest: '44-46' }
    ],
    features: [
      '100% Premium Cotton',
      'Oversized Fit',
      'Digital Print Graphics',
      'Pre-shrunk Fabric',
      'Machine Washable'
    ],
    careInstructions: [
      'Machine wash cold with like colors',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat if needed',
      'Do not dry clean'
    ],
    reviews_data: [
      {
        name: 'Rahul S.',
        rating: 5,
        comment: 'Amazing quality! The print is vibrant and the fit is perfect.',
        date: '2024-09-15',
        verified: true
      },
      {
        name: 'Priya M.',
        rating: 4,
        comment: 'Great oversized fit. Color is exactly as shown.',
        date: '2024-09-10',
        verified: true
      }
    ]
  },
  '2': {
    id: 2,
    name: 'Urban Street Hoodie - Tokyo Vibes',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    description: 'Comfortable oversized hoodie with Japanese street art design. Made from premium fleece for ultimate comfort during those chilly evenings.',
    category: 'Hoodies',
    badge: 'NEW',
    rating: 4.6,
    reviews: 1523,
    images: [
      '/api/placeholder/600/750',
      '/api/placeholder/600/750',
      '/api/placeholder/600/750'
    ],
    colors: [
      { name: 'Black', value: '#000000', stock: 20 },
      { name: 'Gray', value: '#6b7280', stock: 10 },
      { name: 'Maroon', value: '#7f1d1d', stock: 5 }
    ],
    sizes: [
      { name: 'M', stock: 8, chest: '40-42' },
      { name: 'L', stock: 15, chest: '42-44' },
      { name: 'XL', stock: 12, chest: '44-46' },
      { name: 'XXL', stock: 8, chest: '46-48' }
    ],
    features: [
      'Premium Fleece Material',
      'Oversized Fit',
      'Kangaroo Pocket',
      'Adjustable Hood',
      'Ribbed Cuffs & Hem'
    ],
    careInstructions: [
      'Machine wash cold',
      'Do not bleach',
      'Tumble dry low',
      'Iron on low heat',
      'Do not dry clean'
    ],
    reviews_data: [
      {
        name: 'Arjun K.',
        rating: 5,
        comment: 'Super comfortable hoodie! Perfect for winter.',
        date: '2024-09-12',
        verified: true
      }
    ]
  },
  '3': {
    id: 3,
    name: 'Designer Streetwear Jacket',
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    description: 'Limited edition jacket with unique street art graphics. Stand out from the crowd with this exclusive piece.',
    category: 'Jackets',
    badge: 'EXCLUSIVE',
    rating: 4.9,
    reviews: 432,
    images: [
      '/api/placeholder/600/750',
      '/api/placeholder/600/750'
    ],
    colors: [
      { name: 'Black', value: '#000000', stock: 5 },
      { name: 'Navy', value: '#1e3a8a', stock: 3 }
    ],
    sizes: [
      { name: 'M', stock: 2, chest: '40-42' },
      { name: 'L', stock: 4, chest: '42-44' },
      { name: 'XL', stock: 2, chest: '44-46' }
    ],
    features: [
      'Water-resistant Fabric',
      'Multiple Pockets',
      'Adjustable Cuffs',
      'Limited Edition Design',
      'Premium Hardware'
    ],
    careInstructions: [
      'Dry clean only',
      'Do not machine wash',
      'Store in cool, dry place',
      'Avoid direct sunlight',
      'Professional cleaning recommended'
    ],
    reviews_data: [
      {
        name: 'Vikash R.',
        rating: 5,
        comment: 'Premium quality jacket! Worth every penny.',
        date: '2024-09-08',
        verified: true
      }
    ]
  }
};

async function getProduct(id: string) {
  // Return mock data for stable testing
  return mockProducts[id as keyof typeof mockProducts] || null;
}

export default function ProductPage({ params }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // This would normally be async, but keeping it simple for demo
  const product = mockProducts[params.id as keyof typeof mockProducts];

  if (!product) {
    notFound();
  }

  // Set default selections
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0].name);
  }
  if (!selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0].name);
  }

  const selectedColorData = product.colors.find(c => c.name === selectedColor);
  const selectedSizeData = product.sizes.find(s => s.name === selectedSize);

  return (
    <main className="min-h-screen bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/collections" className="hover:text-white">Collections</Link>
          <span className="mx-2">/</span>
          <Link href={`/collections/${product.category.toLowerCase()}`} className="hover:text-white">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-gray-500 text-8xl">👕</div>
              </div>
              
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  product.badge === 'BESTSELLER' ? 'bg-green-500 text-white' :
                  product.badge === 'NEW' ? 'bg-blue-500 text-white' :
                  product.badge === 'EXCLUSIVE' ? 'bg-purple-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>

              {/* Discount */}
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {product.discount}% OFF
              </div>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-white/5 backdrop-blur-sm border rounded-lg overflow-hidden transition-colors ${
                      selectedImage === index ? 'border-purple-400' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-gray-500 text-2xl">👕</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                  <span className="ml-2 text-white font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviews} reviews)</span>
                <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded">
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-white">₹{product.price}</span>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Color: <span className="text-purple-400">{selectedColor}</span>
              </h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-purple-400 scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={`${color.name} (${color.stock} in stock)`}
                  >
                    {selectedColor === color.name && (
                      <CheckIcon className="w-5 h-5 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Size: <span className="text-purple-400">{selectedSize}</span>
                {selectedSizeData && (
                  <span className="text-sm text-gray-400 ml-2">
                    (Chest: {selectedSizeData.chest}")
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={size.stock === 0}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size.name
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : size.stock === 0
                        ? 'border-gray-600 text-gray-600 cursor-not-allowed'
                        : 'border-white/20 text-white hover:border-purple-400 hover:text-purple-400'
                    }`}
                  >
                    {size.name}
                    {size.stock === 0 && (
                      <div className="text-xs mt-1">Out of Stock</div>
                    )}
                  </button>
                ))}
              </div>
              <Link href="/size-guide" className="text-sm text-purple-400 hover:text-purple-300 mt-2 inline-block">
                Size Guide
              </Link>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/20 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4 text-white" />
                  </button>
                  <span className="px-4 py-3 text-white font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white/10 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
                {selectedColorData && (
                  <span className="text-sm text-gray-400">
                    {selectedColorData.stock} left in stock
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
                Add to Cart - ₹{product.price * quantity}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center justify-center space-x-2 py-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'border-white/20 text-white hover:border-red-400 hover:text-red-400'
                  }`}
                >
                  <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-white/20 text-white py-3 rounded-xl hover:border-purple-400 hover:text-purple-400 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="text-center">
                <TruckIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-sm text-white font-medium">Free Shipping</div>
                <div className="text-xs text-gray-400">on orders ₹999+</div>
              </div>
              <div className="text-center">
                <ArrowsRightLeftIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-sm text-white font-medium">Easy Returns</div>
                <div className="text-xs text-gray-400">15 days return</div>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-sm text-white font-medium">Authentic</div>
                <div className="text-xs text-gray-400">100% genuine</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8">
              {['description', 'features', 'care', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-purple-400 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${product.reviews})` : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Product Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3 text-gray-300">
                      <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'care' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Care Instructions</h3>
                <ul className="space-y-3">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Write a Review
                  </button>
                </div>
                
                <div className="space-y-6">
                  {product.reviews_data?.map((review, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-white">{review.name}</span>
                            {review.verified && (
                              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}