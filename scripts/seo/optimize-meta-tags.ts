import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeKeywords(content: string): Promise<string[]> {
  const prompt = `Analyze this content and extract the top 5 SEO keywords:\n\n${content.substring(0, 1000)}`;

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
  const keywords = data.candidates[0].content.parts[0].text.split(',').map((k: string) => k.trim());
  return keywords.slice(0, 5);
}

async function generateMetaTags(content: string, keywords: string[]) {
  const titlePrompt = `Create an SEO-optimized page title (max 60 chars) using these keywords: ${keywords.join(', ')}. Content: ${content.substring(0, 200)}`;
  const descPrompt = `Create an SEO-optimized meta description (max 155 chars) using these keywords: ${keywords.join(', ')}. Content: ${content.substring(0, 300)}`;

  const [titleRes, descRes] = await Promise.all([
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: titlePrompt }] }] })
    }),
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: descPrompt }] }] })
    })
  ]);

  const [titleData, descData] = await Promise.all([titleRes.json(), descRes.json()]);

  return {
    title: titleData.candidates[0].content.parts[0].text.substring(0, 60),
    description: descData.candidates[0].content.parts[0].text.substring(0, 155),
    keywords: keywords.join(', ')
  };
}

async function optimizePages() {
  console.log('🔍 Starting meta tag optimization...');

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('views', { ascending: false })
    .limit(20);

  if (!pages?.length) {
    console.log('⚠️ No pages found');
    return;
  }

  for (const page of pages) {
    try {
      const keywords = await analyzeKeywords(page.content);
      const metaTags = await generateMetaTags(page.content, keywords);
      
      await supabase
        .from('pages')
        .update({
          meta_title: metaTags.title,
          meta_description: metaTags.description,
          meta_keywords: metaTags.keywords,
          last_optimized: new Date().toISOString()
        })
        .eq('id', page.id);

      console.log(`✅ Optimized: ${page.slug}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed for ${page.slug}:`, error);
    }
  }

  console.log('🎉 Meta tag optimization complete!');
}

optimizePages();
