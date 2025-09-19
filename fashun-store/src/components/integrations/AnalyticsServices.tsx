// Analytics and content optimization tools
'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

interface AnalyticsConfig {
  clarity?: boolean
  googleAnalytics?: boolean
  mixpanel?: boolean
  hotjar?: boolean
}

interface AnalyticsServicesProps {
  config?: AnalyticsConfig
  userId?: string
  userProperties?: Record<string, any>
}

export default function AnalyticsServices({ 
  config = { 
    clarity: true, 
    googleAnalytics: true 
  },
  userId,
  userProperties
}: AnalyticsServicesProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views on route changes
    trackPageView(pathname)
  }, [pathname])

  useEffect(() => {
    // Initialize user properties when available
    if (userId && userProperties) {
      identifyUser(userId, userProperties)
    }
  }, [userId, userProperties])

  return (
    <>
      {/* Microsoft Clarity */}
      {config.clarity && (
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "tbtbz65uod");
              
              // Configure Clarity
              clarity('set', 'anonymize_ip', true);
              clarity('set', 'mask_sensitive_data', true);
              
              // Custom events for e-commerce
              window.clarityEcommerce = {
                trackPurchase: function(orderId, revenue, items) {
                  clarity('event', 'purchase', {
                    order_id: orderId,
                    revenue: revenue,
                    items: items.length
                  });
                },
                trackAddToCart: function(productId, productName, price) {
                  clarity('event', 'add_to_cart', {
                    product_id: productId,
                    product_name: productName,
                    price: price
                  });
                }
              };
            `
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {config.googleAnalytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-PG5EQP2E0W"
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-PG5EQP2E0W', {
                  page_title: document.title,
                  page_location: window.location.href,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
                
                // Enhanced E-commerce setup
                gtag('config', 'G-PG5EQP2E0W', {
                  custom_map: {
                    'custom_parameter_1': 'customer_lifetime_value',
                    'custom_parameter_2': 'customer_tier'
                  }
                });
                
                // Set up e-commerce tracking
                window.gtag_ecommerce = {
                  // Track product views
                  viewItem: function(item) {
                    gtag('event', 'view_item', {
                      currency: 'INR',
                      value: item.price,
                      items: [{
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: 'FUC',
                        price: item.price,
                        quantity: 1
                      }]
                    });
                  },
                  
                  // Track add to cart
                  addToCart: function(item, quantity = 1) {
                    gtag('event', 'add_to_cart', {
                      currency: 'INR',
                      value: item.price * quantity,
                      items: [{
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: 'FUC',
                        price: item.price,
                        quantity: quantity
                      }]
                    });
                  },
                  
                  // Track remove from cart
                  removeFromCart: function(item, quantity = 1) {
                    gtag('event', 'remove_from_cart', {
                      currency: 'INR',
                      value: item.price * quantity,
                      items: [{
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: 'FUC',
                        price: item.price,
                        quantity: quantity
                      }]
                    });
                  },
                  
                  // Track begin checkout
                  beginCheckout: function(items, value) {
                    gtag('event', 'begin_checkout', {
                      currency: 'INR',
                      value: value,
                      items: items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: 'FUC',
                        price: item.price,
                        quantity: item.quantity
                      }))
                    });
                  },
                  
                  // Track purchase
                  purchase: function(transactionId, items, value, tax = 0, shipping = 0) {
                    gtag('event', 'purchase', {
                      transaction_id: transactionId,
                      currency: 'INR',
                      value: value,
                      tax: tax,
                      shipping: shipping,
                      items: items.map(item => ({
                        item_id: item.id,
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: 'FUC',
                        price: item.price,
                        quantity: item.quantity
                      }))
                    });
                  }
                };
              `
            }}
          />
        </>
      )}

      {/* Mixpanel Analytics */}
      {config.mixpanel && (
        <Script
          id="mixpanel-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
              
              // Initialize Mixpanel
              mixpanel.init('YOUR_MIXPANEL_PROJECT_TOKEN', {
                debug: false,
                track_pageview: true,
                persistence: 'localStorage'
              });
              
              // Set up e-commerce tracking for Mixpanel
              window.mixpanel_ecommerce = {
                trackProductView: function(product) {
                  mixpanel.track('Product Viewed', {
                    'Product ID': product.id,
                    'Product Name': product.name,
                    'Product Category': product.category,
                    'Product Price': product.price,
                    'Product Brand': 'FUC'
                  });
                },
                
                trackAddToCart: function(product, quantity) {
                  mixpanel.track('Product Added to Cart', {
                    'Product ID': product.id,
                    'Product Name': product.name,
                    'Product Category': product.category,
                    'Product Price': product.price,
                    'Quantity': quantity,
                    'Total Value': product.price * quantity
                  });
                },
                
                trackPurchase: function(order) {
                  mixpanel.track('Order Completed', {
                    'Order ID': order.id,
                    'Order Total': order.total,
                    'Item Count': order.items.length,
                    'Payment Method': order.paymentMethod,
                    'Shipping Method': order.shippingMethod
                  });
                  
                  // Track revenue
                  mixpanel.people.track_charge(order.total);
                }
              };
            `
          }}
        />
      )}

      {/* Hotjar Heatmaps and User Session Recording */}
      {config.hotjar && (
        <Script
          id="hotjar-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:YOUR_HOTJAR_SITE_ID,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              
              // Hotjar configuration
              window.hj = window.hj || function(){(window.hj.q=window.hj.q||[]).push(arguments)};
              
              // Custom Hotjar events for e-commerce
              window.hotjar_ecommerce = {
                trackPurchase: function(orderId, revenue) {
                  hj('event', 'purchase', {
                    order_id: orderId,
                    revenue: revenue
                  });
                },
                
                trackSignup: function(method) {
                  hj('event', 'signup', {
                    method: method
                  });
                },
                
                trackCartAbandonment: function(cartValue) {
                  hj('event', 'cart_abandoned', {
                    cart_value: cartValue
                  });
                }
              };
            `
          }}
        />
      )}
    </>
  )
}

