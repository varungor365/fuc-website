"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, ShoppingBag, Heart, Eye, Share2 } from "lucide-react";

interface AnalyticsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  gradient: string;
}

function AnalyticsCard({ icon, label, value, trend, gradient }: AnalyticsCardProps) {
  return (
    <motion.div
      className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {/* Gradient background */}
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", gradient)} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", gradient)}>
            {icon}
          </div>
          {trend !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", trend >= 0 ? "text-green-500" : "text-red-500")}>
              <TrendingUp className={cn("w-4 h-4", trend < 0 && "rotate-180")} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

interface CustomerAnalyticsProps {
  className?: string;
}

export function CustomerAnalytics({ className }: CustomerAnalyticsProps) {
  // Placeholder data - will be replaced with real data from backend
  const analyticsData = [
    {
      icon: <Eye className="w-6 h-6 text-white" />,
      label: "Profile Views",
      value: "Coming Soon",
      trend: 0,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      label: "Favorites",
      value: "Coming Soon",
      trend: 0,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-white" />,
      label: "Orders",
      value: "Coming Soon",
      trend: 0,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: <Share2 className="w-6 h-6 text-white" />,
      label: "Shares",
      value: "Coming Soon",
      trend: 0,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      label: "Followers",
      value: "Coming Soon",
      trend: 0,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Your Style Analytics
          </h2>
          <p className="text-gray-400 text-lg">
            Track your fashion journey and engagement
          </p>
        </motion.div>

        {/* Notice Banner */}
        <motion.div
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-600/10 border border-orange-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Analytics Coming Soon</h3>
          </div>
          <p className="text-gray-400">
            We're building advanced analytics to help you understand your fashion influence. 
            Features include profile views, engagement metrics, follower insights, and more. 
            Stay tuned for the launch in the coming months!
          </p>
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {analyticsData.map((data, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AnalyticsCard {...data} />
            </motion.div>
          ))}
        </div>

        {/* Feature Preview */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">What's Coming</h3>
            <ul className="space-y-3">
              {[
                "Real-time profile view tracking",
                "Engagement analytics (likes, shares, comments)",
                "Follower growth insights",
                "Product interaction metrics",
                "Social sharing performance",
                "Weekly/monthly reports",
              ].map((feature, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-600/10 border border-orange-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Why Wait?</h3>
            <p className="text-gray-300 mb-4">
              We're launching with a lightweight, social-first experience to keep our platform fast and responsive. 
              Analytics features will be added progressively based on user feedback and server capacity.
            </p>
            <p className="text-gray-400">
              Focus on sharing your style now, and we'll add the insights to track your fashion influence later!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
