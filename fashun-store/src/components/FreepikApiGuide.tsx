/**
 * Freepik API Integration Guide
 * Comprehensive documentation for using Freepik API in the project
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  CodeBracketIcon, 
  PhotoIcon, 
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const FreepikApiGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'setup' | 'usage' | 'examples'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DocumentTextIcon },
    { id: 'setup', label: 'Setup', icon: CogIcon },
    { id: 'usage', label: 'Usage', icon: CodeBracketIcon },
    { id: 'examples', label: 'Examples', icon: PhotoIcon }
  ];

  const codeExamples = {
    hook: `import { useFreepikImage } from '@/hooks/useFreepik';

function MyComponent() {
  const { imageUrl, loading, error } = useFreepikImage({
    searchTerm: 'urban streetwear fashion',
    enabled: true,
    fallbackUrl: 'https://example.com/fallback.jpg'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <img src={imageUrl} alt="Fashion" />;
}`,
    smartComponent: `import SmartImage from '@/components/ui/SmartImage';

function ProductCard() {
  return (
    <SmartImage
      searchTerm="streetwear hoodie urban"
      alt="Streetwear Hoodie"
      width={400}
      height={500}
      orientation="vertical"
      className="rounded-lg"
    />
  );
}`,
    apiRoute: `// Using the API route directly
const response = await fetch('/api/freepik?term=fashion&limit=10&type=photo');
const data = await response.json();

// With fallback handling
const images = data.fallback 
  ? data.data.map(item => item.fallbackUrl)
  : data.data.map(item => item.preview.url);`,
    multipleImages: `import { useFreepikImages } from '@/hooks/useFreepik';

function ImageGallery() {
  const { images, loading } = useFreepikImages({
    searchTerm: 'streetwear collection',
    count: 6
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((url, i) => (
        <img key={i} src={url} alt={Fashion \${i + 1}} />
      ))}
    </div>
  );
}`
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📸 Freepik API Integration Guide
        </h1>
        <p className="text-lg text-gray-600">
          Complete documentation for integrating Freepik API in your FASHUN.CO project
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">API Key Configured</h3>
                  <p className="text-blue-700">
                    Your Freepik API key (FPSX231f0a23b48d96bd0d59894cfe7d8117) is properly configured 
                    and integrated with automatic fallback to Unsplash for enhanced reliability.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">✨ Features</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• High-quality stock photos and vectors</li>
                  <li>• Fashion and streetwear specific searches</li>
                  <li>• Automatic fallback to Unsplash/Picsum</li>
                  <li>• React hooks for easy integration</li>
                  <li>• Server-side API routes for security</li>
                  <li>• Loading states and error handling</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-3">🚀 Benefits</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Professional-quality images</li>
                  <li>• 99.9% uptime with fallbacks</li>
                  <li>• Optimized for fashion/streetwear</li>
                  <li>• SEO-friendly alt text support</li>
                  <li>• Responsive and fast loading</li>
                  <li>• Free tier with 5 USD credits</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Environment Setup</h3>
                  <p className="text-yellow-700 mb-3">
                    For production deployment, add your Freepik API key to environment variables:
                  </p>
                  <div className="bg-yellow-100 rounded p-3 font-mono text-sm">
                    FREEPIK_API_KEY=FPSX231f0a23b48d96bd0d59894cfe7d8117
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">📁 File Structure</h3>
              <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
                <div>📁 src/</div>
                <div>├── 📁 lib/</div>
                <div>│   └── 📄 freepikApi.ts (API service)</div>
                <div>├── 📁 hooks/</div>
                <div>│   └── 📄 useFreepik.ts (React hooks)</div>
                <div>├── 📁 components/ui/</div>
                <div>│   └── 📄 SmartImage.tsx (Smart image component)</div>
                <div>└── 📁 app/api/freepik/</div>
                <div>    └── 📄 route.ts (API endpoint)</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">⚙️ Configuration Options</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Search Parameters</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• term: Search keyword</li>
                    <li>• type: photo, vector, psd, ai, eps</li>
                    <li>• orientation: horizontal, vertical, square</li>
                    <li>• premium: true/false</li>
                    <li>• limit: 1-100 results</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Fallback Sources</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Freepik API (primary)</li>
                    <li>• Unsplash (secondary)</li>
                    <li>• Picsum Photos (tertiary)</li>
                    <li>• SVG placeholder (final)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">🔧 React Hook Usage</h3>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {codeExamples.hook}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.hook, 'hook')}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  {copiedCode === 'hook' ? <CheckCircleIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">🖼️ Smart Image Component</h3>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {codeExamples.smartComponent}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.smartComponent, 'smart')}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  {copiedCode === 'smart' ? <CheckCircleIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">🌐 Direct API Usage</h3>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {codeExamples.apiRoute}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.apiRoute, 'api')}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  {copiedCode === 'api' ? <CheckCircleIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">📷 Image Gallery Example</h3>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {codeExamples.multipleImages}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples.multipleImages, 'gallery')}
                  className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  {copiedCode === 'gallery' ? <CheckCircleIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold mb-3">🎯 Fashion Search Terms</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded">streetwear hoodie urban</div>
                  <div className="bg-white p-2 rounded">fashion model portrait</div>
                  <div className="bg-white p-2 rounded">t-shirt mockup template</div>
                  <div className="bg-white p-2 rounded">bomber jacket style</div>
                  <div className="bg-white p-2 rounded">accessories cap sneakers</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold mb-3">⚡ Best Practices</h4>
                <ul className="text-sm space-y-2">
                  <li>• Use specific, descriptive search terms</li>
                  <li>• Always provide fallback URLs</li>
                  <li>• Handle loading and error states</li>
                  <li>• Use appropriate orientations</li>
                  <li>• Test with various screen sizes</li>
                  <li>• Monitor API usage and costs</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">✅ Implementation Status</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Homepage collections using Freepik
                  </div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Smart image component ready
                  </div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    React hooks available
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    API routes configured
                  </div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Fallback system active
                  </div>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Error handling implemented
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FreepikApiGuide;