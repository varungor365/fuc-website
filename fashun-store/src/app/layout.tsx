import type { Metadata } from 'next'
import './globals.css'
import ErrorBoundary from '../components/error/ErrorBoundary'
import NewsletterPopup from '../components/promotional/NewsletterPopup'

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
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-black text-white min-h-screen">
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                FASHUN.CO.IN
              </h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/collections/all" className="text-gray-300 hover:text-white transition-colors">Shop</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/account" className="text-gray-300 hover:text-white transition-colors">Account</a>
              <a href="/cart" className="text-gray-300 hover:text-white transition-colors">Cart (0)</a>
            </div>
          </div>
        </nav>
        
        <ErrorBoundary>
          <main className="flex-1">
            {children}
          </main>
          <NewsletterPopup />
        </ErrorBoundary>
        
        <footer className="bg-gray-900 border-t border-gray-800 px-6 py-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">© 2025 FASHUN.CO.IN. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
