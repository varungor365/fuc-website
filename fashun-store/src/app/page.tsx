import { Metadata } from 'next'
import Link from 'next/link'
import { mockProducts } from '@/data/mockProducts'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Unapologetically Bold Streetwear | Gender-Inclusive Fashion',
  description: 'Express your unforgettable flair with FASHUN.CO - India\'s boldest streetwear brand. Affordable, trend-focused, gender-inclusive fashion for the modern urban youth.',
  keywords: 'affordable streetwear India, oversized hoodies, graphic tees, gender-neutral clothing, urban fashion, bold streetwear, youth fashion, trendy clothes'
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white text-center py-3 text-sm font-bold animate-pulse">
        🔥 LAUNCH WEEK: Flat 40% OFF Everything | Free Express Shipping | #UnforgettableFlair
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text">
              FASHUN.CO
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/collections/men" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                MEN
              </Link>
              <Link href="/collections/women" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                WOMEN
              </Link>
              <Link href="/collections/all-genders" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors border-b-2 border-purple-500">
                ALL GENDERS
              </Link>
              <Link href="/collections/new-arrivals" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                NEW DROPS
              </Link>
              <Link href="/collections/vintage-60s" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                VINTAGE 60S
              </Link>
              <Link href="/accessories" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                ACCESSORIES
              </Link>
              <Link href="/the-canvas" className="text-gray-800 hover:text-purple-600 font-semibold transition-colors">
                THE CANVAS
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input 
                  type="search" 
                  placeholder="Search styles..."
                  className="hidden md:block w-64 px-4 py-2 rounded-full border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-sm"
                />
                <button className="md:hidden text-gray-700 hover:text-purple-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button className="relative text-gray-700 hover:text-purple-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <button className="relative text-gray-700 hover:text-purple-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5h6" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold Lifestyle Imagery */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-orange-900/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop')`
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full px-6 py-3 text-white font-semibold">
                <span className="w-2 h-2 bg-lime-400 rounded-full mr-3 animate-pulse"></span>
                UNAPOLOGETICALLY BOLD
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] text-white">
                UNFORGETTABLE
                <br />
                <span className="text-transparent bg-gradient-to-r from-lime-400 via-pink-500 to-purple-600 bg-clip-text">
                  FLAIR
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-lg">
                Where art meets culture. Gender-transcendent streetwear for the modern rebel who refuses to blend in.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/collections/coordinated-sets">
                  <button className="bg-gradient-to-r from-lime-400 to-cyan-400 text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-2xl">
                    SHOP COORDINATED SETS
                  </button>
                </Link>
                <Link href="/collections/statement-hoodies">
                  <button className="border-3 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all">
                    STATEMENT HOODIES
                  </button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold text-lime-400">50K+</div>
                  <div className="text-sm">Urban Rebels</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">100%</div>
                  <div className="text-sm">Authentic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-sm">Self-Expression</div>
                </div>
              </div>
            </div>

            {/* Featured Look */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Today's Featured Look</h3>
                  <p className="text-white/70">"Dark Magic Oversized" Coordinated Set</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=600&fit=crop" 
                  alt="Dark Magic Oversized Coordinated Set" 
                  className="w-full h-80 object-cover rounded-2xl mb-6"
                />
                <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                  SHOP THIS LOOK - ₹2,499
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-lime-400 rounded-full animate-bounce opacity-20"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-16 bg-pink-500 rounded-full animate-pulse opacity-30"></div>
      </section>

      {/* Quick Shop Categories */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              SHOP BY VIBE
            </h2>
            <p className="text-xl text-gray-600">
              Find your perfect expression
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { 
                name: "Oversized", 
                icon: "�", 
                color: "from-orange-500 to-red-500",
                description: "Boxy Comfort"
              },
              { 
                name: "Vintage 60s", 
                icon: "✨", 
                color: "from-purple-500 to-pink-500",
                description: "Retro Graphics"
              },
              { 
                name: "Dark Magic", 
                icon: "�", 
                color: "from-gray-800 to-black",
                description: "Punk Influences"
              },
              { 
                name: "Neon Punk", 
                icon: "⚡", 
                color: "from-lime-400 to-cyan-400",
                description: "Bold Colors"
              },
              { 
                name: "Coordinated", 
                icon: "�", 
                color: "from-blue-500 to-purple-500",
                description: "Complete Sets"
              },
              { 
                name: "Gender Free", 
                icon: "🌈", 
                color: "from-pink-400 to-purple-600",
                description: "All Identities"
              }
            ].map((category, index) => (
              <Link key={category.name} href={`/collections/${category.name.toLowerCase().replace(' ', '-')}`}>
                <div className="group cursor-pointer">
                  <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 text-center text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <div className="font-black text-lg mb-2">{category.name}</div>
                    <div className="text-sm opacity-90">{category.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop the Look Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              SHOP THE <span className="text-transparent bg-gradient-to-r from-lime-400 to-pink-500 bg-clip-text">LOOK</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete outfits curated for maximum impact. Add the entire look to your cart with one click.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Look 1: Neon Rebellion */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lime-400 to-cyan-400 p-1">
                <div className="bg-black rounded-3xl p-8">
                  <div className="aspect-[3/4] mb-6 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop" 
                      alt="Neon Rebellion Look" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-lime-400 mb-3">NEON REBELLION</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Oversized Neon Hoodie</span>
                      <span className="text-white font-bold">₹1,899</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Matching Joggers</span>
                      <span className="text-white font-bold">₹1,299</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Neon Cap</span>
                      <span className="text-white font-bold">₹799</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                      <span className="text-gray-400">Total Individual:</span>
                      <span className="text-gray-400 line-through">₹3,997</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lime-400 font-bold">Complete Set:</span>
                      <span className="text-lime-400 font-bold text-xl">₹2,999</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-lime-400 to-cyan-400 text-black py-4 rounded-full font-black hover:scale-105 transition-transform">
                    ADD COMPLETE LOOK
                  </button>
                </div>
              </div>
            </div>

            {/* Look 2: Dark Academia */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                <div className="bg-black rounded-3xl p-8">
                  <div className="aspect-[3/4] mb-6 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop" 
                      alt="Dark Academia Look" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-purple-400 mb-3">DARK ACADEMIA</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Vintage Graphic Tee</span>
                      <span className="text-white font-bold">₹1,299</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Dark Magic Overshirt</span>
                      <span className="text-white font-bold">₹2,199</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Chain Accessories</span>
                      <span className="text-white font-bold">₹899</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                      <span className="text-gray-400">Total Individual:</span>
                      <span className="text-gray-400 line-through">₹4,397</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 font-bold">Complete Set:</span>
                      <span className="text-purple-400 font-bold text-xl">₹3,299</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-full font-black hover:scale-105 transition-transform">
                    ADD COMPLETE LOOK
                  </button>
                </div>
              </div>
            </div>

            {/* Look 3: Gender-Free Comfort */}
            <div className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 to-orange-400 p-1">
                <div className="bg-black rounded-3xl p-8">
                  <div className="aspect-[3/4] mb-6 rounded-2xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop" 
                      alt="Gender-Free Comfort Look" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-pink-400 mb-3">GENDER-FREE COMFORT</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Soft Oversized Hoodie</span>
                      <span className="text-white font-bold">₹1,799</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Relaxed Fit Pants</span>
                      <span className="text-white font-bold">₹1,499</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Rainbow Pin Set</span>
                      <span className="text-white font-bold">₹599</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                      <span className="text-gray-400">Total Individual:</span>
                      <span className="text-gray-400 line-through">₹3,897</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-pink-400 font-bold">Complete Set:</span>
                      <span className="text-pink-400 font-bold text-xl">₹2,799</span>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-pink-400 to-orange-400 text-black py-4 rounded-full font-black hover:scale-105 transition-transform">
                    ADD COMPLETE LOOK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              NEW DROPS & <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text">BESTSELLERS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh arrivals and community favorites. Limited quantities, unlimited expression.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vintage 60s Collection */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-1">
                <div className="bg-white rounded-3xl p-8">
                  <div className="absolute top-6 right-6 bg-lime-400 text-black px-4 py-2 rounded-full text-sm font-black">
                    NEW DROP
                  </div>
                  <div className="space-y-6">
                    <div className="text-6xl text-center">🌈</div>
                    <h3 className="text-3xl font-black text-gray-900">VINTAGE 60S COLLECTION</h3>
                    <p className="text-gray-600 text-lg">Retro graphics meet modern streetwear. Peace, love, and oversized fits.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-purple-600">From ₹899</span>
                      <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                        EXPLORE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Magic Oversized */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 to-black p-1">
                <div className="bg-gray-900 rounded-3xl p-8 text-white">
                  <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-black">
                    BESTSELLER
                  </div>
                  <div className="space-y-6">
                    <div className="text-6xl text-center">🌙</div>
                    <h3 className="text-3xl font-black">DARK MAGIC OVERSIZED</h3>
                    <p className="text-gray-300 text-lg">Punk influences with a modern twist. For those who embrace the darkness.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-lime-400">From ₹1,299</span>
                      <button className="bg-gradient-to-r from-lime-400 to-cyan-400 text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinated Sets */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                <div className="bg-white rounded-3xl p-8">
                  <div className="absolute top-6 right-6 bg-cyan-400 text-black px-4 py-2 rounded-full text-sm font-black">
                    TRENDING
                  </div>
                  <div className="space-y-6">
                    <div className="text-6xl text-center">�</div>
                    <h3 className="text-3xl font-black text-gray-900">COORDINATED SETS</h3>
                    <p className="text-gray-600 text-lg">Effortless matching pieces. Maximum impact, minimal effort.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-blue-600">From ₹1,999</span>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                        MATCH UP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Favorites */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              COMMUNITY <span className="text-transparent bg-gradient-to-r from-lime-400 to-pink-500 bg-clip-text">FAVORITES</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Pieces our urban rebels can't stop wearing. Rated 5★ by the community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockProducts.slice(0, 4).map((product, index) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${
                          index === 0 ? 'bg-red-500' : 
                          index === 1 ? 'bg-lime-400 text-black' : 
                          index === 2 ? 'bg-purple-500' : 'bg-cyan-400 text-black'
                        }`}>
                          {index === 0 ? 'BESTSELLER' : 
                           index === 1 ? 'NEW DROP' : 
                           index === 2 ? 'LIMITED' : 'TRENDING'}
                        </span>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                          ❤️
                        </button>
                        <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-black hover:bg-white transition-colors">
                          👁️
                        </button>
                      </div>

                      {/* Size Dots */}
                      <div className="absolute bottom-4 left-4 flex space-x-2">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                          <div key={size} className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-xs font-bold">
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 text-lg">★</span>
                          <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                          <span className="text-xs text-gray-500">(847)</span>
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-full font-bold hover:scale-105 transition-transform">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/collections/bestsellers">
              <button className="bg-gradient-to-r from-gray-900 to-black text-white px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl">
                EXPLORE ALL COMMUNITY FAVORITES
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Showcase - UGC Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              OUR <span className="text-transparent bg-gradient-to-r from-lime-400 to-pink-500 bg-clip-text">COMMUNITY</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Brand camaraderie at its finest. See how our urban rebels style FASHUN.CO
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-lime-400 to-cyan-400 text-black px-6 py-3 rounded-full font-bold">
              <span className="mr-2">📸</span>
              Tag #UnforgettableFlair to get featured
            </div>
          </div>

          {/* UGC Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
            {Array.from({length: 12}).map((_, index) => (
              <div key={index} className="group cursor-pointer relative aspect-square rounded-2xl overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1515886657613 + index}?w=300&h=300&fit=crop&face`}
                  alt={`Community member ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-bold text-sm">@rebel_{index + 1}</div>
                    <div className="text-xs text-gray-300">2.4k likes</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white">
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-black text-lime-400 mb-2">50K+</div>
              <div className="text-gray-300">Urban Rebels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-pink-400 mb-2">15K</div>
              <div className="text-gray-300">Daily Posts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">98%</div>
              <div className="text-gray-300">Love Our Fits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Self-Expression</div>
            </div>
          </div>

          <div className="text-center">
            <Link href="https://instagram.com/fashun.co" target="_blank">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl">
                JOIN OUR COMMUNITY
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-gradient-to-r from-lime-400 to-cyan-400 text-black px-6 py-3 rounded-full font-bold">
                <span className="mr-2">✨</span>
                Our Philosophy
              </div>
              
              <h2 className="text-5xl font-black text-gray-900 leading-tight">
                WHERE ART MEETS 
                <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text"> CULTURE</span>
              </h2>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                FASHUN.CO isn't just clothing—it's a canvas for expression. We believe fashion transcends gender, 
                age, and boundaries. Every piece we create tells a story of rebellion, authenticity, and unforgettable flair.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-full flex items-center justify-center text-black font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gender-Transcendent</h3>
                    <p className="text-gray-600">Fashion for all identities, all bodies, all expressions of self.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unapologetically Bold</h3>
                    <p className="text-gray-600">Stand out, speak up, and express your truth through every thread.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Affordably Accessible</h3>
                    <p className="text-gray-600">Premium quality and cutting-edge style shouldn't break the bank.</p>
                  </div>
                </div>
              </div>

              <Link href="/about">
                <button className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                  READ OUR FULL STORY
                </button>
              </Link>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop" 
                    alt="Art meets culture" 
                    className="rounded-2xl shadow-xl"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop" 
                    alt="Gender transcendent fashion" 
                    className="rounded-2xl shadow-xl"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop" 
                    alt="Bold expression" 
                    className="rounded-2xl shadow-xl"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop" 
                    alt="Urban culture" 
                    className="rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-lime-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-pink-500 rounded-full opacity-30 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Service Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-lime-400 to-cyan-400 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">FREE EXPRESS SHIPPING</h3>
              <p className="text-gray-600">Lightning-fast delivery on orders ₹999+. Get your unforgettable flair, faster.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">PREMIUM QUALITY</h3>
              <p className="text-gray-600">Ethically sourced, quality tested. Every piece meets our rebel standards.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl">↩️</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">HASSLE-FREE RETURNS</h3>
              <p className="text-gray-600">30-day return policy. If it doesn't spark joy, send it back—no questions asked.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">24/7 REBEL SUPPORT</h3>
              <p className="text-gray-600">Our community team is always here to help you express your authentic self.</p>
            </div>
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

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">
            JOIN THE <span className="text-transparent bg-gradient-to-r from-lime-400 to-pink-500 bg-clip-text">REBELLION</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get first access to new drops, exclusive member pricing, and style guides delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder-gray-300 focus:border-lime-400 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-lime-400 to-cyan-400 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              JOIN NOW
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            No spam, just unforgettable style updates. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-black mb-6 text-transparent bg-gradient-to-r from-lime-400 to-pink-500 bg-clip-text">
                FASHUN.CO
              </h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Where art meets culture. India's boldest streetwear brand for the modern urban rebel. 
                Gender-transcendent fashion that speaks your truth.
              </p>
              <div className="flex space-x-4">
                <Link href="https://instagram.com/fashun.co" target="_blank" className="group">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.750-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.990-5.367 11.990-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </div>
                </Link>
                <Link href="https://twitter.com/fashunco" target="_blank" className="group">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </div>
                </Link>
                <Link href="https://youtube.com/@fashunco" target="_blank" className="group">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </Link>
                <Link href="https://tiktok.com/@fashunco" target="_blank" className="group">
                  <div className="bg-gradient-to-r from-lime-400 to-green-500 p-3 rounded-full hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Shop Column */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white">SHOP</h4>
              <div className="space-y-3">
                <Link href="/collections/men" className="block text-gray-300 hover:text-lime-400 transition-colors">Men's Collection</Link>
                <Link href="/collections/women" className="block text-gray-300 hover:text-lime-400 transition-colors">Women's Collection</Link>
                <Link href="/collections/all-genders" className="block text-gray-300 hover:text-lime-400 transition-colors">All Genders</Link>
                <Link href="/collections/coordinated-sets" className="block text-gray-300 hover:text-lime-400 transition-colors">Coordinated Sets</Link>
                <Link href="/collections/vintage-60s" className="block text-gray-300 hover:text-lime-400 transition-colors">Vintage 60s</Link>
                <Link href="/collections/dark-magic" className="block text-gray-300 hover:text-lime-400 transition-colors">Dark Magic</Link>
                <Link href="/accessories" className="block text-gray-300 hover:text-lime-400 transition-colors">Accessories</Link>
              </div>
            </div>
            
            {/* Support Column */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white">SUPPORT</h4>
              <div className="space-y-3">
                <Link href="/contact" className="block text-gray-300 hover:text-pink-400 transition-colors">Contact Us</Link>
                <Link href="/shipping" className="block text-gray-300 hover:text-pink-400 transition-colors">Shipping Info</Link>
                <Link href="/returns" className="block text-gray-300 hover:text-pink-400 transition-colors">Returns & Exchange</Link>
                <Link href="/size-guide" className="block text-gray-300 hover:text-pink-400 transition-colors">Size Guide</Link>
                <Link href="/faq" className="block text-gray-300 hover:text-pink-400 transition-colors">FAQs</Link>
                <Link href="/track-order" className="block text-gray-300 hover:text-pink-400 transition-colors">Track Your Order</Link>
              </div>
            </div>
            
            {/* Company Column */}
            <div>
              <h4 className="text-xl font-black mb-6 text-white">COMPANY</h4>
              <div className="space-y-3">
                <Link href="/about" className="block text-gray-300 hover:text-purple-400 transition-colors">Our Story</Link>
                <Link href="/the-canvas" className="block text-gray-300 hover:text-purple-400 transition-colors">The Canvas Blog</Link>
                <Link href="/careers" className="block text-gray-300 hover:text-purple-400 transition-colors">Join Our Rebellion</Link>
                <Link href="/sustainability" className="block text-gray-300 hover:text-purple-400 transition-colors">Sustainability</Link>
                <Link href="/privacy" className="block text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-300 hover:text-purple-400 transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                <p className="text-gray-400 text-center md:text-left">
                  © 2024 FASHUN.CO. All rights reserved. Made with 🔥 in India
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 text-sm">Secure Payments:</span>
                  <div className="flex space-x-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-md text-xs font-bold">VISA</div>
                    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-md text-xs font-bold">MC</div>
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-md text-xs font-bold">UPI</div>
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-md text-xs font-bold">COD</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">Crafted for the bold, worn by rebels</p>
                <div className="text-2xl">🔥✨🌟</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}