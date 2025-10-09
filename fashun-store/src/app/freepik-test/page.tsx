'use client';

import React from 'react';
import FreepikApiGuide from '@/components/FreepikApiGuide';
import SmartImage from '@/components/ui/SmartImage';
import { useFreepikImages } from '@/hooks/useFreepik';

export default function FreepikTestPage() {
  const { images, loading, error } = useFreepikImages({
    searchTerm: 'streetwear fashion urban',
    count: 6
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <FreepikApiGuide />
        
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">🧪 Live Freepik API Test</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Single Smart Image</h3>
            <SmartImage
              searchTerm="urban streetwear hoodie"
              alt="Streetwear Hoodie"
              width={400}
              height={500}
              className="rounded-lg shadow-md"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Image Gallery Hook</h3>
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading Freepik images...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">Error: {error} (Fallback images will be used)</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((url, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-md">
                  <img 
                    src={url} 
                    alt={`Fashion ${i + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&q=streetwear`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📊 API Status</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">API Key:</span>
                <span className="text-green-600 ml-2">✅ Configured</span>
              </div>
              <div>
                <span className="font-medium">Fallbacks:</span>
                <span className="text-green-600 ml-2">✅ Active</span>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <span className="text-blue-600 ml-2">Development</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}