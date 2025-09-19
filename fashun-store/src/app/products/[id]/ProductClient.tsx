'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ShoppingCartIcon, ShareIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import SizeRecommendation from '@/components/ai/SizeRecommendation'
import MeasurementGuide from '@/components/ai/MeasurementGuide'
import OutfitBuilderButton from '@/components/ai/OutfitBuilderButton'

// Flexible product interface that works with both old and new data
interface ProductData {
  id: any
  name: string
  price: number
  originalPrice?: number
  sale_price?: number
  discount?: number
  discountPercentage?: number
  rating: number
  reviews: number
  description: string
  short_description?: string
  features?: string[]
  images: string[]
  image?: string
  colors?: any[]
  sizes?: any[]
  category: string
  categorySlug?: string
  tags: string[]
  material?: string
  materials?: any[]
  care?: string
  care_instructions?: string
  shipping?: string
  inStock?: boolean
  stock_status?: string
  weight?: string
  dimensions?: any
  sku?: string
  seo_title?: string
  seo_description?: string
}

interface ProductClientProps {
  product: ProductData
  sizeGuide: {
    [key: string]: Array<{
      size: string
      chest: string
      length: string
      sleeve?: string
    }>
  }
  relatedProducts: Array<{
    id: any
    name: string
    price: number
    image: string
  }>
}

export default function ProductClient({ product, sizeGuide, relatedProducts }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showMeasurementGuide, setShowMeasurementGuide] = useState(false)
  const [userMeasurements, setUserMeasurements] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('description')

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    // Add to cart logic here
    console.log('Added to cart:', { product: product.id, size: selectedSize, quantity, color: selectedColor })
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex space-x-2 text-sm text-primary-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li>/</li>
            <li><Link href="/collections/all" className="hover:text-white">Collections</Link></li>
            <li>/</li>
            <li><Link href={`/collections/${product.category}`} className="hover:text-white capitalize">{product.category}</Link></li>
            <li>/</li>
            <li className="text-white">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square bg-primary-900 rounded-lg overflow-hidden"
            >
              <Image
                src={product.colors?.[selectedColor]?.image || product.images?.[selectedImage] || product.image || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                {isWishlisted ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-white" />
                )}
              </button>
            </motion.div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-accent-400' : 'border-transparent'
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-primary-600'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-primary-300">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-white">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-primary-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="px-2 py-1 bg-red-600 text-white text-sm rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color: {product.colors[selectedColor]?.name || 'Default'}</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === index ? 'border-accent-400 ring-2 ring-accent-400/50' : 'border-primary-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Size</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMeasurementGuide(true)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    📏 My Measurements
                  </button>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-accent-400 hover:text-accent-300 text-sm underline"
                  >
                    Size Guide
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => size.inStock && setSelectedSize(size.name)}
                    disabled={!size.inStock}
                    className={`py-3 px-4 border rounded-lg text-center transition-all ${
                      selectedSize === size.name
                        ? 'border-accent-400 bg-accent-400 text-black'
                        : size.inStock
                        ? 'border-primary-600 hover:border-primary-400'
                        : 'border-primary-800 text-primary-600 cursor-not-allowed'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
              
              {/* AI Size Recommendation */}
              <div className="mt-4">
                <SizeRecommendation
                  productId={product.id.toString()}
                  category={product.category}
                  onSizeSelect={setSelectedSize}
                  selectedSize={selectedSize}
                  userMeasurements={userMeasurements}
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-accent-500 hover:bg-accent-600 text-black py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span>Add to Cart - ₹{(product.price * quantity).toLocaleString()}</span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="border border-accent-400 text-accent-400 hover:bg-accent-400 hover:text-black py-3 px-6 rounded-lg font-semibold transition-colors">
                  Buy Now
                </button>
                <button className="border border-primary-600 text-white hover:border-primary-400 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* AI Outfit Builder */}
              <div className="pt-2">
                <OutfitBuilderButton
                  product={{
                    id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    image: product.colors?.[selectedColor]?.image || product.images?.[selectedImage] || product.image || '/placeholder.jpg',
                    category: product.category,
                    color: product.colors?.[selectedColor]?.name || 'default',
                    brand: 'FUC!'
                  }}
                  variant="secondary"
                  className="w-full"
                />
              </div>
            </div>

            {/* Shipping Info */}
            <div className="border border-primary-800 rounded-lg p-4">
              <p className="text-green-400 text-sm">{product.shipping}</p>
              <p className="text-primary-300 text-sm mt-1">Estimated delivery: 3-5 business days</p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-primary-800">
            <nav className="flex space-x-8">
              {['description', 'features', 'reviews', 'shipping'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-accent-400 text-accent-400'
                      : 'border-transparent text-primary-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-primary-200 text-lg leading-relaxed">{product.description}</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Material</h4>
                    <p className="text-primary-300">{product.material}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">Care Instructions</h4>
                    <p className="text-primary-300">{product.care}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Product Features</h3>
                <ul className="space-y-3">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                      <span className="text-primary-200">{feature}</span>
                    </li>
                  )) || <p className="text-primary-200">No features available</p>}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Customer Reviews</h3>
                <div className="text-center py-12">
                  <p className="text-primary-400">Reviews component will be implemented here</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Shipping & Returns</h3>
                <div className="space-y-4 text-primary-200">
                  <p>Free standard shipping on orders over ₹2000</p>
                  <p>Express shipping available for ₹200</p>
                  <p>30-day return policy</p>
                  <p>Free returns within India</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square bg-primary-900 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-accent-400 font-bold">₹{relatedProduct.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-primary-900 rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Size Guide</h2>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-primary-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-primary-700">
                    <th className="pb-3 text-white">Size</th>
                    <th className="pb-3 text-white">Chest</th>
                    <th className="pb-3 text-white">Length</th>
                    <th className="pb-3 text-white">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.hoodies.map((size) => (
                    <tr key={size.size} className="border-b border-primary-800">
                      <td className="py-3 text-accent-400 font-semibold">{size.size}</td>
                      <td className="py-3 text-primary-200">{size.chest}</td>
                      <td className="py-3 text-primary-200">{size.length}</td>
                      <td className="py-3 text-primary-200">{size.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Measurement Guide Modal */}
      <MeasurementGuide
        isOpen={showMeasurementGuide}
        onClose={() => setShowMeasurementGuide(false)}
        onSave={(measurements) => {
          setUserMeasurements(measurements)
          console.log('Saved measurements:', measurements)
        }}
      />
    </div>
  )
}
