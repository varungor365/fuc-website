import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, width = 800, height = 800, style = 'realistic' } = await request.json();

    // Enhanced image generation with multiple fallbacks
    const styleKeywords = {
      realistic: 'photo-realistic,professional,studio-lighting',
      artistic: 'artistic,creative,abstract,colorful',
      minimal: 'minimal,clean,simple,modern',
      streetwear: 'urban,street-style,trendy,cool'
    };

    const styleParam = styleKeywords[style as keyof typeof styleKeywords] || styleKeywords.realistic;
    
    // Primary: Enhanced Unsplash with better parameters
    const enhancedPrompt = `${prompt},${styleParam},fashion,apparel,design`;
    const unsplashUrl = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(enhancedPrompt)}&sig=${Date.now()}`;
    
    // Secondary: Picsum for consistent results
    const picsumUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    
    // Tertiary: Lorem Flickr as backup
    const flickrUrl = `https://loremflickr.com/${width}/${height}/fashion,design?random=${Date.now()}`;

    // Test image availability
    const testUrls = [unsplashUrl, flickrUrl, picsumUrl];
    let finalImageUrl = unsplashUrl;

    try {
      // Quick test for first URL availability
      const testResponse = await fetch(unsplashUrl, { method: 'HEAD' });
      if (!testResponse.ok) {
        finalImageUrl = flickrUrl;
      }
    } catch {
      // If test fails, use Flickr as more reliable fallback
      finalImageUrl = flickrUrl;
    }

    return NextResponse.json({
      imageUrl: finalImageUrl,
      fallbackUrls: testUrls,
      prompt,
      style,
      width,
      height,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

// Alternative implementation using actual AI services (uncomment when API keys are available)
/*
export async function POST(request: NextRequest) {
  try {
    const { prompt, width = 400, height = 500 } = await request.json();

    // Example using OpenAI DALL-E
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Fashion photography: ${prompt}, professional lighting, clean background, high quality`,
        n: 1,
        size: `${width}x${height}`,
        response_format: 'url'
      })
    });

    const data = await response.json();
    
    if (data.data && data.data[0]) {
      return NextResponse.json({
        imageUrl: data.data[0].url,
        prompt,
        width,
        height
      });
    }

    throw new Error('No image generated');

  } catch (error) {
    console.error('Error generating image:', error);
    // Fallback to Unsplash
    const fallbackUrl = `https://source.unsplash.com/${width}x${height}/?fashion&clothing`;
    return NextResponse.json({
      imageUrl: fallbackUrl,
      prompt,
      width,
      height
    });
  }
}
*/