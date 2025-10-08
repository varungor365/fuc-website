'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export default function ScrollReveal({ children, direction = 'up', delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const directionMap = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 },
    };

    gsap.fromTo(
      element,
      {
        opacity: 0,
        ...directionMap[direction],
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [direction, delay]);

  return <div ref={elementRef}>{children}</div>;
}
