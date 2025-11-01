'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage?: string;
  cta: string;
  ctaLink: string;
  theme: 'dark' | 'light';
  badge?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'WINTER COLLECTION 2025',
    subtitle: 'Streetwear Essentials',
    description: 'Elevate your style with our premium collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=768&h=1024&fit=crop',
    cta: 'Shop Now',
    ctaLink: '/collections/winter-collection',
    theme: 'dark',
    badge: 'NEW ARRIVAL'
  },
  {
    id: 2,
    title: 'OVERSIZED HOODIES',
    subtitle: 'Comfort Meets Style',
    description: 'Premium quality hoodies for the ultimate comfort',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1920&h=1080&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=768&h=1024&fit=crop',
    cta: 'Explore Collection',
    ctaLink: '/collections/oversized-hoodies',
    theme: 'light',
    badge: 'TRENDING'
  },
  {
    id: 3,
    title: 'GRAPHIC TEES',
    subtitle: 'Express Yourself',
    description: 'Bold designs that make a statement',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1920&h=1080&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=768&h=1024&fit=crop',
    cta: 'View Collection',
    ctaLink: '/collections/printed-tshirts',
    theme: 'dark',
    badge: 'BEST SELLERS'
  },
  {
    id: 4,
    title: 'CUSTOMIZE YOUR STYLE',
    subtitle: 'Design Your Own',
    description: 'Create unique pieces with our AI-powered customization',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=768&h=1024&fit=crop',
    cta: 'Start Creating',
    ctaLink: '/customize',
    theme: 'light',
    badge: '🎨 AI POWERED'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Desktop Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={currentSlide === 0}
              className="object-cover hidden md:block"
              sizes="100vw"
            />
            {/* Mobile Image */}
            <Image
              src={slide.mobileImage || slide.image}
              alt={slide.title}
              fill
              priority={currentSlide === 0}
              className="object-cover md:hidden"
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-2xl"
              >
                {/* Badge */}
                {slide.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block mb-4"
                  >
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-semibold tracking-wider">
                      {slide.badge}
                    </span>
                  </motion.div>
                )}

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm md:text-base font-medium mb-3 tracking-wide"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-tight"
                >
                  {slide.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/70 text-base md:text-lg mb-8 max-w-xl"
                >
                  {slide.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Link
                    href={slide.ctaLink}
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
                  >
                    {slide.cta}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
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
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
