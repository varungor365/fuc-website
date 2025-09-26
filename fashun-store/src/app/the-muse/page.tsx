"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface MuseProfile {
  id: string;
  name: string;
  handle: string;
  location: string;
  style: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: number;
  outfitsShared: number;
  badges: string[];
  featured: boolean;
  looks: MuseLook[];
}

interface MuseLook {
  id: string;
  title: string;
  description: string;
  image: string;
  products: {
    name: string;
    price: number;
    link: string;
  }[];
  likes: number;
  saves: number;
  tags: string[];
  occasion: string;
}

const muses: MuseProfile[] = [
  {
    id: 'arjun_mumbai',
    name: 'Arjun Mehta',
    handle: '@arjun_mumbai',
    location: 'Mumbai, MH',
    style: 'Street Hip-Hop',
    bio: 'Gully rap enthusiast mixing traditional prints with modern streetwear. Representing Mumbai streets worldwide.',
    avatar: '/images/muses/arjun-avatar.jpg',
    coverImage: '/images/muses/arjun-cover.jpg',
    followers: 12500,
    outfitsShared: 47,
    badges: ['Hip-Hop Pioneer', 'Mumbai Ambassador', 'Style Innovator'],
    featured: true,
    looks: [
      {
        id: 'arjun_1',
        title: 'Mumbai Monsoon Vibes',
        description: 'Keeping it fresh during the rains with waterproof layers and bold patterns',
        image: '/images/looks/arjun-monsoon.jpg',
        products: [
          { name: 'Mumbai Streets Hoodie', price: 2499, link: '/products/mumbai-hoodie' },
          { name: 'Cargo Track Pants', price: 1899, link: '/products/cargo-pants' },
          { name: 'Rain Drop Sneakers', price: 3299, link: '/products/rain-sneakers' }
        ],
        likes: 834,
        saves: 267,
        tags: ['monsoon', 'waterproof', 'mumbai', 'hiphop'],
        occasion: 'Casual Street'
      }
    ]
  },
  {
    id: 'priya_delhi',
    name: 'Priya Sharma',
    handle: '@priya_styles',
    location: 'New Delhi, DL',
    style: 'Indo-Western Fusion',
    bio: 'Blending traditional Indian elements with contemporary cuts. Making heritage cool for Gen Z.',
    avatar: '/images/muses/priya-avatar.jpg',
    coverImage: '/images/muses/priya-cover.jpg',
    followers: 18700,
    outfitsShared: 63,
    badges: ['Fusion Queen', 'Delhi Trendsetter', 'Heritage Reviver'],
    featured: true,
    looks: [
      {
        id: 'priya_1',
        title: 'Modern Rajasthani',
        description: 'Traditional block prints meet contemporary silhouettes for the perfect fusion look',
        image: '/images/looks/priya-rajasthani.jpg',
        products: [
          { name: 'Block Print Crop Top', price: 1699, link: '/products/block-print-top' },
          { name: 'High-Waist Palazzo', price: 2199, link: '/products/palazzo-pants' },
          { name: 'Mirror Work Jacket', price: 3499, link: '/products/mirror-jacket' }
        ],
        likes: 1247,
        saves: 445,
        tags: ['fusion', 'traditional', 'blockprint', 'rajasthani'],
        occasion: 'Festive Casual'
      }
    ]
  },
  {
    id: 'rahul_bangalore',
    name: 'Rahul Krishnan',
    handle: '@techie_swag',
    location: 'Bangalore, KA',
    style: 'Tech Minimalist',
    bio: 'Software engineer by day, style innovator by night. Proving that tech bros can have serious swag.',
    avatar: '/images/muses/rahul-avatar.jpg',
    coverImage: '/images/muses/rahul-cover.jpg',
    followers: 9200,
    outfitsShared: 31,
    badges: ['Tech Innovator', 'Minimalist Master', 'Bangalore Rep'],
    featured: false,
    looks: [
      {
        id: 'rahul_1',
        title: 'Startup Casual',
        description: 'Looking professional yet approachable for those important pitch meetings',
        image: '/images/looks/rahul-startup.jpg',
        products: [
          { name: 'Clean Code Tee', price: 1299, link: '/products/code-tee' },
          { name: 'Smart Chinos', price: 2299, link: '/products/chinos' },
          { name: 'Minimal Sneakers', price: 2799, link: '/products/minimal-sneakers' }
        ],
        likes: 567,
        saves: 189,
        tags: ['minimal', 'tech', 'professional', 'startup'],
        occasion: 'Work Casual'
      }
    ]
  },
  {
    id: 'zara_mumbai',
    name: 'Zara Khan',
    handle: '@zara_vibes',
    location: 'Mumbai, MH',
    style: 'Bollywood Glam',
    bio: 'Dance choreographer bringing Bollywood glamour to everyday streetwear. Every outfit tells a story.',
    avatar: '/images/muses/zara-avatar.jpg',
    coverImage: '/images/muses/zara-cover.jpg',
    followers: 25600,
    outfitsShared: 89,
    badges: ['Bollywood Icon', 'Dance Floor Queen', 'Glam Goddess'],
    featured: true,
    looks: [
      {
        id: 'zara_1',
        title: 'Dance Class Glam',
        description: 'Bringing movie magic to dance rehearsals with sequins and sass',
        image: '/images/looks/zara-dance.jpg',
        products: [
          { name: 'Sequin Sports Bra', price: 1899, link: '/products/sequin-bra' },
          { name: 'High-Waist Leggings', price: 1699, link: '/products/glam-leggings' },
          { name: 'Statement Bomber', price: 3999, link: '/products/statement-bomber' }
        ],
        likes: 1832,
        saves: 623,
        tags: ['bollywood', 'dance', 'sequins', 'glam'],
        occasion: 'Dance & Party'
      }
    ]
  }
];

