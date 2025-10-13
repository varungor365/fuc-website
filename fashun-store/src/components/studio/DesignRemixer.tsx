'use client';

import { useState } from 'react';

const OFFICIAL_DESIGNS = [
  { id: 1, name: 'Retro Wave', image: '/designs/retro-wave.svg', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] },
  { id: 2, name: 'Street Graffiti', image: '/designs/graffiti.svg', colors: ['#FF0000', '#00FF00', '#0000FF'] },
  { id: 3, name: 'Minimal Geo', image: '/designs/minimal.svg', colors: ['#000000', '#FFFFFF', '#808080'] },
];

export default function DesignRemixer() {
  const [selectedDesign, setSelectedDesign] = useState(OFFICIAL_DESIGNS[0]);
  const [customText, setCustomText] = useState('');
  const [selectedColors, setSelectedColors] = useState(selectedDesign.colors);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...selectedColors];
    newColors[index] = newColor;
    setSelectedColors(newColors);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Design Remix</h2>
        <p className="text-white/70 mb-6">
          Take our official designs and make them your own
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Design Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Choose a Design</h3>
          <div className="grid grid-cols-2 gap-4">
            {OFFICIAL_DESIGNS.map((design) => (
              <div
                key={design.id}
                onClick={() => {
                  setSelectedDesign(design);
                  setSelectedColors(design.colors);
                }}
                className={`cursor-pointer rounded-lg p-4 border-2 transition ${
                  selectedDesign.id === design.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="bg-white/10 rounded-lg p-4 mb-2 h-32 flex items-center justify-center">
                  <span className="text-4xl">🎨</span>
                </div>
                <p className="text-center font-semibold">{design.name}</p>
              </div>
            ))}
          </div>

          {/* Color Customization */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Customize Colors</h3>
            <div className="space-y-3">
              {selectedColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm w-20">Color {index + 1}</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add Text */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Add Your Text</h3>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Your custom text..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
            />
          </div>
        </div>

        {/* Right - Preview */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          <div className="bg-white/10 rounded-lg p-8 border border-white/20">
            <div className="bg-gray-800 rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-2xl font-bold mb-2">{selectedDesign.name}</p>
              {customText && (
                <p className="text-xl" style={{ color: selectedColors[0] }}>
                  {customText}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                {selectedColors.map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition">
              Apply to T-Shirt
            </button>
            <button className="w-full px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition">
              Save Remix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
