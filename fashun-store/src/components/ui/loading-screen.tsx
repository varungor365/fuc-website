"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlickeringGridHero } from "./flickering-grid";
import Image from "next/image";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({
  onLoadingComplete,
  duration = 3000,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999]"
        >
          <FlickeringGridHero>
            <div className="flex flex-col items-center justify-center gap-8">
              {/* FUC Logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 1,
                }}
                className="relative"
              >
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(249, 115, 22, 0.5)",
                      "0 0 60px rgba(236, 72, 153, 0.8)",
                      "0 0 20px rgba(147, 51, 234, 0.5)",
                      "0 0 60px rgba(249, 115, 22, 0.8)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-1"
                >
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <span className="text-6xl font-black bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                      FUC!
                    </span>
                  </div>
                </motion.div>

                {/* Orbiting particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                    animate={{
                      rotate: 360,
                      x: Math.cos((i * Math.PI * 2) / 8) * 80,
                      y: Math.sin((i * Math.PI * 2) / 8) * 80,
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>

              {/* FASHUN.CO Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  FASHUN.CO
                </h1>
                <p className="text-gray-400 text-sm tracking-widest uppercase">
                  Premium Streetwear
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Loading Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-500 text-sm"
              >
                {progress < 30 && "Loading your style..."}
                {progress >= 30 && progress < 60 && "Preparing collections..."}
                {progress >= 60 && progress < 90 && "Almost there..."}
                {progress >= 90 && "Welcome to FASHUN.CO"}
              </motion.p>
            </div>
          </FlickeringGridHero>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
