"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  className?: string;
  href?: string;
  badge?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function BentoCard({
  title,
  description,
  icon,
  image,
  className,
  href,
  badge,
  onClick,
  children,
}: BentoCardProps) {
  const Component = href ? motion.a : motion.div;
  const componentProps = href ? { href } : {};

  return (
    <Component
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      {...componentProps}
    >
      {/* Background image */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Badge */}
        {badge && (
          <span className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            {badge}
          </span>
        )}

        {/* Icon */}
        {icon && (
          <motion.div
            className="mb-4 text-orange-500"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        )}

        {/* Custom children content */}
        {children}

        {/* Hover arrow */}
        <motion.div
          className="mt-auto pt-4 flex items-center text-sm font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          Explore
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/20 via-pink-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </Component>
  );
}

interface BentoFeatureCardProps extends BentoCardProps {
  stats?: { label: string; value: string }[];
}

export function BentoFeatureCard({
  stats,
  ...props
}: BentoFeatureCardProps) {
  return (
    <BentoCard {...props} className={cn("min-h-[200px]", props.className)}>
      {stats && (
        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </BentoCard>
  );
}

interface BentoProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating?: number;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function BentoProductCard({
  title,
  price,
  originalPrice,
  image,
  badge,
  rating,
  className,
  href,
  onClick,
}: BentoProductCardProps) {
  return (
    <BentoCard
      title={title}
      image={image}
      badge={badge}
      href={href}
      onClick={onClick}
      className={cn("min-h-[300px]", className)}
    >
      <div className="mt-auto pt-4">
        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
      </div>
    </BentoCard>
  );
}

// Large card variant
export function BentoCardLarge({ className, ...props }: BentoCardProps) {
  return (
    <BentoCard
      {...props}
      className={cn("md:col-span-2 min-h-[400px]", className)}
    />
  );
}

// Tall card variant
export function BentoCardTall({ className, ...props }: BentoCardProps) {
  return (
    <BentoCard
      {...props}
      className={cn("md:row-span-2 min-h-[400px]", className)}
    />
  );
}

// Wide card variant
export function BentoCardWide({ className, ...props }: BentoCardProps) {
  return (
    <BentoCard
      {...props}
      className={cn("lg:col-span-2 min-h-[250px]", className)}
    />
  );
}
