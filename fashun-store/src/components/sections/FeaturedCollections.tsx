'use client'

import Link from 'next/link'
import Image from 'next/image'

const collections = [
  {
    id: 1,
    name: 'Oversized Hoodies',
    description: 'Premium cotton blend hoodies with bold streetwear designs',
    image: '/api/placeholder/600/800',
    href: '/collections/hoodies',
    price: 'From ₹2,499',
    featured: true,
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Graphic Tees',
    description: 'Statement pieces with unique artwork and premium comfort',
    image: '/api/placeholder/600/800',
    href: '/collections/tshirts',
    price: 'From ₹1,299',
    featured: true,
    badge: 'New'
  },
  {
    id: 3,
    name: 'Polo Collection',
    description: 'Elevated streetwear polos with contemporary styling',
    image: '/api/placeholder/600/800',
    href: '/collections/polos',
    price: 'From ₹1,899',
    featured: true,
    badge: 'Premium'
  },
  {
    id: 4,
    name: 'Custom Designs',
    description: 'Create your own unique streetwear with our design tools',
    image: '/api/placeholder/600/800',
    href: '/designer',
    price: 'Start Creating',
    featured: true,
    badge: 'Popular'
  }
]

export function FeaturedCollections() {
  return (
    <section className="py-20 bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-white mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-primary-300 max-w-2xl mx-auto">
            Discover our curated selection of premium streetwear designed for the modern generation
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`group relative overflow-hidden rounded-2xl ${
                collection.featured ? 'lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <Link href={collection.href}>
                <div className="relative aspect-square lg:aspect-[4/5] overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-primary-800">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={collection.featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
                  {/* Badge */}
                  {collection.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full">
                        {collection.badge}
                      </span>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                    <div>
                      <h3 className={`font-montserrat font-bold text-white mb-2 ${
                        collection.featured ? 'text-2xl lg:text-3xl' : 'text-xl'
                      }`}>
                        {collection.name}
                      </h3>
                      <p className={`text-primary-200 mb-4 ${
                        collection.featured ? 'text-base lg:text-lg' : 'text-sm'
                      }`}>
                        {collection.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-green-400 ${
                          collection.featured ? 'text-lg' : 'text-base'
                        }`}>
                          {collection.price}
                        </span>
                        <div className="text-white group-hover:text-green-400 transition-colors">
                          <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M17 8l4 4m0 0l-4 4m4-4H3" 
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Link href="/collections/all">
            <button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
              View All Collections
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
