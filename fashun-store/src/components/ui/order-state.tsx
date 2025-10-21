"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Truck } from "lucide-react";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface OrderStateProps {
  status: OrderStatus;
  orderNumber?: string;
  estimatedDelivery?: string;
  className?: string;
  showIcon?: boolean;
}

const orderStates = {
  pending: {
    icon: Clock,
    color: "bg-yellow-500",
    text: "Order Pending",
    description: "Waiting for confirmation",
    gradient: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-300",
  },
  confirmed: {
    icon: CheckCircle,
    color: "bg-green-500",
    text: "Order Confirmed",
    description: "Your order has been confirmed",
    gradient: "from-green-400 to-green-600",
    borderColor: "border-green-300",
  },
  processing: {
    icon: Package,
    color: "bg-blue-500",
    text: "Processing",
    description: "Preparing your order",
    gradient: "from-blue-400 to-blue-600",
    borderColor: "border-blue-300",
  },
  shipped: {
    icon: Truck,
    color: "bg-purple-500",
    text: "Shipped",
    description: "Your order is on the way",
    gradient: "from-purple-400 to-purple-600",
    borderColor: "border-purple-300",
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-emerald-500",
    text: "Delivered",
    description: "Order has been delivered",
    gradient: "from-emerald-400 to-emerald-600",
    borderColor: "border-emerald-300",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-500",
    text: "Cancelled",
    description: "Order has been cancelled",
    gradient: "from-red-400 to-red-600",
    borderColor: "border-red-300",
  },
  returned: {
    icon: AlertCircle,
    color: "bg-orange-500",
    text: "Returned",
    description: "Order has been returned",
    gradient: "from-orange-400 to-orange-600",
    borderColor: "border-orange-300",
  },
};

export function OrderState({
  status,
  orderNumber,
  estimatedDelivery,
  className,
  showIcon = true,
}: OrderStateProps) {
  const state = orderStates[status];
  const Icon = state.icon;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 p-6",
        state.borderColor,
        "bg-white shadow-lg",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-5 bg-gradient-to-br",
          state.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {showIcon && (
          <motion.div
            className={cn(
              "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-lg bg-gradient-to-br",
              state.gradient
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="h-7 w-7" />
          </motion.div>
        )}

        <div className="flex-1">
          <motion.h3
            className="text-2xl font-bold text-gray-900 mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {state.text}
          </motion.h3>

          <motion.p
            className="text-sm text-gray-600 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {state.description}
          </motion.p>

          {orderNumber && (
            <motion.div
              className="flex items-center gap-2 text-xs text-gray-500 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-semibold">Order #:</span>
              <span className="font-mono">{orderNumber}</span>
            </motion.div>
          )}

          {estimatedDelivery && status !== "delivered" && status !== "cancelled" && (
            <motion.div
              className="flex items-center gap-2 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Clock className="h-3 w-3" />
              <span>Est. Delivery: {estimatedDelivery}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Animated Progress Bar */}
      {status !== "cancelled" && status !== "returned" && status !== "delivered" && (
        <motion.div
          className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className={cn("h-full bg-gradient-to-r", state.gradient)}
            initial={{ width: "0%" }}
            animate={{
              width:
                status === "pending"
                  ? "25%"
                  : status === "confirmed"
                  ? "50%"
                  : status === "processing"
                  ? "75%"
                  : "90%",
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
