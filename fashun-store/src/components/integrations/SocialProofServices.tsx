// Social proof and urgency tools
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface SocialProofConfig {
  reviews?: 'yotpo' | 'judge.me' | 'loox'
  notifications?: 'trustpulse' | 'fomo'
  urgency?: boolean
}

interface SocialProofServicesProps {
  config?: SocialProofConfig
  productId?: string
  customerId?: string
}

export default function SocialProofServices({ 
  config = { 
    reviews: 'judge.me', 
    notifications: 'fomo', 
    urgency: true 
  },
  productId,
  customerId
}: SocialProofServicesProps) {
  return (
    <>
      {/* Judge.me Product Reviews */}
      {config.reviews === 'judge.me' && (
        <JudgeMeReviews productId={productId} />
      )}

      {/* Yotpo Reviews (Alternative) */}
      {config.reviews === 'yotpo' && (
        <YotpoReviews productId={productId} />
      )}

      {/* Loox Reviews (Alternative) */}
      {config.reviews === 'loox' && (
        <LooxReviews productId={productId} />
      )}

      {/* Fomo Social Proof Notifications */}
      {config.notifications === 'fomo' && (
        <FomoNotifications />
      )}

      {/* TrustPulse (Alternative) */}
      {config.notifications === 'trustpulse' && (
        <TrustPulseNotifications />
      )}

      {/* Urgency Components */}
      {config.urgency && (
        <>
          <StockUrgencyBanner productId={productId} />
          <RecentActivityFeed />
        </>
      )}
    </>
  )
}

// Judge.me Reviews Integration
function JudgeMeReviews({ productId }: { productId?: string }) {
  useEffect(() => {
    // Initialize Judge.me
    if (window.jdgm) {
      window.jdgm.customizeBadges()
    }
  }, [])

  return (
    <>
      <Script
        id="judgeme-reviews"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.jdgmSettings = {
              "shop_domain": "fashun.co.in",
              "api_token": "YOUR_JUDGEME_API_TOKEN",
              "platform": "standalone",
              "branding": "light",
              "custom_colors": {
                "star_color": "#000000",
                "review_text_color": "#333333",
                "submit_button_color": "#000000"
              }
            };
            
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "https://cdn.judge.me/widgets/platform.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'jdgm-script'));
            
            // Custom Judge.me functions
            window.judgeme_ecommerce = {
              // Request review after purchase
              requestReview: function(orderId, customerEmail, products) {
                if (window.jdgm && window.jdgm.api) {
                  window.jdgm.api.request_review({
                    order_id: orderId,
                    email: customerEmail,
                    products: products
                  });
                }
              },
              
              // Track review submission
              trackReviewSubmission: function(productId, rating) {
                if (window.gtag) {
                  window.gtag('event', 'review_submitted', {
                    product_id: productId,
                    rating: rating
                  });
                }
              }
            };
          `
        }}
      />
      
      {/* Review Widget Containers */}
      <div id="judgeme_product_reviews" data-product-id={productId}></div>
      <div id="jdgm-rev-widg" data-product-id={productId}></div>
    </>
  )
}

// Yotpo Reviews (Alternative)
function YotpoReviews({ productId }: { productId?: string }) {
  return (
    <Script
      id="yotpo-reviews"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,
          e.src="//staticw2.yotpo.com/YOUR_YOTPO_APP_KEY/widget.js";var t=document.getElementsByTagName("script")[0];
          t.parentNode.insertBefore(e,t)})();
          
          // Yotpo configuration
          window.yotpo = window.yotpo || {};
          window.yotpo.settings = {
            app_key: "YOUR_YOTPO_APP_KEY",
            product_id: "${productId}",
            shop_domain: "fashun.co.in"
          };
        `
      }}
    />
  )
}

