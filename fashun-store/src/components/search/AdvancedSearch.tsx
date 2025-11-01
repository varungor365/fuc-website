'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchProducts, getCollectionProducts } from '@/lib/shopify/client';
import ShopifyProductGrid from '@/components/shopify/ShopifyProductGrid';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOptions {
  priceRange: [number, number];
  vendors: string[];
  productTypes: string[];
  tags: string[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'best-selling';
}

export default function AdvancedSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const collection = searchParams.get('collection');

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    vendors: [],
    productTypes: [],
    tags: [],
    sortBy: 'relevance',
  });

  const [availableFilters, setAvailableFilters] = useState({
    vendors: [] as string[],
    productTypes: [] as string[],
    tags: [] as string[],
  });

  useEffect(() => {
    loadProducts();
  }, [query, collection]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data;
      if (collection) {
        data = await getCollectionProducts(collection, 100);
        setProducts(data?.products.edges.map((edge: any) => edge.node) || []);
      } else if (query) {
        data = await searchProducts(query, 100);
        setProducts(data?.edges.map((edge: any) => edge.node) || []);
      }

      // Extract available filter options
      if (data) {
        const prods = collection 
          ? data.products.edges.map((e: any) => e.node)
          : data.edges.map((e: any) => e.node);

        const vendors = ([...new Set(prods.map((p: any) => p.vendor))].filter(Boolean)) as string[];
        const types = ([...new Set(prods.map((p: any) => p.productType))].filter(Boolean)) as string[];
        const allTags = prods.flatMap((p: any) => p.tags || []);
        const tags = ([...new Set(allTags)].filter(Boolean)) as string[];

        setAvailableFilters({ vendors, productTypes: types, tags });
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Vendor filter
    if (filters.vendors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.vendors.includes(product.vendor)
      );
    }

    // Product type filter
    if (filters.productTypes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.productTypes.includes(product.productType)
      );
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((product) =>
        filters.tags.some((tag) => product.tags?.includes(tag))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case 'price-high':
        filtered.sort((a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case 'newest':
        filtered.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    setFilters((prev) => {
      const current = prev[type] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      vendors: [],
      productTypes: [],
      tags: [],
      sortBy: 'relevance',
    });
  };

  const activeFilterCount =
    filters.vendors.length +
    filters.productTypes.length +
    filters.tags.length +
    (filters.sortBy !== 'relevance' ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold mb-2">
            {collection ? 'Collection' : 'Search Results'}
          </h1>
          {query && (
            <p className="text-white/60">
              Showing results for <span className="text-accent-purple font-semibold">"{query}"</span>
            </p>
          )}
          <p className="text-white/60 mt-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-xl hover:border-accent-purple/50 transition-all"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-accent-purple rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="px-6 py-3 bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-xl hover:border-accent-purple/50 transition-all focus:outline-none focus:border-accent-purple"
          >
            <option value="relevance">Most Relevant</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-primary-900/75 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center justify-between">
                    Price Range
                    <span className="text-sm text-white/60">
                      ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                    </span>
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                        })
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Brands/Vendors */}
                {availableFilters.vendors.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Brands</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.vendors.map((vendor) => (
                        <button
                          key={vendor}
                          onClick={() => toggleFilter('vendors', vendor)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            filters.vendors.includes(vendor)
                              ? 'bg-accent-purple text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {vendor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Types */}
                {availableFilters.productTypes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.productTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => toggleFilter('productTypes', type)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            filters.productTypes.includes(type)
                              ? 'bg-accent-purple text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {availableFilters.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {availableFilters.tags.slice(0, 20).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleFilter('tags', tag)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            filters.tags.includes(tag)
                              ? 'bg-accent-purple text-white'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* We'll reuse product cards here */}
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-primary-900/75 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
                {/* Product card content */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Filter className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-white/60 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-xl font-semibold hover:shadow-lg hover:shadow-accent-purple/50 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
