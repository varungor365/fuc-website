'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Image as ImageIcon, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { searchLummiImages, LummiImage } from '@/lib/lummi';

export default function LummiAdminPage() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<LummiImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchLummiImages({ query, perPage: 24 });
      setImages(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const quickSearches = [
    'fashion model',
    'streetwear',
    'clothing',
    'urban style',
    'hoodie',
    't-shirt',
    'accessories',
    'lifestyle'
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ImageIcon className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Lummi AI Image Library</h1>
          </div>
          <p className="text-gray-400">Search and use high-quality AI-generated images for your products</p>
        </div>

        {/* API Info */}
        <div className="bg-purple-900/20 border border-purple-500/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">✨ Lummi API Integration Active</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-semibold text-white mb-2">Features:</p>
              <ul className="space-y-1">
                <li>• High-quality AI images</li>
                <li>• 10 requests/minute</li>
                <li>• Automatic attribution</li>
                <li>• Commercial use allowed</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Usage:</p>
              <ul className="space-y-1">
                <li>• Search for product images</li>
                <li>• Copy URLs for products</li>
                <li>• Attribution included automatically</li>
                <li>• Hotlinked URLs provided</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for images... (e.g., 'fashion model', 'streetwear')"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Search className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Quick Searches */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Quick searches:</p>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    searchLummiImages({ query: term, perPage: 24 }).then(setImages);
                  }}
                  className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {images.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results ({images.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900 rounded-xl overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                      <button
                        onClick={() => copyImageUrl(image.url)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                      >
                        {copiedUrl === image.url ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy URL
                          </>
                        )}
                      </button>
                      
                      <a
                        href={image.url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                      {image.alt}
                    </p>
                    <div className="text-xs text-gray-500">
                      {image.width} × {image.height}
                    </div>
                    
                    {/* Attribution */}
                    <div className="mt-2 pt-2 border-t border-gray-800 text-xs text-gray-500">
                      Photo by{' '}
                      <a
                        href={image.user.attributionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        {image.user.name}
                      </a>
                      {' '}on{' '}
                      <a
                        href={image.attributionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Lummi
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && query && (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold mb-2">No images found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
