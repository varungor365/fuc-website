import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const frequency: Record<string, number> = {};
  
  words.forEach(word => {
    if (!['this', 'that', 'with', 'from', 'have', 'been'].includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

async function addInternalLinks(content: string, currentPageId: string): Promise<string> {
  const keywords = extractKeywords(content);
  
  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, title')
    .neq('id', currentPageId);

  if (!pages) return content;

  let updatedContent = content;
  const linkedKeywords = new Set<string>();

  for (const keyword of keywords) {
    if (linkedKeywords.has(keyword)) continue;

    const matchingPage = pages.find(p => 
      p.title.toLowerCase().includes(keyword) || 
      p.slug.includes(keyword)
    );

    if (matchingPage) {
      const regex = new RegExp(`\\b${keyword}\\b(?![^<]*>)`, 'i');
      if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(
          regex,
          `<a href="/${matchingPage.slug}" class="internal-link">${keyword}</a>`
        );
        linkedKeywords.add(keyword);
      }
    }
  }

  return updatedContent;
}

async function processPages() {
  console.log('🔗 Starting internal linking...');

  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (!pages?.length) {
    console.log('⚠️ No pages found');
    return;
  }

  for (const page of pages) {
    try {
      const linkedContent = await addInternalLinks(page.content, page.id);
      
      if (linkedContent !== page.content) {
        await supabase
          .from('pages')
          .update({
            content: linkedContent,
            internal_links_updated: new Date().toISOString()
          })
          .eq('id', page.id);

        console.log(`✅ Added links to: ${page.slug}`);
      }
    } catch (error) {
      console.error(`❌ Failed for ${page.slug}:`, error);
    }
  }

  console.log('🎉 Internal linking complete!');
}

processPages();
