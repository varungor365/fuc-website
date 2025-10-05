/**
 * React Hooks for Saleor GraphQL Integration
 * High-performance, type-safe hooks for e-commerce operations
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { SaleorProduct, SaleorCategory, SaleorCollection, SaleorCheckout } from '@/lib/saleor';

// Custom hook for Saleor products
export const useSaleorProducts = (params?: {
  first?: number;
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
}) => {
  const [products, setProducts] = useState<SaleorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.first) queryParams.set('first', params.first.toString());
      if (params?.search) queryParams.set('search', params.search);
      if (params?.category) queryParams.set('category', params.category);
      if (params?.collection) queryParams.set('collection', params.collection);
      if (params?.minPrice) queryParams.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.set('maxPrice', params.maxPrice.toString());
      if (params?.isAvailable !== undefined) queryParams.set('isAvailable', params.isAvailable.toString());
      if (params?.sortBy) {
        queryParams.set('sortField', params.sortBy.field);
        queryParams.set('sortDirection', params.sortBy.direction);
      }

      const response = await fetch(`/api/saleor/products?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setIsFallback(data.fallback || false);
      } else {
        setError(data.error);
        setProducts(data.data || []);
        setIsFallback(data.fallback || false);
      }
    } catch (err) {
      setError('Failed to fetch products');
      setProducts([]);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const memoizedProducts = useMemo(() => products, [products]);

  return {
    products: memoizedProducts,
    loading,
    error,
    isFallback,
    refetch: fetchProducts
  };
};

// Custom hook for single Saleor product
export const useSaleorProduct = (id?: string, slug?: string) => {
  const [product, setProduct] = useState<SaleorProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id && !slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        if (id) queryParams.set('id', id);
        if (slug) queryParams.set('slug', slug);

        const response = await fetch(`/api/saleor/products/single?${queryParams.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.data);
          setIsFallback(data.fallback || false);
        } else {
          setError(data.error);
          setProduct(data.data || null);
          setIsFallback(data.fallback || false);
        }
      } catch (err) {
        setError('Failed to fetch product');
        setProduct(null);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, slug]);

  return {
    product,
    loading,
    error,
    isFallback
  };
};

// Custom hook for Saleor categories
export const useSaleorCategories = (first: number = 20) => {
  const [categories, setCategories] = useState<SaleorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/saleor/categories?first=${first}`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
          setIsFallback(data.fallback || false);
        } else {
          setError(data.error);
          setCategories([]);
          setIsFallback(data.fallback || false);
        }
      } catch (err) {
        setError('Failed to fetch categories');
        setCategories([]);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [first]);

  return {
    categories,
    loading,
    error,
    isFallback
  };
};

// Custom hook for Saleor collections
export const useSaleorCollections = (first: number = 20) => {
  const [collections, setCollections] = useState<SaleorCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/saleor/collections?first=${first}`);
        const data = await response.json();
        
        if (data.success) {
          setCollections(data.data);
          setIsFallback(data.fallback || false);
        } else {
          setError(data.error);
          setCollections([]);
          setIsFallback(data.fallback || false);
        }
      } catch (err) {
        setError('Failed to fetch collections');
        setCollections([]);
        setIsFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [first]);

  return {
    collections,
    loading,
    error,
    isFallback
  };
};

// Custom hook for Saleor search
export const useSaleorSearch = () => {
  const [results, setResults] = useState<SaleorProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, limit: number = 20) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/saleor/products?search=${encodeURIComponent(query)}&first=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error);
        setResults([]);
      }
    } catch (err) {
      setError('Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearSearch
  };
};

// Custom hook for Saleor checkout operations
export const useSaleorCheckout = () => {
  const [checkout, setCheckout] = useState<SaleorCheckout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckout = useCallback(async (lines: Array<{ variantId: string; quantity: number }>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/saleor/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lines }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCheckout(data.data);
        return data.data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Failed to create checkout');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCheckout = useCallback(async (checkoutId: string, lines: Array<{ variantId: string; quantity: number }>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/saleor/checkout/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkoutId, lines }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCheckout(data.data);
        return data.data;
      } else {
        setError(data.error);
        return null;
      }
    } catch (err) {
      setError('Failed to add to checkout');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrCreateCheckout = useCallback(async () => {
    // Check if we have a saved checkout token in localStorage
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('saleor-checkout-token') : null;
    
    if (savedToken) {
      try {
        const response = await fetch(`/api/saleor/checkout/${savedToken}`);
        const data = await response.json();
        
        if (data.success) {
          setCheckout(data.data);
          return data.data;
        }
      } catch (err) {
        // If fetching saved checkout fails, create a new one
        console.warn('Failed to fetch saved checkout, creating new one');
      }
    }

    // Create new checkout if no saved one exists or fetching failed
    const newCheckout = await createCheckout([]);
    if (newCheckout && typeof window !== 'undefined') {
      localStorage.setItem('saleor-checkout-token', newCheckout.token);
    }
    
    return newCheckout;
  }, [createCheckout]);

  return {
    checkout,
    loading,
    error,
    createCheckout,
    addToCheckout,
    getOrCreateCheckout
  };
};

// Saleor connection status indicator component  
export const SaleorStatus = ({ className = '' }: { className?: string }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/saleor/products?first=1');
        const data = await response.json();
        
        setStatus(data.fallback ? 'disconnected' : 'connected');
      } catch {
        setStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  const statusStyles = {
    checking: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    connected: 'bg-green-500/20 text-green-300 border-green-500/40',
    disconnected: 'bg-red-500/20 text-red-300 border-red-500/40'
  };

  const statusText = {
    checking: 'Checking Saleor Connection...',
    connected: 'Saleor GraphQL Connected',
    disconnected: 'Saleor Offline (Using Fallback)'
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]} ${className}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${status === 'connected' ? 'bg-green-400' : status === 'disconnected' ? 'bg-red-400' : 'bg-yellow-400'}`} />
      {statusText[status]}
    </div>
  );
};

// Performance optimization hook for product filtering
export const useSaleorProductFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    collection: '',
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: { field: 'CREATED_AT', direction: 'DESC' as 'ASC' | 'DESC' },
    isAvailable: true
  });

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      collection: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: { field: 'CREATED_AT', direction: 'DESC' },
      isAvailable: true
    });
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters
  };
};

export default {
  useSaleorProducts,
  useSaleorProduct,
  useSaleorCategories,
  useSaleorCollections,
  useSaleorSearch,
  useSaleorCheckout,
  useSaleorProductFilters,
  SaleorStatus
};