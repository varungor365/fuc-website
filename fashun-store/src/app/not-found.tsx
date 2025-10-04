import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search, Home, TrendingUp, ShoppingBag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Page Not Found | FashUn',
  description: 'The page you are looking for could not be found. Discover our latest fashion collections instead.',
};

// Smart 404 page with product suggestions based on URL
export default function NotFound() {
  // Popular products fallback
  const popularProducts = [
    {
      id: 'oversized-graphic-hoodie',
      name: 'Oversized Graphic Hoodie',
      price: 2999,
      image: '/api/placeholder/300/400',
      category: 'Hoodies'
    },
    {
      id: 'minimalist-t-shirt',
      name: 'Minimalist T-Shirt',
      price: 1299,
      image: '/api/placeholder/300/400',
      category: 'T-Shirts'
    },
    {
      id: 'classic-denim-jacket',
      name: 'Classic Denim Jacket',
      price: 3999,
      image: '/api/placeholder/300/400',
      category: 'Jackets'
    },
    {
      id: 'streetwear-joggers',
      name: 'Streetwear Joggers',
      price: 2499,
      image: '/api/placeholder/300/400',
      category: 'Pants'
    }
  ];

  const popularCategories = [
    { name: 'Hoodies', href: '/collections/hoodies', icon: '🔥' },
    { name: 'T-Shirts', href: '/collections/tshirts', icon: '👕' },
    { name: 'Jeans', href: '/collections/jeans', icon: '👖' },
    { name: 'Sneakers', href: '/collections/sneakers', icon: '👟' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you're looking for doesn't exist, but don't worry! 
              Let's help you find what you're searching for.
            </p>
          </div>

          {/* Search Input - Simple non-interactive version for SSG */}
          <div className="mb-8">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for products, styles, or trends..."
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder-gray-500"
                  disabled
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Please go to the homepage to use the search functionality
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Link>
            <Link
              href="/collections/all"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse All Products
            </Link>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <p className="font-bold text-lg text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Still can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help you find the perfect fashion items.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/size-guide"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Size Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}