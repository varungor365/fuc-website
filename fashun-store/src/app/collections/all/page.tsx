export default function AllCollectionsPage() {
  const products = [
    {
      id: 1,
      name: "Urban Explorer Hoodie",
      price: "₹2,499",
      originalPrice: "₹3,199",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=center",
      category: "Hoodies"
    },
    {
      id: 2,
      name: "Minimalist Graphic Tee",
      price: "₹1,299",
      originalPrice: "₹1,699",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
      category: "T-Shirts"
    },
    {
      id: 3,
      name: "Oversized Street Polo",
      price: "₹1,899",
      originalPrice: "₹2,299",
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop&crop=center",
      category: "Polos"
    },
    {
      id: 4,
      name: "Custom Design Hoodie",
      price: "₹2,799",
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop&crop=center",
      category: "Custom"
    }
  ]

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">All Collections</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our complete range of premium streetwear designed for the modern lifestyle
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold">All</button>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">Hoodies</button>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">T-Shirts</button>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">Polos</button>
          <button className="bg-gray-800 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">Custom</button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <a key={product.id} href={`/products/${product.id}`} className="group">
              <div className="bg-gray-900 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-yellow-400">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-lg">{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-lg font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all transform hover:scale-105">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  )
}