import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

interface GenerateImageRequest {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'minimal' | 'fashion';
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:4';
  quality?: 'standard' | 'high';
}

interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  imageData?: string;
  error?: string;
  metadata?: {
    prompt: string;
    style: string;
    aspectRatio: string;
    generatedAt: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateImageResponse>> {
  try {
    // Verify API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({
        success: false,
        error: 'AI service configuration error'
      }, { status: 500 });
    }

    // Parse request body
    const body = await request.json() as GenerateImageRequest;
    const { prompt, style = 'fashion', aspectRatio = '16:9', quality = 'high' } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid prompt is required'
      }, { status: 400 });
    }

    if (prompt.length > 1000) {
      return NextResponse.json({
        success: false,
        error: 'Prompt too long (max 1000 characters)'
      }, { status: 400 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the Gemini model for image generation
    // Note: Using Gemini Pro Vision for now as it's available
    // When Gemini gets dedicated image generation, we'll update this
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Enhanced prompt for fashion/e-commerce context
    const enhancedPrompt = `Create a high-quality, professional ${style} image for a premium streetwear e-commerce website. The image should be: ${prompt}. 

Style guidelines:
- ${style === 'fashion' ? 'Modern, trendy, streetwear aesthetic with clean lines and contemporary feel' : ''}
- ${style === 'realistic' ? 'Photorealistic with natural lighting and authentic details' : ''}
- ${style === 'artistic' ? 'Creative and visually striking with artistic flair' : ''}
- ${style === 'minimal' ? 'Clean, minimal design with plenty of white space' : ''}
- High resolution and professional quality
- Suitable for ${aspectRatio} aspect ratio
- No text or watermarks
- Consistent with premium brand aesthetics`;

    console.log('Generating image with Gemini AI...', {
      promptLength: enhancedPrompt.length,
      style,
      aspectRatio,
      quality
    });

    // Note: Since Gemini Pro Vision is primarily for image analysis, not generation,
    // we'll implement a fallback approach for now and prepare for when Gemini
    // releases dedicated image generation capabilities
    
    // For now, we'll create a response that indicates the service is being set up
    // and provide a placeholder implementation
    const response: GenerateImageResponse = {
      success: false,
      error: 'Gemini image generation service is being configured. Please check back soon.',
      metadata: {
        prompt: prompt,
        style,
        aspectRatio,
        generatedAt: new Date().toISOString()
      }
    };

    // Log for debugging
    console.log('Image generation request processed:', {
      prompt: prompt.substring(0, 100) + '...',
      style,
      aspectRatio,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(response, { status: 202 }); // Accepted but not processed yet

  } catch (error) {
    console.error('Error in image generation API:', error);
    
    // Don't expose internal errors to client
    return NextResponse.json({
      success: false,
      error: 'Internal server error during image generation'
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'Gemini AI Image Generation',
    status: 'Available',
    version: '1.0.0',
    supportedStyles: ['realistic', 'artistic', 'minimal', 'fashion'],
    supportedAspectRatios: ['1:1', '16:9', '4:3', '3:4'],
    maxPromptLength: 1000
  });
}