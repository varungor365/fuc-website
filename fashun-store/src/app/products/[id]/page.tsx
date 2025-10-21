'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon,
  HeartIcon,
  ShareIcon,
  ShoppingCartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowsRightLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  MagnifyingGlassPlusIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  FireIcon,
  EyeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import VariantSwatches from '../../../components/product/VariantSwatches';
import ShippingCalculator from '../../../components/product/ShippingCalculator';
import TryOnButton from '../../../components/product/TryOnButton';
import PhygitalUpgradeButton from '../../../components/product/PhygitalUpgradeButton';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const mockProduct = {
  id: 'cyber-punk-hoodie',
  name: 'Cyber Punk Neon Hoodie',
  price: 3299,
  originalPrice: 4299,
  description: 'Step into the future with our premium Cyber Punk Neon Hoodie. Featuring high-tech aesthetics with comfortable streetwear design perfect for the digital age.',
  rating: 4.8,
  reviewCount: 247,
  inStock: true,
  stockCount: 23,
  sku: 'CPH-001-BLK',
  category: 'Hoodies',
  tags: ['Cyberpunk', 'Neon', 'Limited Edition', 'Premium'],
  images: [
    '/images/products/t-shirts/tshirt-1-main.jpg',
    '/images/products/t-shirts/tshirt-1-front.jpg',
    '/images/products/t-shirts/tshirt-1-back.jpg',
    '/images/products/t-shirts/tshirt-2-main.jpg'
  ],
  sizes: [
    { id: 'xs', name: 'XS', stock: 5 },
    { id: 's', name: 'S', stock: 8 },
    { id: 'm', name: 'M', stock: 12 },
    { id: 'l', name: 'L', stock: 15 },
    { id: 'xl', name: 'XL', stock: 10 },
    { id: 'xxl', name: 'XXL', stock: 0 }
  ],
  colors: [
    { id: 'neon-black', name: 'Neon Black', colorCode: '#000000', stock: 25 },
    { id: 'cyber-blue', name: 'Cyber Blue', colorCode: '#00ffff', stock: 18 },
    { id: 'matrix-green', name: 'Matrix Green', colorCode: '#00ff00', stock: 0 }
  ],
  features: [
    'Premium cotton-polyester blend',
    'Glow-in-the-dark neon prints',
    'Kangaroo pocket with hidden compartment',
    'Adjustable drawstring hood',
    'Ribbed cuffs and hem',
    'Machine washable'
  ]
};

const relatedProducts = [
  {
    id: 'neon-glow-hoodie',
    name: 'Neon Glow Circuit Hoodie',
    price: 2999,
    originalPrice: 3799,
    image: '/images/products/hoodies/hoodie-1-main.jpg',
    rating: 4.6
  },
  {
    id: 'holographic-tee',
    name: 'Holographic Matrix Tee',
    price: 1799,
    originalPrice: 2299,
    image: '/images/products/t-shirts/tshirt-2-front.jpg',
    rating: 4.7
  },
  {
    id: 'quantum-bomber',
    name: 'Quantum Tech Bomber',
    price: 4999,
    originalPrice: 6299,
    image: '/images/products/hoodies/hoodie-2-main.jpg',
    rating: 4.9
  }
];

// Size Guide Data
const sizeGuide = {
  hoodie: {
    title: 'Hoodie Size Guide',
    measurements: [
      { size: 'XS', chest: '34-36', length: '25', sleeve: '23' },
      { size: 'S', chest: '36-38', length: '26', sleeve: '24' },
      { size: 'M', chest: '38-40', length: '27', sleeve: '25' },
      { size: 'L', chest: '40-42', length: '28', sleeve: '26' },
      { size: 'XL', chest: '42-44', length: '29', sleeve: '27' },
      { size: 'XXL', chest: '44-46', length: '30', sleeve: '28' }
    ],
    tips: [
      'Measurements are in inches',
      'For loose fit, size up',
      'Model is 6\'0" wearing size M',
      'Machine wash cold, tumble dry low'
    ]
  }
};

// Q&A Data
const productQA = [
  {
    id: 1,
    question: "Is this hoodie true to size?",
    answer: "Yes, this hoodie fits true to size. For a looser fit, consider sizing up one size.",
    author: "Sarah M.",
    date: "2 days ago",
    helpful: 23,
    verified: true
  },
  {
    id: 2,
    question: "Does the glow effect wash out over time?",
    answer: "The glow-in-the-dark print is highly durable and will maintain its brightness for years with proper care.",
    author: "FASHUN Team",
    date: "1 week ago",
    helpful: 45,
    verified: true
  },
  {
    id: 3,
    question: "What's the material composition?",
    answer: "80% premium cotton, 20% polyester blend for comfort and durability.",
    author: "Mike R.",
    date: "3 days ago",
    helpful: 12,
    verified: false
  }
];

