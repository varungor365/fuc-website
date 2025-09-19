// Analytics verification and testing utilities
'use client'

interface AnalyticsEvent {
  name: string
  parameters: Record<string, any>
}

interface EcommerceItem {
  item_id: string
  item_name: string
  item_category: string
  item_variant?: string
  price: number
  quantity: number
}

// Enhanced analytics tracking with real tracking IDs
export const analytics = {
  // Verify all analytics services are loaded
  verify: () => {
    const status = {
      googleAnalytics: typeof window !== 'undefined' && 'gtag' in window,
      microsoftClarity: typeof window !== 'undefined' && 'clarity' in window,
      mixpanel: typeof window !== 'undefined' && 'mixpanel' in window,
      timestamp: new Date().toISOString()
    }
    
    console.log('📊 Analytics Status:', status)
    return status
  },

  // Track custom events across all platforms
  track: (eventName: string, properties: Record<string, any> = {}) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: properties.category || 'engagement',
        event_label: properties.label || '',
        value: properties.value || 0,
        ...properties
      })
    }

    // Microsoft Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('event', eventName, properties)
    }

    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(eventName, properties)
    }

    console.log('📈 Event tracked:', eventName, properties)
  },

  // E-commerce specific tracking
  ecommerce: {
    // Product page view
    viewItem: (item: EcommerceItem) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'view_item', {
          currency: 'INR',
          value: item.price,
          items: [item]
        })
      }
      
      analytics.track('product_viewed', {
        product_id: item.item_id,
        product_name: item.item_name,
        category: item.item_category,
        price: item.price
      })
    },

    // Add to cart
    addToCart: (item: EcommerceItem) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
          currency: 'INR',
          value: item.price * item.quantity,
          items: [item]
        })
      }

      analytics.track('add_to_cart', {
        product_id: item.item_id,
        product_name: item.item_name,
        category: item.item_category,
        price: item.price,
        quantity: item.quantity
      })
    },

    // Begin checkout
    beginCheckout: (items: EcommerceItem[], value: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: value,
          items: items
        })
      }

      analytics.track('checkout_started', {
        cart_value: value,
        items_count: items.length,
        items: items.map(item => ({
          id: item.item_id,
          name: item.item_name,
          price: item.price,
          quantity: item.quantity
        }))
      })
    },

    // Purchase
    purchase: (transactionId: string, items: EcommerceItem[], value: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: transactionId,
          currency: 'INR',
          value: value,
          items: items
        })
      }

      analytics.track('purchase_completed', {
        transaction_id: transactionId,
        revenue: value,
        items_count: items.length,
        items: items
      })
    },

    // Search
    search: (searchTerm: string, resultsCount?: number) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'search', {
          search_term: searchTerm,
          ...(resultsCount && { results_count: resultsCount })
        })
      }

      analytics.track('search_performed', {
        search_term: searchTerm,
        results_count: resultsCount || 0
      })
    }
  },

  // PWA specific tracking
  pwa: {
    // App installed
    installed: () => {
      analytics.track('pwa_installed', {
        category: 'pwa',
        installation_source: 'banner'
      })
    },

    // Offline usage
    offlineUsage: (page: string) => {
      analytics.track('offline_page_view', {
        category: 'pwa',
        page: page,
        connection_type: 'offline'
      })
    },

    // Push notification received
    notificationReceived: (type: string) => {
      analytics.track('notification_received', {
        category: 'pwa',
        notification_type: type
      })
    },

    // Push notification clicked
    notificationClicked: (type: string, action?: string) => {
      analytics.track('notification_clicked', {
        category: 'pwa',
        notification_type: type,
        action: action || 'open'
      })
    }
  },

  // User identification
  identify: (userId: string, properties: Record<string, any> = {}) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-PG5EQP2E0W', {
        user_id: userId,
        user_properties: properties
      })
    }

    // Microsoft Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', userId, properties)
    }

    // Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.identify(userId)
      window.mixpanel.people.set(properties)
    }

    console.log('👤 User identified:', userId, properties)
  },

  // Page view tracking
  pageView: (path: string, title?: string) => {
    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-PG5EQP2E0W', {
        page_path: path,
        page_title: title || document.title
      })
    }

    // Microsoft Clarity
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', 'page', path)
    }

    analytics.track('page_viewed', {
      page_path: path,
      page_title: title || document.title
    })
  },

  // Test all tracking
  test: () => {
    console.log('🧪 Testing analytics tracking...')
    
    // Test basic event
    analytics.track('test_event', {
      category: 'testing',
      label: 'analytics_verification',
      value: 1
    })

    // Test e-commerce event
    analytics.ecommerce.viewItem({
      item_id: 'test-product-123',
      item_name: 'Test Streetwear Hoodie',
      item_category: 'Hoodies',
      item_variant: 'Black/L',
      price: 2999,
      quantity: 1
    })

    // Test PWA event
    analytics.pwa.notificationReceived('test')

    console.log('✅ Analytics test events sent!')
  }
}

// Global window declaration for TypeScript
declare global {
  interface Window {
    gtag: any
    clarity: any
    mixpanel: any
    dataLayer: any[]
  }
}

export default analytics