// Enhanced page view tracking
function trackPageView(pathname: string) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('config', 'G-PG5EQP2E0W', {
      page_path: pathname,
      page_title: document.title
    })
  }

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track_pageview({
      'Page': pathname,
      'Title': document.title
    })
  }

  // Clarity
  if (window.clarity) {
    window.clarity('set', 'page', pathname)
  }
}

// User identification across platforms
function identifyUser(userId: string, properties: Record<string, any>) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('config', 'G-PG5EQP2E0W', {
      user_id: userId,
      custom_map: properties
    })
  }

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.identify(userId)
    window.mixpanel.people.set({
      '$email': properties.email,
      '$first_name': properties.firstName,
      '$last_name': properties.lastName,
      '$phone': properties.phone,
      'Customer Tier': properties.tier,
      'Total Orders': properties.totalOrders,
      'Total Spent': properties.totalSpent
    })
  }

  // Clarity
  if (window.clarity) {
    window.clarity('identify', userId, properties)
  }

  // Hotjar
  if (window.hj) {
    window.hj('identify', userId, properties)
  }
}

// E-commerce event tracking utilities
export const trackEcommerceEvent = {
  viewItem: (product: any) => {
    if (window.gtag_ecommerce) window.gtag_ecommerce.viewItem(product)
    if (window.mixpanel_ecommerce) window.mixpanel_ecommerce.trackProductView(product)
    if (window.clarityEcommerce) window.clarityEcommerce.trackAddToCart(product.id, product.name, product.price)
  },

  addToCart: (product: any, quantity: number = 1) => {
    if (window.gtag_ecommerce) window.gtag_ecommerce.addToCart(product, quantity)
    if (window.mixpanel_ecommerce) window.mixpanel_ecommerce.trackAddToCart(product, quantity)
    if (window.clarityEcommerce) window.clarityEcommerce.trackAddToCart(product.id, product.name, product.price)
  },

  removeFromCart: (product: any, quantity: number = 1) => {
    if (window.gtag_ecommerce) window.gtag_ecommerce.removeFromCart(product, quantity)
  },

  beginCheckout: (items: any[], value: number) => {
    if (window.gtag_ecommerce) window.gtag_ecommerce.beginCheckout(items, value)
  },

  purchase: (transactionId: string, items: any[], value: number, tax: number = 0, shipping: number = 0) => {
    if (window.gtag_ecommerce) window.gtag_ecommerce.purchase(transactionId, items, value, tax, shipping)
    if (window.mixpanel_ecommerce) window.mixpanel_ecommerce.trackPurchase({ id: transactionId, total: value, items, paymentMethod: 'online', shippingMethod: 'standard' })
    if (window.clarityEcommerce) window.clarityEcommerce.trackPurchase(transactionId, value, items)
    if (window.hotjar_ecommerce) window.hotjar_ecommerce.trackPurchase(transactionId, value)
  }
}

// Content optimization helpers
export const ContentOptimization = {
  // A/B testing helper
  getVariant: (testName: string, variants: string[]): string => {
    const userId = localStorage.getItem('user_id') || 'anonymous'
    const hash = simpleHash(userId + testName)
    const index = hash % variants.length
    
    // Track the variant assignment
    if (window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        test_name: testName,
        variant: variants[index]
      })
    }
    
    return variants[index]
  },

  // Content performance tracking
  trackContentEngagement: (contentType: string, contentId: string, action: string) => {
    if (window.gtag) {
      window.gtag('event', 'content_engagement', {
        content_type: contentType,
        content_id: contentId,
        action: action
      })
    }

    if (window.mixpanel) {
      window.mixpanel.track('Content Engagement', {
        'Content Type': contentType,
        'Content ID': contentId,
        'Action': action
      })
    }
  }
}

// Simple hash function for A/B testing
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Performance monitoring
export function monitorWebVitals() {
  // Track Core Web Vitals
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS((metric: any) => trackWebVital('CLS', metric))
      onINP((metric: any) => trackWebVital('INP', metric))
      onFCP((metric: any) => trackWebVital('FCP', metric))
      onLCP((metric: any) => trackWebVital('LCP', metric))
      onTTFB((metric: any) => trackWebVital('TTFB', metric))
    }).catch((error) => {
      console.log('Web Vitals not available:', error)
    })
  }
}

function trackWebVital(name: string, metric: any) {
  if (window.gtag) {
    window.gtag('event', name, {
      value: Math.round(name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true
    })
  }
}

// Declare global types
declare global {
  interface Window {
    gtag: any
    gtag_ecommerce: any
    mixpanel: any
    mixpanel_ecommerce: any
    clarity: any
    clarityEcommerce: any
    hj: any
    hotjar_ecommerce: any
  }
}
