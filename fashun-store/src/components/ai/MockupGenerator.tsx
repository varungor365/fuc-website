'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bytezClient } from '@/lib/bytez-client';
import { SparklesIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface MockupGeneratorProps {
  onMockupGenerated: (imageUrl: string) => void;
}

export default function MockupGenerator({ onMockupGenerated }: MockupGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMockups, setGeneratedMockups] = useState<string[]>([]);

  const mockupStyles = [
    { id: 'realistic', name: 'Realistic', desc: 'Photo-realistic mockups' },
    { id: 'artistic', name: 'Artistic', desc: 'Creative artistic style' },
    { id: 'minimal', name: 'Minimal', desc: 'Clean minimal design' },
    { id: 'streetwear', name: 'Streetwear', desc: 'Urban street style' }
  ];

  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const generateMockup = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const result = await bytezClient.generateMockup(
        `${prompt} on a t-shirt mockup, ${selectedStyle} style, high quality, professional photography`,
        selectedStyle
      );
      
      if (result.image_url) {
        setGeneratedMockups(prev => [result.image_url, ...prev]);
        onMockupGenerated(result.image_url);
      }
    } catch (error) {
      console.error('Failed to generate mockup:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    'Minimalist geometric pattern',
    'Vintage band logo style',
    'Abstract colorful design',
    'Typography quote design',
    'Nature inspired artwork',
    'Cyberpunk neon graphics'
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold">AI Mockup Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Design Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your design idea..."
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="grid grid-cols-2 gap-2">
            {mockupStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  selectedStyle === style.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="font-medium">{style.name}</div>
                <div className="text-xs text-gray-400">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Quick Ideas</label>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((quickPrompt) => (
              <button
                key={quickPrompt}
                onClick={() => setPrompt(quickPrompt)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-xs transition-colors"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateMockup}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <PhotoIcon className="w-5 h-5" />
              Generate Mockup
            </>
          )}
        </button>

        {generatedMockups.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Generated Mockups</h4>
            <div className="grid grid-cols-2 gap-2">
              {generatedMockups.slice(0, 4).map((mockup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
                  onClick={() => onMockupGenerated(mockup)}
                >
                  <img
                    src={mockup}
                    alt={`Generated mockup ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}