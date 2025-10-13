import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { supabase } from '@/lib/supabase-client';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const { data: { user } } = await request.headers.get('authorization')
      ? await supabase.auth.getUser(request.headers.get('authorization')!)
      : { data: { user: null } };

    // Generate pattern using Stable Diffusion
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: `${prompt}, seamless pattern, tileable, high quality, 4k`,
          negative_prompt: "blurry, low quality, distorted",
          width: 1024,
          height: 1024,
        }
      }
    );

    const patternUrl = Array.isArray(output) ? output[0] : output;

    // Save to database
    if (user) {
      await supabase.from('ai_patterns').insert({
        user_id: user.id,
        prompt,
        image_url: patternUrl,
        is_seamless: true,
      });
    }

    return NextResponse.json({ patternUrl });
  } catch (error) {
    console.error('AI pattern generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate pattern' },
      { status: 500 }
    );
  }
}
