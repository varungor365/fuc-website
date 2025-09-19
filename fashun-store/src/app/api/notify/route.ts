import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as { email?: string; productId?: string; variant?: string }
  if (!body.email || !body.productId) {
    return NextResponse.json({ ok: false, error: 'Missing email or productId' }, { status: 400 })
  }
  // TODO: Save to DB or mailing list provider
  return NextResponse.json({ ok: true })
}
