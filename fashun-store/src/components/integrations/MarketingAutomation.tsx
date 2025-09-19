// Marketing automation and personalization tools
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface MarketingConfig {
  mailchimp?: boolean
  sendinblue?: boolean
  privy?: boolean
  optinmonster?: boolean
  recommendations?: boolean
}

interface MarketingAutomationProps {
  config?: MarketingConfig
  userEmail?: string
  customerId?: string
}

export default function MarketingAutomation({ 
  config = { 
    sendinblue: true, 
    privy: true, 
    recommendations: true 
  }, 
  userEmail,
  customerId 
}: MarketingAutomationProps) {
  const [emailCapture, setEmailCapture] = useState(false)

  useEffect(() => {
    // Initialize marketing tools
    console.log('Marketing Automation initialized:', config)
    
    // Set up exit intent detection
    let mouseLeft = false
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !mouseLeft) {
        mouseLeft = true
        showExitIntentPopup()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const showExitIntentPopup = () => {
    if (!emailCapture && !userEmail) {
      setEmailCapture(true)
    }
  }

  return (
    <>
      {/* Sendinblue (Brevo) Integration */}
      {config.sendinblue && (
        <Script
          id="sendinblue-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.sib = {
                  equeue: [],
                  client_key: "YOUR_SENDINBLUE_CLIENT_KEY"
                };
                window.sib.email_id = "${userEmail || ''}";
                window.sendinblue = window.sendinblue || {};
                for (var j = ['track', 'identify', 'trackLink', 'page'], i = 0; i < j.length; i++) {
                  (function(k) {
                    window.sendinblue[k] = function() {
                      var arg = Array.prototype.slice.call(arguments);
                      (window.sib[k] || function() {
                        var t = {};
                        t[k] = arg;
                        window.sib.equeue.push(t);
                      })(arg[0], arg[1], arg[2]);
                    };
                  })(j[i]);
                }
                var n = document.createElement("script"),
                    i = document.getElementsByTagName("script")[0];
                n.type = "text/javascript", n.id = "sendinblue-js", 
                n.async = !0, n.src = "https://sibautomations.com/sa.js?key=" + window.sib.client_key;
                i.parentNode.insertBefore(n, i);
                
                // Track page view
                window.sendinblue.page();
              })();
            `
          }}
        />
      )}

      {/* Mailchimp Integration */}
      {config.mailchimp && (
        <Script
          id="mailchimp-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(c,h,i,m,p){
                m=c.createElement(h),p=c.getElementsByTagName(h)[0],
                m.async=1,m.src=i,p.parentNode.insertBefore(m,p)
              }(document,"script","https://chimpstatic.com/mcjs-connected/js/users/YOUR_MAILCHIMP_USER_ID/YOUR_MAILCHIMP_ID.js");
              
              // Configure Mailchimp tracking
              window.mc = window.mc || {};
              window.mc.track = function(event, properties) {
                console.log('Mailchimp tracking:', event, properties);
              };
            `
          }}
        />
      )}

      {/* Privy Pop-ups and Banners */}
      {config.privy && (
        <Script
          id="privy-integration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _privy_embed = _privy_embed || [];
              _privy_embed.push(['account_id', 'YOUR_PRIVY_ACCOUNT_ID']);
              (function () {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://settings.privy.com/js/privy.js';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
              })();
              
              // Configure Privy campaigns
              window.Privy = window.Privy || {};
              window.Privy.settings = {
                account_id: 'YOUR_PRIVY_ACCOUNT_ID',
                campaigns: {
                  exit_intent: {
                    enabled: true,
                    discount_code: 'WELCOME10',
                    discount_percentage: 10
                  },
                  top_banner: {
                    enabled: true,
                    message: 'Free Shipping on Orders Over ₹2,500! 🚚',
                    background_color: '#000000',
                    text_color: '#ffffff'
                  }
                }
              };
            `
          }}
        />
      )}

      {/* AI Product Recommendations */}
      {config.recommendations && (
        <ProductRecommendationEngine customerId={customerId} />
      )}

      {/* Exit Intent Popup */}
      {emailCapture && (
        <ExitIntentPopup onClose={() => setEmailCapture(false)} />
      )}

      {/* Top Banner for Announcements */}
      <TopBanner />
    </>
  )
}

// AI Product Recommendation Engine Component
function ProductRecommendationEngine({ customerId }: { customerId?: string }) {
  useEffect(() => {
    // Initialize recommendation engine
    if (window.LimeSpot) {
      window.LimeSpot.init({
        store_id: 'YOUR_LIMESPOT_STORE_ID',
        customer_id: customerId || null
      })
    }
  }, [customerId])

  return (
    <Script
      id="limespot-recommendations"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            window.LimeSpot = window.LimeSpot || {};
            window.LimeSpot.store_id = 'YOUR_LIMESPOT_STORE_ID';
            
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://cdn.limespot.com/live-recommendations.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
            
            // Configure recommendation widgets
            window.LimeSpot.config = {
              widgets: {
                product_page: {
                  selector: '#you-might-also-like',
                  type: 'related_products',
                  limit: 6
                },
                cart_page: {
                  selector: '#frequently-bought-together',
                  type: 'frequently_bought_together',
                  limit: 4
                },
                homepage: {
                  selector: '#trending-products',
                  type: 'trending',
                  limit: 8
                }
              }
            };
          })();
        `
      }}
    />
  )
}