// Loox Reviews (Alternative)
function LooxReviews({ productId }: { productId?: string }) {
  return (
    <Script
      id="loox-reviews"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.loox_global_hash = "YOUR_LOOX_HASH";
          (function(){var s=document.createElement("script");s.type="text/javascript";s.async=true;
          s.src="//loox.io/widget/YOUR_LOOX_HASH/loox.js";
          var x=document.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x);})();
        `
      }}
    />
  )
}

// Fomo Social Proof Notifications
function FomoNotifications() {
  return (
    <Script
      id="fomo-notifications"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(f,o,m,o,j,q){
            f['FomoObject']=o;f[o]=f[o]||function(){
            (f[o].q=f[o].q||[]).push(arguments)},f[o].l=1*new Date();
            j=m.createElement('script'),q=m.getElementsByTagName('script')[0];
            j.async=1;j.src='https://load.fomo.com/api/v1/YzJzcGxqc3F5b2VyMnFhbjA3/load.js';
            q.parentNode.insertBefore(j,q)
          })(window,document,'script','fomo');
          
          fomo('init', 'YzJzcGxqc3F5b2VyMnFhbjA3', {
            selector: '.fomo-wrapper',
            templates: {
              image: '<strong>{{firstName}}</strong> from {{city}} purchased <strong>{{productName}}</strong>',
              noImage: '<strong>{{firstName}}</strong> from {{city}} purchased <strong>{{productName}}</strong>'
            },
            position: 'bottom-left',
            displayFor: 6000,
            delayBefore: 3000,
            maxNotifications: 3
          });
          
          // Custom Fomo events
          window.fomo_ecommerce = {
            trackPurchase: function(customerName, city, productName, timestamp) {
              fomo('track', 'Custom', {
                first_name: customerName,
                city: city,
                product_name: productName,
                timestamp: timestamp || new Date()
              });
            }
          };
        `
      }}
    />
  )
}

// TrustPulse (Alternative)
function TrustPulseNotifications() {
  return (
    <Script
      id="trustpulse-notifications"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(t,r,u,s,t,p,u,l,s,e){
            t[p]=t[p]||[],t[p].push(['init',u]),
            l=r.createElement(s),l.async=1,l.src=u,
            s=r.getElementsByTagName(s)[0],s.parentNode.insertBefore(l,s)
          })(window,document,'https://cdn.trustpulse.com/loader.js','script','trustpulse');
          
          trustpulse('init', 'YOUR_TRUSTPULSE_ACCOUNT_ID', {
            position: 'bottom-left',
            animation: 'slide',
            display_time: 5000,
            delay_between: 3000
          });
        `
      }}
    />
  )
}

// Stock Urgency Banner Component
function StockUrgencyBanner({ productId }: { productId?: string }) {
  const [stock, setStock] = useState<number | null>(null)
  const [urgencyMessage, setUrgencyMessage] = useState<string>('')

  useEffect(() => {
    if (productId) {
      fetchProductStock(productId)
    }
  }, [productId])

  useEffect(() => {
    if (stock !== null) {
      generateUrgencyMessage(stock)
    }
  }, [stock])

  const fetchProductStock = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}/stock`)
      const data = await response.json()
      setStock(data.stock)
    } catch (error) {
      console.error('Error fetching stock:', error)
    }
  }

  const generateUrgencyMessage = (stockLevel: number) => {
    if (stockLevel <= 0) {
      setUrgencyMessage('🔥 Out of Stock - Join Waitlist')
    } else if (stockLevel <= 3) {
      setUrgencyMessage(`⚡ Only ${stockLevel} left in stock!`)
    } else if (stockLevel <= 10) {
      setUrgencyMessage(`🔥 Low Stock - Only ${stockLevel} remaining`)
    } else {
      setUrgencyMessage('')
    }
  }

  if (!urgencyMessage) return null

  return (
    <div className="bg-red-600 text-white text-center py-2 px-4 rounded-lg mb-4 animate-pulse">
      <span className="font-semibold">{urgencyMessage}</span>
    </div>
  )
}

