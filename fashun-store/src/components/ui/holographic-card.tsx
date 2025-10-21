"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function HolographicCard({
  children,
  className,
  containerClassName,
}: HolographicCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", containerClassName)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10",
          "bg-gradient-to-br from-white/5 via-white/10 to-white/5",
          "backdrop-blur-xl shadow-2xl",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-br before:from-purple-500/20 before:via-pink-500/20 before:to-cyan-500/20",
          "before:opacity-0 hover:before:opacity-100",
          "before:transition-opacity before:duration-500",
          "after:absolute after:inset-0",
          "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]",
          "after:opacity-0 hover:after:opacity-100",
          "after:transition-opacity after:duration-300",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, 
              transparent 0%, 
              rgba(255,255,255,0.1) 25%, 
              rgba(255,255,255,0.3) 50%, 
              rgba(255,255,255,0.1) 75%, 
              transparent 100%)`,
            transform: `translateX(${rotateY * 5}px) translateY(${rotateX * 5}px)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Border glow effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(${rotateY + 90}deg, 
                rgba(147, 51, 234, 0.5), 
                rgba(236, 72, 153, 0.5), 
                rgba(6, 182, 212, 0.5))`,
              filter: "blur(20px)",
              opacity: 0.5,
              zIndex: -1,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    </div>
  );
}
