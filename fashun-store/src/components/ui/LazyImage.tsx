import { useState } from 'react';

export default function LazyImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && <div className="absolute inset-0 skeleton rounded-lg" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      />
    </div>
  );
}
