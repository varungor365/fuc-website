import { NextRequest, NextResponse } from 'next/server';

const BYTEZ_API_KEY = '6eebd9e3131d9feb9215cf2e6818b394';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type, style } = await request.json();

    const response = await fetch('https://api.bytez.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BYTEZ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `${prompt}, ${style} style, high quality`,
        type: type || 'image',
        width: 1024,
        height: 1024,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}