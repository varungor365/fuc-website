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

          

          <h2 className="font-montserrat text-3xl font-bold text-white mb-4">            <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">    inStock: true

            Your cart is empty

          </h2>              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">  },

          

          <p className="text-white/70 mb-8 max-w-md mx-auto">                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />  {

            Looks like you haven't added any items to your cart yet. 

            Start shopping to fill it up!              </svg>    id: 2,

          </p>

                      </div>    name: 'Graphic Print Tee',

          <div className="space-y-4">

            <Link            <h2 className="font-montserrat text-2xl font-bold text-white mb-4">    price: 1499,

              href="/collections"

              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-3 px-8 rounded-xl transition-all duration-300"              Your cart is empty    originalPrice: 1999,

            >

              Continue Shopping            </h2>    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&crop=center',

            </Link>

                        <p className="text-white/60 mb-8">    color: 'White',

            <div className="flex justify-center space-x-4 text-sm">

              <Link href="/designer" className="text-white/60 hover:text-white transition-colors">              Looks like you haven't added any items to your cart yet. Start shopping to add items here.    size: 'M',

                Try Designer Tool

              </Link>            </p>    quantity: 1,

              <span className="text-white/40">•</span>

              <Link href="/collections" className="text-white/60 hover:text-white transition-colors">            <Link    inStock: true

                Browse Collections

              </Link>              href="/collections"  },

            </div>

          </div>              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-4 px-8 rounded-xl transition-all duration-300"  {

        </div>

            >    id: 3,

        {/* Recommended Products */}

        <div className="mt-16">              Start Shopping    name: 'Premium Cotton Polo',

          <h2 className="font-montserrat text-3xl font-bold text-white text-center mb-8">

            You might also like            </Link>    price: 2299,

          </h2>

                    </div>    originalPrice: 2799,

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[        </div>    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=400&fit=crop&crop=center',

              {

                id: 1,      </div>    color: 'Navy',

                name: 'Urban Streetwear Hoodie',

                price: 2999,    </main>    size: 'L',

                image: '/api/placeholder/300/300',

                category: 'Hoodies'  );    quantity: 1,

              },

              {}    inStock: false

                id: 2,  }

                name: 'Graphic Print T-Shirt',]

                price: 1599,

                image: '/api/placeholder/300/300',export default function CartPage() {

                category: 'T-Shirts'  const [cartItems, setCartItems] = useState(mockCartItems)

              },  const [promoCode, setPromoCode] = useState('')

              {  const [promoApplied, setPromoApplied] = useState(false)

                id: 3,

                name: 'Distressed Denim Jacket',  const updateQuantity = (id: number, newQuantity: number) => {

                price: 3999,    if (newQuantity === 0) {

                image: '/api/placeholder/300/300',      removeItem(id)

                category: 'Jackets'      return

              }    }

            ].map((product) => (    setCartItems(cartItems.map(item => 

              <div key={product.id} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">      item.id === id ? { ...item, quantity: newQuantity } : item

                <div className="aspect-square bg-white/10 rounded-lg mb-4 flex items-center justify-center">    ))

                  <span className="text-white/40 text-sm">{product.category}</span>  }

                </div>

                  const removeItem = (id: number) => {

                <h3 className="font-montserrat text-lg font-bold text-white mb-2">    setCartItems(cartItems.filter(item => item.id !== id))

                  {product.name}  }

                </h3>

                  const moveToWishlist = (id: number) => {

                <p className="text-white/70 mb-4">    // Move to wishlist logic

                  ₹{product.price.toLocaleString()}    removeItem(id)

                </p>  }

                

                <Link  const applyPromoCode = () => {

                  href={`/products/${product.id}`}    if (promoCode.toLowerCase() === 'fuc10') {

                  className="block w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg text-center transition-all duration-300"      setPromoApplied(true)

                >    }

                  View Product  }

                </Link>

              </div>  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

            ))}  const savings = cartItems.reduce((sum, item) => 

          </div>    sum + ((item.originalPrice - item.price) * item.quantity), 0

        </div>  )

      </div>  const discount = promoApplied ? subtotal * 0.1 : 0

    </main>  const shipping = subtotal >= 2000 ? 0 : 200

  );  const total = subtotal - discount + shipping

}
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-primary-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-primary-300 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link 
              href="/collections/all"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-black py-3 px-8 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-primary-300">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary-900 rounded-lg p-6"
              >
                <div className="flex gap-6">
                  
                  {/* Product Image */}
                  <div className="relative w-24 h-32 bg-primary-800 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-xs text-red-400 font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-primary-300 text-sm">
                          Color: {item.color} • Size: {item.size}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToWishlist(item.id)}
                          className="p-2 text-primary-400 hover:text-white transition-colors"
                          title="Move to Wishlist"
                        >
                          <HeartIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-primary-400 hover:text-red-400 transition-colors"
                          title="Remove Item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-white">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-primary-400 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={!item.inStock}
                          className="w-8 h-8 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={!item.inStock}
                          className="w-8 h-8 border border-primary-600 rounded-lg flex items-center justify-center hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {!item.inStock && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-700 rounded-lg">
                        <p className="text-red-400 text-sm">
                          This item is currently out of stock. You can keep it in your cart or remove it.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-6">
              <Link 
                href="/collections/all"
                className="text-accent-400 hover:text-accent-300 font-semibold inline-flex items-center"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary-900 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 bg-primary-800 border border-primary-700 rounded-lg px-3 py-2 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:bg-primary-700 disabled:text-primary-400 text-black font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-400 text-sm mt-2">Promo code applied successfully!</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-primary-200">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>You Save</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo Discount (10%)</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-primary-200">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                
                {shipping === 0 && (
                  <p className="text-green-400 text-sm">
                    🎉 You qualify for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-primary-700 pt-4 mb-6">
                <div className="flex justify-between text-xl font-semibold text-white">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-accent-500 hover:bg-accent-600 text-black py-4 px-6 rounded-lg font-semibold text-center block transition-colors"
              >
                Proceed to Checkout
              </Link>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <p className="text-primary-400 text-sm mb-2">Secure Checkout</p>
                <div className="flex items-center justify-center space-x-4 text-primary-300">
                  <span className="text-xs">🔒 SSL Encrypted</span>
                  <span className="text-xs">💳 Safe Payment</span>
                </div>
              </div>

              {/* Free Shipping Threshold */}
              {shipping > 0 && (
                <div className="mt-6 p-4 bg-primary-800 rounded-lg">
                  <p className="text-primary-300 text-sm text-center">
                    Add ₹{(2000 - subtotal).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-square bg-primary-900 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={`https://images.unsplash.com/photo-157866299644${i}-48f60103fc96?w=300&h=400&fit=crop&crop=center`}
                    alt={`Recommended Product ${i}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-white group-hover:text-accent-400 transition-colors">
                  Recommended Product {i}
                </h3>
                <p className="text-accent-400 font-bold">₹{(1999 + i * 500).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
