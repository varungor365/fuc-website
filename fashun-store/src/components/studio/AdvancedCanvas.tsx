'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface AdvancedCanvasProps {
  initialPattern: string | null;
}

export default function AdvancedCanvas({ initialPattern }: AdvancedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 700,
        backgroundColor: '#ffffff',
      });
    }

    if (initialPattern && fabricCanvasRef.current) {
      fabric.Image.fromURL(initialPattern, (img) => {
        img.scaleToWidth(600);
        fabricCanvasRef.current?.setBackgroundImage(img, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
      });
    }

    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [initialPattern]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Advanced Canvas</h2>
        <p className="text-white/70 mb-6">
          Full creative control with professional tools
        </p>
      </div>

      <div className="bg-white rounded-lg p-4">
        <canvas ref={canvasRef} />
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
