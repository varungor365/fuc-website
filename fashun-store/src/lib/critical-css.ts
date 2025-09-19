// Critical CSS for above-the-fold content
// This CSS will be inlined in the head for faster initial render

export const criticalCSS = `
  /* Critical above-the-fold styles */
  body {
    background-color: #0F0F10;
    color: #E8E8E8;
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    margin: 0;
    line-height: 1.6;
  }

  /* Hero section critical styles */
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0F0F10 0%, #1A1A1B 100%);
    position: relative;
    overflow: hidden;
  }

  /* Typography critical styles */
  .heading-1 {
    font-size: clamp(2.5rem, 8vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0;
    font-family: var(--font-montserrat), sans-serif;
  }

  .body-large {
    font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    line-height: 1.6;
    opacity: 0.9;
  }

  /* Button critical styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
  }

  .btn-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
  }

  /* Layout critical styles */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 2rem;
    }
  }

  /* Hide non-critical elements initially */
  .non-critical {
    visibility: hidden;
  }

  /* Critical loading states */
  .loading-placeholder {
    background: linear-gradient(90deg, #2A2A2B 25%, #404041 50%, #2A2A2B 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Prevent layout shifts */
  img, video {
    max-width: 100%;
    height: auto;
  }

  /* Critical mobile optimizations */
  @media (max-width: 768px) {
    .heading-1 {
      font-size: 2rem;
    }
    
    .body-large {
      font-size: 1rem;
    }
    
    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
    }
  }
`;

// Function to inject critical CSS
export function injectCriticalCSS() {
  if (typeof window !== 'undefined' && !document.getElementById('critical-css')) {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }
}

// Export for use in _document.js or layout components
export default criticalCSS;