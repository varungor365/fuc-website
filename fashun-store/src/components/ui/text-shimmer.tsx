"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  className,
  shimmerColor = "rgba(255, 255, 255, 0.5)",
  duration = 2,
  spread = 3,
}: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-gradient-to-r from-current via-current to-current bg-clip-text text-transparent",
        className
      )}
      style={{
        backgroundSize: `${spread * 100}% 100%`,
        backgroundImage: `linear-gradient(90deg, currentColor 0%, ${shimmerColor} 50%, currentColor 100%)`,
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

interface TextShimmerGradientProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  duration?: number;
}

export function TextShimmerGradient({
  children,
  className,
  gradientColors = ["#f97316", "#ec4899", "#9333ea"],
  duration = 3,
}: TextShimmerGradientProps) {
  const gradientString = gradientColors.join(", ");

  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradientString}, ${gradientColors[0]})`,
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

interface ShimmerTextProps {
  text: string;
  className?: string;
  shimmerWidth?: number;
}

export function ShimmerText({ text, className, shimmerWidth = 100 }: ShimmerTextProps) {
  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <span className="invisible">{text}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        style={{
          backgroundSize: `${shimmerWidth}% 100%`,
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

interface AnimatedShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedShimmerText({
  children,
  className,
  delay = 0,
}: AnimatedShimmerTextProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        backgroundSize: "200% 100%",
      }}
    >
      <motion.span
        className="inline-block"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #f97316, #ec4899, #9333ea, #f97316)",
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

interface PulseShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function PulseShimmerText({ children, className }: PulseShimmerTextProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent font-bold",
        className
      )}
      animate={{
        opacity: [1, 0.7, 1],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}
