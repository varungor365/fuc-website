export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          FASHUN.CO.IN
        </h1>
        <p className="text-xl text-gray-300 mb-8">Premium Streetwear Collection</p>
        <div className="space-x-4">
          <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Collection
          </button>
          <button className="border border-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Browse Designs
          </button>
        </div>
      </div>
    </main>
  )
}
