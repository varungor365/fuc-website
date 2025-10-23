"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  category?: string;
}

interface RadialTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
  className?: string;
  centerImage?: string;
  centerText?: string;
}

export function RadialTimeline({
  events,
  title = "Our Journey",
  subtitle = "The story of FASHUN.CO",
  className,
  centerImage,
  centerText = "FASHUN.CO",
}: RadialTimelineProps) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  const calculatePosition = (index: number, total: number) => {
    const angle = (index * 360) / total - 90; // Start from top
    const radians = (angle * Math.PI) / 180;
    const radius = 200; // Distance from center
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
      angle,
    };
  };

  return (
    <section className={cn("py-16 px-4 overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {subtitle}
          </p>
        </motion.div>

        <div className="relative min-h-[600px] flex items-center justify-center">
          {/* Center Circle */}
          <motion.div
            className="absolute z-20 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {centerImage ? (
              <img
                src={centerImage}
                alt="Center"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg text-center px-2">
                {centerText}
              </span>
            )}
          </motion.div>

          {/* Orbital Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.circle
              cx="50%"
              cy="50%"
              r="200"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9333ea" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timeline Events */}
          {events.map((event, index) => {
            const position = calculatePosition(index, events.length);
            const isActive = activeEvent === event.id;

            return (
              <motion.div
                key={event.id}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}
                  className="relative"
                >
                  {/* Connection Line to Center */}
                  <motion.div
                    className="absolute w-0.5 bg-gradient-to-r from-orange-500 to-purple-600 origin-right"
                    style={{
                      height: "200px",
                      transform: `rotate(${position.angle + 90}deg)`,
                      right: "50%",
                      top: "50%",
                    }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  />

                  {/* Event Node */}
                  <motion.button
                    onClick={() =>
                      setActiveEvent(isActive ? null : event.id)
                    }
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 scale-125"
                        : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                    )}
                  >
                    {event.icon ? (
                      <span
                        className={cn(
                          isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {event.icon}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}

                    {/* Pulse animation for active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-purple-600"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    )}
                  </motion.button>

                  {/* Event Info Popup */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-20 left-1/2 -translate-x-1/2 w-72 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-30"
                      >
                        {/* Arrow pointing to node */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45" />

                        {event.category && (
                          <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                            {event.category}
                          </span>
                        )}

                        <h3 className="text-lg font-bold mt-1 mb-2 text-gray-900 dark:text-white">
                          {event.title}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {event.description}
                        </p>

                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                          {event.date}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Date Label */}
                  <motion.div
                    className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {event.date}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          Click on any milestone to learn more about our journey
        </motion.div>
      </div>
    </section>
  );
}
