import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, items, reason, email } = body

    if (!orderId || !items || !reason || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const returnId = `RET-${Date.now()}`

    return NextResponse.json({
      success: true,
      returnId,
      message: 'Return request submitted successfully'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process return' }, { status: 500 })
  }
}
