'use client'

import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, Zap, Bell, WifiOff } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showPushPermission, setShowPushPermission] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show install prompt after 30 seconds if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true)
        }
      }, 30000)
    }

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      
      // Request push notification permission after install
      setTimeout(() => {
        setShowPushPermission(true)
      }, 2000)
    }

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker()
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isInstalled])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('SW registered:', registration)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, prompt user to refresh
              if (confirm('New version available! Refresh to update?')) {
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.error('SW registration failed:', error)
    }
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handlePushPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setShowPushPermission(false)
      return
    }

    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        // Subscribe to push notifications
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
        })

        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        })

        console.log('Push notifications enabled')
      }
    } catch (error) {
      console.error('Push notification setup failed:', error)
    }
    
    setShowPushPermission(false)
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <>
      {children}
      
      {/* Install App Prompt */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full transform animate-slide-up">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Install FASHUN.CO</h3>
                    <p className="text-sm text-gray-600">Add to your home screen</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Native app experience</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Faster loading & performance</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <WifiOff className="w-4 h-4 text-blue-600" />
                  <span>Works offline</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Push notifications</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Install
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Permission */}
      {showPushPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 rounded-lg p-2">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Stay Updated</h3>
                  <p className="text-sm text-gray-600">Get notified about new drops & orders</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Receive notifications for order updates, new product releases, and exclusive offers.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPushPermission(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Not Now
                </button>
                <button
                  onClick={handlePushPermission}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium z-50">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span>You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Update Available Banner */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default PWAProvider
