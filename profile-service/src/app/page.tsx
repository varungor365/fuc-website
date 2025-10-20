import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Fashun
          </h1>
          <p className="text-xl md:text-2xl text-purple-300 font-light">
            Profile Service
          </p>
        </div>

        {/* Description */}
        <div className="mb-8 text-white/80">
          <p className="text-lg mb-4">
            Create your personalized link-in-bio page with advanced features like live mode, 
            virtual closets, and real-time analytics.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/demo"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🎨 View Demo Profile
          </Link>
          <Link
            href="https://www.fashun.co.in/login"
            className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 transition-colors duration-200"
          >
            Create Your Profile
          </Link>
          <Link
            href="https://www.fashun.co.in"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 transition-colors duration-200"
          >
            Visit Store
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-white font-semibold mb-2">Smart Links</h3>
            <p className="text-white/70 text-sm">
              Organize all your links in one beautiful page
            </p>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-white font-semibold mb-2">Analytics</h3>
            <p className="text-white/70 text-sm">
              Track clicks and profile views in real-time
            </p>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-white font-semibold mb-2">Customizable</h3>
            <p className="text-white/70 text-sm">
              Choose themes and customize your appearance
            </p>
          </div>
        </div>

        {/* Example Profile Link */}
        <div className="text-center">
          <p className="text-white/60 mb-4">✨ No API required - Try the demo:</p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/30 transition-all duration-200 hover:scale-105"
          >
            <span className="text-lg">🚀</span>
            <span>View Demo Profile (Works Offline!)</span>
            <span>→</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-white/60 text-sm">
            Powered by{' '}
            <Link href="https://www.fashun.co.in" className="text-purple-400 hover:text-purple-300">
              Fashun.co.in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}