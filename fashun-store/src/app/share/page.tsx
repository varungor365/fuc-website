"use client";

import React from "react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { OrbitGallery } from "@/components/ui/orbit-gallery";
import { FeatureHighlight } from "@/components/ui/feature-highlight";
import { CustomerAnalytics } from "@/components/ui/customer-analytics";
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Truck, 
  Heart, 
  Sparkles,
  Tag,
  Users,
  Clock
} from "lucide-react";

export default function SharePage() {
  // Sample images for ZoomParallax
  const parallaxImages = [
    "/api/freepik?term=streetwear fashion model&limit=1&type=photo&orientation=square",
    "/api/freepik?term=urban fashion style&limit=1&type=photo&orientation=square",
    "/api/freepik?term=fashion photoshoot&limit=1&type=photo&orientation=square",
    "/api/freepik?term=trendy outfit&limit=1&type=photo&orientation=square",
    "/api/freepik?term=fashion lifestyle&limit=1&type=photo&orientation=square",
  ];

  // Sample orbit gallery images
  const orbitImages = [
    {
      src: "/api/freepik?term=hoodie mockup&limit=1&type=photo&orientation=square",
      alt: "Premium Hoodie",
      title: "Urban Hoodie",
      description: "Oversized comfort with style",
    },
    {
      src: "/api/freepik?term=t-shirt design&limit=1&type=photo&orientation=square",
      alt: "Graphic Tee",
      title: "Limited Edition Tee",
      description: "Exclusive print designs",
    },
    {
      src: "/api/freepik?term=bomber jacket&limit=1&type=photo&orientation=square",
      alt: "Bomber Jacket",
      title: "Classic Bomber",
      description: "Timeless streetwear",
    },
    {
      src: "/api/freepik?term=cargo pants&limit=1&type=photo&orientation=square",
      alt: "Cargo Pants",
      title: "Tactical Cargos",
      description: "Function meets fashion",
    },
    {
      src: "/api/freepik?term=sneakers fashion&limit=1&type=photo&orientation=square",
      alt: "Sneakers",
      title: "Street Kicks",
      description: "Complete your look",
    },
    {
      src: "/api/freepik?term=cap beanie&limit=1&type=photo&orientation=square",
      alt: "Accessories",
      title: "Head Gear",
      description: "Finishing touches",
    },
  ];

  // Features for FeatureHighlight
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Shipping",
      description: "Get your orders delivered within 2-3 business days with our express shipping service.",
      benefits: [
        "Free shipping on orders over ₹999",
        "Real-time order tracking",
        "Secure packaging guaranteed",
        "Hassle-free returns within 30 days",
      ],
      gradient: "from-yellow-500 via-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Every piece is crafted with premium fabrics and undergoes strict quality control.",
      benefits: [
        "100% authentic products",
        "Premium cotton and materials",
        "Fade-resistant prints",
        "Durability guaranteed",
      ],
      gradient: "from-blue-500 via-purple-500 to-pink-500",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority with 24/7 support and easy returns.",
      benefits: [
        "24/7 customer support",
        "30-day return policy",
        "Size exchange available",
        "Dedicated support team",
      ],
      gradient: "from-pink-500 via-red-500 to-rose-500",
    },
    {
      icon: Tag,
      title: "Best Prices",
      description: "Premium streetwear at affordable prices with regular discounts and deals.",
      benefits: [
        "Competitive pricing",
        "Seasonal sales and offers",
        "Student discounts available",
        "Price match guarantee",
      ],
      gradient: "from-green-500 via-emerald-500 to-teal-500",
    },
    {
      icon: Sparkles,
      title: "Exclusive Drops",
      description: "Be the first to access limited edition collections and collaborations.",
      benefits: [
        "Early access for members",
        "Limited edition releases",
        "Exclusive collaborations",
        "Members-only designs",
      ],
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of fashion enthusiasts and share your style with the world.",
      benefits: [
        "Style inspiration feed",
        "Community challenges",
        "Featured on our socials",
        "Rewards for engagement",
      ],
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    },
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Social Sharing Section with Zoom Parallax */}
      <section className="relative">
        <ZoomParallax
          images={parallaxImages}
          title="Share Your FASHUN"
          description="Show the world your style"
          shareUrl={typeof window !== "undefined" ? window.location.href : ""}
        />
      </section>

      {/* 3D Orbit Gallery */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black">
        <OrbitGallery
          images={orbitImages}
          title="Explore Our Collection"
          subtitle="360° Product Showcase"
        />
      </section>

      {/* Feature Highlight */}
      <section className="bg-gradient-to-b from-black to-gray-900">
        <FeatureHighlight
          features={features}
          title="Why Choose FASHUN.CO"
          subtitle="Premium streetwear experience, unmatched quality"
        />
      </section>

      {/* Customer Analytics */}
      <section className="bg-gradient-to-b from-gray-900 to-black pb-16">
        <CustomerAnalytics />
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of fashion enthusiasts and start sharing your unique style today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg"
            >
              Shop Collection
            </a>
            <a
              href="/register"
              className="px-8 py-4 bg-black/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-black/30 transition-colors text-lg border-2 border-white/30"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
