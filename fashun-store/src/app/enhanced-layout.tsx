import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { inter, poppins, getAllFontVariables } from '@/lib/simpleFonts'
import EnhancedHeader from '@/components/layout/EnhancedHeader'
import EnhancedFooter from '@/components/layout/EnhancedFooter'

export const metadata: Metadata = {
  title: 'FASHUN.CO - AI-Powered Streetwear Revolution',
  description: 'Experience the future of fashion with AI-curated streetwear, premium quality, and personalized style recommendations.',
  keywords: 'streetwear, AI fashion, premium clothing, style recommendations, urban fashion, trendy clothes, FASHUN',
  authors: [{ name: 'FASHUN Team' }],
  openGraph: {
    title: 'FASHUN.CO - AI-Powered Streetwear Revolution',
    description: 'Experience the future of fashion with AI-curated streetwear, premium quality, and personalized style recommendations.',
    images: ['/logo.png'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FASHUN.CO - AI-Powered Streetwear Revolution',
    description: 'Experience the future of fashion with AI-curated streetwear.',
    images: ['/logo.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={getAllFontVariables()}>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PG5EQP2E0W"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PG5EQP2E0W');
            `,
          }}
        />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#9f7aea" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white min-h-screen antialiased overflow-x-hidden`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <EnhancedHeader />
            <main className="flex-1 relative">
              {children}
            </main>
            <EnhancedFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}