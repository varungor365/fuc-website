import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function AnimatedSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, isVisible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
}
