import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { design, color } = body;

    if (!design) {
      return NextResponse.json({ error: 'No design provided' }, { status: 400 });
    }

    // Return the design as mockup (simplified version)
    // In production, this would call an AI service or image processing
    return NextResponse.json({ 
      mockupUrl: design,
      success: true,
      message: 'Mockup generated successfully'
    });
  } catch (error) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate mockup' },
      { status: 500 }
    );
  }
}
