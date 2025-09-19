// Master integration manager for all AI tools
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import AIChatServices from './AIChatServices'
import MarketingAutomation from './MarketingAutomation'
import AnalyticsServices from './AnalyticsServices'
import SocialProofServices from './SocialProofServices'

interface IntegrationsConfig {
  // Chat & Customer Service
  chat: {
    provider: 'tidio' | 'hubspot' | 'crisp' | 'drift'
    enabled: boolean
  }
  
  // Marketing & Email
  marketing: {
    email: 'mailchimp' | 'sendinblue'
    popups: 'privy' | 'optinmonster'
    recommendations: boolean
    enabled: boolean
  }
  
  // Analytics
  analytics: {
    clarity: boolean
    googleAnalytics: boolean
    mixpanel: boolean
    hotjar: boolean
    enabled: boolean
  }
  
  // Social Proof
  socialProof: {
    reviews: 'yotpo' | 'judge.me' | 'loox'
    notifications: 'trustpulse' | 'fomo'
    urgency: boolean
    enabled: boolean
  }
  
  // Performance
  performance: {
    tagManager: boolean
    webVitals: boolean
    lazyLoading: boolean
  }
}

interface MasterIntegrationsProps {
  config?: Partial<IntegrationsConfig>
  userId?: string
  userEmail?: string
  customerId?: string
  productId?: string
  userProperties?: Record<string, any>
}

// Default configuration optimized for performance and conversions
const DEFAULT_CONFIG: IntegrationsConfig = {
  chat: {
    provider: 'tidio',
    enabled: true
  },
  marketing: {
    email: 'sendinblue',
    popups: 'privy',
    recommendations: true,
    enabled: true
  },
  analytics: {
    clarity: true,
    googleAnalytics: true,
    mixpanel: false, // Disabled by default to reduce load
    hotjar: false,   // Disabled by default to reduce load
    enabled: true
  },
  socialProof: {
    reviews: 'judge.me',
    notifications: 'fomo',
    urgency: true,
    enabled: true
  },
  performance: {
    tagManager: true,
    webVitals: true,
    lazyLoading: true
  }
}