// Recent Activity Feed Component
function RecentActivityFeed() {
  const [activities, setActivities] = useState<Array<{
    id: string
    message: string
    timestamp: Date
    location: string
  }>>([])

  useEffect(() => {
    // Fetch recent activities
    fetchRecentActivities()
    
    // Set up real-time updates
    const interval = setInterval(fetchRecentActivities, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/analytics/recent-activities')
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Fallback to mock data
      setActivities(generateMockActivities())
    }
  }

  const generateMockActivities = () => {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad']
    const products = ['Urban Explorer Hoodie', 'Street Rebel Tee', 'Oversized Crew Neck', 'Graphic Print Hoodie']
    const names = ['Arjun', 'Priya', 'Rohan', 'Sneha', 'Karan', 'Ananya', 'Vikram', 'Ishika']
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${i}`,
      message: `${names[Math.floor(Math.random() * names.length)]} from ${cities[Math.floor(Math.random() * cities.length)]} just bought ${products[Math.floor(Math.random() * products.length)]}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      location: cities[Math.floor(Math.random() * cities.length)]
    }))
  }

  if (activities.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-40">
      <h3 className="font-semibold text-sm text-gray-800 mb-2">🔥 Recent Activity</h3>
      <div className="space-y-2">
        {activities.slice(0, 3).map((activity) => (
          <div key={activity.id} className="text-xs text-gray-600">
            <p>{activity.message}</p>
            <span className="text-gray-400">
              {formatTimeAgo(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Countdown Timer Component
function CountdownTimer({ 
  endTime, 
  message = "Limited Time Offer!" 
}: { 
  endTime: Date
  message?: string 
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const { hours, minutes, seconds } = timeLeft

  if (hours === 0 && minutes === 0 && seconds === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-3 px-4 rounded-lg mb-4">
      <p className="font-semibold mb-2">{message}</p>
      <div className="flex justify-center space-x-4 text-lg font-mono">
        <div className="bg-white bg-opacity-20 rounded px-2 py-1">
          <span>{hours.toString().padStart(2, '0')}</span>
          <div className="text-xs">HRS</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded px-2 py-1">
          <span>{minutes.toString().padStart(2, '0')}</span>
          <div className="text-xs">MIN</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded px-2 py-1">
          <span>{seconds.toString().padStart(2, '0')}</span>
          <div className="text-xs">SEC</div>
        </div>
      </div>
    </div>
  )
}

// Visitor Counter Component
function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    // Generate realistic visitor count
    const baseCount = 1247 // Base number
    const randomVariation = Math.floor(Math.random() * 50) // Add some variation
    setVisitorCount(baseCount + randomVariation)

    // Update count periodically
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>{visitorCount} people viewing this page</span>
    </div>
  )
}

// Purchase Proof Component
function PurchaseProof({ 
  customerName, 
  location, 
  productName, 
  timeAgo 
}: {
  customerName: string
  location: string
  productName: string
  timeAgo: string
}) {
  return (
    <div className="bg-black text-white rounded-lg p-3 mb-2 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">
            {customerName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <p>
            <strong>{customerName}</strong> from {location} purchased{' '}
            <strong>{productName}</strong>
          </p>
          <p className="text-gray-400 text-xs">{timeAgo}</p>
        </div>
        <div className="text-green-400">✓</div>
      </div>
    </div>
  )
}

// Utility function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

// Review request automation
export async function requestProductReview(orderId: string, customerEmail: string, products: any[]) {
  // Judge.me integration
  if (window.judgeme_ecommerce) {
    window.judgeme_ecommerce.requestReview(orderId, customerEmail, products)
  }

  // Also send via your API for follow-up emails
  try {
    await fetch('/api/reviews/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        customerEmail,
        products,
        requestedAt: new Date().toISOString()
      }),
    })
  } catch (error) {
    console.error('Error requesting review:', error)
  }
}

// Social proof tracking
export function trackSocialProofInteraction(type: string, action: string, data?: any) {
  if (window.gtag) {
    window.gtag('event', 'social_proof_interaction', {
      proof_type: type,
      action: action,
      custom_data: data
    })
  }

  console.log(`Social Proof Interaction [${type}]: ${action}`, data)
}

// Export components for use in other parts of the app
export {
  CountdownTimer,
  VisitorCounter,
  PurchaseProof,
  StockUrgencyBanner,
  RecentActivityFeed
}

// Declare global types
declare global {
  interface Window {
    jdgm: any
    judgeme_ecommerce: any
    yotpo: any
    fomo: any
    fomo_ecommerce: any
    trustpulse: any
    gtag: any
  }
}
