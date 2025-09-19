import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - FASHUN.CO',
  description: 'Learn about FASHUN.CO - the premier destination for unique streetwear and urban fashion',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="font-montserrat text-5xl md:text-6xl font-bold text-white mb-6">
            About FASHUN.CO
          </h1>
          <p className="font-inter text-xl text-white/80 max-w-3xl mx-auto">
            Redefining streetwear culture through innovative design, premium quality, and authentic expression.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <h2 className="font-montserrat text-3xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Born from the streets and inspired by urban culture, FASHUN.CO was founded with a simple mission: 
              to create streetwear that speaks to the soul of modern fashion enthusiasts.
            </p>
            <p className="text-white/80 mb-6 leading-relaxed">
              We believe that fashion is more than just clothing—it's a form of self-expression, a way to 
              communicate who you are without saying a word. Every piece we create is designed with this 
              philosophy in mind.
            </p>
            <p className="text-white/80 leading-relaxed">
              From concept to creation, we're committed to pushing boundaries and setting new standards 
              in streetwear fashion.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <h2 className="font-montserrat text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-white mb-2">Quality First</h3>
                  <p className="text-white/70">Premium materials and craftsmanship in every piece we create.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-white mb-2">Innovation</h3>
                  <p className="text-white/70">Cutting-edge designs that push the boundaries of streetwear.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-bold text-white mb-2">Community</h3>
                  <p className="text-white/70">Building a global community of fashion-forward individuals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="font-montserrat text-4xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-montserrat text-xl font-bold text-white mb-4">Creativity</h3>
              <p className="text-white/70">
                We celebrate originality and encourage bold self-expression through unique designs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-montserrat text-xl font-bold text-white mb-4">Authenticity</h3>
              <p className="text-white/70">
                Real streetwear for real people. We stay true to our roots and genuine in our approach.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-montserrat text-xl font-bold text-white mb-4">Sustainability</h3>
              <p className="text-white/70">
                Committed to ethical practices and environmental responsibility in fashion.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
          <h2 className="font-montserrat text-4xl font-bold text-white mb-8">Join Our Journey</h2>
          <p className="font-inter text-xl text-white/80 max-w-3xl mx-auto mb-8">
            We're more than a fashion brand—we're a movement. Join thousands of fashion enthusiasts 
            who trust FASHUN.CO to deliver the latest in streetwear innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-montserrat font-bold py-3 px-8 rounded-xl transition-all duration-300">
              Shop Collection
            </button>
            <button className="bg-transparent border-2 border-white/30 hover:border-white/50 text-white font-montserrat font-bold py-3 px-8 rounded-xl transition-all duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}