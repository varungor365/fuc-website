import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateDescription(product: any): Promise<string> {
  const prompt = `Write a compelling, SEO-optimized product description (150-200 words) for this streetwear item:
Title: ${product.title}
Category: ${product.category}
Price: ₹${product.price}
Features: ${product.features?.join(', ') || 'Premium quality streetwear'}

Focus on: style, comfort, versatility, and street culture. Include relevant keywords naturally.`;

  // Gemini API integration removed
  throw new Error('Gemini API integration removed');
}

async function enrichProducts() {
  console.log('🤖 Starting AI product description generation...');

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .or('description.is.null,seo_optimized.eq.false')
    .limit(10);

  if (!products?.length) {
    console.log('✅ All products have optimized descriptions');
    return;
  }

  for (const product of products) {
    try {
      const description = await generateDescription(product);
      
      await supabase
        .from('products')
        .update({
          description,
          seo_optimized: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      console.log(`✅ Generated description for: ${product.title}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
    } catch (error) {
      console.error(`❌ Failed for ${product.title}:`, error);
    }
  }

  console.log('🎉 Product enrichment complete!');
}

enrichProducts();
