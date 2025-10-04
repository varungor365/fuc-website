'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid'
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  content: string
  product?: string
  location?: string
  date?: string
}

interface TestimonialsProps {
  variant?: 'default' | 'carousel' | 'grid' | 'featured'
  showControls?: boolean
  autoPlay?: boolean
  testimonials?: Testimonial[]
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Arjun Patel',
    role: 'Fashion Blogger',
    avatar: '/images/avatars/avatar1.jpg',
    rating: 5,
    content: 'FASHUN completely transformed my wardrobe! Their streetwear collection is unmatched in quality and style. Every piece feels premium and the designs are ahead of the curve.',
    product: 'Urban Streetwear Collection',
    location: 'Mumbai, India',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Instagram Influencer',
    avatar: '/images/avatars/avatar2.jpg',
    rating: 5,
    content: 'The AI-powered style recommendations are incredible! FASHUN suggested pieces that perfectly match my aesthetic. Customer service is top-notch too.',
    product: 'Designer Accessories',
    location: 'Delhi, India',
    date: '2024-01-12'
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    role: 'Tech Professional',
    avatar: '/images/avatars/avatar3.jpg',
    rating: 5,
    content: 'Fast delivery, excellent packaging, and the quality exceeded my expectations. The smart shopping experience makes finding the perfect outfit effortless.',
    product: 'Smart Casual Wear',
    location: 'Bangalore, India',
    date: '2024-01-10'
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    role: 'Creative Director',
    avatar: '/images/avatars/avatar4.jpg',
    rating: 5,
    content: 'FASHUN\'s limited edition pieces are works of art. The attention to detail and unique designs make every purchase feel special. Highly recommend!',
    product: 'Limited Edition Collection',
    location: 'Hyderabad, India',
    date: '2024-01-08'
  },
  {
    id: '5',
    name: 'Vikram Singh',
    role: 'Entrepreneur',
    avatar: '/images/avatars/avatar5.jpg',
    rating: 5,
    content: 'The premium quality and innovative designs justify every rupee. FASHUN has become my go-to for both casual and formal wear. Exceptional service!',
    product: 'Premium Formal Collection',
    location: 'Pune, India',
    date: '2024-01-05'
  }
]

export default function Testimonials({
  variant = 'default',
  showControls = true,
  autoPlay = true,
  testimonials = defaultTestimonials
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || variant === 'grid') return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, testimonials.length, variant])

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400' : 'text-primary-600'
        }`}
      />
    ))
  }

  if (variant === 'grid') {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              What Our
              <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                {' '}Customers Say
              </span>
            </h2>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust FASHUN for their style needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-accent-400/30 transition-all group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary-700">
                    <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-primary-300">{testimonial.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                <blockquote className="text-primary-200 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                {testimonial.product && (
                  <div className="text-sm text-accent-400 font-medium">
                    {testimonial.product}
                  </div>
                )}

                {testimonial.location && (
                  <div className="text-xs text-primary-400 mt-2">
                    {testimonial.location}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'featured') {
    const featured = testimonials[currentIndex]
    
    return (
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-accent-500/10" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 text-accent-400 mx-auto mb-8 opacity-50 flex items-center justify-center text-6xl font-serif">
              "
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-8 leading-relaxed">
              "{featured.content}"
            </blockquote>

            <div className="flex items-center gap-2 justify-center mb-6">
              {renderStars(featured.rating)}
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-700">
                <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {featured.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white text-lg">{featured.name}</div>
                <div className="text-primary-300">{featured.role}</div>
                {featured.location && (
                  <div className="text-sm text-primary-400">{featured.location}</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={goToPrev}
                className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-accent-400' : 'bg-primary-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors ml-2"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default carousel variant
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Customer
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              {' '}Love Stories
            </span>
          </h2>
          <p className="text-xl text-primary-200 max-w-3xl mx-auto">
            Discover why fashion enthusiasts choose FASHUN for their style journey
          </p>
        </motion.div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <blockquote className="text-lg text-primary-200 mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </blockquote>

                        {testimonial.product && (
                          <div className="text-accent-400 font-medium mb-2">
                            {testimonial.product}
                          </div>
                        )}
                      </div>

                      <div className="text-center md:text-left">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-primary-700 mx-auto md:mx-0 mb-4">
                          <div className="w-full h-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-xl">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="font-semibold text-white text-lg mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-primary-300 mb-2">{testimonial.role}</div>
                        
                        {testimonial.location && (
                          <div className="text-sm text-primary-400">{testimonial.location}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          {showControls && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={goToPrev}
                className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-accent-400' : 'bg-primary-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>

              {autoPlay && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-primary-800/50 border border-white/10 rounded-full hover:border-accent-400/50 transition-colors"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-5 h-5 text-white" />
                  ) : (
                    <PlayIcon className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}