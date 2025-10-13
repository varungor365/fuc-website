'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function InteractiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const shape = shapeRef.current;
    if (!container || !shape) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      gsap.to(shape, {
        x: x * 50,
        y: y * 50,
        rotationY: x * 20,
        rotationX: -y * 20,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-auto hidden lg:block"
    >
      <div
        ref={shapeRef}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-20 bg-gradient-to-tr from-yellow-400/40 to-red-500/40 rounded-full blur-2xl" />
        <div className="absolute inset-40 bg-gradient-to-bl from-pink-400/50 to-purple-500/50 rounded-full blur-xl" />
      </div>
    </div>
  );
}
