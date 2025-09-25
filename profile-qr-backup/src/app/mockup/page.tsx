'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
}

interface MockupTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

export default function MockupBuilderPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tshirt-back');
  const [qrPosition, setQrPosition] = useState({ x: 150, y: 200, width: 200, height: 200 });
  const [generatedMockup, setGeneratedMockup] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const router = useRouter();

  const templates: MockupTemplate[] = [
    {
      id: 'tshirt-back',
      name: 'T-Shirt Back',
      description: 'Classic T-shirt back design',
      previewUrl: '/api/placeholder/400/400'
    },
    {
      id: 'tshirt-front',
      name: 'T-Shirt Front',
      description: 'T-shirt front chest area',
      previewUrl: '/api/placeholder/400/400'
    },
    {
      id: 'hoodie-back',
      name: 'Hoodie Back',
      description: 'Hoodie back design',
      previewUrl: '/api/placeholder/400/400'
    },
    {
      id: 'hoodie-front',
      name: 'Hoodie Front',
      description: 'Hoodie front design',
      previewUrl: '/api/placeholder/400/400'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    setLoading(false);
  }, [router]);

  const generateMockup = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/mockup/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          template: selectedTemplate,
          qrPosition: qrPosition,
          qrStyle: {
            borderRadius: 10,
            opacity: 1
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedMockup(data.mockup);
      } else {
        const error = await response.json();
        alert(`Failed to generate mockup: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating mockup:', error);
      alert('Error generating mockup');
    } finally {
      setGenerating(false);
    }
  };

  const downloadMockup = () => {
    if (!generatedMockup) return;
    
    const link = document.createElement('a');
    link.download = `${user?.username}-${selectedTemplate}-mockup.png`;
    link.href = generatedMockup;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">T-Shirt Mockup Builder</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.displayName}</span>
              <a
                href="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Template Selection */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Template</h2>
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                        <div className="text-4xl">👕</div>
                      </div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Position */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Position</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X Position: {qrPosition.x}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="350"
                      value={qrPosition.x}
                      onChange={(e) => setQrPosition({ ...qrPosition, x: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y Position: {qrPosition.y}px
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="350"
                      value={qrPosition.y}
                      onChange={(e) => setQrPosition({ ...qrPosition, y: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size: {qrPosition.width}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={qrPosition.width}
                      onChange={(e) => {
                        const size = parseInt(e.target.value);
                        setQrPosition({ ...qrPosition, width: size, height: size });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Mockup</h2>
                <p className="text-gray-600 mb-4">
                  This will create a T-shirt mockup with your profile QR code positioned as configured above.
                </p>
                <button
                  onClick={generateMockup}
                  disabled={generating}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50"
                >
                  {generating ? 'Generating Mockup...' : 'Generate Mockup'}
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
              
              {generatedMockup ? (
                <div className="space-y-4">
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <img 
                      src={generatedMockup} 
                      alt="Generated T-shirt mockup" 
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={downloadMockup}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                      Download Mockup
                    </button>
                    <button
                      onClick={generateMockup}
                      disabled={generating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">👕</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No mockup generated yet</h3>
                  <p className="text-gray-600">
                    Select a template, adjust the QR code position, and click "Generate Mockup" to see your design.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">How it works</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Your profile QR code will be automatically generated and placed on the selected T-shirt template</li>
                  <li>• Adjust the position and size using the sliders above</li>
                  <li>• Download the final mockup image for printing or promotional use</li>
                  <li>• Perfect for merchandise, marketing materials, or personal branding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}