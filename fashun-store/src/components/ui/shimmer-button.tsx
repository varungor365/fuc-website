"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: number;
  background?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.3)",
  shimmerSize = "200px",
  borderRadius = "0.75rem",
  shimmerDuration = 2,
  background = "linear-gradient(90deg, #f97316, #ec4899, #9333ea)",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden px-8 font-medium text-white transition-all duration-300 hover:scale-105",
        className
      )}
      style={{
        borderRadius,
        background,
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          width: shimmerSize,
        }}
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: shimmerDuration,
          ease: "linear",
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

interface ShimmerButtonIconProps extends ShimmerButtonProps {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function ShimmerButtonIcon({
  children,
  icon,
  iconPosition = "left",
  className,
  ...props
}: ShimmerButtonIconProps) {
  return (
    <ShimmerButton className={className} {...props}>
      {iconPosition === "left" && icon && (
        <motion.span
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
      )}
      {children}
      {iconPosition === "right" && icon && (
        <motion.span
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
      )}
    </ShimmerButton>
  );
}

interface ShimmerButtonBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerButtonBorder({
  children,
  className,
  ...props
}: ShimmerButtonBorderProps) {
  return (
    <div className="relative group">
      {/* Animated border */}
      <motion.div
        className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-75 group-hover:opacity-100 blur transition-all"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />

      {/* Button */}
      <button
        className={cn(
          "relative inline-flex h-12 items-center justify-center rounded-xl px-8 bg-black text-white font-medium transition-all duration-300 hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

interface ShimmerButtonCompactProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerButtonCompact({
  children,
  className,
  ...props
}: ShimmerButtonCompactProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-sm font-semibold text-white transition-all duration-300 hover:scale-105",
        className
      )}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ width: "150px" }}
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface ShimmerButtonOutlineProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerButtonOutline({
  children,
  className,
  ...props
}: ShimmerButtonOutlineProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl px-8 bg-transparent border-2 border-gradient font-medium text-white transition-all duration-300 hover:bg-white/5",
        className
      )}
      style={{
        borderImage: "linear-gradient(90deg, #f97316, #ec4899, #9333ea) 1",
      }}
      {...props}
    >
      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        style={{ width: "150px" }}
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      />

      {/* Content */}
      <span className="relative z-10 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        {children}
      </span>
    </button>
  );
}
