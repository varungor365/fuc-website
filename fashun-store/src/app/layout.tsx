import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { inter, poppins, getAllFontVariables, pagefonts } from '@/lib/simpleFonts'
import Image from 'next/image'
import AdvancedUIProvider from '@/components/ui/AdvancedUIProvider'

export const metadata: Metadata = {
  title: 'FASHUN.CO.IN - Premium Streetwear',
  description: 'Premium streetwear and custom apparel for the modern generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-black text-white min-h-screen antialiased" suppressHydrationWarning>
        <Providers>
          <AdvancedUIProvider
            enableCommandPalette={true}
            enableSoundEffects={true}
            enableTours={true}
            autoStartNewUserTour={true}
            username="user"
          >
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4" data-tour="navigation">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/logo.png"
                      alt="FASHUN.CO Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h1 className={`${pagefonts.headers.primary.className} text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent`}>
                    FASHUN.CO
                  </h1>
                </div>
                <div className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
                  <a href="/collections/all" className="text-gray-300 hover:text-white transition-colors">Shop</a>
                  <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
                  <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                  <a href="/search" className="text-gray-300 hover:text-white transition-colors" data-tour="search">Search</a>
                  <a href="/ai-features" className="text-gray-300 hover:text-white transition-colors" data-tour="ai-features">AI Features</a>
                </div>
                <div className="flex items-center space-x-4" data-tour="profile">
                  <a href="/account" className="text-gray-300 hover:text-white transition-colors">Account</a>
                  <a href="/cart" className="text-gray-300 hover:text-white transition-colors">Cart (0)</a>
                </div>
              </div>
            </nav>
            
            <main className="flex-1">
              {children}
            </main>
          </AdvancedUIProvider>
        
        <footer className="bg-gray-900 border-t border-gray-800 px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">© 2025 FASHUN.CO.IN. All rights reserved.</p>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  )
}
