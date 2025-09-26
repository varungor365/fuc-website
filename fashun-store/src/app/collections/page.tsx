import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Collections - FASHUN.CO',
  description: 'Browse our premium streetwear collections. Find the perfect pieces for your style.',
};

// Mock products data for stable testing
const mockProducts = [
  {
    id: '1',
    name: 'Premium Streetwear T-Shirt',
    price: 2499,
    description: 'High-quality cotton blend streetwear tee with modern fit.',
    image: '/api/placeholder/400/500',
    category: 'T-Shirts'
  },
  {
    id: '2',
    name: 'Urban Hoodie',
    price: 4999,
    description: 'Comfortable oversized hoodie perfect for street style.',
    image: '/api/placeholder/400/500',
    category: 'Hoodies'
  },
  {
    id: '3',
    name: 'Designer Polo Shirt',
    price: 3499,
    description: 'Classic polo with contemporary streetwear twist.',
    image: '/api/placeholder/400/500',
    category: 'Polos'
  },
  {
    id: '4',
    name: 'Vintage Denim Jacket',
    price: 6999,
    description: 'Authentic vintage-style denim jacket with premium finish.',
    image: '/api/placeholder/400/500',
    category: 'Jackets'
  }
];

const mockCategories = ['All', 'T-Shirts', 'Hoodies', 'Polos', 'Jackets'];

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Premium Collections
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our curated selection of premium streetwear designed for the modern urban lifestyle.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {mockCategories.map((category, index) => (
              <button
                key={category}
                className={`font-montserrat font-bold py-3 px-6 rounded-xl transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 product-card"
              data-testid="product-card"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-gray-500 text-6xl">👕</div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    ♡
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                  
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-montserrat font-bold py-4 px-8 rounded-xl transition-all duration-300">
            Load More Products
          </button>
        </div>
      </div>
    </main>
  );
}