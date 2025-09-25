import { Metadata } from 'next'
import TestShowcasePage from '@/components/ui/TestShowcasePage'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Website Showcase',
  description: 'Complete premium website upgrade with logo integration, Instagram feed, premium cart, advanced login, stunning fonts, and comprehensive mockup system.',
  keywords: 'streetwear, AI fashion, premium clothing, style recommendations, urban fashion, trendy clothes, website showcase',
  openGraph: {
    title: 'FASHUN.CO - Premium Website Showcase',
    description: 'Complete premium website upgrade with all features integrated.',
    images: ['/logo.png'],
  }
}

export default function Home() {
  return <TestShowcasePage />
}