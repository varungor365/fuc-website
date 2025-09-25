import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shopping Cart - FASHUN.CO',
  description: 'Review your cart and proceed to checkout',
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-montserrat text-5xl font-bold text-white mb-6">
            Shopping Cart
          </h1>
          <p className="font-inter text-xl text-white/80">
            Review your items and proceed to checkout
          </p>
        </div>

        {/* Empty Cart State */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-12 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-8 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>

          <h2 className="font-montserrat text-3xl font-bold text-white mb-4">
            Your cart is empty
          </h2>

          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet.
            Discover our latest streetwear collection.
          </p>

          <div className="space-y-4">
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Continue Shopping
            </Link>

            <div className="flex justify-center space-x-4 text-sm">
              <Link
                href="/collections"
                className="text-white/60 hover:text-white transition-colors"
              >
                Browse Collections
              </Link>
              <span className="text-white/30">•</span>
              <Link
                href="/account"
                className="text-white/60 hover:text-white transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}