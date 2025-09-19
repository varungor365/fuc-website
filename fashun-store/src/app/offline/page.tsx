'use client'

import React from 'react'
import Link from 'next/link'
import { WifiOff, RefreshCw, Home, ShoppingBag, Heart } from 'lucide-react'

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoOnline = () => {
    if ('serviceWorker' in navigator) {
      // Trigger sync when connection is restored
      navigator.serviceWorker.ready.then(registration => {
        // Check if background sync is supported
        if ('sync' in registration) {
          (registration as any).sync.register('cart-sync')
          (registration as any).sync.register('review-sync')
        }
      })
    }
    handleRetry()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Offline Icon with Animation */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="relative bg-gray-800 rounded-full p-6 border border-gray-700">
            <WifiOff className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-white mb-4">
            You're Offline
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            No internet connection detected. Some features may be limited.
          </p>

          {/* Cached Content Notice */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">
              Available Offline Features:
            </h2>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Browse cached products
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                View saved designs
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Read cached articles
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Cart changes will sync when online
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoOnline}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <div className="grid grid-cols-3 gap-3 pt-4">
              <Link
                href="/"
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <Home className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-300">Home</span>
              </Link>

              <Link
                href="/products"
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <ShoppingBag className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-300">Products</span>
              </Link>

              <Link
                href="/account/wishlist"
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <Heart className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-gray-300">Wishlist</span>
              </Link>
            </div>
          </div>

          {/* Connection Status */}
          <div className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Waiting for connection...</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-gray-500 text-sm">
            FASHUN.CO - Streetwear Empire
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Progressive Web App Mode
          </p>
        </div>
      </div>

      {/* Connection Detection Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Detect when connection is restored
            window.addEventListener('online', function() {
              if (window.location.pathname === '/offline') {
                window.location.href = '/';
              }
            });

            // Auto-retry connection every 10 seconds
            let retryInterval = setInterval(function() {
              if (navigator.onLine) {
                clearInterval(retryInterval);
                window.location.href = '/';
              }
            }, 10000);

            // Service Worker messaging
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.addEventListener('message', function(event) {
                if (event.data.type === 'CONNECTION_RESTORED') {
                  window.location.href = '/';
                }
              });
            }
          `
        }}
      />
    </div>
  )
}
