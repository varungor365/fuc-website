"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { mockProducts } from '@/data/mockProducts';

interface EraCollection {
  id: string;
  name: string;
  tagline: string;
  description: string;
  years: string;
  colorPalette: string[];
  keyFeatures: string[];
  vibe: string;
  musicGenre: string;
  culturalContext: string;
  heroImage: string;
  products: any[];
  gradientFrom: string;
  gradientTo: string;
}

const eraCollections: EraCollection[] = [
  {
    id: '90s-nostalgia',
    name: '90s Nostalgia',
    tagline: 'When Hip-Hop Met Street Style',
    description: 'Relive the golden era of streetwear with baggy silhouettes, bold graphics, and authentic underground vibes.',
    years: '1990-1999',
    colorPalette: ['#FF6B35', '#2E86AB', '#A23B72', '#F18F01', '#C73E1D'],
    keyFeatures: ['Baggy Fits', 'Retro Graphics', 'High Waisted', 'Bold Colors', 'Logo Mania'],
    vibe: 'Rebellious & Authentic',
    musicGenre: 'Hip-Hop, Grunge, R&B',
    culturalContext: 'MTV Generation, Street Culture Rise',
    heroImage: '/images/era-collections/90s-hero.jpg',
    products: mockProducts.slice(0, 3),
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-red-600'
  },
  {
    id: 'y2k-revival',
    name: 'Y2K Revival',
    tagline: 'Future Meets Fashion',
    description: 'Metallic fabrics, cyber aesthetics, and millennium optimism collide in this futuristic collection.',
    years: '1999-2005',
    colorPalette: ['#E0E0E0', '#FF00FF', '#00FFFF', '#C0C0C0', '#800080'],
    keyFeatures: ['Metallic Textures', 'Low-Rise Cuts', 'Tech Wear', 'Holographic Details', 'Cyber Aesthetics'],
    vibe: 'Futuristic & Optimistic',
    musicGenre: 'Electronic, Pop, Trance',
    culturalContext: 'Digital Revolution, Tech Optimism',
    heroImage: '/images/era-collections/y2k-hero.jpg',
    products: mockProducts.slice(1, 4),
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-cyan-500'
  },
  {
    id: '2000s-indie',
    name: '2000s Indie',
    tagline: 'Effortlessly Cool',
    description: 'Skinny jeans, band tees, and that effortless indie rock aesthetic that defined a generation.',
    years: '2000-2010',
    colorPalette: ['#2C3E50', '#E74C3C', '#F39C12', '#27AE60', '#8E44AD'],
    keyFeatures: ['Skinny Fits', 'Band Merch', 'Vintage Wash', 'Minimalist', 'Alternative Edge'],
    vibe: 'Alternative & Artistic',
    musicGenre: 'Indie Rock, Alternative',
    culturalContext: 'Blog Culture, Independent Media',
    heroImage: '/images/era-collections/2000s-hero.jpg',
    products: mockProducts.slice(2, 5),
    gradientFrom: 'from-gray-600',
    gradientTo: 'to-blue-600'
  },
  {
    id: 'vintage-bollywood',
    name: 'Vintage Bollywood',
    tagline: 'Filmi Glamour Meets Street',
    description: 'Inspired by iconic Bollywood fashion from the 70s-90s, reimagined for modern streetwear.',
    years: '1970-1995',
    colorPalette: ['#FFD700', '#DC143C', '#FF1493', '#32CD32', '#FF4500'],
    keyFeatures: ['Bold Prints', 'Retro Cuts', 'Statement Collars', 'Vibrant Colors', 'Cultural Motifs'],
    vibe: 'Glamorous & Nostalgic',
    musicGenre: 'Bollywood Classics, Disco',
    culturalContext: 'Golden Age of Indian Cinema',
    heroImage: '/images/era-collections/bollywood-hero.jpg',
    products: mockProducts.slice(3, 6),
    gradientFrom: 'from-yellow-500',
    gradientTo: 'to-pink-600'
  },
  {
    id: '80s-neon',
    name: '80s Neon Dreams',
    tagline: 'Electric Nights & Neon Lights',
    description: 'Workout wear meets party fashion with electric colors and bold geometric patterns.',
    years: '1980-1989',
    colorPalette: ['#FF0080', '#00FF80', '#FF8000', '#8000FF', '#00FFFF'],
    keyFeatures: ['Neon Colors', 'Athletic Cuts', 'Geometric Patterns', 'Oversized Shoulders', 'Retro Futurism'],
    vibe: 'Energetic & Bold',
    musicGenre: 'Synthwave, Pop, New Wave',
    culturalContext: 'MTV Launch, Fitness Culture',
    heroImage: '/images/era-collections/80s-hero.jpg',
    products: mockProducts.slice(4, 7),
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-purple-600'
  }
];

