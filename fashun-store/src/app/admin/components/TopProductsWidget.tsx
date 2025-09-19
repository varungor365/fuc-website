'use client'

import { motion } from 'framer-motion'
import { 
  StarIcon,
  EyeIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Product {
  id: string
  name: string
  image: string
  price: number
  sold: number
  revenue: number
  rating: number
  views: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

const TopProductsWidget = () => {
  // Mock data - in production, this would come from your API
  const topProducts: Product[] = [
    {
      id: '1',
      name: 'Oversized Graphic Tee',
      image: '/images/products/tee1.jpg',
      price: 899,
      sold: 245,
      revenue: 220155,
      rating: 4.8,
      views: 1250,
      trend: 'up',
      trendPercentage: 23
    },
    {
      id: '2',
      name: 'Streetwear Hoodie',
      image: '/images/products/hoodie1.jpg',
      price: 1499,
      sold: 187,
      revenue: 280313,
      rating: 4.9,
      views: 980,
      trend: 'up',
      trendPercentage: 18
    },
    {
      id: '3',
      name: 'Vintage Denim Jacket',
      image: '/images/products/jacket1.jpg',
      price: 2299,
      sold: 134,
      revenue: 308066,
      rating: 4.7,
      views: 756,
      trend: 'stable',
      trendPercentage: 2
    },
    {
      id: '4',
      name: 'Urban Cargo Pants',
      image: '/images/products/pants1.jpg',
      price: 1299,
      sold: 156,
      revenue: 202644,
      rating: 4.6,
      views: 623,
      trend: 'up',
      trendPercentage: 12
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
      case 'down':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-400 rotate-180" />
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-['Montserrat'] text-[#E8E8E8]">
              Top Products
            </h3>
            <p className="text-gray-400 font-['Inter'] text-sm">
              Best performing items
            </p>
          </div>
        </div>
        <select className="bg-[#0F0F10] border border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-[#E4C590]">
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {topProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-[#0F0F10] border border-gray-800 hover:border-gray-700 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-16 h-16 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">IMG</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-[#E8E8E8] font-medium font-['Inter'] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[#E4C590] font-medium font-['Inter']">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(product.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(product.trend)}`}>
                      {product.trendPercentage}%
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-xs ml-1">
                    {product.rating}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <ShoppingCartIcon className="w-3 h-3" />
                      <span>Sold</span>
                    </div>
                    <p className="text-[#E8E8E8] font-medium">{product.sold}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <EyeIcon className="w-3 h-3" />
                      <span>Views</span>
                    </div>
                    <p className="text-[#E8E8E8] font-medium">{product.views}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Revenue</p>
                    <p className="text-green-400 font-medium">
                      ₹{(product.revenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full mt-4 py-3 rounded-lg border border-gray-700 text-gray-400 hover:text-[#E8E8E8] hover:border-[#E4C590]/50 transition-all duration-300 font-['Inter']"
      >
        View All Products
      </motion.button>
    </motion.div>
  )
}

export default TopProductsWidget