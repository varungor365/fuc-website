'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  inStock: boolean;
}

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'suggestion';
}

const SmartSearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions();
        performSearch();
      } else {
        setSuggestions([]);
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + results.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            // Select suggestion
            setQuery(suggestions[selectedIndex]);
          } else {
            // Select product
            const productIndex = selectedIndex - suggestions.length;
            const product = results[productIndex];
            router.push(`/products/${product.id}`);
          }
        } else if (query.trim()) {
          // Perform full search
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
        setShowDropdown(false);
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    setTimeout(() => {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    }, 100);
  };

  const handleProductClick = (product: SearchResult) => {
    setShowDropdown(false);
    router.push(`/products/${product.id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, styles, or trends..."
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-500"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          {isLoading && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {showDropdown && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                    index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Product Results */}
          {results.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Products
              </div>
              {results.map((product, index) => {
                const globalIndex = suggestions.length + index;
                return (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center ${
                      globalIndex === selectedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-sm font-semibold text-blue-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 capitalize">
                          {product.category}
                        </span>
                        {!product.inStock && (
                          <span className="ml-2 text-xs text-red-500">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              
              {/* View All Results */}
              <button
                onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
                className="w-full px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100 font-medium"
              >
                View all results for "{query}"
              </button>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && suggestions.length === 0 && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;