export default function MasterIntegrations({
  config = {},
  userId,
  userEmail,
  customerId,
  productId,
  userProperties
}: MasterIntegrationsProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [integrationsConfig, setIntegrationsConfig] = useState<IntegrationsConfig>({
    ...DEFAULT_CONFIG,
    ...config
  })

  useEffect(() => {
    // Initialize all integrations in the correct order
    initializeIntegrations()
  }, [])

  useEffect(() => {
    // Update user context across all platforms when user data changes
    if (userId && userEmail) {
      updateUserContext()
    }
  }, [userId, userEmail, userProperties])

  const initializeIntegrations = () => {
    console.log('🚀 Initializing FASHUN.CO AI Integrations...')
    
    // Set loading state
    setIsLoaded(true)
    
    // Track initialization
    if (window.gtag) {
      window.gtag('event', 'integrations_initialized', {
        config: integrationsConfig
      })
    }
  }

  const updateUserContext = () => {
    // Update user context across all integrated platforms
    const userData = {
      id: userId,
      email: userEmail,
      customerId: customerId,
      properties: userProperties
    }

    // Chat platforms
    if (integrationsConfig.chat.enabled) {
      updateChatUserContext(userData)
    }

    // Analytics platforms
    if (integrationsConfig.analytics.enabled) {
      updateAnalyticsUserContext(userData)
    }

    // Marketing platforms
    if (integrationsConfig.marketing.enabled) {
      updateMarketingUserContext(userData)
    }
  }

  return (
    <>
      {/* Google Tag Manager - Load first for performance */}
      {integrationsConfig.performance.tagManager && (
        <GoogleTagManager />
      )}

      {/* Core Analytics - Load early */}
      {integrationsConfig.analytics.enabled && (
        <AnalyticsServices
          config={{
            clarity: integrationsConfig.analytics.clarity,
            googleAnalytics: integrationsConfig.analytics.googleAnalytics,
            mixpanel: integrationsConfig.analytics.mixpanel,
            hotjar: integrationsConfig.analytics.hotjar
          }}
          userId={userId}
          userProperties={userProperties}
        />
      )}

      {/* Chat Services - Load after critical resources */}
      {integrationsConfig.chat.enabled && (
        <AIChatServices
          config={{
            tidio: integrationsConfig.chat.provider === 'tidio',
            hubspot: integrationsConfig.chat.provider === 'hubspot',
            crisp: integrationsConfig.chat.provider === 'crisp',
            drift: integrationsConfig.chat.provider === 'drift'
          }}
        />
      )}

      {/* Marketing Automation - Load with lower priority */}
      {integrationsConfig.marketing.enabled && (
        <MarketingAutomation
          config={{
            mailchimp: integrationsConfig.marketing.email === 'mailchimp',
            sendinblue: integrationsConfig.marketing.email === 'sendinblue',
            privy: integrationsConfig.marketing.popups === 'privy',
            optinmonster: integrationsConfig.marketing.popups === 'optinmonster',
            recommendations: integrationsConfig.marketing.recommendations
          }}
          userEmail={userEmail}
          customerId={customerId}
        />
      )}

      {/* Social Proof - Load last */}
      {integrationsConfig.socialProof.enabled && (
        <SocialProofServices
          config={{
            reviews: integrationsConfig.socialProof.reviews,
            notifications: integrationsConfig.socialProof.notifications,
            urgency: integrationsConfig.socialProof.urgency
          }}
          productId={productId}
          customerId={customerId}
        />
      )}

      {/* Performance Monitoring */}
      {integrationsConfig.performance.webVitals && (
        <PerformanceMonitor />
      )}

      {/* Integration Status Dashboard (Dev Only) */}
      {process.env.NODE_ENV === 'development' && (
        <IntegrationDashboard 
          config={integrationsConfig}
          isLoaded={isLoaded}
        />
      )}
    </>
  )
}

