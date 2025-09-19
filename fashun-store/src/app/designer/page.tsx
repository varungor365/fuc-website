import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Design Assistant - FASHUN.CO',
  description: 'Create and customize your unique streetwear pieces with our intelligent design tools',
};

export default function DesignerPage() {
  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-montserrat text-5xl font-bold text-white mb-6">
            Design Assistant
          </h1>
          <p className="font-inter text-xl text-white/80 max-w-3xl mx-auto">
            Unleash your creativity with our intelligent design tools. Create custom streetwear pieces that perfectly express your unique style.
          </p>
        </div>

        {/* Design Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="font-montserrat text-xl font-bold text-white mb-4">Custom Graphics</h3>
            <p className="text-white/70 mb-6">Create unique graphic designs for t-shirts, hoodies, and more with our advanced design tools.</p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-3 px-6 rounded-xl transition-all duration-300">
              Start Designing
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
              </svg>
            </div>
            <h3 className="font-montserrat text-xl font-bold text-white mb-4">Text & Typography</h3>
            <p className="text-white/70 mb-6">Add custom text, quotes, or logos with a variety of fonts and styling options.</p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-montserrat font-bold py-3 px-6 rounded-xl transition-all duration-300">
              Add Text
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-montserrat text-xl font-bold text-white mb-4">Style Consultation</h3>
            <p className="text-white/70 mb-6">Get personalized style recommendations and expert advice for your designs.</p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-montserrat font-bold py-3 px-6 rounded-xl transition-all duration-300">
              Get Advice
            </button>
          </div>
        </div>

        {/* Canvas Placeholder */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8">
          <div className="aspect-video bg-white/10 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-montserrat text-2xl font-bold text-white mb-4">Design Canvas</h3>
              <p className="text-white/60 mb-6">Your design workspace will appear here. Start by selecting a product to customize.</p>
              <Link
                href="/collections"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Choose Product
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-montserrat text-lg font-bold text-white mb-4">Colors</h3>
            <div className="grid grid-cols-6 gap-2">
              {['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'].map((color, i) => (
                <div key={i} className={`w-8 h-8 ${color} rounded-lg cursor-pointer hover:scale-110 transition-transform`}></div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-montserrat text-lg font-bold text-white mb-4">Fonts</h3>
            <div className="space-y-2">
              <div className="text-white font-montserrat cursor-pointer hover:text-purple-400">Montserrat</div>
              <div className="text-white font-serif cursor-pointer hover:text-purple-400">Serif</div>
              <div className="text-white font-mono cursor-pointer hover:text-purple-400">Monospace</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-montserrat text-lg font-bold text-white mb-4">Layers</h3>
            <div className="space-y-2">
              <div className="text-white/60 text-sm">Background</div>
              <div className="text-white/60 text-sm">Text Layer 1</div>
              <div className="text-white/60 text-sm">Graphic Element</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h3 className="font-montserrat text-lg font-bold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Save Design
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Preview
              </button>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}