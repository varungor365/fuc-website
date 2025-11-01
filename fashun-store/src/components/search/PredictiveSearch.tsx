'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchProducts } from '@/lib/shopify/client';
import Image from 'next/image';
import Link from 'next/link';
import { debounce } from 'lodash';

interface SearchResult {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  featuredImage: {
    url: string;
    altText: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export default function PredictiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Oversized Hoodies',
    'Graphic Tees',
    'Cargo Pants',
    'Streetwear Jackets',
    'Sneakers',
    'Accessories',
  ]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const performSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchProducts(searchQuery, 10);
        setResults(data?.edges.map((edge: any) => edge.node) || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    setShowResults(true);
    performSearch(value);
  };

  const handleSelectSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setShowResults(false);
    
    // Add to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search products, brands, styles..."
          className="w-full py-4 pl-12 pr-12 bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:border-accent-purple/50 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/50" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-primary-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[600px] overflow-y-auto"
          >
            {/* Loading State */}
            {loading && (
              <div className="p-6 text-center">
                <div className="w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-3 text-white/50 text-sm">Searching...</p>
              </div>
            )}

            {/* Recent & Popular Searches */}
            {!query && !loading && (
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-accent-purple hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectSearch(term)}
                          className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Search className="w-4 h-4 text-white/40" />
                          <span className="text-white">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearch(term)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && !loading && results.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                  Products ({results.length})
                </h3>
                <div className="space-y-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-primary-800/30">
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate group-hover:text-accent-purple transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-sm text-white/50">{product.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-accent-purple">
                          ₹{parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => handleSelectSearch(query)}
                  className="w-full mt-3 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-purple/50 transition-all"
                >
                  View All Results
                </button>
              </div>
            )}

            {/* No Results */}
            {query && !loading && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/70 mb-2">No products found for "{query}"</p>
                <p className="text-sm text-white/40">Try different keywords or browse our collections</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {showResults && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
