"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Share2, Heart, MessageCircle, Bookmark } from "lucide-react";

interface ZoomParallaxProps {
  images: string[];
  title?: string;
  description?: string;
  shareUrl?: string;
  className?: string;
}

export function ZoomParallax({
  images,
  title = "Share Your Style",
  description = "Showcase your FASHUN.CO looks",
  shareUrl,
  className,
}: ZoomParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 2.5]);
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 3.5]);

  const handleShare = async (platform: string) => {
    const url = shareUrl || window.location.href;
    const text = `Check out ${title} on FASHUN.CO`;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      instagram: url, // Instagram sharing requires native app
    };

    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div ref={containerRef} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

        {/* Parallax Images */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Center large image */}
          {images[0] && (
            <motion.div
              style={{ scale }}
              className="absolute w-[35vw] h-[50vh] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src={images[0]}
                alt="Main"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Top left */}
          {images[1] && (
            <motion.div
              style={{ scale: scale2 }}
              className="absolute top-[10%] left-[15%] w-[20vw] h-[30vh] rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={images[1]}
                alt="Secondary"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Top right */}
          {images[2] && (
            <motion.div
              style={{ scale: scale3 }}
              className="absolute top-[15%] right-[10%] w-[18vw] h-[25vh] rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={images[2]}
                alt="Tertiary"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Bottom left */}
          {images[3] && (
            <motion.div
              style={{ scale: scale4 }}
              className="absolute bottom-[10%] left-[20%] w-[16vw] h-[22vh] rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={images[3]}
                alt="Fourth"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Bottom right */}
          {images[4] && (
            <motion.div
              style={{ scale: scale2 }}
              className="absolute bottom-[15%] right-[15%] w-[17vw] h-[24vh] rounded-xl overflow-hidden shadow-xl"
            >
              <img
                src={images[4]}
                alt="Fifth"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </div>

        {/* Overlay Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0, 0, 1]) }}
        >
          <h2 className="text-6xl font-bold text-white mb-4 text-center">
            {title}
          </h2>
          <p className="text-xl text-white/80 mb-8">{description}</p>
        </motion.div>

        {/* Share Buttons - Floating */}
        <motion.div
          className="absolute bottom-20 right-8 flex flex-col gap-4 pointer-events-auto z-20"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("native")}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-shadow"
            title="Share"
          >
            <Share2 className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-shadow"
            title="Like"
          >
            <Heart className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare("twitter")}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-shadow"
            title="Tweet"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-shadow"
            title="Save"
          >
            <Bookmark className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