// Social Proof Notifications
const recentPurchases = [
  { name: "Arjun K.", location: "Mumbai", product: "Cyber Punk Hoodie", time: "2 minutes ago" },
  { name: "Priya S.", location: "Delhi", product: "Neon Glow Hoodie", time: "8 minutes ago" },
  { name: "Rahul M.", location: "Bangalore", product: "Cyber Punk Hoodie", time: "12 minutes ago" }
];

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // Get cart store actions
  const { addItem: addToCart, openCart } = useCartStore();
  
  // New Feature States
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showImageLightbox, setShowImageLightbox] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [showQA, setShowQA] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [socialProofVisible, setSocialProofVisible] = useState(true);
  const [currentSocialProofIndex, setCurrentSocialProofIndex] = useState(0);
  const [urgencyTimer, setUrgencyTimer] = useState(47); // Stock urgency countdown
  
  // Refs for scroll detection
  const qaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const product = mockProduct;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  // Track recently viewed products
  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const currentProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      rating: product.rating
    };
    
    const filtered = viewed.filter((item: any) => item.id !== product.id);
    const updated = [currentProduct, ...filtered].slice(0, 4);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    setRecentlyViewed(updated.slice(1)); // Exclude current product
  }, [product]);

  // Social proof rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSocialProofIndex((prev) => (prev + 1) % recentPurchases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Stock urgency countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setUrgencyTimer((prev) => prev > 0 ? prev - 1 : 47);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Hide social proof after some time
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSocialProofVisible(false);
    }, 15000);
    return () => clearTimeout(timeout);
  }, []);

  const handleAddToCart = (isPhygital: boolean = false) => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }
    
    // Add item to cart using Zustand store
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
      slug: product.id,
      quantity: quantity,
      maxQuantity: product.stock,
    });
    
    // Show success feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
    
    // Open cart sidebar
    openCart();
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Enhanced image handlers
  const openLightbox = (index: number) => {
    setLightboxImageIndex(index);
    setShowImageLightbox(true);
  };

  const nextLightboxImage = () => {
    setLightboxImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevLightboxImage = () => {
    setLightboxImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Wishlist handler with animation
  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // Here you would typically save to user's wishlist in backend
  };

  // Variant handlers
  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
  };

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
  };

  // Shipping handler
  const handleShippingSelect = (option: any, cost: number) => {
    setSelectedShipping(option);
    setShippingCost(cost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-white/60 mb-8">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/collections/all" className="hover:text-white">Collections</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              ref={imageRef}
              className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden group cursor-zoom-in"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => openLightbox(currentImageIndex)}
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>

              {/* Zoom Button */}
              <button className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
              </button>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {discount}% OFF
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index
                      ? 'border-purple-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Product Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-sm">
                  {product.category}
                </span>
                {product.inStock && (
                  <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-sm">
                    In Stock ({product.stockCount} left)
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-white/80 font-medium">{product.rating}</span>
                </div>
                <span className="text-white/60">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="text-white/70 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-white/50 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Color: {selectedColor || 'Select a color'}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    onClick={() => color.stock > 0 && setSelectedColor(color.name)}
                    disabled={color.stock === 0}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color.name
                        ? 'border-white scale-110'
                        : 'border-white/20 hover:border-white/50'
                    } ${color.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.colorCode }}
                    title={color.name}
                    whileHover={color.stock > 0 ? { scale: 1.1 } : {}}
                    whileTap={color.stock > 0 ? { scale: 0.95 } : {}}
                  />
                ))}
              </div>
            </div>

            {/* Variant Selection */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <VariantSwatches
                colors={product.colors}
                sizes={product.sizes}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorSelect={handleColorSelect}
                onSizeSelect={handleSizeSelect}
                className="mb-4"
              />
              
              <div className="flex items-center justify-between text-sm">
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  <ScaleIcon className="w-4 h-4" />
                  Size Guide
                </button>
                {selectedSize && selectedColor && (
                  <span className="text-white/60">
                    {product.sizes.find(s => s.id === selectedSize)?.stock} available in {selectedSize.toUpperCase()}
                  </span>
                )}
              </div>
            </div>            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/10 rounded-lg border border-white/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-l-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-r-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                {selectedSize && (
                  <span className="text-white/60 text-sm">
                    {product.sizes.find(s => s.id === selectedSize)?.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* Stock Urgency Alert */}
            {product.stockCount <= 50 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-red-400 font-medium flex items-center gap-2">
                      <FireIcon className="w-4 h-4" />
                      Only {product.stockCount} left in stock!
                    </p>
                    <p className="text-sm text-white/60 flex items-center gap-1 mt-1">
                      <ClockIcon className="w-3 h-3" />
                      {urgencyTimer} people are viewing this item
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Virtual Try-On Button */}
              <TryOnButton
                productId={product.id}
                productName={product.name}
                productColor={selectedColor}
                productImageUrl={product.images[0]}
                garmentType="hoodie"
              />
              
              {/* Phygital Upgrade Button - Main CTA */}
              <PhygitalUpgradeButton
                productName={product.name}
                productPrice={product.price}
                onAddToCart={handleAddToCart}
                className="w-full"
              />
              
              <div className="flex gap-4">
                <motion.button
                  onClick={handleWishlist}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all border border-white/10 ${
                    isWishlisted ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isWishlisted ? (
                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
                  )}
                </motion.button>
                
                <motion.button 
                  className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShareIcon className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
                </motion.button>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-white text-black font-semibold py-4 px-6 rounded-xl text-center hover:bg-white/90 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white/80">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowsRightLeftIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white/80">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white/80">Secure Payment</span>
              </div>
            </div>

            {/* Shipping Calculator */}
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <ShippingCalculator
                productPrice={product.price}
                productWeight={0.8}
                onShippingSelect={handleShippingSelect}
                className="bg-transparent border-none"
              />
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'features', label: 'Features' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
                { id: 'qa', label: `Q&A (${productQA.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-white/60 hover:text-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <motion.div 
            className="py-8"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 text-lg leading-relaxed">
                  {product.description} This premium hoodie combines cutting-edge design with ultimate comfort, 
                  perfect for those who want to stand out in the digital age. Made with high-quality materials 
                  and attention to detail that sets it apart from ordinary streetwear.
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 bg-white/5 rounded-lg p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold">{product.rating}</span>
                </div>
                <p className="text-white/60 mb-8">Based on {product.reviewCount} reviews</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Write a Review
                </button>
              </div>
            )}

            {activeTab === 'qa' && (
              <div ref={qaRef} className="space-y-6">
                {productQA.map((qa, index) => (
                  <motion.div
                    key={qa.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <QuestionMarkCircleIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-2">{qa.question}</h4>
                        <p className="text-white/70 mb-4">{qa.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              by {qa.author}
                              {qa.verified && (
                                <CheckCircleIcon className="w-4 h-4 text-green-400" />
                              )}
                            </span>
                            <span>{qa.date}</span>
                          </div>
                          <button className="text-sm text-white/50 hover:text-white/80 flex items-center gap-1">
                            👍 {qa.helpful}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center pt-6">
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors border border-white/10 flex items-center gap-2 mx-auto">
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    Ask a Question
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <EyeIcon className="w-6 h-6 text-purple-400" />
                Recently Viewed
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentlyViewed.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/products/${item.id}`} className="group block">
                    <div className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors border border-white/10">
                      <div className="aspect-square relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(item.rating)
                                  ? 'text-yellow-400'
                                  : 'text-white/20'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-white/60 ml-1">{item.rating}</span>
                        </div>
                        <p className="font-bold text-sm">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/products/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors border border-white/10">
                    <div className="aspect-square relative">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-medium mb-2 group-hover:text-purple-300 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(relatedProduct.rating)
                                  ? 'text-yellow-400'
                                  : 'text-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-white/60">{relatedProduct.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">₹{relatedProduct.price.toLocaleString()}</span>
                        {relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-sm text-white/50 line-through">
                            ₹{relatedProduct.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Proof Notification */}
        <AnimatePresence>
          {socialProofVisible && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="fixed bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-sm z-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <div className="text-sm">
                  <p className="text-white font-medium">
                    {recentPurchases[currentSocialProofIndex].name} from {recentPurchases[currentSocialProofIndex].location}
                  </p>
                  <p className="text-white/60">
                    purchased {recentPurchases[currentSocialProofIndex].product} • {recentPurchases[currentSocialProofIndex].time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSocialProofVisible(false)}
                className="absolute top-2 right-2 text-white/60 hover:text-white"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl border border-white/20 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{sizeGuide.hoodie.title}</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-white/60 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-2 text-white/80 font-medium">Size</th>
                      <th className="text-left py-3 px-2 text-white/80 font-medium">Chest (inches)</th>
                      <th className="text-left py-3 px-2 text-white/80 font-medium">Length (inches)</th>
                      <th className="text-left py-3 px-2 text-white/80 font-medium">Sleeve (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.hoodie.measurements.map((measurement) => (
                      <tr key={measurement.size} className="border-b border-white/10">
                        <td className="py-3 px-2 font-medium text-white">{measurement.size}</td>
                        <td className="py-3 px-2 text-white/70">{measurement.chest}</td>
                        <td className="py-3 px-2 text-white/70">{measurement.length}</td>
                        <td className="py-3 px-2 text-white/70">{measurement.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                  Sizing Tips
                </h3>
                <ul className="space-y-2">
                  {sizeGuide.hoodie.tips.map((tip, index) => (
                    <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {showImageLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowImageLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.images[lightboxImageIndex]}
                alt={`${product.name} - Image ${lightboxImageIndex + 1}`}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              <button
                onClick={() => setShowImageLightbox(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <button
                onClick={prevLightboxImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={nextLightboxImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === lightboxImageIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}