"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `
            [--orange-gradient:repeating-linear-gradient(100deg,#ff8c00_0%,#ff6b00_7%,transparent_10%,transparent_12%,#ff8c00_16%)]
            [--pink-gradient:repeating-linear-gradient(100deg,#ec4899_10%,#f43f5e_15%,transparent_20%,transparent_25%,#ec4899_30%)]
            [--purple-gradient:repeating-linear-gradient(100deg,#9333ea_20%,#7c3aed_25%,transparent_30%,transparent_35%,#9333ea_40%)]
            [background-image:var(--orange-gradient),var(--pink-gradient),var(--purple-gradient)]
            [background-size:300%,200%,100%]
            [background-position:50%_50%,50%_50%,50%_50%]
            `,
            "absolute inset-0 opacity-60 blur-[10px] after:absolute after:inset-0 after:bg-gradient-to-br after:from-black/10 after:via-transparent after:to-black/10"
          )}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["50% 50%", "70% 30%", "50% 50%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, #ff8c00 0%, #ff6b00 7%, transparent 10%, transparent 12%, #ff8c00 16%)",
              backgroundSize: "300%",
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["50% 50%", "30% 70%", "50% 50%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, #ec4899 10%, #f43f5e 15%, transparent 20%, transparent 25%, #ec4899 30%)",
              backgroundSize: "200%",
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["50% 50%", "60% 40%", "50% 50%"],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(100deg, #9333ea 20%, #7c3aed 25%, transparent 30%, transparent 35%, #9333ea 40%)",
              backgroundSize: "100%",
            }}
          />
        </div>
      </div>

      {showRadialGradient && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
      )}

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

interface AuroraHeroProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuroraHero({ className, children }: AuroraHeroProps) {
  return (
    <AuroraBackground className={className}>
      <div className="relative z-10">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {children}
      </div>
    </AuroraBackground>
  );
}

interface AuroraCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuroraCard({ className, children }: AuroraCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl p-8",
        className
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-[-100%]"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(255, 140, 0, 0.3), transparent, rgba(236, 72, 153, 0.3), transparent, rgba(147, 51, 234, 0.3), transparent)",
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AuroraText({ children, className }: AuroraTextProps) {
  return (
    <motion.div
      className={cn("relative inline-block", className)}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ff8c00 0%, #ec4899 25%, #9333ea 50%, #ff8c00 75%, #ec4899 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.div>
  );
}

interface AuroraButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AuroraButton({ children, className, onClick }: AuroraButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-8 py-4 font-bold text-white shadow-lg",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            x: ["-200%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          }}
        />
      </div>

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