const styleCategories = [
  { name: 'All Styles', count: muses.length, active: true },
  { name: 'Hip-Hop', count: 1, active: false },
  { name: 'Indo-Western', count: 1, active: false },
  { name: 'Minimalist', count: 1, active: false },
  { name: 'Bollywood Glam', count: 1, active: false },
  { name: 'Vintage', count: 0, active: false },
  { name: 'Grunge', count: 0, active: false }
];

export default function TheMuseSection() {
  const [selectedCategory, setSelectedCategory] = useState('All Styles');
  const [selectedMuse, setSelectedMuse] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'profile'>('grid');

  const filteredMuses = selectedCategory === 'All Styles' 
    ? muses 
    : muses.filter(muse => muse.style.toLowerCase().includes(selectedCategory.toLowerCase().replace('-', ' ')));

  const currentMuse = selectedMuse ? muses.find(m => m.id === selectedMuse) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            ✨ THE MUSE SECTION
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            YOUR STYLE
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              INSPIRATIONS
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Meet our community of style muses - real people creating incredible looks with FASHUN.CO pieces. 
            Get inspired, shop their looks, or become a muse yourself.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all">
              BECOME A MUSE 🌟
            </button>
            <button className="border-2 border-white/30 text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-all">
              SHARE YOUR LOOK 📸
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Style Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {styleCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                    : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                }`}
              >
                {category.name} {category.count > 0 && `(${category.count})`}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'grid' ? (
          <>
            {/* Featured Muses */}
            <div className="mb-16">
              <h2 className="text-3xl font-black mb-8 text-center">Featured Style Muses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMuses.filter(muse => muse.featured).map((muse) => (
                  <div
                    key={muse.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMuse(muse.id);
                      setViewMode('profile');
                    }}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all">
                      <img 
                        src={muse.coverImage}
                        alt={`${muse.name} cover`}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center mb-3">
                          <img 
                            src={muse.avatar}
                            alt={muse.name}
                            className="w-12 h-12 rounded-full border-2 border-white mr-3"
                          />
                          <div>
                            <h3 className="font-black text-lg">{muse.name}</h3>
                            <p className="text-sm text-white/80">{muse.handle} • {muse.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 px-3 py-1 rounded-full text-sm font-bold">
                            {muse.style}
                          </span>
                          <div className="flex items-center text-sm">
                            <span className="mr-4">👥 {muse.followers.toLocaleString()}</span>
                            <span>👔 {muse.outfitsShared}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-white/90 line-clamp-2">{muse.bio}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {muse.badges.slice(0, 2).map((badge) => (
                            <span key={badge} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Muses Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-black mb-8 text-center">All Style Muses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMuses.map((muse) => (
                  <div
                    key={muse.id}
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedMuse(muse.id);
                      setViewMode('profile');
                    }}
                  >
                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all group-hover:transform group-hover:scale-105">
                      <img 
                        src={muse.avatar}
                        alt={muse.name}
                        className="w-full aspect-square object-cover rounded-xl mb-4"
                      />
                      
                      <h3 className="font-black text-lg mb-1">{muse.name}</h3>
                      <p className="text-sm text-white/70 mb-2">{muse.handle}</p>
                      <p className="text-xs text-white/60 mb-3">{muse.location}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="bg-purple-600/30 px-2 py-1 rounded-full text-xs">
                          {muse.style}
                        </span>
                        <span className="text-white/80">
                          {muse.followers > 1000 ? `${(muse.followers/1000).toFixed(1)}K` : muse.followers} followers
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Looks */}
            <div>
              <h2 className="text-3xl font-black mb-8 text-center">Latest Looks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {muses.flatMap(muse => 
                  muse.looks.map(look => (
                    <div key={look.id} className="group">
                      <div className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all">
                        <img 
                          src={look.image}
                          alt={look.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        <div className="p-6">
                          <div className="flex items-center mb-3">
                            <img 
                              src={muse.avatar}
                              alt={muse.name}
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            <span className="text-sm font-bold">{muse.name}</span>
                          </div>
                          
                          <h3 className="font-black text-lg mb-2">{look.title}</h3>
                          <p className="text-sm text-white/80 mb-4">{look.description}</p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center">
                                ❤️ {look.likes}
                              </span>
                              <span className="flex items-center">
                                🔖 {look.saves}
                              </span>
                            </div>
                            <span className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-3 py-1 rounded-full text-xs font-bold">
                              {look.occasion}
                            </span>
                          </div>
                          
                          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-full font-bold hover:shadow-lg transition-all">
                            SHOP THIS LOOK 🛍️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* Profile View */
          currentMuse && (
            <div>
              {/* Back Button */}
              <button 
                onClick={() => setViewMode('grid')}
                className="mb-8 flex items-center text-white/70 hover:text-white transition-all"
              >
                ← Back to Muses
              </button>

              {/* Profile Header */}
              <div className="relative mb-12 rounded-3xl overflow-hidden">
                <img 
                  src={currentMuse.coverImage}
                  alt={`${currentMuse.name} cover`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-end justify-between">
                    <div className="flex items-center">
                      <img 
                        src={currentMuse.avatar}
                        alt={currentMuse.name}
                        className="w-20 h-20 rounded-full border-4 border-white mr-6"
                      />
                      <div>
                        <h1 className="text-4xl font-black mb-2">{currentMuse.name}</h1>
                        <p className="text-xl text-white/90 mb-2">{currentMuse.handle} • {currentMuse.location}</p>
                        <p className="text-white/80 max-w-md">{currentMuse.bio}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm mb-4">
                        <div className="text-2xl font-black">{currentMuse.followers.toLocaleString()}</div>
                        <div className="text-sm text-white/80">Followers</div>
                      </div>
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="text-2xl font-black">{currentMuse.outfitsShared}</div>
                        <div className="text-sm text-white/80">Looks Shared</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {currentMuse.badges.map((badge) => (
                      <span key={badge} className="bg-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-sm font-bold">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Muse's Looks */}
              <div>
                <h2 className="text-3xl font-black mb-8">{currentMuse.name}'s Latest Looks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentMuse.looks.map((look) => (
                    <div key={look.id} className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                      <img 
                        src={look.image}
                        alt={look.title}
                        className="w-full h-64 object-cover"
                      />
                      
                      <div className="p-6">
                        <h3 className="font-black text-xl mb-3">{look.title}</h3>
                        <p className="text-white/80 mb-4">{look.description}</p>
                        
                        <div className="space-y-3 mb-6">
                          {look.products.map((product) => (
                            <div key={product.name} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                              <span className="text-sm font-medium">{product.name}</span>
                              <span className="text-sm font-bold">₹{product.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center text-sm">
                              ❤️ {look.likes}
                            </span>
                            <span className="flex items-center text-sm">
                              🔖 {look.saves}
                            </span>
                          </div>
                          <span className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-3 py-1 rounded-full text-xs font-bold">
                            {look.occasion}
                          </span>
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full font-bold hover:shadow-lg transition-all">
                          SHOP THIS LOOK ₹{look.products.reduce((sum, p) => sum + p.price, 0)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <h2 className="text-3xl font-black mb-4">Become a FASHUN.CO Muse</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Share your unique style with our community. Get featured, inspire others, and earn rewards for your creativity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                APPLY TO BE A MUSE ✨
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-white/10 transition-all">
                SHARE YOUR LOOK 📸
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}