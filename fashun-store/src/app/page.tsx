import { Metadata } from 'next'
import Link from 'next/link'
import PersonalizedSections from '@/components/ai/PersonalizedSections'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'
import TrendingOutfits from '@/components/ai/TrendingOutfits'
import { EnhancedButton } from '@/components/ui/AdvancedUIProvider'
import AutoStockImageReplacer from '@/components/AutoStockImageReplacer'
import AIImage from '@/components/AIImage'
import { mockProducts } from '@/data/mockProducts'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Streetwear & Urban Fashion',
  description: 'Discover premium streetwear and urban fashion at FASHUN.CO. Shop exclusive collections of hoodies, t-shirts, and accessories that define your unique style.',
  keywords: 'streetwear, urban fashion, premium clothing, hoodies, t-shirts, fashion brand, FASHUN.CO'
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-black">
      {/* Dynamic Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-center py-3 text-sm font-bold animate-pulse">
        ⚡ UNAPOLOGETICALLY BOLD | FREE SHIPPING ₹999+ | Express Yourself Fearlessly ⚡
      </div>

      {/* Header - Modern Streetwear Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FASHUN.CO
            </Link>
            <nav className="hidden lg:flex items-center space-x-10">
              <Link href="/collections/men" className="text-gray-800 hover:text-purple-600 font-bold transition-colors">MEN</Link>
              <Link href="/collections/women" className="text-gray-800 hover:text-purple-600 font-bold transition-colors">WOMEN</Link>
              <Link href="/collections/all-genders" className="text-gray-800 hover:text-purple-600 font-bold transition-colors border-b-2 border-rainbow bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">ALL GENDERS</Link>
              <Link href="/collections/new-arrivals" className="text-gray-800 hover:text-purple-600 font-bold transition-colors">NEW DROPS</Link>
              <Link href="/collections/accessories" className="text-gray-800 hover:text-purple-600 font-bold transition-colors">ACCESSORIES</Link>
              <Link href="/the-canvas" className="text-gray-800 hover:text-purple-600 font-bold transition-colors">THE CANVAS</Link>
            </nav>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search bold looks..." 
                  className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 hidden md:block"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</div>
              </div>
              <button className="text-gray-700 hover:text-purple-600 transition-colors text-xl">❤️</button>
              <button className="text-gray-700 hover:text-purple-600 transition-colors text-xl">🛒</button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Unforgettable Flair */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/30 to-orange-900/20"></div>
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
              ✨ UNFORGETTABLE FLAIR AWAITS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none">
              <span className="block bg-gradient-to-r from-gray-900 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                EXPRESS
              </span>
              <span className="block bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                YOURSELF
              </span>
              <span className="block text-gray-900 text-3xl md:text-4xl font-bold mt-4">
                UNAPOLOGETICALLY
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Where art meets culture. Where fashion transcends gender. Where your individuality becomes unforgettable flair.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link href="/collections">
                <button className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white px-10 py-4 rounded-full font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  DISCOVER YOUR STYLE �
                </button>
              </Link>
              <Link href="/the-canvas">
                <button className="border-3 border-gray-900 text-gray-900 px-10 py-4 rounded-full font-black text-lg hover:bg-gray-900 hover:text-white transition-all duration-300">
                  EXPLORE THE CANVAS
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-600">50K+</div>
                <div className="text-sm text-gray-600">Bold Individuals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-pink-500">Gender-Free</div>
                <div className="text-sm text-gray-600">Fashion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-orange-500">Art & Culture</div>
                <div className="text-sm text-gray-600">Fusion</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/images/products/oversized-hoodie-black.jpg" 
                  alt="Bold Oversized Hoodie" 
                  className="rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <img 
                  src="/images/products/graphic-tee-vintage.jpg" 
                  alt="Vintage Graphic Tee" 
                  className="rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="/images/products/streetwear-joggers.jpg" 
                  alt="Statement Joggers" 
                  className="rounded-3xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <img 
                  src="/images/products/cap-urban-style.jpg" 
                  alt="Urban Style Cap" 
                  className="rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-yellow-400 text-black p-4 rounded-full font-black shadow-xl animate-bounce">
              NEW
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full font-black shadow-xl">
              30% OFF
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections - Curated Drops */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              🎨 CURATED COLLECTIONS
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              DISCOVER YOUR
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                SIGNATURE STYLE
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              From vintage 60s vibes to dark magic oversized variants - each collection tells a unique story of self-expression
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vintage 60s Collection */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 h-96">
                <div className="absolute inset-0 bg-black/20"></div>
                <img 
                  src="/images/products/vintage-collection.jpg" 
                  alt="Vintage 60s Collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold w-fit mb-4">
                    RETRO REVIVAL
                  </div>
                  <h3 className="text-2xl font-black mb-2">VINTAGE 60s COLLECTION</h3>
                  <p className="text-white/90 mb-4">Groovy graphics meet modern fits</p>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors w-fit">
                    EXPLORE VINTAGE ✨
                  </button>
                </div>
              </div>
            </div>

            {/* Dark Magic Oversized */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 h-96">
                <div className="absolute inset-0 bg-black/20"></div>
                <img 
                  src="/images/products/dark-oversized.jpg" 
                  alt="Dark Magic Oversized" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="bg-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-4">
                    OVERSIZED VIBES
                  </div>
                  <h3 className="text-2xl font-black mb-2">DARK MAGIC VARIANT</h3>
                  <p className="text-white/90 mb-4">Mysterious comfort meets street edge</p>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors w-fit">
                    EMBRACE DARKNESS 🖤
                  </button>
                </div>
              </div>
            </div>

            {/* Gender-Neutral Essentials */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-400 to-teal-500 h-96">
                <div className="absolute inset-0 bg-black/20"></div>
                <img 
                  src="/images/products/gender-neutral.jpg" 
                  alt="Gender-Neutral Collection" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="bg-rainbow text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-4 bg-gradient-to-r from-pink-400 to-purple-400">
                    GENDER-FREE
                  </div>
                  <h3 className="text-2xl font-black mb-2">ALL GENDERS ESSENTIALS</h3>
                  <p className="text-white/90 mb-4">Fashion that transcends boundaries</p>
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors w-fit">
                    BREAK BARRIERS 🌈
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop the Look - Style Guides */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              SHOP THE
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                COMPLETE LOOK
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Curated outfits on diverse models. Add the entire look to your cart with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Look 1: Bold Street */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <img 
                  src="/images/products/complete-look-1.jpg" 
                  alt="Bold Street Look" 
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                  COMPLETE LOOK
                </div>
                <div className="absolute bottom-6 right-6">
                  <button className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                    ADD ENTIRE LOOK �
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-900">THE BOLD STREET ENSEMBLE</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Oversized Hoodie - ₹1,299
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Cargo Joggers - ₹899
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Statement Cap - ₹399
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-gray-900">₹2,597</span>
                    <span className="text-lg text-gray-500 line-through ml-2">₹3,199</span>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SAVE ₹602
                  </span>
                </div>
              </div>
            </div>

            {/* Look 2: Gender-Neutral Chic */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                <img 
                  src="/images/products/complete-look-2.jpg" 
                  alt="Gender-Neutral Chic Look" 
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  GENDER-NEUTRAL
                </div>
                <div className="absolute bottom-6 right-6">
                  <button className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                    ADD ENTIRE LOOK 🛒
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-gray-900">THE TRANSCENDENT CHIC</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Boxy Fit Tee - ₹699
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Wide-leg Pants - ₹1,199
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-bold">
                    Minimalist Chain - ₹499
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-gray-900">₹2,397</span>
                    <span className="text-lg text-gray-500 line-through ml-2">₹2,897</span>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SAVE ₹500
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Community - User Generated Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              OUR
              <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                COMMUNITY
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Real people, real style, real confidence. See how our community expresses their unforgettable flair.
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold">
              <span className="mr-2">📸</span>
              #FashunFlair
            </div>
          </div>

          {/* Community Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img 
                    src={`/images/community/user-${i}.jpg`} 
                    alt={`Community Member ${i}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-sm font-bold">@user{i}</div>
                      <div className="text-xs">#FashunFlair</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="https://instagram.com/fashun.co" target="_blank">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                JOIN OUR COMMUNITY 📱
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Philosophy - Art & Culture Fusion */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                🎨 OUR PHILOSOPHY
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                WHERE ART MEETS
                <span className="block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  CULTURE
                </span>
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                We believe fashion is the ultimate canvas for self-expression. Every thread tells a story, 
                every design breaks a boundary, and every piece empowers you to be unapologetically yourself.
              </p>
              
              {/* Philosophy Points */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full font-bold">
                    🚀
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Gender-Transcendent Fashion</h3>
                    <p className="text-gray-700">Style knows no boundaries. Our collections celebrate individuality beyond traditional gender norms.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full font-bold">
                    💎
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Affordable Luxury</h3>
                    <p className="text-gray-700">Premium quality meets accessible pricing. Everyone deserves to express their unforgettable flair.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-full font-bold">
                    🌍
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Community-Driven</h3>
                    <p className="text-gray-700">Our designs are inspired by and created for our vibrant community of bold individuals.</p>
                  </div>
                </div>
              </div>
              
              <Link href="/about">
                <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                  DISCOVER OUR STORY 📖
                </button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img 
                    src="/images/philosophy/art-culture-1.jpg" 
                    alt="Art meets Culture" 
                    className="rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                  <img 
                    src="/images/philosophy/community-2.jpg" 
                    alt="Community Spirit" 
                    className="rounded-3xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-6 mt-12">
                  <img 
                    src="/images/philosophy/diversity-1.jpg" 
                    alt="Diversity & Inclusion" 
                    className="rounded-3xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                  <img 
                    src="/images/philosophy/expression-2.jpg" 
                    alt="Self Expression" 
                    className="rounded-3xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Floating Quote */}
              <div className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <p className="text-gray-900 font-bold text-sm italic">
                  "Fashion is not just what you wear, it's who you are."
                </p>
                <div className="text-xs text-gray-600 mt-2">- FASHUN.CO Philosophy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals - Latest Drops */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
              🔥 JUST DROPPED
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              FRESH
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                ARRIVALS
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              The latest drops that are setting trends and breaking boundaries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl bg-gray-100 mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEW
                    </div>
                    <div className="absolute top-4 right-4 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      ❤️
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                        QUICK ADD
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-gray-900 text-lg">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 font-bold">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/collections/new-arrivals">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-full font-black text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
                EXPLORE ALL NEW ARRIVALS 🚀
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter & Community CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            JOIN THE
            <span className="block text-yellow-300">FASHION REVOLUTION</span>
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Be the first to know about new drops, exclusive offers, and community events. 
            Plus, get 15% off your first order!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <input 
              type="email" 
              placeholder="Enter your email..."
              className="flex-1 px-6 py-4 rounded-full text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button className="bg-black text-white px-8 py-4 rounded-full font-black hover:bg-gray-800 transition-colors">
              SUBSCRIBE ✨
            </button>
          </div>
          
          <div className="text-sm text-white/80">
            Join 50,000+ fashion revolutionaries. Unsubscribe anytime.
          </div>
        </div>
      </section>

      {/* Brand Stories - TSS Style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              WEAR YOUR STORY 📖
            </h2>
            <p className="text-gray-600 text-lg">
              Every design tells a story. What's yours?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-red-500 to-blue-600 rounded-3xl p-8 mb-6">
                <div className="text-6xl mb-4">🦸‍♂️</div>
                <h3 className="text-white text-xl font-bold">BE YOUR HERO</h3>
              </div>
              <p className="text-gray-600">Channel your inner superhero with Marvel-inspired streetwear</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-8 mb-6">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-white text-xl font-bold">ANIME VIBES</h3>
              </div>
              <p className="text-gray-600">Express your otaku spirit with iconic anime designs</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-8 mb-6">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-white text-xl font-bold">GAME ON</h3>
              </div>
              <p className="text-gray-600">Level up your wardrobe with gaming legends</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - TSS Style */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              JOIN THE FASHUN TRIBE 🔥
            </h2>
            <p className="text-xl text-gray-300">
              50,000+ style enthusiasts can't be wrong!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Follow Us</h3>
              <p className="text-gray-300">@fashun.co on Instagram for daily style inspo</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Share Your Style</h3>
              <p className="text-gray-300">Tag #FashunStyle and get featured</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Exclusive Drops</h3>
              <p className="text-gray-300">First access to limited edition collections</p>
            </div>
          </div>

          <Link 
            href="https://instagram.com/fashun.co.in" 
            target="_blank"
          >
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:from-pink-600 hover:to-purple-700 transition-colors">
              FOLLOW @FASHUN.CO �
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - Modern Streetwear */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                FASHUN.CO
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Where unapologetically bold self-expression meets gender-inclusive fashion. 
                Join the revolution of affordable, trend-focused streetwear.
              </p>
              <div className="flex space-x-4">
                <Link href="https://instagram.com/fashun.co" target="_blank" className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-110">
                  📷
                </Link>
                <Link href="https://twitter.com/fashunco" target="_blank" className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-110">
                  🐦
                </Link>
                <Link href="https://youtube.com/fashunco" target="_blank" className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-110">
                  �
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-6 text-white">COLLECTIONS</h4>
              <div className="space-y-3">
                <Link href="/collections/men" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Men's Streetwear</Link>
                <Link href="/collections/women" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Women's Streetwear</Link>
                <Link href="/collections/all-genders" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">All Genders</Link>
                <Link href="/collections/new-arrivals" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">New Drops</Link>
                <Link href="/collections/accessories" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Accessories</Link>
                <Link href="/collections/vintage-60s" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Vintage 60s</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-6 text-white">SUPPORT</h4>
              <div className="space-y-3">
                <Link href="/contact" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Contact Us</Link>
                <Link href="/shipping" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Shipping & Delivery</Link>
                <Link href="/returns" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Returns & Exchange</Link>
                <Link href="/size-guide" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Size Guide</Link>
                <Link href="/faq" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">FAQs</Link>
                <Link href="/track-order" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Track Your Order</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-black mb-6 text-white">THE CANVAS</h4>
              <div className="space-y-3">
                <Link href="/the-canvas" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Editorial</Link>
                <Link href="/about" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Our Story</Link>
                <Link href="/community" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Community</Link>
                <Link href="/careers" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Join Our Team</Link>
                <Link href="/sustainability" className="block text-gray-300 hover:text-purple-400 transition-colors font-medium">Sustainability</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-gray-400 font-medium">
                  &copy; 2024 FASHUN.CO. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Made with ❤️ in India for the global streetwear community
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm font-medium">Secure Payments:</span>
                  <div className="flex space-x-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-bold">VISA</div>
                    <div className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold">MC</div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold">UPI</div>
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-md text-xs font-bold">COD</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Link href="/privacy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Privacy</Link>
                  <Link href="/terms" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
    </div>
  )
}