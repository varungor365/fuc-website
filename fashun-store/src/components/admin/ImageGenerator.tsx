'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiDownload, FiCopy, FiRefreshCw, FiSettings, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface ImageGeneratorProps {
  className?: string;
  onImageGenerated?: (imageUrl: string, metadata: any) => void;
}

interface GenerationMetadata {
  prompt: string;
  style: string;
  aspectRatio: string;
  generatedAt: string;
}

type GenerationStyle = 'realistic' | 'artistic' | 'minimal' | 'fashion';
type AspectRatio = '1:1' | '16:9' | '4:3' | '3:4';

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  className = '', 
  onImageGenerated 
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<GenerationStyle>('fashion');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generationMetadata, setGenerationMetadata] = useState<GenerationMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const styleOptions = [
    { value: 'fashion', label: 'Fashion', description: 'Modern streetwear aesthetic' },
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic images' },
    { value: 'artistic', label: 'Artistic', description: 'Creative and stylized' },
    { value: 'minimal', label: 'Minimal', description: 'Clean and simple' }
  ];

  const aspectRatioOptions = [
    { value: '16:9', label: '16:9', description: 'Widescreen' },
    { value: '4:3', label: '4:3', description: 'Standard' },
    { value: '1:1', label: '1:1', description: 'Square' },
    { value: '3:4', label: '3:4', description: 'Portrait' }
  ];

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
          quality: 'high'
        }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        setGenerationMetadata(data.metadata);
        onImageGenerated?.(data.imageUrl, data.metadata);
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, style, aspectRatio, onImageGenerated]);

  const downloadImage = useCallback(async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fashun-ai-generated-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download image');
    }
  }, [generatedImage]);

  const copyImageUrl = useCallback(async () => {
    if (!generatedImage) return;

    try {
      await navigator.clipboard.writeText(generatedImage);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      setError('Failed to copy URL');
    }
  }, [generatedImage]);

  const promptSuggestions = [
    'A stylish model wearing premium streetwear in an urban setting',
    'Modern minimalist fashion photography with clean backgrounds',
    'Trendy sneakers displayed on a marble surface',
    'Abstract geometric pattern for clothing design',
    'Fashion lifestyle shot with natural lighting'
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Image Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create custom images for your fashion content using advanced AI
        </p>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400"
          >
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Image Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            maxLength={1000}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{prompt.length}/1000 characters</span>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <FiSettings size={14} />
              Advanced Options
            </button>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quick Suggestions
          </label>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {/* Style Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {styleOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStyle(option.value as GenerationStyle)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        style === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {aspectRatioOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAspectRatio(option.value as AspectRatio)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        aspectRatio === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <FiRefreshCw className="animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <FiImage />
              Generate Image
            </>
          )}
        </button>
      </div>

      {/* Generated Image Display */}
      <AnimatePresence>
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Image
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={copyImageUrl}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all ${
                    copySuccess
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {copySuccess ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  {copySuccess ? 'Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <FiDownload size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated by AI"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            {generationMetadata && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <span className="font-medium">Style:</span> {generationMetadata.style}
                </div>
                <div>
                  <span className="font-medium">Ratio:</span> {generationMetadata.aspectRatio}
                </div>
                <div>
                  <span className="font-medium">Generated:</span> {new Date(generationMetadata.generatedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Prompt:</span> {generationMetadata.prompt.substring(0, 30)}...
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGenerator;