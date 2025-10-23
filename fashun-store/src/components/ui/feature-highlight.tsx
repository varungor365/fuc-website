"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, X } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  image?: string;
  gradient?: string;
}

interface FeatureHighlightProps {
  features: Feature[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export function FeatureHighlight({
  features,
  className,
  title = "Why Choose FASHUN.CO",
  subtitle = "Premium features for the ultimate streetwear experience",
}: FeatureHighlightProps) {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  return (
    <section className={cn("py-16 px-4", className)}>
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
          <p className="text-gray-600 dark:text-gray-400 text-xl">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const gradient =
              feature.gradient || "from-orange-500 via-pink-500 to-purple-600";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedFeature(index)}
              >
                <motion.div
                  className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                      gradient
                    )}
                  />

                  {/* Icon with pulsing effect */}
                  <motion.div
                    className={cn(
                      "relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br shadow-lg",
                      gradient
                    )}
                    animate={{
                      boxShadow: [
                        "0 10px 25px -5px rgba(249, 115, 22, 0.3)",
                        "0 20px 35px -5px rgba(236, 72, 153, 0.4)",
                        "0 10px 25px -5px rgba(147, 51, 234, 0.3)",
                        "0 10px 25px -5px rgba(249, 115, 22, 0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Icon className="w-8 h-8 text-white" />

                    {/* Ping effect */}
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 animate-ping opacity-20" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>

                  {/* Learn More Button */}
                  <motion.button
                    className="text-sm font-medium text-orange-500 hover:text-pink-500 transition-colors flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    Learn more
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for detailed view */}
      <AnimatePresence>
        {selectedFeature !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              {(() => {
                const feature = features[selectedFeature];
                const Icon = feature.icon;
                const gradient =
                  feature.gradient || "from-orange-500 via-pink-500 to-purple-600";

                return (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={cn(
                          "w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                          gradient
                        )}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                      {feature.description}
                    </p>

                    {feature.image && (
                      <div className="rounded-2xl overflow-hidden mb-6">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Key Benefits
                      </h4>
                      <ul className="space-y-3">
                        {feature.benefits.map((benefit, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div
                              className={cn(
                                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br",
                                gradient
                              )}
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">
                              {benefit}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
