import { NextRequest, NextResponse } from 'next/server';
import { multiProviderAI, MultiProviderGenerationRequest } from '@/lib/multiProviderAI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const generationRequest: MultiProviderGenerationRequest = {
      prompt: body.prompt,
      negative_prompt: body.negative_prompt,
      model: body.model,
      style: body.style,
      width: body.width || 512,
      height: body.height || 512,
      num_images: body.num_images || 1,
      guidance_scale: body.guidance_scale || 7.5,
      num_inference_steps: body.num_inference_steps || 30,
      seed: body.seed,
      provider_preference: body.provider_preference
    };

    console.log('🎨 Starting multi-provider AI generation:', {
      prompt: generationRequest.prompt.substring(0, 50) + '...',
      model: generationRequest.model,
      provider_preference: generationRequest.provider_preference
    });

    const result = await multiProviderAI.generateImage(generationRequest);

    console.log(`✅ AI generation completed using ${result.provider_used.toUpperCase()}:`, {
      fallback_count: result.fallback_count,
      generation_time: result.generation_time,
      status: result.status
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('❌ Multi-provider AI generation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'AI generation failed',
      details: 'All AI providers failed to generate the image'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const health = await multiProviderAI.getProviderHealth();
    
    return NextResponse.json({
      success: true,
      providers: health,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}