import { createClient } from '@supabase/supabase-js';
import vision from '@google-cloud/vision';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_PATH
});

async function generateAltText(imageUrl: string): Promise<string> {
  const [result] = await visionClient.labelDetection(imageUrl);
  const labels = result.labelAnnotations?.map(l => l.description).slice(0, 5).join(', ') || '';

  const prompt = `Write concise, SEO-friendly alt text (max 125 characters) for a streetwear product image with these elements: ${labels}. Focus on describing the clothing item, color, and style.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text.substring(0, 125);
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
