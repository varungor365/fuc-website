import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.STRAPI_URL || 'http://localhost:1337'}/api/products/${id}?populate=images,category`, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);
  
  if (!product) {
    return {
      title: 'Product Not Found - FASHUN.CO',
    };
  }

  return {
    title: `${product.attributes.name} - FASHUN.CO`,
    description: product.attributes.description || 'Premium streetwear product from FASHUN.CO',
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              {product.attributes.images?.data?.[0] && (
                <Image
                  src={product.attributes.images.data[0].attributes.url}
                  alt={product.attributes.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
            {/* Thumbnail Grid */}
            {product.attributes.images?.data && product.attributes.images.data.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.attributes.images.data.slice(1, 5).map((image: any, index: number) => (
                  <div key={index} className="aspect-square relative bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden">
                    <Image
                      src={image.attributes.url}
                      alt={`${product.attributes.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-montserrat text-4xl font-bold text-white mb-4">
                {product.attributes.name}
              </h1>
              <p className="text-3xl font-bold text-green-400 mb-6">
                ${product.attributes.price}
              </p>
              {product.attributes.category?.data && (
                <p className="text-white/60 text-lg mb-4">
                  Category: {product.attributes.category.data.attributes.name}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.attributes.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white">
                {product.attributes.stock > 0 ? `${product.attributes.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            {product.attributes.description && (
              <div className="prose prose-invert max-w-none">
                <div className="text-white/80 leading-relaxed">
                  {typeof product.attributes.description === 'string' 
                    ? product.attributes.description 
                    : 'Premium streetwear product crafted with attention to detail.'}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button 
                disabled={product.attributes.stock === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-montserrat font-bold py-4 px-8 rounded-xl transition-all duration-300"
              >
                {product.attributes.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              {product.attributes.customizable && (
                <Link
                  href={`/designer?product=${product.id}`}
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-montserrat font-bold py-4 px-8 rounded-xl transition-all duration-300 text-center"
                >
                  Customize This Product
                </Link>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="font-montserrat text-lg font-bold text-white mb-4">Product Details</h3>
              <ul className="space-y-2 text-white/80">
                <li>• Premium quality materials</li>
                <li>• Comfortable fit</li>
                <li>• Durable construction</li>
                <li>• Easy care instructions</li>
                {product.attributes.sku && (
                  <li>• SKU: {product.attributes.sku}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Collections */}
        <div className="mt-12 text-center">
          <Link
            href="/collections"
            className="inline-flex items-center text-white/60 hover:text-white transition-colors"
          >
            ← Back to Collections
          </Link>
        </div>
      </div>
    </main>
  );
}

