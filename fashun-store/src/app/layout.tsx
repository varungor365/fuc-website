import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import MasterIntegrations from '@/components/integrations/MasterIntegrations'
// import PWAProvider from '@/components/pwa/PWAProvider'
// import '@/lib/metamask-handler' // Import MetaMask error handler
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/StructuredData'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import StyleAssistantButton from '@/components/ai/StyleAssistantButton'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'FASHUN.CO - Premium Streetwear & Custom Apparel India',
    template: '%s | FASHUN.CO',
  },
  description: 'The ultimate streetwear destination - Discover, design, and shop the latest urban fashion trends. PWA-enabled for the best mobile experience.',
  keywords: ['streetwear', 'fashion', 'hoodies', 't-shirts', 'custom apparel', 'oversized', 'prints', 'gen-z fashion', 'india', 'pwa', 'progressive web app'],
  authors: [{ name: 'FASHUN.CO' }],
  creator: 'FASHUN.CO',
  publisher: 'FASHUN.CO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fashun.co'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-in',
      'hi-IN': '/hi-in',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FASHUN.CO',
    startupImage: [
      {
        url: '/icons/apple-startup-750x1334.png',
        media: 'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
      },
      {
        url: '/icons/apple-startup-1242x2208.png', 
        media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
      },
      {
        url: '/icons/apple-startup-1125x2436.png',
        media: 'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
      }
    ]
  },
  applicationName: 'FASHUN.CO',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://fashun.co',
    siteName: 'FASHUN.CO',
    title: 'FASHUN.CO - Premium Streetwear & Custom Apparel India',
    description: 'The ultimate streetwear destination - Discover, design, and shop the latest urban fashion trends. PWA-enabled for the best mobile experience.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FASHUN.CO - Premium Streetwear & Custom Apparel India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FASHUN.CO - Premium Streetwear & Custom Apparel India',
    description: 'The ultimate streetwear destination - Discover, design, and shop the latest urban fashion trends. PWA-enabled for the best mobile experience.',
    images: ['/images/og-image.jpg'],
    creator: '@fashunco',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Performance Optimization - Resource Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        
        {/* Preload Critical Resources */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          as="style" 
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" 
          as="style" 
        />
        
        {/* Critical CSS will be inlined by Next.js */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-primary-900 text-primary-100">
        <ErrorBoundary>
          {/* <PWAProvider> */}
            <Providers>
              {/* AI Integrations - Load early for optimal performance */}
              {/* <MasterIntegrations
                config={{
                  chat: { provider: 'tidio', enabled: true },
                  marketing: { 
                    email: 'sendinblue', 
                    popups: 'privy', 
                    recommendations: true, 
                    enabled: true 
                  },
                  analytics: { 
                    clarity: true, 
                    googleAnalytics: true, 
                    mixpanel: false, 
                    hotjar: false,
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
              }}
            /> */}
            
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            
            {/* AI Style Assistant - Available on all pages */}
            <StyleAssistantButton />
            
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#171717',
                  color: '#E8E8E8',
                  border: '1px solid #404040',
                },
              }}
            />
            </Providers>
          {/* </PWAProvider> */}
        </ErrorBoundary>
        
        {/* Structured Data */}
        <OrganizationSchema 
          organization={{
            name: 'FASHUN.CO',
            url: 'https://fashun.co.in',
            logo: 'https://fashun.co.in/logo.png',
            description: 'Premium streetwear e-commerce platform offering the latest in urban fashion, hoodies, sneakers, and street style essentials.',
            contactPoint: {
              telephone: '+91-XXXXXXXXXX',
              contactType: 'Customer Service',
              email: 'hello@fashun.co.in'
            },
            sameAs: [
              'https://instagram.com/fashun.co.in',
              'https://twitter.com/fashunco',
              'https://facebook.com/fashun.co.in'
            ]
          }}
        />
        
        <WebsiteSchema 
          website={{
            name: 'FASHUN.CO - Streetwear Empire',
            url: 'https://fashun.co.in',
            description: 'Discover the latest in streetwear fashion. Premium hoodies, sneakers, and urban essentials for the modern street style enthusiast.',
            potentialAction: {
              target: 'https://fashun.co.in/search?q={search_term_string}',
              queryInput: 'required name=search_term_string'
            }
          }}
        />
        
        <LocalBusinessSchema 
          businessName="FASHUN.CO"
          description="India's premier streetwear destination offering exclusive collections of hoodies, oversized tees, sneakers, and urban fashion essentials for the style-conscious generation."
          address={{
            streetAddress: "Fashion Hub District",
            addressLocality: "Mumbai", 
            addressRegion: "Maharashtra",
            postalCode: "400001",
            addressCountry: "IN"
          }}
          telephone="+91-XXXX-XXXXXX"
          email="hello@fashun.co.in"
          url="https://fashun.co.in"
          areaServed={["India", "Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"]}
          socialMedia={{
            facebook: "https://facebook.com/fashun.co.in",
            twitter: "https://twitter.com/fashunco",
            instagram: "https://instagram.com/fashun.co.in"
          }}
        />
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