// Exit Intent Popup Component
function ExitIntentPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit to email marketing platform
      await submitEmailToMarketing(email)
      
      // Track conversion
      trackEmailCapture('exit_intent', email)
      
      // Show success message and close
      alert('Thanks! Check your email for your 10% discount code 🎉')
      onClose()
    } catch (error) {
      console.error('Error submitting email:', error)
      alert('Sorry, something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Don't Leave Empty Handed 🛍️
          </h2>
          <p className="text-gray-600 mb-4">
            Get 10% off your first order + exclusive streetwear drops
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Claiming...' : 'Claim My 10% Discount'}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2">
            *Discount code will be sent to your email
          </p>
        </div>
      </div>
    </div>
  )
}

// Top Banner Component
function TopBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-black text-white text-center py-2 px-4 text-sm relative">
      <span>🚚 Free Shipping on Orders Over ₹2,500 | 🔥 New Collection Drop This Friday</span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
      >
        ✕
      </button>
    </div>
  )
}

// Email marketing integration functions
async function submitEmailToMarketing(email: string) {
  // Sendinblue/Brevo integration
  if (window.sendinblue) {
    window.sendinblue.identify({
      email: email,
      attributes: {
        SOURCE: 'exit_intent_popup',
        SIGNUP_DATE: new Date().toISOString()
      }
    })
    
    window.sendinblue.track('email_captured', {
      email: email,
      source: 'exit_intent'
    })
  }

  // Also submit to your API
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      email,
      source: 'exit_intent_popup',
      discount_code: 'WELCOME10'
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to subscribe to newsletter')
  }

  return response.json()
}

// Analytics tracking for email capture
function trackEmailCapture(source: string, email: string) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'sign_up', {
      method: source,
      custom_parameters: {
        email_captured: true,
        source: source
      }
    })
  }

  // Custom analytics
  console.log('Email captured:', { source, email })
}

// E-commerce tracking for marketing platforms
export function trackEcommerceEvent(event: string, data: any) {
  // Sendinblue e-commerce tracking
  if (window.sendinblue) {
    switch (event) {
      case 'add_to_cart':
        window.sendinblue.track('cart_updated', {
          cart_value: data.value,
          currency: 'INR',
          items: data.items
        })
        break
      case 'purchase':
        window.sendinblue.track('order_completed', {
          order_id: data.transaction_id,
          revenue: data.value,
          currency: 'INR',
          items: data.items
        })
        break
    }
  }

  // Mailchimp e-commerce tracking
  if (window.mc) {
    window.mc.track(event, data)
  }
}

// Declare global types
declare global {
  interface Window {
    sendinblue: any
    sib: any
    mc: any
    Privy: any
    LimeSpot: any
    gtag: any
  }
}
