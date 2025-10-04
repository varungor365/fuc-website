'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    setProfileUrl(`${window.location.origin}/profile/${userData.username}`);
    setLoading(false);
    
    // Load existing QR code if available
    loadQRCode(token);
  }, [router]);

  const loadQRCode = async (token: string) => {
    try {
      const response = await fetch('/api/qr/generate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
    }
  };

  const generateQRCode = async () => {
    if (!user) return;
    
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          options: {
            width: 300,
            margin: 2,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
      } else {
        console.error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.download = `${user?.username}-qr-code.png`;
    link.href = qrCode;
    link.click();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.displayName}</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Your Profile
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-sm text-gray-900">@{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profile URL</label>
                    <p className="text-sm text-gray-900 break-all">{profileUrl}</p>
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-500 text-sm"
                    >
                      View Profile →
                    </a>
                  </div>
                </div>
                <div className="mt-5 space-x-2">
                  <a
                    href={`/profile/${user?.username}/edit`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Edit Profile & Links
                  </a>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  QR Code
                </h3>
                {qrCode ? (
                  <div className="text-center">
                    <img src={qrCode} alt="Profile QR Code" className="mx-auto mb-4" />
                    <div className="space-x-2">
                      <button
                        onClick={downloadQRCode}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Download QR Code
                      </button>
                      <button
                        onClick={generateQRCode}
                        disabled={generating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                      >
                        {generating ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No QR code generated yet</p>
                    <button
                      onClick={generateQRCode}
                      disabled={generating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {generating ? 'Generating...' : 'Generate QR Code'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mockup Builder */}
            <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  T-Shirt Mockup Builder
                </h3>
                <p className="text-gray-600 mb-4">
                  Create custom T-shirt mockups with your QR code
                </p>
                <a
                  href="/mockup"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Mockup
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}