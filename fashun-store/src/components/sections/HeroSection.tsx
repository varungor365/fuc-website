'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      id: 1,
      title: "REDEFINE\nYOUR STYLE",
      subtitle: "Premium Streetwear Collection",
      description: "Discover bold designs, premium fabrics, and customizable apparel that speaks your language. Express yourself with confidence.",
      cta: "Explore Collection",
      ctaLink: "/collections/all",
      backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center",
      textColor: "light"
    },
    {
      id: 2,
      title: "CREATE\nSOMETHING UNIQUE",
      subtitle: "Design Your Own Apparel",
      description: "Use our advanced design tools to create unique prints and customize your perfect streetwear piece.",
      cta: "Start Designing",
      ctaLink: "/designer",
      backgroundImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop&crop=center",
      textColor: "light"
    },
    {
      id: 3,
      title: "PREMIUM\nQUALITY",
      subtitle: "Crafted to Perfection",
      description: "Every piece is made with the finest materials and attention to detail. Quality that lasts, style that speaks.",
      cta: "Shop Now",
      ctaLink: "/collections/premium",
      backgroundImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&h=1080&fit=crop&crop=center",
      textColor: "light"
    }
  ]

  const currentHero = heroSlides[currentSlide]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm font-medium tracking-widest text-yellow-400 uppercase mb-4"
              >
                {currentHero.subtitle}
              </motion.p>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-6xl md:text-8xl font-bold text-white mb-6 leading-none"
              >
                {currentHero.title.split('\n').map((line, index) => (
                  <div key={index} className="block">
                    {line}
                  </div>
                ))}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg text-gray-200 max-w-2xl mb-8 leading-relaxed"
              >
                {currentHero.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href={currentHero.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-black px-8 py-4 text-base font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {currentHero.cta}
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/80 hover:text-white transition-colors"
        aria-label="Scroll to next section"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <ChevronDownIcon className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </section>
  )
}
