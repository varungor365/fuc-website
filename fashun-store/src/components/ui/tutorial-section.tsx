"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, Check } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  video?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: TutorialStep[];
  ctaText?: string;
  ctaLink?: string;
}

interface TutorialSectionProps {
  tutorials: Tutorial[];
  className?: string;
}

export function TutorialSection({ tutorials, className }: TutorialSectionProps) {
  const [activeTutorial, setActiveTutorial] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleTutorialClick = (tutorialId: string) => {
    if (activeTutorial === tutorialId) {
      setActiveTutorial(null);
      setActiveStep(0);
    } else {
      setActiveTutorial(tutorialId);
      setActiveStep(0);
    }
  };

  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Learn How to Use Our Features
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Step-by-step guides to help you get the most out of FASHUN.CO
          </p>
        </motion.div>

        <div className="space-y-4">
          {tutorials.map((tutorial, index) => {
            const isActive = activeTutorial === tutorial.id;
            const currentSteps = tutorial.steps;

            return (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900"
              >
                {/* Tutorial Header */}
                <button
                  onClick={() => handleTutorialClick(tutorial.id)}
                  className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    {tutorial.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tutorial.description}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </button>

                {/* Tutorial Steps */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-6 space-y-6">
                        {/* Step Indicators */}
                        <div className="flex items-center justify-between mb-6">
                          {currentSteps.map((_, stepIndex) => (
                            <div key={stepIndex} className="flex items-center flex-1">
                              <button
                                onClick={() => setActiveStep(stepIndex)}
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                                  stepIndex <= activeStep
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                )}
                              >
                                {stepIndex < activeStep ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  stepIndex + 1
                                )}
                              </button>
                              {stepIndex < currentSteps.length - 1 && (
                                <div
                                  className={cn(
                                    "flex-1 h-1 mx-2 rounded",
                                    stepIndex < activeStep
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  )}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Active Step Content */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                              {currentSteps[activeStep].title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {currentSteps[activeStep].description}
                            </p>

                            {currentSteps[activeStep].image && (
                              <div className="rounded-lg overflow-hidden mb-4">
                                <img
                                  src={currentSteps[activeStep].image}
                                  alt={currentSteps[activeStep].title}
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            )}

                            {currentSteps[activeStep].video && (
                              <div className="rounded-lg overflow-hidden mb-4">
                                <video
                                  src={currentSteps[activeStep].video}
                                  controls
                                  className="w-full"
                                />
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4">
                          <button
                            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                            disabled={activeStep === 0}
                            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            Previous
                          </button>

                          {activeStep < currentSteps.length - 1 ? (
                            <button
                              onClick={() => setActiveStep(activeStep + 1)}
                              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow"
                            >
                              Next Step
                            </button>
                          ) : tutorial.ctaLink ? (
                            <a
                              href={tutorial.ctaLink}
                              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-shadow"
                            >
                              {tutorial.ctaText || "Try It Now"}
                            </a>
                          ) : (
                            <button
                              onClick={() => setActiveTutorial(null)}
                              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-shadow"
                            >
                              Complete ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
