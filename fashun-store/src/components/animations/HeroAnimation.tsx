'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        100,
        canvas.width / 2,
        canvas.height / 2,
        400
      );
      gradient.addColorStop(0, `rgba(249, 115, 22, ${0.3 + Math.sin(time) * 0.1})`);
      gradient.addColorStop(0.5, `rgba(236, 72, 153, ${0.2 + Math.cos(time) * 0.1})`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated circles
      for (let i = 0; i < 5; i++) {
        const angle = (time + i * Math.PI * 0.4) * 0.5;
        const radius = 150 + i * 30;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        const size = 20 + Math.sin(time + i) * 10;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      // Animated lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (time + i * Math.PI / 4) * 0.3;
        const startRadius = 100;
        const endRadius = 300;
        
        ctx.beginPath();
        ctx.moveTo(
          canvas.width / 2 + Math.cos(angle) * startRadius,
          canvas.height / 2 + Math.sin(angle) * startRadius
        );
        ctx.lineTo(
          canvas.width / 2 + Math.cos(angle) * endRadius,
          canvas.height / 2 + Math.sin(angle) * endRadius
        );
        ctx.stroke();
      }

      // Center pulsing circle
      const pulseSize = 80 + Math.sin(time * 2) * 20;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 115, 22, ${0.4 + Math.sin(time * 2) * 0.2})`;
      ctx.fill();

      time += 0.02;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none hidden lg:block"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60"
        style={{ filter: 'blur(1px)' }}
      />
    </motion.div>
  );
}
