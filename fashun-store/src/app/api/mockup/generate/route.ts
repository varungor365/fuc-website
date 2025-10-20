import { NextRequest, NextResponse } from 'next/server';

const VIRTUAL_TRYON_SERVICE_URL = process.env.VIRTUAL_TRYON_SERVICE_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get files from request
    const photo = formData.get('photo') as File;
    const garment = formData.get('garment') as File;
    const garmentType = formData.get('garmentType') as string || 'tshirt';
    
    if (!photo || !garment) {
      return NextResponse.json({ 
        error: 'Both photo and garment are required' 
      }, { status: 400 });
    }

    console.log('Forwarding to virtual try-on service...');

    // Create form data for Python service
    const serviceFormData = new FormData();
    serviceFormData.append('photo', photo);
    serviceFormData.append('garment', garment);
    serviceFormData.append('garment_type', garmentType);

    // Call Python service
    const response = await fetch(`${VIRTUAL_TRYON_SERVICE_URL}/api/virtual-tryon`, {
      method: 'POST',
      body: serviceFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Virtual try-on service error:', errorText);
      return NextResponse.json({ 
        error: 'Virtual try-on processing failed',
        details: errorText
      }, { status: response.status });
    }

    // Return the image
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store'
      },
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        error: 'Service unavailable',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
