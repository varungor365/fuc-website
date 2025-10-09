'use client';

import { useEffect, useRef, useState } from 'react';

interface Design {
  id: string;
  imageUrl: string;
  title: string;
}

interface VirtualClosetProps {
  designs: Design[];
}

export default function VirtualCloset({ designs }: VirtualClosetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading 3D environment
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Virtual Closet</h2>
          <p className="text-purple-300">Preparing your 3D gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Virtual Closet</h1>
          <div className="text-purple-300">
            {designs.length} designs in collection
          </div>
        </div>
      </div>

      {/* 3D Gallery Container */}
      <div 
        ref={containerRef}
        className="absolute inset-0 pt-20"
      >
        {/* Gallery Grid */}
        <div className="h-full p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {designs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="text-white">
                  <div className="text-6xl mb-4">👕</div>
                  <h2 className="text-2xl font-bold mb-2">Your closet is empty</h2>
                  <p className="text-purple-300 mb-6">Start creating designs to see them here</p>
                  <a
                    href="https://www.fashun.co.in/studio"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Create Your First Design
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {designs.map((design, index) => (
                  <div
                    key={design.id}
                    className="group relative cursor-pointer transform hover:scale-105 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                    onClick={() => setSelectedDesign(design)}
                  >
                    {/* 3D Card Effect */}
                    <div className="relative bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                      {/* T-shirt Mockup */}
                      <div className="relative aspect-square mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={design.imageUrl}
                          alt={design.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-white text-sm font-medium">View Design</div>
                        </div>
                        {/* 3D Effect Highlight */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                      </div>
                      
                      {/* Design Title */}
                      <h3 className="text-white font-medium text-sm text-center truncate">
                        {design.title}
                      </h3>
                      
                      {/* 3D Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                        3D
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Design Modal */}
      {selectedDesign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedDesign.title}</h2>
              <button
                onClick={() => setSelectedDesign(null)}
                className="text-white/70 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Large Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-4">
              <img
                src={selectedDesign.imageUrl}
                alt={selectedDesign.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <a
                href={`https://www.fashun.co.in/products/${selectedDesign.id}`}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-center rounded-lg transition-colors"
              >
                View Product
              </a>
              <button
                onClick={() => navigator.share?.({ 
                  title: selectedDesign.title,
                  url: `https://www.fashun.co.in/products/${selectedDesign.id}`
                })}
                className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white text-center rounded-lg transition-colors border border-white/30"
              >
                Share Design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}