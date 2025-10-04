import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* AI-Generated Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-900/50 via-transparent to-emerald-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
        
        {/* Animated floating elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h50v50H0z' /%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">🚀</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                FUC Portfolio Pro
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-200 hover:text-white px-4 py-2 rounded-xl text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
              >
                Start Free ✨
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-sm font-semibold text-white">🎉</span>
              <span className="text-sm font-semibold text-white">LIFETIME FREE • PERMANENT LINKS • NO LIMITS</span>
              <span className="text-sm font-semibold text-white">🎉</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
              Your Stunning
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Digital Portfolio
            </span>
          </h1>
          
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-200 leading-relaxed">
            Create breathtaking portfolio pages with <span className="text-cyan-300 font-semibold">25+ social media platforms</span>, 
            generate QR codes, and build your permanent digital presence. 
            <span className="text-purple-300 font-semibold"> No expiration. No limits. Yours forever.</span>
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="group w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 border border-white/20"
            >
              <span className="mr-2">🚀</span>
              Create Your Portfolio Free
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/profile/varungor365"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              <span className="mr-2">👀</span>
              View Demo Portfolio
            </Link>
          </div>
        </div>

        {/* Enhanced Features */}
        <div className="mt-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Everything You Need, Forever Free
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Build your digital empire with our comprehensive toolkit. No subscriptions, no limits, no expiration dates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Portfolio Feature */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Stunning Portfolios</h3>
                  <p className="text-gray-300 leading-relaxed">
                    AI-generated beautiful designs with support for <strong className="text-purple-300">25+ social platforms</strong>. 
                    Instagram, TikTok, LinkedIn, GitHub, Spotify, and many more.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code Feature */}
            <div className="group">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Smart QR Codes</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Generate beautiful, customizable QR codes that <strong className="text-cyan-300">never expire</strong>. 
                    Perfect for business cards, marketing, and sharing your profile instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Independence Feature */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Permanent & Independent</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Your links are <strong className="text-emerald-300">yours forever</strong>. 
                    Self-hosted, deployment-independent, and guaranteed to work for a lifetime. No vendor lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Platforms Showcase */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Support for 25+ Social Media Platforms
            </h2>
            <p className="text-gray-300 text-lg">
              Connect all your social profiles in one beautiful, permanent link
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
              {[
                { name: 'Instagram', icon: '📷', color: 'from-pink-500 to-red-500' },
                { name: 'Twitter', icon: '𝕏', color: 'from-gray-800 to-black' },
                { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' },
                { name: 'GitHub', icon: '🐙', color: 'from-gray-700 to-gray-900' },
                { name: 'YouTube', icon: '📺', color: 'from-red-600 to-red-800' },
                { name: 'TikTok', icon: '🎵', color: 'from-black via-pink-500 to-cyan-400' },
                { name: 'Spotify', icon: '🎧', color: 'from-green-500 to-green-700' },
                { name: 'Discord', icon: '🎮', color: 'from-indigo-600 to-purple-600' },
                { name: 'Behance', icon: '🎨', color: 'from-blue-500 to-indigo-600' },
                { name: 'Dribbble', icon: '🏀', color: 'from-pink-500 to-rose-500' },
                { name: 'Medium', icon: '✍️', color: 'from-green-500 to-emerald-600' },
                { name: 'Telegram', icon: '✈️', color: 'from-sky-500 to-blue-600' },
                { name: 'WhatsApp', icon: '💬', color: 'from-green-400 to-green-600' },
                { name: 'Snapchat', icon: '👻', color: 'from-yellow-400 to-yellow-600' },
                { name: 'Pinterest', icon: '📌', color: 'from-red-500 to-pink-500' },
                { name: 'Reddit', icon: '🗨️', color: 'from-orange-500 to-red-500' }
              ].map((platform) => (
                <div
                  key={platform.name}
                  className={`flex flex-col items-center p-4 bg-gradient-to-r ${platform.color} rounded-2xl shadow-lg hover:scale-110 transition-all duration-300`}
                  title={platform.name}
                >
                  <span className="text-2xl mb-2">{platform.icon}</span>
                  <span className="text-xs text-white font-semibold text-center">{platform.name}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-300 text-sm">
                And many more! Custom platform support available.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-4xl mb-6">🎯</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Digital Empire?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators, entrepreneurs, and professionals who trust our platform for their digital presence.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 border border-white/20"
            >
              <span className="mr-3">🚀</span>
              Start Building Now - It's Free!
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              ✅ No Credit Card Required • ✅ Setup in 2 Minutes • ✅ Lifetime Free Access
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}