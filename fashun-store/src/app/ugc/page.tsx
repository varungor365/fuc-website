import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'UGC Gallery - FashUn.Co.in',
  description: 'Shop the look from our community: customer photos, influencer fits, and design highlights.'
}

const demo = [
  { id: 'u1', img: 'https://images.unsplash.com/photo-1521335629791-ce4aec67dd53?w=800&auto=format', user: '@arian', products: ['hod-001', 'tee-001'] },
  { id: 'u2', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format', user: '@sam', products: ['hod-003'] },
  { id: 'u3', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format', user: '@lee', products: ['pol-001'] },
]

export default function UGCPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Shop the Look</h1>
          <p className="mt-2 text-primary-300">Real fits from the FashUn.Co.in community. Tap a tag to shop the items.</p>
        </div>
        <Link href="/contests" className="btn-secondary">Submit your look</Link>
      </div>
      <div className="product-grid">
        {demo.map((c) => (
          <div key={c.id} className="product-card">
            <div className="relative">
              <Image src={c.img} alt={c.user} width={800} height={1000} className="product-image" />
              <div className="absolute bottom-2 left-2 flex gap-2">
                {c.products.map(pid => (
                  <Link key={pid} href={`/products/${pid}`} className="rounded bg-primary-900/80 border border-primary-700 px-2 py-1 text-xs hover:bg-primary-800">{pid}</Link>
                ))}
              </div>
            </div>
            <div className="p-3 text-sm text-primary-300">{c.user}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
