'use client'

import Link from 'next/link';
import AIRecommendations from '@/components/product/AIRecommendations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section with Animated Background */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              FASHUN
            </h1>
            <p className="text-2xl md:text-4xl text-gray-300 mb-4">Next-Gen Streetwear Platform</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              AI-Powered Design Studio • Creator Royalties • Virtual Try-On
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              href="/products"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              Shop Now
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/studio"
              className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full font-bold text-lg border border-white/20 transition-all transform hover:scale-105"
            >
              Create Designs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-sm text-gray-400">Designs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">5K+</div>
              <div className="text-sm text-gray-400">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Explore Features
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Link href="/studio" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-purple-500/50 hover:border-purple-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
            <h3 className="text-2xl font-bold mb-3">Creator Studio</h3>
            <p className="text-gray-400 mb-4">AI Pattern Generator, Design Remix, 10% Royalties</p>
            <span className="text-purple-400 font-bold group-hover:translate-x-2 inline-block transition-transform">Explore →</span>
          </Link>

          <Link href="/customize" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/50 hover:border-yellow-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">✨</div>
            <h3 className="text-2xl font-bold mb-3">Customize Yourself</h3>
            <p className="text-gray-400 mb-4">Design your own T-shirt with AI virtual try-on</p>
            <span className="text-yellow-400 font-bold group-hover:translate-x-2 inline-block transition-transform">Create →</span>
          </Link>

          <Link href="/products" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-pink-500/50 hover:border-pink-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛍️</div>
            <h3 className="text-2xl font-bold mb-3">Shop Collection</h3>
            <p className="text-gray-400 mb-4">Premium streetwear with fast delivery</p>
            <span className="text-pink-400 font-bold group-hover:translate-x-2 inline-block transition-transform">Shop →</span>
          </Link>

          <Link href="/community/submit" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-green-500/50 hover:border-green-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🤝</div>
            <h3 className="text-2xl font-bold mb-3">Community Hub</h3>
            <p className="text-gray-400 mb-4">Submit designs and earn royalties</p>
            <span className="text-green-400 font-bold group-hover:translate-x-2 inline-block transition-transform">Submit →</span>
          </Link>

          <Link href="/track-order" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-orange-500/50 hover:border-orange-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📦</div>
            <h3 className="text-2xl font-bold mb-3">Track Orders</h3>
            <p className="text-gray-400 mb-4">Real-time tracking with 5 carriers</p>
            <span className="text-orange-400 font-bold group-hover:translate-x-2 inline-block transition-transform">Track →</span>
          </Link>

          <Link href="/wishlist" className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-red-500/50 hover:border-red-500 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">❤️</div>
            <h3 className="text-2xl font-bold mb-3">My Wishlist</h3>
            <p className="text-gray-400 mb-4">Save and manage your favorites</p>
            <span className="text-red-400 font-bold group-hover:translate-x-2 inline-block transition-transform">View →</span>
          </Link>
        </div>

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Admin Section */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 backdrop-blur-md rounded-2xl p-8 border border-red-500/50 mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">🎛️ Admin Control Center</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
              { href: '/admin/orders', icon: '📦', label: 'Orders' },
              { href: '/admin/system-health', icon: '🏥', label: 'Health' },
              { href: '/admin/features', icon: '🎚️', label: 'Features' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white/10 rounded-xl p-6 text-center hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold">{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
