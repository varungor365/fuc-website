"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl px-8 font-medium text-white transition-all duration-300 hover:scale-105",
        className
      )}
      {...props}
    >
      {/* Animated rainbow background */}
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-100 transition-opacity duration-300" />
      
      {/* Animated shine effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
        animate={{
          x: ["-200%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      />

      {/* Glow effect on hover */}
      <span className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600" />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}

interface RainbowButtonIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function RainbowButtonIcon({ children, icon, className, ...props }: RainbowButtonIconProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl px-8 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        className
      )}
      {...props}
    >
      {/* Animated rainbow background */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
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

      {/* Shine effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: { duration: 0.6, ease: "easeInOut" },
        }}
      />

      {/* Pulse effect on hover */}
      <motion.span
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/50 via-pink-500/50 to-purple-600/50"
        initial={{ scale: 1, opacity: 0 }}
        whileHover={{
          scale: 1.5,
          opacity: [0, 0.5, 0],
          transition: { duration: 1, repeat: Infinity },
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && (
          <motion.span
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
        )}
        {children}
      </span>
    </button>
  );
}

interface RainbowButtonCompactProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function RainbowButtonCompact({ children, className, ...props }: RainbowButtonCompactProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-105",
        className
      )}
      {...props}
    >
      {/* Background gradient */}
      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600" />

      {/* Shine on hover */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine" />

      {/* Border glow */}
      <span className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_20px_rgba(236,72,153,0.5)]" />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

// Add shine animation to globals.css or component
const styles = `
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shine {
    animation: shine 1s ease-in-out;
  }
`;
