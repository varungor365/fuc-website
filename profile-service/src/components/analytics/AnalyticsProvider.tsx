'use client';

import React, { useEffect } from 'react';
import { trackPageView, trackLinkClick, trackQRScan } from '@/lib/analytics';

interface AnalyticsProviderProps {
  children: React.ReactNode;
  userId: string;
}

export function AnalyticsProvider({ children, userId }: AnalyticsProviderProps) {
  useEffect(() => {
    // Track initial page view
    if (userId) {
      trackPageView(userId, {
        visitorId: getOrCreateVisitorId()
      });
    }

    // Track link clicks
    const handleLinkClick = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href && userId) {
        trackLinkClick(userId, target.href, target.textContent || '');
      }
    };

    // Add global click listener
    document.addEventListener('click', handleLinkClick);

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [userId]);

  return <>{children}</>;
}

// Utility function to get or create visitor ID
function getOrCreateVisitorId(): string {
  const storageKey = 'analytics_visitor_id';
  
  try {
    let visitorId = localStorage.getItem(storageKey);
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(storageKey, visitorId);
    }
    return visitorId;
  } catch {
    // Fallback if localStorage is not available
    return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

// Analytics hook for manual tracking
export function useAnalytics(userId: string) {
  return {
    trackEvent: (eventType: string, eventData: Record<string, any> = {}) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          eventType,
          eventData,
          metadata: {
            visitorId: getOrCreateVisitorId(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        })
      }).catch(console.error);
    },
    
    trackPageView: () => trackPageView(userId),
    trackLinkClick: (url: string, text: string) => trackLinkClick(userId, url, text),
    trackQRScan: (type?: string) => trackQRScan(userId, type),
    
    trackShare: (platform: string, content: string) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          eventType: 'share',
          eventData: { platform, content },
          metadata: {
            visitorId: getOrCreateVisitorId(),
            userAgent: navigator.userAgent
          }
        })
      }).catch(console.error);
    },
    
    trackDownload: (fileName: string, fileType: string) => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          eventType: 'download',
          eventData: { fileName, fileType },
          metadata: {
            visitorId: getOrCreateVisitorId(),
            userAgent: navigator.userAgent
          }
        })
      }).catch(console.error);
    }
  };
}