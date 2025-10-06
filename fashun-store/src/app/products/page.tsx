'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/medusa-client';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const result = await getProducts();
    
    if (result.success) {
      setProducts(result.data);
      setError(null);
    } else {
      setError(result.error);
      setProducts([]);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">⚠️ Service Unavailable</h2>
          <p className="text-gray-400 mb-6">
            Our product catalog is temporarily unavailable. Please try again later.
          </p>
          <button
            onClick={loadProducts}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-500 transition"
            >
              <div className="aspect-square bg-gray-800">
                {product.thumbnail && (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-500">
                    ₹{product.variants?.[0]?.prices?.[0]?.amount / 100}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.variants?.length} variants
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}
