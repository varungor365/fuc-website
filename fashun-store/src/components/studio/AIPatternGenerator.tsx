'use client';

import { useState } from 'react';

interface AIPatternGeneratorProps {
  onPatternGenerated: (patternUrl: string) => void;
}

export default function AIPatternGenerator({ onPatternGenerated }: AIPatternGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [patterns, setPatterns] = useState<string[]>([]);

  const generatePattern = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/ai-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setPatterns([data.patternUrl, ...patterns]);
      onPatternGenerated(data.patternUrl);
    } catch (error) {
      console.error('Pattern generation failed:', error);
      alert('Failed to generate pattern. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const examplePrompts = [
    'cyberpunk floral pattern',
    '80s retro synthwave',
    'minimalist geometric shapes',
    'japanese wave art',
    'graffiti street art',
    'psychedelic mandala',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Pattern Generator</h2>
        <p className="text-white/70 mb-6">
          Describe your vision and AI will create a unique seamless pattern
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Describe Your Pattern</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., cyberpunk floral pattern"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => e.key === 'Enter' && generatePattern()}
          />
          <button
            onClick={generatePattern}
            disabled={generating || !prompt.trim()}
            className="px-8 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm text-white/70 mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example) => (
            <button
              key={example}
              onClick={() => setPrompt(example)}
              className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {patterns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Generated Patterns</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {patterns.map((pattern, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-white/20 hover:border-purple-500 transition"
                onClick={() => onPatternGenerated(pattern)}
              >
                <img
                  src={pattern}
                  alt={`Pattern ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white font-semibold">Use This Pattern</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm">
          <strong>💡 Pro Tip:</strong> Be specific! Instead of "flowers", try "neon pink roses with cyberpunk circuit patterns"
        </p>
      </div>
    </div>
  );
}