export default function EraCollections() {
  const [selectedEra, setSelectedEra] = useState<string>('90s-nostalgia');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

  const currentEra = eraCollections.find(era => era.id === selectedEra);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            🕰️ ERA COLLECTIONS
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            SHOP BY
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              YOUR VIBE
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            From 90s hip-hop to Y2K futurism - find your aesthetic and shop the complete era experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>

        {viewMode === 'timeline' ? (
          /* Timeline View */
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-600 to-pink-500 h-full"></div>
            
            <div className="space-y-24">
              {eraCollections.map((era, index) => (
                <div key={era.id} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                    <button
                      onClick={() => setSelectedEra(era.id)}
                      className={`w-full text-left p-8 rounded-3xl border-2 transition-all ${
                        selectedEra === era.id
                          ? `border-purple-500 bg-gradient-to-br ${era.gradientFrom} ${era.gradientTo} text-white`
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="mb-4">
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          selectedEra === era.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {era.years}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-black mb-2 ${
                        selectedEra === era.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {era.name}
                      </h3>
                      <p className={`text-lg font-bold mb-3 ${
                        selectedEra === era.id ? 'text-white/90' : 'text-purple-600'
                      }`}>
                        {era.tagline}
                      </p>
                      <p className={`${
                        selectedEra === era.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {era.description}
                      </p>
                    </button>
                  </div>

                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Visual */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                    <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                      <img 
                        src={era.heroImage}
                        alt={era.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eraCollections.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`text-left p-6 rounded-3xl border-2 transition-all ${
                  selectedEra === era.id
                    ? 'border-purple-500 ring-4 ring-purple-200'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={era.heroImage}
                    alt={era.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    {era.years}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{era.name}</h3>
                <p className="text-purple-600 font-bold mb-3">{era.tagline}</p>
                <p className="text-gray-600 text-sm">{era.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Selected Era Details */}
        {currentEra && (
          <div className="mt-16">
            <div className={`bg-gradient-to-br ${currentEra.gradientFrom} ${currentEra.gradientTo} rounded-3xl p-12 text-white`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black mb-6">{currentEra.name}</h2>
                  <p className="text-xl mb-8 text-white/90">{currentEra.description}</p>
                  
                  {/* Era Details */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-bold mb-2">Vibe</h4>
                      <p className="text-white/80">{currentEra.vibe}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Music</h4>
                      <p className="text-white/80">{currentEra.musicGenre}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Cultural Context</h4>
                      <p className="text-white/80">{currentEra.culturalContext}</p>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentEra.keyFeatures.slice(0, 3).map((feature) => (
                          <span key={feature} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-8">
                    <h4 className="font-bold mb-3">Color Palette</h4>
                    <div className="flex space-x-2">
                      {currentEra.colorPalette.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-white/30"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/collections/${currentEra.id}`}>
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                      SHOP {currentEra.name.toUpperCase()} 🛍️
                    </button>
                  </Link>
                </div>

                {/* Products Preview */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Featured Pieces</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentEra.products.slice(0, 4).map((product) => (
                      <div key={product.id} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="aspect-square rounded-xl overflow-hidden mb-3">
                          <img 
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-sm mb-1">{product.name}</h4>
                        <p className="text-white/80 text-lg font-bold">₹{product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-black mb-4">Can't Pick Just One Era?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Mix and match pieces from different eras to create your unique time-traveling style
            </p>
            <Link href="/collections/mix-and-match">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                CREATE YOUR MIX 🌈
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}