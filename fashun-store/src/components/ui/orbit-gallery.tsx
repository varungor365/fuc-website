"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface OrbitGalleryProps {
  images: OrbitImage[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export function OrbitGallery({
  images,
  className,
  title = "Explore Our Collection",
  subtitle = "360° Product Showcase",
}: OrbitGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const calculateOrbitPosition = (index: number, total: number) => {
    const angle = (index * 360) / total;
    const radians = (angle * Math.PI) / 180;
    const radius = 250;
    return {
      x: Math.cos(radians) * radius,
      z: Math.sin(radians) * radius,
      rotateY: -angle,
    };
  };

  return (
    <section ref={containerRef} className={cn("py-24 px-4 overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {subtitle}
          </p>
        </motion.div>

        {/* 3D Orbit Container */}
        <div className="relative h-[600px] flex items-center justify-center perspective-[2000px]">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative w-[600px] h-[600px]"
          >
            {images.map((image, index) => {
              const position = calculateOrbitPosition(index, images.length);

              return (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    transform: `translate3d(${position.x}px, 0px, ${position.z}px) rotateY(${position.rotateY}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                  whileHover={{ scale: 1.2, z: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative w-48 h-64 rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {image.title && (
                        <h3 className="text-white font-bold text-lg mb-1">
                          {image.title}
                        </h3>
                      )}
                      {image.description && (
                        <p className="text-white/80 text-sm">
                          {image.description}
                        </p>
                      )}
                    </motion.div>

                    {/* Reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Center glow effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-600/20 blur-3xl" />
          </div>
        </div>

        {/* Instructions */}
        <motion.p
          className="text-center text-gray-600 dark:text-gray-400 mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Scroll to rotate • Hover to explore
        </motion.p>
      </div>

      {/* Add perspective CSS */}
      <style jsx global>{`
        .perspective-\\[2000px\\] {
          perspective: 2000px;
        }
      `}</style>
    </section>
  );
}
