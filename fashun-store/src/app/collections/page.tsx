import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Collections - FASHUN.CO',
  description: 'Browse our premium streetwear collections. Find the perfect pieces for your style.',
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL || 'http://localhost:1337'}/api/products?populate=images,category`, {
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.STRAPI_URL || 'http://localhost:1337'}/api/categories`, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

async function ProductGrid() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-montserrat font-bold py-2 px-6 rounded-xl">
            All
          </button>
          {categories.map((category: any) => (
            <button
              key={category.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-montserrat font-bold py-2 px-6 rounded-xl transition-all duration-300"
            >
              {category.attributes.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              <div className="aspect-square relative">
                {product.attributes.images?.data?.[0] && (
                  <Image
                    src={product.attributes.images.data[0].attributes.url}
                    alt={product.attributes.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-montserrat text-lg font-bold text-white mb-2 truncate">
                  {product.attributes.name}
                </h3>
                <p className="text-green-400 font-bold text-lg">
                  ${product.attributes.price}
                </p>
                {product.attributes.category?.data && (
                  <p className="text-white/60 text-sm mt-1">
                    {product.attributes.category.data.attributes.name}
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          // Placeholder products for demo
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
              <div className="p-4">
                <h3 className="font-montserrat text-lg font-bold text-white mb-2">
                  Premium Item #{i + 1}
                </h3>
                <p className="text-green-400 font-bold text-lg">
                  ${(99 + i * 10).toFixed(2)}
                </p>
                <p className="text-white/60 text-sm mt-1">
                  Streetwear
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-primary-900 py-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h1 className="font-montserrat text-5xl font-bold text-white text-center mb-4">
          Our Collections
        </h1>
        <p className="font-inter text-xl text-white/80 text-center max-w-2xl mx-auto">
          Discover premium streetwear pieces crafted with attention to detail and designed for the modern urban lifestyle.
        </p>
      </div>

      {/* Products */}
      <Suspense fallback={
        <div className="py-16 text-center">
          <p className="text-white/60">Loading products...</p>
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </main>
  );
}