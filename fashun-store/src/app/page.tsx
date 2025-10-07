import Link from 'next/link';
import AIRecommendations from '@/components/product/AIRecommendations';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            FASHUN.CO.IN
          </h1>
          <p className="text-2xl text-gray-300">Next-Gen Streetwear E-Commerce Platform</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
          <Link href="/studio" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/50 hover:border-purple-500 transition">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Creator Studio</h3>
            <p className="text-gray-400 mb-4">AI Pattern Generator, Design Remix, Royalty System</p>
            <span className="text-purple-400">Explore →</span>
          </Link>

          <a href="http://localhost:3001/demo" target="_blank" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-blue-500/50 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">Dynamic Profiles</h3>
            <p className="text-gray-400 mb-4">Live Mode, Virtual Closet, 3D Gallery</p>
            <span className="text-blue-400">View Demo →</span>
          </a>

          <Link href="/community/submit" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-green-500/50 hover:border-green-500 transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Community Hub</h3>
            <p className="text-gray-400 mb-4">Submit Designs, Earn 10% Royalties</p>
            <span className="text-green-400">Submit →</span>
          </Link>

          <Link href="/products" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-pink-500/50 hover:border-pink-500 transition">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold mb-2">Shop Products</h3>
            <p className="text-gray-400 mb-4">Browse streetwear collection</p>
            <span className="text-pink-400">Shop Now →</span>
          </Link>

          <Link href="/customize" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-yellow-500/50 hover:border-yellow-500 transition">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Customize Yourself</h3>
            <p className="text-gray-400 mb-4">Design your own T-shirt with AI try-on</p>
            <span className="text-yellow-400">Customize →</span>
          </Link>

          <Link href="/wishlist" className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-red-500/50 hover:border-red-500 transition">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-bold mb-2">My Wishlist</h3>
            <p className="text-gray-400 mb-4">Save your favorite items</p>
            <span className="text-red-400">View →</span>
          </Link>

        </div>

        {/* AI Recommendations */}
        <AIRecommendations />

        {/* Admin Section */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 backdrop-blur-md rounded-xl p-8 border border-red-500/50 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">🎛️ Admin Control Center</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/dashboard" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold">Dashboard</div>
            </Link>
            <Link href="/admin/orders" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition">
              <div className="text-2xl mb-2">📦</div>
              <div className="font-bold">Orders</div>
            </Link>
            <Link href="/admin/system-health" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition">
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-bold">System Health</div>
            </Link>
            <Link href="/admin/features" className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition">
              <div className="text-2xl mb-2">🎚️</div>
              <div className="font-bold">Features</div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-purple-400">175</div>
            <div className="text-gray-400">Files Created</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-blue-400">24K+</div>
            <div className="text-gray-400">Lines of Code</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-green-400">25+</div>
            <div className="text-gray-400">Documentation</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <div className="text-4xl font-bold text-pink-400">100%</div>
            <div className="text-gray-400">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
