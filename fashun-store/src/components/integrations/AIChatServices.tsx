// AI-powered customer service integrations
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface ChatConfig {
  tidio?: boolean
  hubspot?: boolean
  crisp?: boolean
  drift?: boolean
}

interface AIChatServicesProps {
  config?: ChatConfig
}

export default function AIChatServices({ config = { tidio: true } }: AIChatServicesProps) {
  useEffect(() => {
    // Initialize chat services based on configuration
    console.log('AI Chat Services initialized with config:', config)
  }, [config])

  return (
    <>
      {/* Tidio Chat Widget */}
      {config.tidio && (
        <>
          <Script
            id="tidio-chat"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                document.tidioIdentify = {
                  distinct_id: "visitor_" + Date.now(),
                  email: "visitor@example.com"
                };
                !function(){var t=document.createElement("script");
                t.type="text/javascript",t.async=!0,t.src="//code.tidio.co/ew1attncic7hwgbyfjymmksjxiworlaj.js";
                var e=document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(t,e)}();
              `
            }}
          />
          <style jsx global>{`
            #tidio-chat-iframe {
              z-index: 999999 !important;
            }
            #tidio-chat {
              --tidio-color-primary: #2563eb;
              --tidio-color-primary-hover: #1d4ed8;
            }
          `}</style>
        </>
      )}

      {/* HubSpot Live Chat */}
      {config.hubspot && (
        <Script
          id="hubspot-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e,r,n,u){
                if(!t.hubspot){
                  var c=t.hubspot={};
                  c.hub_id="243878521";
                  c.messages=[];
                  c.methods=["addHandler","removeHandler","on","off","track","page"];
                  c.api = function(e){
                    c.messages.push([e,Array.prototype.slice.call(arguments,1)])
                  };
                  for(var o=0;o<c.methods.length;o++){
                    c[c.methods[o]]=c.api.bind(null,c.methods[o])
                  }
                  var s=document.createElement("script");
                  s.type="text/javascript";
                  s.async=!0;
                  s.src="//js.hs-scripts.com/243878521.js";
                  var i=document.getElementsByTagName("script")[0];
                  i.parentNode.insertBefore(s,i)
                }
              }(window);
              
              // Configure chat widget
              window.hsConversationsSettings = {
                loadImmediately: true,
                enableWelcomeMessage: true,
                welcomeMessage: "Hi! I'm here to help you find the perfect streetwear. What are you looking for today?",
                targetSelector: '.hs-chat-widget'
              };
            `
          }}
        />
      )}

      {/* Crisp Chat */}
      {config.crisp && (
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="YOUR_CRISP_WEBSITE_ID";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
              
              // Configure Crisp
              $crisp.push(["safe", true]);
              $crisp.push(["set", "message:text", ["Welcome to FUC! How can we help you find your perfect streetwear today?"]]);
              $crisp.push(["set", "session:data", [["company", "FUC Streetwear"]]]);
            `
          }}
        />
      )}

      {/* Drift Chat */}
      {config.drift && (
        <Script
          id="drift-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function() {
                var t = window.driftt = window.drift = window.driftt || [];
                if (!t.init) {
                  if (t.invoked) return void (window.console && console.error && console.error("Drift snippet included twice."));
                  t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
                  t.factory = function(e) {
                    return function() {
                      var n = Array.prototype.slice.call(arguments);
                      return n.unshift(e), t.push(n), t;
                    };
                  }, t.methods.forEach(function(e) {
                    t[e] = t.factory(e);
                  }), t.load = function(t) {
                    var e = 3e5, n = Math.ceil(new Date() / e) * e, o = document.createElement("script");
                    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
                    var i = document.getElementsByTagName("script")[0];
                    i.parentNode.insertBefore(o, i);
                  };
                }
              }();
              drift.SNIPPET_VERSION = '0.3.1';
              drift.load('YOUR_DRIFT_ID');
              
              // Configure Product Finder Bot
              drift.config({
                enableWelcomeMessage: true,
                welcomeMessage: "Hey! 👋 Looking for some fresh streetwear? I can help you find exactly what you're looking for!",
                position: "right"
              });
            `
          }}
        />
      )}
    </>
  )
}

// Enhanced chat integration with user context
export function initializeChatWithUser(userData: {
  email?: string
  name?: string
  customerId?: string
  orderHistory?: any[]
}) {
  // Tidio user identification
  if (window.tidioIdentify) {
    window.tidioIdentify = {
      distinct_id: userData.customerId || `visitor_${Date.now()}`,
      email: userData.email || '',
      name: userData.name || 'Guest',
      order_count: userData.orderHistory?.length || 0
    }
  }

  // HubSpot user identification
  if (window.hsConversationsAPI) {
    window.hsConversationsAPI.identify({
      email: userData.email,
      firstName: userData.name?.split(' ')[0],
      lastName: userData.name?.split(' ')[1],
      customerId: userData.customerId
    })
  }

  // Crisp user data
  if (window.$crisp) {
    window.$crisp.push(['set', 'user:email', userData.email])
    window.$crisp.push(['set', 'user:nickname', userData.name])
    window.$crisp.push(['set', 'session:data', [
      ['customer_id', userData.customerId],
      ['order_count', userData.orderHistory?.length || 0]
    ]])
  }

  // Drift user identification
  if (window.drift) {
    window.drift.identify(userData.customerId, {
      email: userData.email,
      name: userData.name,
      orderCount: userData.orderHistory?.length || 0
    })
  }
}

// Product Finder Chatbot Flow
export function setupProductFinderBot() {
  // This would integrate with your chosen chat platform
  // Example for Drift:
  if (window.drift) {
    window.drift.on('ready', () => {
      // Set up product finder conversation flow
      window.drift.api.widget.update({
        backgroundColor: '#000000',
        textColor: '#ffffff',
        teaser: 'Find Your Perfect Fit 🔥'
      })
    })
  }
}

// Chat analytics and tracking
export function trackChatInteraction(platform: string, event: string, data?: any) {
  // Track chat interactions for analytics
  if (window.gtag) {
    window.gtag('event', 'chat_interaction', {
      platform,
      event_type: event,
      custom_data: data
    })
  }

  console.log(`Chat Interaction [${platform}]: ${event}`, data)
}

// Declare global types for TypeScript
declare global {
  interface Window {
    tidioIdentify: any
    hsConversationsAPI: any
    $crisp: any
    drift: any
    driftt: any
    gtag: any
  }
}
