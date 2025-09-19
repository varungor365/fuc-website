import { NextResponse } from 'next/server'
import { products } from '@/data/products'

export async function GET() {
  const picks = products
    .filter(p => p.isFeatured || (p.rating ?? 0) >= 4.6)
    .slice(0, 12)
  return NextResponse.json({ ok: true, items: picks })
}
