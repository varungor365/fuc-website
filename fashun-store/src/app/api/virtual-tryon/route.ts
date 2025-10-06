import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const { userPhoto, designImage } = await request.json();

    // Convert base64 to buffers
    const userPhotoBuffer = Buffer.from(userPhoto.split(',')[1], 'base64');
    const designBuffer = Buffer.from(designImage.split(',')[1], 'base64');

    // Simple overlay method (for demo)
    // In production, use AI service like Zyler or custom ML model
    
    const result = await sharp(userPhotoBuffer)
      .composite([
        {
          input: designBuffer,
          top: 100,
          left: 150,
          blend: 'over',
        },
      ])
      .png()
      .toBuffer();

    const resultBase64 = `data:image/png;base64,${result.toString('base64')}`;

    return NextResponse.json({ resultImage: resultBase64 });
  } catch (error) {
    console.error('Virtual try-on error:', error);
    return NextResponse.json(
      { error: 'Failed to process virtual try-on' },
      { status: 500 }
    );
  }
}
