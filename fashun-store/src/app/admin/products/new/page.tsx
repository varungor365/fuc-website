'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  CheckIcon,
  PhotoIcon,
  CubeIcon,
  TagIcon,
  TruckIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ProductFormData {
  // Basic Info
  title: string;
  description: string;
  category: string;
  tags: string[];
  
  // Pricing & Inventory
  price: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  trackInventory: boolean;
  quantity: number;
  
  // Images & Media
  images: File[];
  
  // Variants
  variants: ProductVariant[];
  
  // SEO & Organization
  handle: string;
  metaTitle: string;
  metaDescription: string;
  
  // Shipping & Logistics
  weight?: number;
  requiresShipping: boolean;
  taxable: boolean;
}

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku: string;
  inventory: number;
  options: { [key: string]: string };
}

const steps = [
  { id: 1, name: 'Basic Info', icon: CubeIcon, description: 'Product details and description' },
  { id: 2, name: 'Pricing', icon: TagIcon, description: 'Pricing and inventory settings' },
  { id: 3, name: 'Images', icon: PhotoIcon, description: 'Upload product images' },
  { id: 4, name: 'Variants', icon: SparklesIcon, description: 'Size, color, and other options' },
  { id: 5, name: 'SEO', icon: TruckIcon, description: 'Search and shipping settings' }
];

export default function NewProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    price: 0,
    sku: '',
    trackInventory: true,
    quantity: 0,
    images: [],
    variants: [],
    handle: '',
    metaTitle: '',
    metaDescription: '',
    requiresShipping: true,
    taxable: true
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const categories = [
    'Hoodies & Sweatshirts',
    'T-Shirts & Tops', 
    'Jackets & Outerwear',
    'Pants & Bottoms',
    'Accessories',
    'Footwear'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement product creation API call
    console.log('Creating product:', formData);
  };

  const generateAIDescription = async () => {
    setIsGeneratingAI(true);
    // Simulate AI description generation
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: `Elevate your streetwear game with this premium ${formData.title}. Crafted from high-quality materials with attention to detail, this piece combines contemporary design with urban functionality. Perfect for fashion-forward individuals who appreciate authentic street style and superior comfort.`,
        metaTitle: `${formData.title} - Premium Streetwear | FASHUN.CO`,
        metaDescription: `Shop the ${formData.title} from FASHUN.CO. Premium streetwear with modern design and superior quality. Free shipping on orders over ₹1500.`
      }));
      setIsGeneratingAI(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="Enter product title..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-white">
                  Product Description *
                </label>
                <button
                  onClick={generateAIDescription}
                  disabled={!formData.title || isGeneratingAI}
                  className="inline-flex items-center gap-2 text-xs bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1 rounded-full transition-all duration-300"
                >
                  <SparklesIcon className="w-3 h-3" />
                  {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="Describe your product..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="streetwear, hoodie, premium, urban..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-white/70">₹</span>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Compare Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-white/70">₹</span>
                  <input
                    type="number"
                    value={formData.comparePrice || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: parseFloat(e.target.value) || undefined }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="PRODUCT-SKU-001"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  Track Inventory
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, trackInventory: !prev.trackInventory }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.trackInventory ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.trackInventory ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {formData.trackInventory && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product Images
              </label>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                <PhotoIcon className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <p className="text-white/70 mb-2">Drop images here or click to upload</p>
                <p className="text-xs text-white/50">PNG, JPG, GIF up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData(prev => ({ ...prev, images: files }));
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="mt-4 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300"
                >
                  <PhotoIcon className="w-4 h-4" />
                  Choose Images
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-white/80 mb-2">
                    {formData.images.length} image(s) selected
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-2 text-xs text-white/70">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <SparklesIcon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Product Variants</h3>
              <p className="text-white/70">Add size, color, or other variant options</p>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-white/80 text-center">
                Variant creation wizard coming soon...
              </p>
              <p className="text-white/60 text-sm text-center mt-2">
                For now, continue to create a simple product without variants
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Product Handle (URL)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-white/70 bg-white/5 border border-r-0 border-white/10 rounded-l-lg text-sm">
                  /products/
                </span>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="product-handle"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="SEO title for search engines..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                placeholder="Brief description for search results..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  Requires Shipping
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, requiresShipping: !prev.requiresShipping }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.requiresShipping ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.requiresShipping ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">
                  Taxable
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, taxable: !prev.taxable }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.taxable ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.taxable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Create New Product</h1>
          <p className="text-white/70">Add a new product to your store with our intelligent product wizard</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-white/20 text-white/50'
                }`}>
                  {currentStep > step.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 text-center ${
                  currentStep >= step.id ? 'text-white' : 'text-white/50'
                }`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {steps[currentStep - 1].name}
            </h2>
            <p className="text-white/70">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 rounded-lg text-white transition-all duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </button>

          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300"
            >
              <CheckIcon className="w-4 h-4" />
              Create Product
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}