'use client';

import React, { useState } from 'react';
import { Heart, Share2, ShoppingBag, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LookbookPage = () => {
  const [selectedLook, setSelectedLook] = useState(0);

  const lookbookData = [
    {
      id: 1,
      title: "Urban Edge",
      description: "Street style meets high fashion in this effortlessly cool ensemble",
      mainImage: "/api/placeholder/600/800",
      additionalImages: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ],
      products: [
        { id: 1, name: "Oversized Graphic Hoodie", price: 89, image: "/api/placeholder/100/100" },
        { id: 2, name: "Distressed Denim Jeans", price: 129, image: "/api/placeholder/100/100" },
        { id: 3, name: "Platform Sneakers", price: 159, image: "/api/placeholder/100/100" }
      ],
      tags: ["streetwear", "casual", "urban"],
      likes: 324,
      views: 1250
    },
    {
      id: 2,
      title: "Minimalist Chic",
      description: "Clean lines and neutral tones create the perfect minimalist aesthetic",
      mainImage: "/api/placeholder/600/800",
      additionalImages: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ],
      products: [
        { id: 4, name: "Structured Blazer", price: 199, image: "/api/placeholder/100/100" },
        { id: 5, name: "High-Waist Trousers", price: 149, image: "/api/placeholder/100/100" },
        { id: 6, name: "Minimal Leather Bag", price: 249, image: "/api/placeholder/100/100" }
      ],
      tags: ["minimalist", "formal", "chic"],
      likes: 189,
      views: 892
    },
    {
      id: 3,
      title: "Boho Dreams",
      description: "Flowing fabrics and earthy tones capture the free-spirited boho vibe",
      mainImage: "/api/placeholder/600/800",
      additionalImages: [
        "/api/placeholder/400/600",
        "/api/placeholder/400/600",
        "/api/placeholder/400/600"
      ],
      products: [
        { id: 7, name: "Flowing Maxi Dress", price: 169, image: "/api/placeholder/100/100" },
        { id: 8, name: "Layered Jewelry Set", price: 79, image: "/api/placeholder/100/100" },
        { id: 9, name: "Suede Ankle Boots", price: 189, image: "/api/placeholder/100/100" }
      ],
      tags: ["boho", "flowy", "feminine"],
      likes: 267,
      views: 1080
    }
  ];

  const currentLook = lookbookData[selectedLook];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lookbook</h1>
              <p className="text-gray-600 mt-1">Discover curated style inspirations</p>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Save Look</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-lg">
              <img
                src={currentLook.mainImage}
                alt={currentLook.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setSelectedLook(selectedLook > 0 ? selectedLook - 1 : lookbookData.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedLook(selectedLook < lookbookData.length - 1 ? selectedLook + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Stats Overlay */}
              <div className="absolute bottom-4 left-4 flex space-x-4 text-white">
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{currentLook.likes}</span>
                </div>
                <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{currentLook.views}</span>
                </div>
              </div>
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-4">
              {currentLook.additionalImages.map((image, index) => (
                <div key={index} className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={image}
                    alt={`${currentLook.title} view ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Look Details */}
          <div className="space-y-6">
            {/* Look Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLook.title}</h2>
              <p className="text-gray-600 mb-4">{currentLook.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentLook.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Shop This Look</span>
              </button>
            </div>

            {/* Products in this Look */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h3>
              <div className="space-y-4">
                {currentLook.products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-lg font-bold text-gray-900">${product.price}</p>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Looks */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Looks</h3>
              <div className="grid grid-cols-2 gap-4">
                {lookbookData.filter((_, index) => index !== selectedLook).slice(0, 2).map((look, index) => (
                  <div
                    key={look.id}
                    className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedLook(lookbookData.findIndex(l => l.id === look.id))}
                  >
                    <img
                      src={look.mainImage}
                      alt={look.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                      {look.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Look Navigation */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            {lookbookData.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedLook(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === selectedLook ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookbookPage;
