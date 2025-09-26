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
    <div className="min-h-screen bg-white text-black">
      {/* Top Banner - Souled Store Style */}
      <div className="bg-black text-white text-center py-2 text-sm font-medium">
        🎉 FREE SHIPPING on orders above ₹999 | COD Available | Easy 15-day Returns
      </div>

      {/* Header - Clean White Background like TSS */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-black">
              FASHUN.CO
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/collections/men" className="text-gray-700 hover:text-black font-medium">MEN</Link>
              <Link href="/collections/women" className="text-gray-700 hover:text-black font-medium">WOMEN</Link>
              <Link href="/collections/new-arrivals" className="text-gray-700 hover:text-black font-medium">NEW ARRIVALS</Link>
              <Link href="/collections/bestsellers" className="text-gray-700 hover:text-black font-medium">BESTSELLERS</Link>
              <Link href="/collections/sale" className="text-red-600 hover:text-red-700 font-bold">SALE</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-black">🔍</button>
              <button className="text-gray-700 hover:text-black">❤️</button>
              <button className="text-gray-700 hover:text-black">🛒</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Banner - TSS Style with Pop Culture */}
      <section className="relative">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="text-sm font-semibold bg-yellow-400 text-black px-3 py-1 rounded-full w-fit">
                  ⚡ NEW DROP ALERT
                </div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  POP CULTURE
                  <br />
                  <span className="text-yellow-300">STREETWEAR</span>
                </h1>
                <p className="text-xl text-white/90">
                  From Marvel to Anime, Music to Movies - Wear your passion with our exclusive pop culture collection
                </p>
                <div className="flex gap-4">
                  <Link href="/collections">
                    <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                      SHOP NOW 🚀
                    </button>
                  </Link>
                  <Link href="/collections/new-arrivals">
                    <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-colors">
                      NEW ARRIVALS
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop" 
                  alt="Pop Culture Fashion" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-3 rounded-full font-bold shadow-lg">
                  30% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation - TSS Style */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Marvel", emoji: "🕷️", color: "from-red-500 to-blue-600" },
              { name: "Anime", emoji: "⚡", color: "from-orange-500 to-pink-500" },
              { name: "Movies", emoji: "🎬", color: "from-purple-500 to-indigo-500" },
              { name: "Music", emoji: "🎵", color: "from-green-500 to-teal-500" },
              { name: "Gaming", emoji: "🎮", color: "from-blue-500 to-purple-500" },
              { name: "Sports", emoji: "⚽", color: "from-yellow-500 to-red-500" }
            ].map((category) => (
              <Link key={category.name} href={`/collections/${category.name.toLowerCase()}`}>
                <div className="group cursor-pointer">
                  <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center text-white hover:scale-105 transition-transform`}>
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <div className="font-bold">{category.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections - TSS Grid Style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              TRENDING NOW 🔥
            </h2>
            <p className="text-gray-600 text-lg">
              The hottest drops everyone's talking about
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Marvel Collection */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-blue-600 p-8 text-white">
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  BESTSELLER
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">🕷️</div>
                  <h3 className="text-2xl font-black">MARVEL COLLECTION</h3>
                  <p className="text-white/90">Your favorite superheroes on premium streetwear</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Starting ₹499</span>
                    <button className="bg-white text-red-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      SHOP NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Collection */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 p-8 text-white">
                <div className="absolute top-4 right-4 bg-green-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                  NEW
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">⚡</div>
                  <h3 className="text-2xl font-black">ANIME ZONE</h3>
                  <p className="text-white/90">Naruto, One Piece, DBZ & more iconic anime merch</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Starting ₹549</span>
                    <button className="bg-white text-orange-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      EXPLORE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Gaming Collection */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-white">
                <div className="absolute top-4 right-4 bg-red-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                  HOT
                </div>
                <div className="space-y-4">
                  <div className="text-4xl">🎮</div>
                  <h3 className="text-2xl font-black">GAMING LEGENDS</h3>
                  <p className="text-white/90">Level up your style with gaming classics</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Starting ₹599</span>
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      PLAY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers - TSS Product Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
              BESTSELLERS 💫
            </h2>
            <p className="text-gray-600 text-lg">
              Most loved by our community
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SALE
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      ❤️
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-black text-black">₹{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/collections">
              <button className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner - TSS Style */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <div className="text-yellow-300 font-bold mb-4">⚡ LIMITED TIME OFFER</div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">
                FLAT 50% OFF
                <br />
                <span className="text-yellow-300">ON EVERYTHING</span>
              </h2>
              <p className="text-xl mb-8 text-white/90">
                The biggest sale of the year! Use code <span className="bg-yellow-300 text-black px-2 py-1 rounded-md font-bold">MEGA50</span> at checkout
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/collections">
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                    SHOP NOW 🛍️
                  </button>
                </Link>
              </div>
              <div className="mt-6 text-sm text-white/80">
                *Valid till stocks last. T&C apply.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - TSS Style */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">FREE SHIPPING</h3>
              <p className="text-gray-600 text-sm">On orders above ₹999</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">PREMIUM QUALITY</h3>
              <p className="text-gray-600 text-sm">100% genuine products</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">EASY RETURNS</h3>
              <p className="text-gray-600 text-sm">15-day return policy</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">FAST DELIVERY</h3>
              <p className="text-gray-600 text-sm">2-3 days across India</p>
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

      {/* Footer - TSS Style */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-black mb-4">FASHUN.CO</h3>
              <p className="text-gray-300 mb-4">
                India's favorite pop culture streetwear destination. Express yourself, be authentic, stay fashionable.
              </p>
              <div className="flex space-x-4">
                <Link href="https://instagram.com/fashun.co.in" target="_blank" className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors">
                  📷
                </Link>
                <Link href="https://twitter.com/fashunco" target="_blank" className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                  🐦
                </Link>
                <Link href="https://facebook.com/fashunco" target="_blank" className="bg-blue-800 p-2 rounded-full hover:bg-blue-900 transition-colors">
                  👥
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">SHOP</h4>
              <div className="space-y-2">
                <Link href="/collections/men" className="block text-gray-300 hover:text-white transition-colors">Men's Collection</Link>
                <Link href="/collections/women" className="block text-gray-300 hover:text-white transition-colors">Women's Collection</Link>
                <Link href="/collections/new-arrivals" className="block text-gray-300 hover:text-white transition-colors">New Arrivals</Link>
                <Link href="/collections/sale" className="block text-gray-300 hover:text-white transition-colors">Sale</Link>
                <Link href="/collections/bestsellers" className="block text-gray-300 hover:text-white transition-colors">Bestsellers</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">CUSTOMER CARE</h4>
              <div className="space-y-2">
                <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">Contact Us</Link>
                <Link href="/shipping" className="block text-gray-300 hover:text-white transition-colors">Shipping Info</Link>
                <Link href="/returns" className="block text-gray-300 hover:text-white transition-colors">Returns & Exchange</Link>
                <Link href="/size-guide" className="block text-gray-300 hover:text-white transition-colors">Size Guide</Link>
                <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors">FAQs</Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4 text-white">ABOUT</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">Our Story</Link>
                <Link href="/careers" className="block text-gray-300 hover:text-white transition-colors">Careers</Link>
                <Link href="/privacy" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2024 FASHUN.CO. All rights reserved. Made with ❤️ in India
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400">We Accept:</span>
                <div className="flex space-x-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">UPI</div>
                  <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">COD</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}