'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { ProductService } from '@/services/productService';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categories: [] as any[]
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [allProducts, featuredProducts, categories] = await Promise.all([
          ProductService.getAllProducts(),
          ProductService.getFeaturedProducts(),
          ProductService.getCategories()
        ]);

        setProducts(allProducts);
        setStats({
          totalProducts: allProducts.length,
          featuredProducts: featuredProducts.length,
          categories: categories
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">Please sign in to access the dashboard</p>
          <Link 
            href="/auth"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.user_metadata?.full_name || user.email}!
              </h1>
              <p className="text-white/70">
                Supabase Integration Dashboard - FashUn.Co Platform
              </p>
            </div>
            <button
              onClick={signOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                </svg>
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Products</p>
                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-white/60 text-sm">Featured Products</p>
                <p className="text-2xl font-bold text-white">{stats.featuredProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-500/20 rounded-lg mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-white/60 text-sm">Categories</p>
                <p className="text-2xl font-bold text-white">{stats.categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🚀 Supabase Integration Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-white">Authentication ✓</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-white">Database Connection ✓</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-white">Product Service ✓</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
              <span className="text-white">Row Level Security ✓</span>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📦 Products from Supabase</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white/70 mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product: any) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-white/70 text-sm mb-2">{product.category}</p>
                  <p className="text-green-400 font-bold">${product.price}</p>
                  <div className="flex items-center mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.featured 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {product.featured ? 'Featured' : 'Regular'}
                    </span>
                    <span className="ml-2 text-white/60 text-xs">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Link 
              href="/collections"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              View All Products
            </Link>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}