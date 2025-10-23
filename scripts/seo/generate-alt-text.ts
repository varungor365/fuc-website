import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateAltText(imageUrl: string): Promise<string> {
  // Google Cloud Vision and Gemini API integration removed
  throw new Error('Google Cloud Vision and Gemini API integration removed');
}

async function processImages() {
  console.log('🖼️ Starting alt text generation...');

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .is('alt_text', null)
    .limit(20);

  if (!images?.length) {
    console.log('✅ All images have alt text');
    return;
  }

  for (const image of images) {
    try {
      const altText = await generateAltText(image.url);
      
      await supabase
        .from('product_images')
        .update({ alt_text: altText })
        .eq('id', image.id);

      console.log(`✅ Generated alt text for image ${image.id}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`❌ Failed for image ${image.id}:`, error);
    }
  }

  console.log('🎉 Alt text generation complete!');
}

processImages();
