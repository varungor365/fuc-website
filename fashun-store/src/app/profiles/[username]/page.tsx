import Image from 'next/image'

export function generateStaticParams() {
  return [{ username: 'demo' }]
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const username = params.username
  const looks = [
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format'
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary-700" />
        <div>
          <h1 className="text-2xl font-display font-bold">@{username}</h1>
          <div className="text-sm text-primary-300">Member since 2025 · 5 looks · 3 designs</div>
        </div>
      </div>
      <div className="mt-8 product-grid">
        {looks.map((src, i) => (
          <div key={i} className="product-card">
            <Image src={src} alt={`${username} look ${i+1}`} width={800} height={1000} className="product-image" />
          </div>
        ))}
      </div>
    </div>
  )
}
