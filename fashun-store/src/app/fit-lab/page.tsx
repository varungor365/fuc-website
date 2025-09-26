"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BodyType {
  id: string;
  name: string;
  description: string;
  measurements: string;
  videoUrl: string;
  image: string;
}

interface FitLabProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  images: {
    [bodyType: string]: string;
  };
}

const bodyTypes: BodyType[] = [
  {
    id: 'petite',
    name: 'Petite (5\'2" & Under)',
    description: 'Shorter frame, proportional styling',
    measurements: '32-24-34, Height: 5\'1"',
    videoUrl: '/videos/fit-lab/petite-model.mp4',
    image: '/images/fit-lab/petite-model.jpg'
  },
  {
    id: 'tall',
    name: 'Tall (5\'8" & Above)',
    description: 'Elongated silhouette, oversized friendly',
    measurements: '34-26-36, Height: 5\'9"',
    videoUrl: '/videos/fit-lab/tall-model.mp4',
    image: '/images/fit-lab/tall-model.jpg'
  },
  {
    id: 'curvy',
    name: 'Curvy',
    description: 'Fuller figure, flattering fits',
    measurements: '38-30-42, Height: 5\'5"',
    videoUrl: '/videos/fit-lab/curvy-model.mp4',
    image: '/images/fit-lab/curvy-model.jpg'
  },
  {
    id: 'athletic',
    name: 'Athletic Build',
    description: 'Muscular frame, comfortable movement',
    measurements: '36-28-38, Height: 5\'7"',
    videoUrl: '/videos/fit-lab/athletic-model.mp4',
    image: '/images/fit-lab/athletic-model.jpg'
  },
  {
    id: 'slim',
    name: 'Slim Build',
    description: 'Lean frame, versatile styling',
    measurements: '30-22-32, Height: 5\'6"',
    videoUrl: '/videos/fit-lab/slim-model.mp4',
    image: '/images/fit-lab/slim-model.jpg'
  },
  {
    id: 'plus-size',
    name: 'Plus Size',
    description: 'Fuller figure, confident comfort',
    measurements: '42-34-46, Height: 5\'4"',
    videoUrl: '/videos/fit-lab/plus-size-model.mp4',
    image: '/images/fit-lab/plus-size-model.jpg'
  }
];

const fitLabProducts: FitLabProduct[] = [
  {
    id: 'boxy-tee-black',
    name: 'Signature Boxy Tee',
    category: 'Tops',
    description: 'Our universally flattering boxy cut designed to celebrate every body type',
    price: 899,
    images: {
      petite: '/images/fit-lab/boxy-tee-petite.jpg',
      tall: '/images/fit-lab/boxy-tee-tall.jpg',
      curvy: '/images/fit-lab/boxy-tee-curvy.jpg',
      athletic: '/images/fit-lab/boxy-tee-athletic.jpg',
      slim: '/images/fit-lab/boxy-tee-slim.jpg',
      'plus-size': '/images/fit-lab/boxy-tee-plus.jpg'
    }
  },
  {
    id: 'utility-pants',
    name: 'Utility Cargo Pants',
    category: 'Bottoms',
    description: 'Gender-neutral utility pants that adapt to your unique silhouette',
    price: 1299,
    images: {
      petite: '/images/fit-lab/utility-pants-petite.jpg',
      tall: '/images/fit-lab/utility-pants-tall.jpg',
      curvy: '/images/fit-lab/utility-pants-curvy.jpg',
      athletic: '/images/fit-lab/utility-pants-athletic.jpg',
      slim: '/images/fit-lab/utility-pants-slim.jpg',
      'plus-size': '/images/fit-lab/utility-pants-plus.jpg'
    }
  },
  {
    id: 'oversized-hoodie',
    name: 'Oversized Statement Hoodie',
    category: 'Outerwear',
    description: 'The perfect oversized fit that flatters without overwhelming',
    price: 1599,
    images: {
      petite: '/images/fit-lab/hoodie-petite.jpg',
      tall: '/images/fit-lab/hoodie-tall.jpg',
      curvy: '/images/fit-lab/hoodie-curvy.jpg',
      athletic: '/images/fit-lab/hoodie-athletic.jpg',
      slim: '/images/fit-lab/hoodie-slim.jpg',
      'plus-size': '/images/fit-lab/hoodie-plus.jpg'
    }
  }
];

