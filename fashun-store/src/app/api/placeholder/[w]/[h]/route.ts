import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { w: string; h: string } }
) {
  try {
    const { w, h } = params;
    const width = parseInt(w) || 300;
    const height = parseInt(h) || 300;
    
    // Validate dimensions
    if (width > 2000 || height > 2000 || width < 1 || height < 1) {
      return NextResponse.json(
        { error: 'Invalid dimensions. Max 2000x2000, min 1x1' },
        { status: 400 }
      );
    }

    // Create SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#374151"/>
        <rect x="${width * 0.2}" y="${height * 0.2}" width="${width * 0.6}" height="${height * 0.6}" stroke="#6B7280" stroke-width="2" stroke-linecap="round" fill="none"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.1}">
          ${width}×${height}
        </text>
      </svg>
    `.trim();

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });

  } catch (error) {
    console.error('Placeholder generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate placeholder' },
      { status: 500 }
    );
  }
}