import { Metadata } from 'next'
import Link from 'next/link'
import PersonalizedSections from '@/components/ai/PersonalizedSections'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'
import TrendingOutfits from '@/components/ai/TrendingOutfits'
import { EnhancedButton } from '@/components/ui/AdvancedUIProvider'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Streetwear & Urban Fashion',
  description: 'Discover premium streetwear and urban fashion at FASHUN.CO. Shop exclusive collections of hoodies, t-shirts, and accessories that define your unique style.',
  keywords: 'streetwear, urban fashion, premium clothing, hoodies, t-shirts, fashion brand, FASHUN.CO'
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              FASHUN.CO
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="hover:text-purple-400 transition-colors">About</Link>
              <Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-purple-400 transition-colors">Terms</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              FASHUN
            </span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-white bg-clip-text text-transparent">
              REVOLUTION
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Discover premium streetwear that defines your style. From bold graphics to minimalist designs, 
            every piece tells your story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections">
              <EnhancedButton 
                variant="primary" 
                size="lg" 
                soundEffect="chime"
                confettiEffect="achievement"
                className="px-8 py-4"
              >
                Shop Collections
              </EnhancedButton>
            </Link>
            <Link href="/ui-demo">
              <EnhancedButton 
                variant="secondary" 
                size="lg" 
                soundEffect="pop"
                className="px-8 py-4"
              >
                Try UI Demo
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-400">On orders above ₹999</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">100% Authentic</h3>
              <p className="text-gray-400">Premium quality guaranteed</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-400">7-day hassle-free returns</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Delivery</h3>
              <p className="text-gray-400">2-3 days across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Personalized Sections */}
      <PersonalizedSections userId="demo-user" />

      {/* Trending AI Outfits */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <TrendingOutfits />
        </div>
      </section>

      {/* Instagram Community */}
      <section className="py-20 px-4 bg-gradient-to-r from-black/40 to-purple-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">#FashunCommunity</h2>
          <p className="text-xl text-gray-300 mb-8">Follow @fashun.co.in - See how our community styles FASHUN.CO</p>
          <Link 
            href="https://instagram.com/fashun.co.in" 
            target="_blank"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">📷</span>
            Follow @fashun.co.in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-r from-purple-900/10 to-pink-900/10 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FASHUN.CO
              </h3>
              <p className="text-gray-400">
                Premium streetwear that defines your unique style and personality.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
                <Link href="/shipping" className="block text-gray-400 hover:text-white transition-colors">Shipping</Link>
                <Link href="/returns" className="block text-gray-400 hover:text-white transition-colors">Returns</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="https://instagram.com/fashun.co.in" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  Instagram
                </Link>
                <Link href="https://twitter.com/fashunco" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FASHUN.CO. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Style Assistant - Floating Button */}
      <StyleAssistantButton />
    </div>
  )
}