export default function FitLab() {
  const [selectedBodyType, setSelectedBodyType] = useState<string>('curvy');
  const [selectedProduct, setSelectedProduct] = useState<string>('boxy-tee-black');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const currentBodyType = bodyTypes.find(bt => bt.id === selectedBodyType);
  const currentProduct = fitLabProducts.find(p => p.id === selectedProduct);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            🧪 THE FIT LAB
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            UNIVERSALLY
            <span className="block text-yellow-300">FLATTERING FIT</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            See how our signature silhouettes look on every body type. Because fashion should celebrate diversity, not hide it.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Product Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Signature Piece</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fitLabProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  selectedProduct === product.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="text-xl font-black text-purple-600">₹{product.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Body Type Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">See It On Your Body Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bodyTypes.map((bodyType) => (
              <button
                key={bodyType.id}
                onClick={() => {
                  setSelectedBodyType(bodyType.id);
                  setIsVideoPlaying(false);
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  selectedBodyType === bodyType.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                  <img 
                    src={bodyType.image} 
                    alt={bodyType.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">{bodyType.name}</h3>
                <p className="text-xs text-gray-600">{bodyType.measurements}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual Display */}
          <div className="relative">
            <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-[3/4] relative">
              {isVideoPlaying ? (
                <video 
                  src={currentBodyType?.videoUrl}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                  onEnded={() => setIsVideoPlaying(false)}
                />
              ) : (
                <img 
                  src={currentProduct?.images[selectedBodyType] || '/images/placeholder.jpg'}
                  alt={`${currentProduct?.name} on ${currentBodyType?.name}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Play Button */}
              {!isVideoPlaying && (
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="bg-white rounded-full p-6 shadow-xl hover:scale-110 transition-transform">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-white border-y-2 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Size Guide */}
            <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border">
              <h3 className="font-bold text-gray-900 mb-3">Model Details</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Body Type:</span> {currentBodyType?.description}</div>
                <div><span className="font-medium">Measurements:</span> {currentBodyType?.measurements}</div>
                <div><span className="font-medium">Wearing Size:</span> Medium</div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">{currentProduct?.name}</h2>
              <p className="text-lg text-gray-700 mb-6">{currentProduct?.description}</p>
              <div className="text-3xl font-black text-purple-600 mb-6">₹{currentProduct?.price}</div>
            </div>

            {/* Fit Philosophy */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Design Philosophy
              </h3>
              <p className="text-gray-700">
                This piece is designed to celebrate your unique silhouette. Our boxy cut creates a 
                relaxed, gender-neutral fit that flatters without conforming to traditional sizing constraints.
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Select Your Size</h3>
              <div className="grid grid-cols-4 gap-3">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    className="py-3 px-4 border-2 border-gray-200 rounded-xl font-bold hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                ADD TO CART 🛒
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 px-6 border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all">
                  SIZE GUIDE
                </button>
                <button className="py-3 px-6 border-2 border-purple-500 text-purple-500 rounded-full font-bold hover:bg-purple-500 hover:text-white transition-all">
                  SHARE FIT
                </button>
              </div>
            </div>

            {/* Social Proof */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-3">What Our Community Says</h4>
              <div className="text-sm text-gray-700">
                <p className="mb-2 italic">"Finally found a brand that shows clothes on real bodies like mine!"</p>
                <p className="font-medium">- Priya K., Mumbai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-black mb-4">Love The Fit? Complete The Look</h2>
            <p className="text-xl mb-8 text-white/90">
              Discover matching pieces that work perfectly with your body type
            </p>
            <Link href="/collections">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                SHOP COMPLETE LOOKS 🔥
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}