import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }
}

// Mock product data for stable testing
const mockProducts = {
  '1': {
    id: 1,
    attributes: {
      name: 'Urban Streetwear Hoodie',
      description: 'Premium cotton blend hoodie with contemporary urban design. Perfect for street style enthusiasts.',
      price: 89.99,
      category: { data: { attributes: { name: 'Hoodies' } } },
      images: {
        data: [{
          attributes: {
            url: '/images/products/hoodie-1.jpg',
            alternativeText: 'Urban Streetwear Hoodie'
          }
        }]
      }
    }
  },
  '2': {
    id: 2,
    attributes: {
      name: 'Street Style T-Shirt',
      description: 'Comfortable graphic tee with bold street art design. Essential for your streetwear collection.',
      price: 34.99,
      category: { data: { attributes: { name: 'T-Shirts' } } },
      images: {
        data: [{
          attributes: {
            url: '/images/products/tshirt-1.jpg',
            alternativeText: 'Street Style T-Shirt'
          }
        }]
      }
    }
  },
  '3': {
    id: 3,
    attributes: {
      name: 'Designer Streetwear Jacket',
      description: 'Limited edition jacket with unique street art graphics. Stand out from the crowd.',
      price: 149.99,
      category: { data: { attributes: { name: 'Jackets' } } },
      images: {
        data: [{
          attributes: {
            url: '/images/products/jacket-1.jpg',
            alternativeText: 'Designer Streetwear Jacket'
          }
        }]
      }
    }
  }
};

async function getProduct(id: string) {
  // Return mock data for stable testing
  return mockProducts[id as keyof typeof mockProducts] || null;
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

  const mainImage = product.attributes.images?.data?.[0]?.attributes?.url || '/images/placeholder-product.jpg';
  const category = product.attributes.category?.data?.attributes?.name || 'Streetwear';

  return (
    <main className="min-h-screen bg-primary-900 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              <Image
                src={mainImage}
                alt={product.attributes.images?.data?.[0]?.attributes?.alternativeText || product.attributes.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <Link href="/collections" className="hover:text-white transition-colors">
                Collections
              </Link>
              <span>/</span>
              <span className="text-white">{category}</span>
              <span>/</span>
              <span className="text-gray-400">{product.attributes.name}</span>
            </nav>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white font-montserrat">
                {product.attributes.name}
              </h1>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-accent-400">
                  ${product.attributes.price}
                </span>
                <span className="px-3 py-1 bg-accent-400/20 text-accent-400 text-sm font-medium rounded-full">
                  {category}
                </span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">
                {product.attributes.description}
              </p>
            </div>

            {/* Product Options */}
            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                <div className="flex space-x-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      className="w-12 h-12 border border-white/20 text-white hover:border-accent-400 hover:text-accent-400 transition-colors rounded-lg"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                <div className="flex space-x-3">
                  {[
                    { name: 'Black', value: '#000000' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Gray', value: '#6B7280' },
                    { name: 'Navy', value: '#1E3A8A' }
                  ].map((color) => (
                    <button
                      key={color.name}
                      className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-accent-400 transition-colors"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button className="w-10 h-10 border border-white/20 text-white hover:border-accent-400 hover:text-accent-400 transition-colors rounded-lg">
                    -
                  </button>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="w-16 h-10 bg-white/5 border border-white/20 text-white text-center rounded-lg focus:border-accent-400 focus:outline-none"
                  />
                  <button className="w-10 h-10 border border-white/20 text-white hover:border-accent-400 hover:text-accent-400 transition-colors rounded-lg">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <button className="w-full bg-accent-400 text-primary-900 font-semibold py-4 rounded-xl hover:bg-accent-300 transition-colors">
                Add to Cart - ${product.attributes.price}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="border border-white/20 text-white py-3 rounded-xl hover:border-accent-400 hover:text-accent-400 transition-colors">
                  Add to Wishlist
                </button>
                <button className="border border-white/20 text-white py-3 rounded-xl hover:border-accent-400 hover:text-accent-400 transition-colors">
                  Share Product
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="pt-8 space-y-4">
              <h3 className="text-xl font-semibold text-white font-montserrat">Product Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Premium quality materials</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Contemporary street style design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Comfortable fit for all-day wear</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
                  <span>Machine washable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}