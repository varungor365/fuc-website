'use client';

import { useRef } from 'react';

interface AdvancedCanvasProps {
  initialPattern: string | null;
}

export default function AdvancedCanvas({ initialPattern }: AdvancedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced Canvas</h2>
        <p className="text-white/70 mb-6">
          Full creative control with professional tools
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 min-h-[700px] flex items-center justify-center">
        {initialPattern ? (
          <img src={initialPattern} alt="Pattern" className="max-w-full max-h-[700px]" />
        ) : (
          <p className="text-gray-400">Canvas will appear here</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition">
          Add Text
        </button>
        <button className="px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition">
          Upload Image
        </button>
      </div>
    </div>
  );
}
