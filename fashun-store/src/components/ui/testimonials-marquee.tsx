"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  image?: string;
}

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export function TestimonialsMarquee({
  testimonials,
  className,
  speed = 50,
  pauseOnHover = true,
  direction = "left",
}: TestimonialsMarqueeProps) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className={cn("relative overflow-hidden py-12", className)}>
      <motion.div
        className="flex gap-6"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </motion.div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[400px] rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Rating */}
      {testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < testimonial.rating!
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-600"
              )}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm">{testimonial.name}</p>
          {testimonial.role && (
            <p className="text-gray-400 text-xs">
              {testimonial.role}
              {testimonial.company && ` • ${testimonial.company}`}
            </p>
          )}
        </div>
      </div>

      {/* Optional image */}
      {testimonial.image && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <img
            src={testimonial.image}
            alt={`${testimonial.name}'s purchase`}
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full" />
    </motion.div>
  );
}

interface DoubleMarqueeProps {
  topTestimonials: Testimonial[];
  bottomTestimonials: Testimonial[];
  className?: string;
  speed?: number;
}

export function DoubleTestimonialsMarquee({
  topTestimonials,
  bottomTestimonials,
  className,
  speed = 50,
}: DoubleMarqueeProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <TestimonialsMarquee
        testimonials={topTestimonials}
        speed={speed}
        direction="left"
      />
      <TestimonialsMarquee
        testimonials={bottomTestimonials}
        speed={speed}
        direction="right"
      />
    </div>
  );
}

interface VerticalMarqueeProps {
  testimonials: Testimonial[];
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

export function VerticalTestimonialsMarquee({
  testimonials,
  className,
  speed = 30,
  pauseOnHover = true,
}: VerticalMarqueeProps) {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className={cn("relative overflow-hidden h-[600px]", className)}>
      <motion.div
        className="flex flex-col gap-6"
        animate={{
          y: ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
        ))}
      </motion.div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
