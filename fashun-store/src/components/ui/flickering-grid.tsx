"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FlickeringGridProps {
  className?: string;
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
}

export function FlickeringGrid({
  className,
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(249, 115, 22)",
  width = 1920,
  height = 1080,
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const columns = Math.floor(width / (squareSize + gridGap));
    const rows = Math.floor(height / (squareSize + gridGap));

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() < flickerChance) {
            ctx.fillStyle = color;
            ctx.globalAlpha = Math.random() * 0.5 + 0.5;
            ctx.fillRect(
              i * (squareSize + gridGap),
              j * (squareSize + gridGap),
              squareSize,
              squareSize
            );
          }
        }
      }
    };

    const animate = () => {
      drawGrid();
      requestAnimationFrame(animate);
    };

    animate();
  }, [squareSize, gridGap, flickerChance, color, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

interface FlickeringGridHeroProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  logo?: string;
  title?: string;
  subtitle?: string;
  minLoadingTime?: number;
}

export function FlickeringGridHero({
  isLoading,
  onLoadingComplete,
  logo,
  title = "FUC!",
  subtitle = "FASHUN.CO",
  minLoadingTime = 2500,
}: FlickeringGridHeroProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, minLoadingTime - elapsed);
          
          setTimeout(() => {
            onLoadingComplete?.();
          }, remaining);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading, onLoadingComplete, minLoadingTime]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-600/10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />

      {/* Flickering Grid Background */}
      <div className="absolute inset-0">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(249, 115, 22)"
          width={typeof window !== "undefined" ? window.innerWidth : 1920}
          height={typeof window !== "undefined" ? window.innerHeight : 1080}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* FUC! Logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {logo ? (
            <div className="relative w-80 h-80 flex items-center justify-center">
              <Image
                src={logo}
                alt="FASHUN.CO Logo"
                width={320}
                height={320}
                className="object-contain drop-shadow-2xl filter brightness-110 hover:scale-105 transition-transform duration-300"
                priority
                unoptimized={logo.endsWith('.svg')}
                onError={() => {
                  console.log('Logo failed to load, falling back to text');
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
            </div>
          ) : (
            <>
              <motion.h1
                className="text-5xl sm:text-7xl md:text-9xl font-black text-white relative"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(249, 115, 22, 0.5)",
                    "0 0 40px rgba(236, 72, 153, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.5)",
                    "0 0 40px rgba(249, 115, 22, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {title}
              </motion.h1>

              {/* Glitch layers */}
              <motion.h1
                className="absolute inset-0 text-5xl sm:text-7xl md:text-9xl font-black text-orange-500 opacity-70"
                style={{ clipPath: "inset(0 0 0 0)" }}
                animate={{
                  clipPath: [
                    "inset(0 0 0 0)",
                    "inset(20% 0 80% 0)",
                    "inset(0 0 0 0)",
                  ],
                  x: [-2, 2, -2],
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
              >
                {title}
              </motion.h1>

              <motion.h1
                className="absolute inset-0 text-5xl sm:text-7xl md:text-9xl font-black text-pink-500 opacity-70"
                style={{ clipPath: "inset(0 0 0 0)" }}
                animate={{
                  clipPath: [
                    "inset(0 0 0 0)",
                    "inset(40% 0 60% 0)",
                    "inset(0 0 0 0)",
                  ],
                  x: [2, -2, 2],
                }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}
              >
                {title}
              </motion.h1>
            </>
          )}
        </motion.div>

        {/* FASHUN.CO Text */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl font-bold tracking-[0.3em] sm:tracking-[0.5em] text-white/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {subtitle}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-sm text-white/60 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your fashion experience...
        </motion.p>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-orange-500" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-pink-500" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-purple-600" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-orange-500" />
    </motion.div>
  );
}
