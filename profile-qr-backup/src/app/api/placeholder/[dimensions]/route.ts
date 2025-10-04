// Simple placeholder image generator for templates
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string }> }
) {
  try {
    const { dimensions } = await params;
    const [width, height] = dimensions.split('x').map(Number);
    
    if (!width || !height || width > 1000 || height > 1000) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    // Create a simple placeholder T-shirt template
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <rect x="50" y="50" width="${width-100}" height="${height-100}" fill="#ffffff" rx="20" stroke="#e9ecef" stroke-width="2"/>
        <circle cx="${width/2}" cy="${height/3}" r="40" fill="#e9ecef"/>
        <rect x="${width/2-60}" y="${height/2-40}" width="120" height="80" fill="#f8f9fa" rx="10"/>
        <text x="${width/2}" y="${height-30}" text-anchor="middle" font-family="Arial" font-size="14" fill="#6c757d">T-Shirt Template</text>
      </svg>
    `;

    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error generating placeholder:', error);
    return NextResponse.json({ error: 'Failed to generate placeholder' }, { status: 500 });
  }
}