'use client';

import React, { useEffect, useRef } from 'react';
import Shepherd, { Tour } from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

interface TourStep {
  id: string;
  title: string;
  text: string;
  attachTo?: {
    element: string;
    on: 'top' | 'bottom' | 'left' | 'right';
  };
  buttons?: Array<{
    text: string;
    action: 'next' | 'back' | 'complete' | (() => void);
    classes?: string;
  }>;
  beforeShow?: () => void;
  when?: {
    show?: () => void;
    hide?: () => void;
  };
}

interface GuidedTourProps {
  tourId: string;
  steps: TourStep[];
  autoStart?: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({
  tourId,
  steps,
  autoStart = false,
  onComplete,
  onCancel
}) => {
  const tourRef = useRef<Shepherd.Tour | null>(null);

  useEffect(() => {
    // Create tour instance
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: 'shepherd-theme-custom',
        scrollTo: true,
        cancelIcon: {
          enabled: true
        }
      }
    });

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .shepherd-modal-overlay-container {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
      }
      
      .shepherd-theme-custom {
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        color: white;
        font-family: 'Inter', sans-serif;
        max-width: 400px;
      }
      
      .shepherd-theme-custom .shepherd-header {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3));
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px 16px 0 0;
        padding: 16px 20px;
      }
      
      .shepherd-theme-custom .shepherd-title {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }
      
      .shepherd-theme-custom .shepherd-text {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        line-height: 1.6;
        padding: 20px;
      }
      
      .shepherd-theme-custom .shepherd-footer {
        background: rgba(255, 255, 255, 0.05);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0 0 16px 16px;
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .shepherd-theme-custom .shepherd-button {
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        padding: 8px 16px;
        transition: all 0.2s;
      }
      
      .shepherd-theme-custom .shepherd-button:hover {
        background: linear-gradient(135deg, #7c3aed, #db2777);
        transform: translateY(-1px);
      }
      
      .shepherd-theme-custom .shepherd-button.shepherd-button-secondary {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .shepherd-theme-custom .shepherd-button.shepherd-button-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .shepherd-theme-custom .shepherd-cancel-icon {
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 20px;
        position: absolute;
        right: 16px;
        top: 16px;
        z-index: 1;
      }
      
      .shepherd-theme-custom .shepherd-cancel-icon:hover {
        color: white;
      }
      
      .shepherd-element {
        background: rgba(139, 92, 246, 0.2);
        border: 2px solid #8b5cf6;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        transition: all 0.3s ease;
      }
      
      .shepherd-enabled.shepherd-element {
        animation: shepherdPulse 2s infinite;
      }
      
      @keyframes shepherdPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
        50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
      }
    `;
    document.head.appendChild(style);

    // Add steps to tour
    steps.forEach((step, index) => {
      const buttons = step.buttons || [
        {
          text: index === 0 ? 'Start Tour' : 'Next',
          action: 'next',
          classes: 'shepherd-button-primary'
        }
      ];

      // Convert button actions
      const processedButtons = buttons.map(button => ({
        text: button.text,
        classes: button.classes || 'shepherd-button-primary',
        action: typeof button.action === 'string' ? 
          (() => {
            if (button.action === 'next') tour.next();
            else if (button.action === 'back') tour.back();
            else if (button.action === 'complete') tour.complete();
          }) : button.action
      }));

      // Add back button for non-first steps
      if (index > 0 && !buttons.some(b => b.action === 'back')) {
        processedButtons.unshift({
          text: 'Back',
          classes: 'shepherd-button-secondary',
          action: () => tour.back()
        });
      }

      // Add complete button for last step
      if (index === steps.length - 1) {
        processedButtons.push({
          text: 'Finish',
          classes: 'shepherd-button-primary',
          action: () => tour.complete()
        });
      }

      tour.addStep({
        id: step.id,
        title: step.title,
        text: step.text,
        attachTo: step.attachTo,
        buttons: processedButtons
      });
    });

    // Event handlers
    tour.on('complete', () => {
      onComplete?.();
      // Store completion status
      if (typeof window !== 'undefined') {
        localStorage.setItem(`tour_${tourId}_completed`, 'true');
      }
    });

    tour.on('cancel', () => {
      onCancel?.();
    });

    tourRef.current = tour;

    // Auto start if enabled and not completed before
    if (autoStart && typeof window !== 'undefined' && !localStorage.getItem(`tour_${tourId}_completed`)) {
      setTimeout(() => tour.start(), 1000);
    }

    return () => {
      tour.complete();
      document.head.removeChild(style);
    };
  }, [tourId, steps, autoStart, onComplete, onCancel]);

  return null;
};

// Hook for manual tour control
export const useTour = (tourId: string) => {
  const tourRef = useRef<Tour | null>(null);

  const startTour = () => {
    tourRef.current?.start();
  };

  const nextStep = () => {
    tourRef.current?.next();
  };

  const previousStep = () => {
    tourRef.current?.back();
  };

  const completeTour = () => {
    tourRef.current?.complete();
  };

  const cancelTour = () => {
    tourRef.current?.cancel();
  };

  const isCompleted = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`tour_${tourId}_completed`) === 'true';
  };

  const resetCompletion = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`tour_${tourId}_completed`);
  };

  return {
    startTour,
    nextStep,
    previousStep,
    completeTour,
    cancelTour,
    isCompleted,
    resetCompletion
  };
};

// Predefined tours
export const TOURS = {
  newUser: {
    id: 'new-user-onboarding',
    steps: [
      {
        id: 'welcome',
        title: '👋 Welcome to FASHUN!',
        text: 'Welcome to the future of streetwear shopping! Let me show you around our AI-powered platform.'
      },
      {
        id: 'search',
        title: '🔍 Smart Search',
        text: 'Use our AI-powered search to find exactly what you\'re looking for. Try visual search or natural language queries!',
        attachTo: { element: '[data-tour="search"]', on: 'bottom' as const }
      },
      {
        id: 'ai-features',
        title: '🤖 AI Features',
        text: 'Discover our AI features including outfit builder, size recommendations, and personalized styling.',
        attachTo: { element: '[data-tour="ai-features"]', on: 'bottom' as const }
      },
      {
        id: 'profile',
        title: '👤 Your Profile',
        text: 'Customize your profile, save favorites, and get personalized recommendations.',
        attachTo: { element: '[data-tour="profile"]', on: 'left' as const }
      },
      {
        id: 'command-palette',
        title: '⌨️ Quick Actions',
        text: 'Press Ctrl+K (or Cmd+K on Mac) anytime to open the command palette for lightning-fast navigation!'
      }
    ]
  },
  
  designStudio: {
    id: 'design-studio-tour',
    steps: [
      {
        id: 'canvas',
        title: '🎨 Design Canvas',
        text: 'This is your creative canvas. Add text, images, and shapes to create your unique design.',
        attachTo: { element: '[data-tour="canvas"]', on: 'right' as const }
      },
      {
        id: 'tools',
        title: '🛠️ Design Tools',
        text: 'Use these tools to add elements, change colors, and modify your design.',
        attachTo: { element: '[data-tour="tools"]', on: 'left' as const }
      },
      {
        id: 'ai-assistant',
        title: '🤖 AI Design Assistant',
        text: 'Get design suggestions and AI-powered assistance for your creative process.',
        attachTo: { element: '[data-tour="ai-assistant"]', on: 'top' as const }
      },
      {
        id: 'preview',
        title: '👕 Live Preview',
        text: 'See how your design looks on actual products in real-time.',
        attachTo: { element: '[data-tour="preview"]', on: 'left' as const }
      }
    ]
  }
};

// Component for triggering tours
interface TourTriggerProps {
  tourId: keyof typeof TOURS;
  children: React.ReactNode;
  className?: string;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({ 
  tourId, 
  children, 
  className = '' 
}) => {
  const { startTour, isCompleted } = useTour(tourId);
  const [completed, setCompleted] = React.useState(false);

  React.useEffect(() => {
    setCompleted(isCompleted());
  }, [isCompleted]);

  const handleClick = () => {
    startTour();
  };

  return (
    <div 
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
      title={completed ? 'Retake tour' : 'Start tour'}
    >
      {children}
    </div>
  );
};

export default GuidedTour;