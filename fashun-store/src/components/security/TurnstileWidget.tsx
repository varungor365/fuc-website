'use client';

import { useEffect, useRef } from 'react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  siteKey?: string;
}

export default function TurnstileWidget({ onVerify, siteKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
          callback: onVerify,
          theme: 'dark',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onVerify, siteKey]);

  return <div ref={containerRef} className="cf-turnstile" />;
}

declare global {
  interface Window {
    turnstile: any;
  }
}
