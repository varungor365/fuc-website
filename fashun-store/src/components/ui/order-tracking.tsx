"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Package, Truck, Home } from "lucide-react";

interface OrderTrackingStep {
  id: string;
  title: string;
  description: string;
  date?: string;
  status: "completed" | "current" | "pending";
  icon?: React.ReactNode;
}

interface OrderTrackingProps {
  steps: OrderTrackingStep[];
  className?: string;
}

const defaultSteps: OrderTrackingStep[] = [
  {
    id: "1",
    title: "Order Placed",
    description: "Your order has been confirmed",
    status: "completed",
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: "2",
    title: "Processing",
    description: "Preparing your items",
    status: "completed",
    icon: <Package className="w-5 h-5" />,
  },
  {
    id: "3",
    title: "Shipped",
    description: "Out for delivery",
    status: "current",
    icon: <Truck className="w-5 h-5" />,
  },
  {
    id: "4",
    title: "Delivered",
    description: "Package delivered",
    status: "pending",
    icon: <Home className="w-5 h-5" />,
  },
];

export function OrderTracking({ steps = defaultSteps, className }: OrderTrackingProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 h-full w-0.5 bg-gradient-to-b from-gray-200 via-gray-200 to-gray-200">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-500"
            initial={{ height: "0%" }}
            animate={{
              height: `${
                (steps.filter((s) => s.status === "completed").length /
                  steps.length) *
                100
              }%`,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-4 border-white shadow-lg",
                    {
                      "bg-gradient-to-br from-orange-500 to-orange-600 text-white":
                        step.status === "completed",
                      "bg-gradient-to-br from-blue-500 to-blue-600 text-white animate-pulse":
                        step.status === "current",
                      "bg-gray-100 text-gray-400": step.status === "pending",
                    }
                  )}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.status === "current" ? (
                    step.icon || <Circle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <motion.div
                  className={cn(
                    "rounded-xl border p-6 transition-all",
                    {
                      "border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-md":
                        step.status === "completed",
                      "border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-lg":
                        step.status === "current",
                      "border-gray-200 bg-gray-50": step.status === "pending",
                    }
                  )}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={cn("text-lg font-semibold", {
                        "text-orange-900": step.status === "completed",
                        "text-blue-900": step.status === "current",
                        "text-gray-500": step.status === "pending",
                      })}
                    >
                      {step.title}
                    </h3>
                    {step.date && (
                      <span className="text-sm text-gray-500">{step.date}</span>
                    )}
                  </div>
                  <p
                    className={cn("text-sm", {
                      "text-orange-700": step.status === "completed",
                      "text-blue-700": step.status === "current",
                      "text-gray-400": step.status === "pending",
                    })}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
