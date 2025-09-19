import { NextRequest, NextResponse } from 'next/server'
import { analyzeContent } from '@/lib/seo'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const result = analyzeContent({
    title: body?.title,
    description: body?.description,
    body: body?.body,
    images: body?.images,
  })
  return NextResponse.json({ ok: true, result })
}
