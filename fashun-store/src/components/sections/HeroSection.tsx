'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDownIcon, PlayIcon } from '@heroicons/react/24/outline'

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const heroSlides = [
    {
      id: 1,
      title: "REDEFINE\nYOUR STYLE",
      subtitle: "Premium Streetwear Collection",
      description: "Discover bold designs, premium fabrics, and customizable apparel that speaks your language.",
      cta: "Shop Collection",
      ctaLink: "/collections/all",
      backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&crop=center",
      backgroundVideo: "",
      textColor: "light"
    },
    {
      id: 2,
      title: "CUSTOM\nCREATIONS",
      subtitle: "Design Your Own Apparel",
      description: "Use our AI-powered design tool to create unique prints and customize your perfect hoodie or tee.",
      cta: "Start Designing",
      ctaLink: "/designer",
      backgroundImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop&crop=center",
      backgroundVideo: "",
      textColor: "light"
    },
    {
      id: 3,
      title: "SUSTAINABLE\nFASHION",
      subtitle: "Eco-Conscious Streetwear",
      description: "Premium quality meets environmental responsibility. Made with sustainable materials and ethical practices.",
      cta: "Learn More",
      ctaLink: "/sustainability",
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
            
            {/* Video Background (if available) */}
            {slide.backgroundVideo && isVideoPlaying && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={slide.backgroundVideo} type="video/mp4" />
              </video>
            )}
            
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
                className="text-sm font-medium tracking-widest text-accent-400 uppercase mb-4"
              >
                {currentHero.subtitle}
              </motion.p>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="hero-text text-white mb-6 leading-none"
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
                className="text-lg text-primary-200 max-w-2xl mb-8 leading-relaxed"
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
                    className="btn-primary px-8 py-4 text-base font-semibold"
                  >
                    {currentHero.cta}
                  </motion.button>
                </Link>
                
                {currentHero.backgroundVideo && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    className="btn-secondary px-8 py-4 text-base font-semibold flex items-center gap-2"
                  >
                    <PlayIcon className="h-5 w-5" />
                    {isVideoPlaying ? 'Pause Video' : 'Watch Video'}
                  </motion.button>
                )}
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
                  ? 'bg-accent-500 scale-125'
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
