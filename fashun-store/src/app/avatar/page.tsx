'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon, 
  CloudArrowUpIcon, 
  CogIcon, 
  CheckCircleIcon,
  ArrowPathIcon,
  PhotoIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function LoRATrainingPage() {
  const [images, setImages] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelName, setModelName] = useState('My Custom Avatar');
  const [triggerWord, setTriggerWord] = useState('avatar');
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'uploading' | 'training' | 'completed' | 'error'>('idle');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setImages(prev => [...prev, ...newImages]);
    
    // Create preview URLs
    const previewUrls = newImages.map(file => URL.createObjectURL(file));
    setUploadedImages(prev => [...prev, ...previewUrls]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const startTraining = async () => {
    if (images.length < 3) {
      alert('Please upload at least 3 images for training');
      return;
    }

    setIsTraining(true);
    setTrainingStatus('uploading');
    
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start training simulation
    setTrainingStatus('training');
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrainingStatus('completed');
          setIsTraining(false);
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const resetTraining = () => {
    setImages([]);
    setUploadedImages([]);
    setIsTraining(false);
    setTrainingProgress(0);
    setTrainingStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold mb-6"
          >
            <UserCircleIcon className="w-6 h-6" />
            LoRA Custom Model Training
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Train Your Personal Avatar AI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Upload multiple photos of yourself to train a custom AI model that can generate consistent avatars in any style or setting.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Training Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Training Setup</h2>
              
              {/* Model Configuration */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Configuration</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model Name
                    </label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., My Custom Avatar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trigger Word
                    </label>
                    <input
                      type="text"
                      value={triggerWord}
                      onChange={(e) => setTriggerWord(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., avatar"
                    />
                  </div>
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Training Images</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload 3-20 clear photos of yourself from different angles. Best results with front-facing, well-lit images.
                </p>
                
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
                >
                  <CloudArrowUpIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    <span className="text-orange-600 font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    PNG, JPG up to 10MB (3-20 images recommended)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Uploaded Images ({uploadedImages.length})</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {uploadedImages.map((src, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={src}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Training Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={startTraining}
                  disabled={isTraining || images.length < 3}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                    isTraining || images.length < 3
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isTraining ? (
                    <div className="flex items-center justify-center gap-2">
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      {trainingStatus === 'uploading' ? 'Uploading...' : 'Training...'}
                    </div>
                  ) : (
                    'Start Training'
                  )}
                </button>
                
                <button
                  onClick={resetTraining}
                  className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
              
              {/* Training Progress */}
              {isTraining && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>
                      {trainingStatus === 'uploading' ? 'Uploading images...' : 'Training model...'}
                    </span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Training Complete */}
              {trainingStatus === 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Training Complete!</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 mb-4">
                    Your custom avatar model "{modelName}" has been successfully trained. You can now generate avatars using the trigger word "{triggerWord}".
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                      Generate Avatar
                    </button>
                    <button className="py-2 px-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      View Model Details
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Information Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                How It Works
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Upload Photos</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Provide 3-20 clear photos of yourself from different angles and expressions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Model Training</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Our AI processes your images to learn your facial features and characteristics.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Generate Avatars</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Use your custom model to create avatars in any style, setting, or outfit.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-orange-600" />
                    Tips for Best Results
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Use front-facing photos with neutral expressions</li>
                    <li>• Ensure good lighting and clear focus</li>
                    <li>• Include a variety of angles and backgrounds</li>
                    <li>• Avoid accessories that might obscure facial features</li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Training Requirements</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Minimum Images:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recommended Images:</span>
                      <span className="font-medium">8-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Time:</span>
                      <span className="font-medium">5-15 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Storage:</span>
                      <span className="font-medium">50MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Example Avatars */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Example Avatars</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            See what you can create with your custom avatar model
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-purple-400 dark:text-purple-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-semibold">Avatar Style {item}</h3>
                      <p className="text-sm opacity-80">Generated with custom model</p>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Style Variant {item}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Professional portrait with custom styling</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}