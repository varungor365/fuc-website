'use client';

import { useState } from 'react';
import AIPatternGenerator from '@/components/studio/AIPatternGenerator';
import DesignRemixer from '@/components/studio/DesignRemixer';
import AdvancedCanvas from '@/components/studio/AdvancedCanvas';

export default function CreatorStudio() {
  const [activeTab, setActiveTab] = useState<'ai' | 'remix' | 'custom'>('ai');
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Creator Studio</h1>
          <p className="text-white/70">Professional design tools powered by AI</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'ai'
                ? 'bg-purple-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🤖 AI Pattern Generator
          </button>
          <button
            onClick={() => setActiveTab('remix')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'remix'
                ? 'bg-purple-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🎨 Design Remix
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'custom'
                ? 'bg-purple-600'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            ✏️ Custom Design
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {activeTab === 'ai' && (
            <AIPatternGenerator onPatternGenerated={setSelectedPattern} />
          )}
          {activeTab === 'remix' && <DesignRemixer />}
          {activeTab === 'custom' && (
            <AdvancedCanvas initialPattern={selectedPattern} />
          )}
        </div>

        {/* Submit to Community */}
        <div className="mt-8 text-center">
          <a
            href="/community/submit"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition"
          >
            💰 Submit Design & Earn Royalties
          </a>
        </div>
      </div>
    </div>
  );
}
