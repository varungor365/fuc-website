'use client';

import Link from 'next/link';
import { MockupEditor } from '@/components/designer/MockupEditor';

export default function DesignerPage() {
  const handleDesignSave = (designData: any) => {
    console.log('Design saved:', designData)
    // Handle design save logic
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-black">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-montserrat font-bold text-white">
                Design Studio
              </h1>
              <p className="text-primary-300 mt-1">
                Create custom streetwear with premium resources from Lummi AI, Unblast & more
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/collections/all">
                <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                  Browse Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mockup Editor */}
      <MockupEditor onSave={handleDesignSave} />
    </main>
  )
}