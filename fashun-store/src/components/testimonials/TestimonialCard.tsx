'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, className = '' }) => {
  return (
    <motion.div
      className={`card glass p-6 hover-lift ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`w-4 h-4 ${
              index < testimonial.rating ? 'text-yellow-500' : 'text-neutral-300'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-neutral-700 mb-6 italic">
        "{testimonial.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200"
        />
        <div>
          <div className="font-semibold text-neutral-900">{testimonial.name}</div>
          <div className="text-sm text-neutral-600">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;