// Google Tag Manager Component
function GoogleTagManager() {
  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-YOUR_GTM_ID');
            
            // Configure GTM for e-commerce
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'site_type': 'ecommerce',
              'platform': 'nextjs',
              'store_name': 'FASHUN.CO'
            });
          `
        }}
      />
      
      {/* GTM NoScript Fallback */}
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-YOUR_GTM_ID"
          height="0" 
          width="0" 
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

// Performance Monitoring Component
function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(sendToAnalytics)
        onINP(sendToAnalytics)
        onFCP(sendToAnalytics)
        onLCP(sendToAnalytics)
        onTTFB(sendToAnalytics)
      }).catch(console.warn)
    }

    // Monitor integration load times
    const integrationLoadTimes = performance.getEntriesByType('navigation')
    console.log('Integration Performance:', integrationLoadTimes)
  }, [])

  const sendToAnalytics = (metric: any) => {
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true
      })
    }
  }

  return null
}

// Development Integration Dashboard
function IntegrationDashboard({ 
  config, 
  isLoaded 
}: { 
  config: IntegrationsConfig
  isLoaded: boolean 
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full z-50 shadow-lg"
        title="Integration Dashboard"
      >
        🔧
      </button>

      {isVisible && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">AI Integrations</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className={`px-2 py-1 rounded text-xs ${isLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {isLoaded ? 'Loaded' : 'Loading'}
              </span>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Chat & Support</h4>
              <div className="flex items-center justify-between">
                <span>Provider</span>
                <span className="capitalize">{config.chat.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Enabled</span>
                <span className={config.chat.enabled ? 'text-green-600' : 'text-red-600'}>
                  {config.chat.enabled ? '✓' : '✗'}
                </span>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Marketing</h4>
              <div className="flex items-center justify-between">
                <span>Email</span>
                <span className="capitalize">{config.marketing.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pop-ups</span>
                <span className="capitalize">{config.marketing.popups}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommendations</span>
                <span className={config.marketing.recommendations ? 'text-green-600' : 'text-red-600'}>
                  {config.marketing.recommendations ? '✓' : '✗'}
                </span>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Analytics</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span>Google Analytics</span>
                  <span className={config.analytics.googleAnalytics ? 'text-green-600' : 'text-red-600'}>
                    {config.analytics.googleAnalytics ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Clarity</span>
                  <span className={config.analytics.clarity ? 'text-green-600' : 'text-red-600'}>
                    {config.analytics.clarity ? '✓' : '✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mixpanel</span>
                  <span className={config.analytics.mixpanel ? 'text-green-600' : 'text-red-600'}>
                    {config.analytics.mixpanel ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Social Proof</h4>
              <div className="flex items-center justify-between">
                <span>Reviews</span>
                <span className="capitalize">{config.socialProof.reviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                <span className="capitalize">{config.socialProof.notifications}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Helper functions for user context updates
function updateChatUserContext(userData: any) {
  // Update chat services with user data
  console.log('Updating chat user context:', userData)
  
  // Implementation would call specific chat platform APIs
  // This is handled by the individual chat components
}

function updateAnalyticsUserContext(userData: any) {
  // Update analytics platforms with user data
  if (window.gtag) {
    window.gtag('config', 'G-PG5EQP2E0W', {
      user_id: userData.id,
      custom_map: userData.properties
    })
  }

  if (window.mixpanel) {
    window.mixpanel.identify(userData.id)
    window.mixpanel.people.set(userData.properties)
  }
}

function updateMarketingUserContext(userData: any) {
  // Update marketing platforms with user data
  if (window.sendinblue) {
    window.sendinblue.identify({
      email: userData.email,
      attributes: userData.properties
    })
  }
}

// E-commerce event tracking across all platforms
export const trackEcommerceEvent = (event: string, data: any) => {
  // Google Analytics 4
  if (window.gtag) {
    switch (event) {
      case 'view_item':
        window.gtag('event', 'view_item', {
          currency: 'INR',
          value: data.price,
          items: [data.item]
        })
        break
      case 'add_to_cart':
        window.gtag('event', 'add_to_cart', {
          currency: 'INR',
          value: data.value,
          items: data.items
        })
        break
      case 'purchase':
        window.gtag('event', 'purchase', {
          transaction_id: data.transaction_id,
          currency: 'INR',
          value: data.value,
          items: data.items
        })
        break
    }
  }

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track(`E-commerce ${event}`, data)
  }

  // Marketing platforms
  if (window.sendinblue) {
    window.sendinblue.track(event, data)
  }

  // Social proof platforms
  if (event === 'purchase' && window.fomo_ecommerce) {
    window.fomo_ecommerce.trackPurchase(
      data.customer_name,
      data.customer_city,
      data.product_name,
      new Date()
    )
  }
}

// Performance optimization utilities
export const IntegrationUtils = {
  // Lazy load integrations based on user interaction
  lazyLoadIntegrations: () => {
    // Load heavy integrations only when needed
    console.log('Lazy loading integrations...')
  },

  // Prefetch critical integration resources
  prefetchResources: () => {
    const links = [
      'https://code.tidio.co/ew1attncic7hwgbyfjymmksjxiworlaj.js',
      'https://cdn.judge.me/widgets/platform.js',
      'https://www.googletagmanager.com/gtag/js?id=G-PG5EQP2E0W'
    ]

    links.forEach(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = href
      document.head.appendChild(link)
    })
  },

  // Monitor integration performance
  monitorPerformance: () => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('tidio') || 
            entry.name.includes('judge') || 
            entry.name.includes('gtag')) {
          console.log(`Integration Load Time: ${entry.name} - ${entry.duration}ms`)
        }
      }
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }
}

// Global type declarations
declare global {
  interface Window {
    gtag: any
    mixpanel: any
    sendinblue: any
    fomo_ecommerce: any
    dataLayer: any[]
  }
}
