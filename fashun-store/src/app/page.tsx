import { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'FASHUN.CO - Premium Streetwear Redefined',
  description: 'Elevating streetwear culture with premium designs that speak to the modern generation. Every piece tells a story.',
}

export default function Home() {
  return <HomePage />
}