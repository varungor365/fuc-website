'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  RocketLaunchIcon,
  PaintBrushIcon,
  CpuChipIcon,
  PhotoIcon,
  BeakerIcon,
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  CloudArrowUpIcon,
  FaceSmileIcon,
  CameraIcon,
  ChartBarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface UseCase {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  example: string;
  features: string[];
  color: string;
}

const useCases: UseCase[] = [
  {
    title: "AI-Powered Design Creation",
    description: "Transform text prompts into unique T-shirt graphics using advanced AI models",
    icon: SparklesIcon,
    example: "User types: 'retro wave cat with neon colors' → AI generates unique synthwave cat design",
    features: [
      "5 AI models: Mystic, Flux, Flux Realism, Flux Anime, Stable Diffusion XL",
      "Style presets: Streetwear, Vintage, Cyberpunk, Minimalist, Vector Art",
      "Advanced controls: Negative prompts, guidance scale, seed control",
      "Batch generation: Create up to 4 designs simultaneously"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Professional Mockup Generation",
    description: "Automatically create high-end product photos with lifestyle photography",
    icon: PhotoIcon,
    example: "AI places design on folded t-shirt with rustic wooden table, soft cozy lighting",
    features: [
      "Automated lifestyle mockups with professional lighting",
      "Multiple perspectives: front, back, side, folded, lifestyle shots",
      "Environment customization: studio, outdoor, urban, cozy",
      "Brand-consistent product photography"
    ],
    color: "from-blue-500 to-teal-500"
  },
  {
    title: "Custom Avatar Training (LoRA)",
    description: "Train personalized AI models for consistent character generation",
    icon: UserCircleIcon,
    example: "Upload 5 selfies → Train custom model → Generate avatars in any style",
    features: [
      "Upload multiple photos to train custom AI model",
      "Generate consistent avatars in different styles",
      "Trigger word customization for specific character traits",
      "High-quality, personalized design elements"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    title: "AI Image Enhancement",
    description: "Professional image editing with automated upscaling and background removal",
    icon: AdjustmentsHorizontalIcon,
    example: "Low-res customer photo → 4K upscaled, background removed, ready for print",
    features: [
      "AI upscaling up to 4x resolution",
      "One-click background removal",
      "Smart image enhancement and color correction",
      "Automated relighting and mood adjustment"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Automated Content Pipeline",
    description: "Streamline marketing content creation with stock assets and AI generation",
    icon: ChartBarIcon,
    example: "Auto-generate social media posts, email banners, blog graphics",
    features: [
      "Access to millions of premium stock assets",
      "AI-generated marketing visuals",
      "Automated social media content creation",
      "Brand-consistent design templates"
    ],
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Selfie Try-On System",
    description: "Advanced face detection and virtual try-on for personalized shopping",
    icon: CameraIcon,
    example: "Customer uploads selfie → Face detected, cropped, styled → Added to design canvas",
    features: [
      "Client-side face detection with face-api.js",
      "Automatic face cropping and stylization",
      "Canvas integration with Fabric.js for positioning",
      "Privacy-first: all processing happens locally"
    ],
    color: "from-rose-500 to-pink-500"
  }
];

const workflowSteps = [
  {
    step: 1,
    title: "Generate Design",
    description: "Use AI to create unique graphics from text prompts",
    icon: SparklesIcon
  },
  {
    step: 2,
    title: "Save to Library",
    description: "Store designs in customer library for future use",
    icon: CloudArrowUpIcon
  },
  {
    step: 3,
    title: "Create Order",
    description: "Generate order with design specifications",
    icon: ChartBarIcon
  },
  {
    step: 4,
    title: "Enable Try-On",
    description: "Activate AI try-on system for virtual fitting",
    icon: CameraIcon
  }
];

export default function AICreatorShowcase() {
  const [selectedUseCase, setSelectedUseCase] = useState<number>(0);
  const [showWorkflow, setShowWorkflow] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <RocketLaunchIcon className="w-6 h-6" />
            Powered by Freepik API
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-3"
          >
            <SparklesIcon className="w-12 h-12 text-purple-600" />
            AI Creator Studio
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
          >
            Professional AI-powered design suite for fashun.co.in. Create unique graphics, 
            generate professional mockups, train custom AI models, and automate your entire creative workflow.
          </motion.p>
        </div>

        {/* Workflow Overview */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Workflow Overview</h2>
            <button
              onClick={() => setShowWorkflow(!showWorkflow)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showWorkflow ? 'Hide' : 'Show'} Workflow
            </button>
          </div>
          
          {showWorkflow && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid md:grid-cols-4 gap-6 mb-12"
            >
              {workflowSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Use Cases Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Use Cases</h2>
            <div className="space-y-3">
              {useCases.map((useCase, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUseCase(index)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedUseCase === index
                      ? 'bg-gradient-to-r ' + useCase.color + ' text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <useCase.icon className="w-6 h-6" />
                    <span className="font-semibold">{useCase.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              key={selectedUseCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${useCases[selectedUseCase].color} flex items-center justify-center`}>
                  {React.createElement(useCases[selectedUseCase].icon, { className: "w-6 h-6 text-white" })}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {useCases[selectedUseCase].title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                {useCases[selectedUseCase].description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Example:</h4>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  {useCases[selectedUseCase].example}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {useCases[selectedUseCase].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Technical Specifications
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
              <CpuChipIcon className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">AI Models</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Mystic (Versatile)</li>
                <li>• Flux (High Quality)</li>
                <li>• Flux Realism (Photo)</li>
                <li>• Flux Anime (Illustration)</li>
                <li>• Stable Diffusion XL</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6">
              <AdjustmentsHorizontalIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Generation Control</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Custom prompts & negative prompts</li>
                <li>• Guidance scale (1-20)</li>
                <li>• Seed control for reproducibility</li>
                <li>• Batch generation (1-4 images)</li>
                <li>• Multiple resolutions up to 1024px</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
              <PhotoIcon className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Image Processing</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 4x AI upscaling</li>
                <li>• Background removal</li>
                <li>• Face detection & cropping</li>
                <li>• Professional mockup generation</li>
                <li>• Automated enhancement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Cost Information */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-800">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              Cost-Effective AI Solutions
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Freepik API operates on a pay-as-you-go model. You only pay for what you use, 
              with €5 free credits to get started. No monthly subscriptions required.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">€0.001-0.05</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">per AI generation</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">€5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">free credits included</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">Unlimited</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">stock downloads (premium)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}