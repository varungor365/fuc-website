"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  from = "#ff8c00",
  via = "#ec4899",
  to = "#9333ea",
  animate = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  if (animate) {
    return (
      <motion.span
        className={cn("inline-block", className)}
        style={{
          ...gradientStyle,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={cn("inline-block", className)} style={gradientStyle}>
      {children}
    </span>
  );
}

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ff8c00 0%, #ec4899 25%, #9333ea 50%, #ff8c00 75%, #ec4899 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}

interface TypewriterGradientProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TypewriterGradient({
  text,
  className,
  delay = 0.05,
}: TypewriterGradientProps) {
  const letters = Array.from(text);

  return (
    <div className={cn("inline-block", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * delay }}
          style={{
            backgroundImage: `linear-gradient(90deg, #ff8c00, #ec4899, #9333ea)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}

interface PulseGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function PulseGradientText({ children, className }: PulseGradientTextProps) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, #ff8c00, #ec4899, #9333ea)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

interface WaveGradientTextProps {
  text: string;
  className?: string;
}

export function WaveGradientText({ text, className }: WaveGradientTextProps) {
  const letters = Array.from(text);

  return (
    <div className={cn("inline-flex", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          style={{
            backgroundImage: "linear-gradient(90deg, #ff8c00, #ec4899, #9333ea)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}

interface GlowingGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowingGradientText({
  children,
  className,
}: GlowingGradientTextProps) {
  return (
    <motion.div
      className={cn("inline-block relative", className)}
      animate={{
        textShadow: [
          "0 0 10px rgba(255, 140, 0, 0.5)",
          "0 0 20px rgba(236, 72, 153, 0.5)",
          "0 0 30px rgba(147, 51, 234, 0.5)",
          "0 0 20px rgba(236, 72, 153, 0.5)",
          "0 0 10px rgba(255, 140, 0, 0.5)",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        backgroundImage: "linear-gradient(90deg, #ff8c00, #ec4899, #9333ea)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.div>
  );
}

interface RainbowGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function RainbowGradientText({
  children,
  className,
}: RainbowGradientTextProps) {
  return (
    <motion.div
      className={cn("inline-block", className)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #ff0000, #ff8c00, #ffd700, #00ff00, #0000ff, #9333ea, #ff00ff)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}
