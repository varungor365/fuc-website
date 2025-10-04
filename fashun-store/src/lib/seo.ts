export type SeoScore = {
  title: number
  description: number
  images: number
  headings: number
  keywords: string[]
  total: number
}

export function analyzeContent(input: { title?: string; description?: string; body?: string; images?: string[] }): SeoScore {
  const title = input.title?.trim() ?? ''
  const description = input.description?.trim() ?? ''
  const body = input.body ?? ''
  const images = input.images ?? []

  const scoreTitle = Math.min(20, Math.max(0, title.length > 30 && title.length < 65 ? 20 : 10))
  const scoreDesc = Math.min(20, Math.max(0, description.length > 70 && description.length < 160 ? 20 : 10))
  const scoreImages = Math.min(20, images.length > 0 ? 20 : 5)
  const scoreHeadings = Math.min(20, /\b(h1|h2|h3)\b/i.test(body) ? 20 : 10)

  const words = (title + ' ' + description + ' ' + body).toLowerCase().match(/[a-z]{4,}/g) || []
  const freq: Record<string, number> = {}
  words.forEach(w => (freq[w] = (freq[w] || 0) + 1))
  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w)

  const total = scoreTitle + scoreDesc + scoreImages + scoreHeadings
  return { title: scoreTitle, description: scoreDesc, images: scoreImages, headings: scoreHeadings, keywords, total }
}

export function buildProductJsonLd(p: { name: string; images: string[]; description: string; sku?: string; price: number; inStock?: boolean }) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.name,
    image: p.images,
    description: p.description,
    sku: p.sku,
    brand: { '@type': 'Brand', name: 'FashUn.Co.in' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: p.price,
      availability: p.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
}
