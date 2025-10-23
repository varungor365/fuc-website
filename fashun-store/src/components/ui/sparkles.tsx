"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SparklesProps {
  className?: string;
  count?: number;
  speed?: number;
  color?: string;
  size?: number;
  children?: React.ReactNode;
}

export function Sparkles({
  className,
  count = 50,
  speed = 3,
  color = "#FFA500",
  size = 3,
  children,
}: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
      size: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        opacity: Math.random(),
        size: Math.random() * size + 1,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Pulse opacity
        particle.opacity = Math.sin(Date.now() * 0.001 + particle.x) * 0.5 + 0.5;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw sparkle effect
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = particle.opacity * 0.5;
        ctx.beginPath();
        ctx.moveTo(particle.x - particle.size * 2, particle.y);
        ctx.lineTo(particle.x + particle.size * 2, particle.y);
        ctx.moveTo(particle.x, particle.y - particle.size * 2);
        ctx.lineTo(particle.x, particle.y + particle.size * 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, color, size]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

interface SparkleIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function SparkleIcon({ className, size = 24, color = "#FFA500" }: SparkleIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill={color}
      />
      <path
        d="M18 6L18.75 8.25L21 9L18.75 9.75L18 12L17.25 9.75L15 9L17.25 8.25L18 6Z"
        fill={color}
        opacity="0.6"
      />
    </motion.svg>
  );
}

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  sparkleCount?: number;
}

export function SparklesText({ children, className, sparkleCount = 3 }: SparklesTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      {Array.from({ length: sparkleCount }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          <SparkleIcon size={16} color="#FFA500" />
        </motion.span>
      ))}
    </span>
  );
}

interface FloatingSparklesProps {
  className?: string;
  children?: React.ReactNode;
}

export function FloatingSparkles({ className, children }: FloatingSparklesProps) {
  const sparkles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-gradient-to-r from-orange-500 to-pink-500"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}

interface SparklesBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SparklesBadge({ children, className }: SparklesBadgeProps) {
  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-semibold",
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <SparkleIcon size={16} color="#FFFFFF" />
      {children}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/30"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
