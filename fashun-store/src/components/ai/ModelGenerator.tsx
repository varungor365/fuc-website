'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bytezClient } from '@/lib/bytez-client';
import { CubeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function ModelGenerator() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedModel, setGeneratedModel] = useState<string | null>(null);

  const modelTypes = [
    { id: '3d', name: '3D Model', desc: 'Full 3D object model' },
    { id: 'texture', name: 'Texture', desc: 'Surface texture pattern' },
    { id: 'pattern', name: 'Pattern', desc: 'Repeatable design pattern' }
  ];

  const [selectedType, setSelectedType] = useState('3d');

  const generateModel = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    try {
      const result = await bytezClient.generateModel(
        `${description} for streetwear fashion, high quality, detailed`,
        selectedType
      );
      
      if (result.model_url) {
        setGeneratedModel(result.model_url);
      }
    } catch (error) {
      console.error('Failed to generate model:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadModel = () => {
    if (generatedModel) {
      const link = document.createElement('a');
      link.href = generatedModel;
      link.download = 'generated-model.obj';
      link.click();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <CubeIcon className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold">3D Model Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Model Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the 3D model you want to create..."
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model Type</label>
          <div className="grid grid-cols-3 gap-2">
            {modelTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="font-medium text-sm">{type.name}</div>
                <div className="text-xs text-gray-400">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateModel}
          disabled={!description.trim() || isGenerating}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Generating Model...
            </>
          ) : (
            <>
              <CubeIcon className="w-5 h-5" />
              Generate 3D Model
            </>
          )}
        </button>

        {generatedModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Generated Model</h4>
              <button
                onClick={downloadModel}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <CubeIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">3D Model Generated</p>
                <p className="text-xs text-gray-500">Click download to save</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}