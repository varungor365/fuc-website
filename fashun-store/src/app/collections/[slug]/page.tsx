import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { products, categories } from '@/data/products'

interface Category {
  slug: string
  name: string
  description: string
  image: string
}

function getCategory(slug: string): Category | undefined {
  return (categories as Record<string, Category>)[slug]
}

export function generateStaticParams() {
  return Object.values(categories as Record<string, Category>).map((c) => ({ slug: c.slug }))
}

export const dynamicParams = false

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const cat = getCategory(params.slug)
  if (!cat) return notFound()

  const items = products.filter(p => p.category === params.slug)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">{cat.name}</h1>
          <p className="mt-3 text-primary-300">{cat.description}</p>
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-primary-700">
          <Image src={cat.image} alt={cat.name} fill className="object-cover" />
        </div>
      </div>

      <div className="product-grid">
        {items.map((p) => (
          <div key={p.id} className="product-card group hover:-translate-y-1 transition-transform">
            <Link href={`/products/${p.id}`}>
              <div className="relative">
                <Image src={p.images[0]} alt={p.name} width={600} height={600} className="product-image" />
                {p.isNew && (
                  <span className="absolute left-2 top-2 rounded bg-accent-500 px-2 py-1 text-xs font-semibold text-primary-900">New</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium">{p.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-primary-100 font-semibold">₹{p.price}</span>
                  {p.originalPrice && (
                    <span className="text-primary-400 line-through text-sm">₹{p.originalPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
