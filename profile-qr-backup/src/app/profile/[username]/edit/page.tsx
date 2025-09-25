'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Link {
  id: number;
  title: string;
  url: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState('default');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' });
  const [showAddLink, setShowAddLink] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }
    
    const userData = JSON.parse(userStr);
    
    // Check if user owns this profile
    if (userData.username !== username) {
      router.push('/dashboard');
      return;
    }
    
    setUser(userData);
    setDisplayName(userData.displayName);
    loadProfile(token);
    loadLinks(token);
  }, [username, router]);

  const loadProfile = async (token: string) => {
    try {
      const response = await fetch(`/api/profile/${username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBio(data.profile.bio || '');
        setTheme(data.profile.theme || 'default');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadLinks = async (token: string) => {
    try {
      const response = await fetch('/api/links', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error loading links:', error);
    }
    
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/profile/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName, bio, theme }),
      });

      if (response.ok) {
        // Update local storage
        const updatedUser = { ...user!, displayName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) {
      alert('Title and URL are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newLink),
      });

      if (response.ok) {
        setNewLink({ title: '', url: '', icon: '' });
        setShowAddLink(false);
        loadLinks(token!);
      } else {
        alert('Failed to add link');
      }
    } catch (error) {
      console.error('Error adding link:', error);
      alert('Error adding link');
    }
  };

  const deleteLink = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadLinks(token!);
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Error deleting link');
    }
  };

  const toggleLinkActive = async (link: Link) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...link,
          is_active: !link.is_active
        }),
      });

      if (response.ok) {
        setLinks(links.map(l => 
          l.id === link.id ? { ...l, is_active: !l.is_active } : l
        ));
      } else {
        alert('Failed to update link');
      }
    } catch (error) {
      console.error('Error updating link:', error);
      alert('Error updating link');
    }
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <div className="flex items-center space-x-4">
              <a
                href={`/profile/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                View Profile →
              </a>
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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell people about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="colorful">Colorful</option>
                </select>
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          {/* Links Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Links</h2>
              <button
                onClick={() => setShowAddLink(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Add Link
              </button>
            </div>

            {/* Quick Link Templates */}
            {showAddLink && (
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { title: 'Instagram', icon: '📷', url: 'https://instagram.com/' },
                    { title: 'Twitter', icon: '🐦', url: 'https://twitter.com/' },
                    { title: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/' },
                    { title: 'YouTube', icon: '📺', url: 'https://youtube.com/@' },
                    { title: 'TikTok', icon: '🎵', url: 'https://tiktok.com/@' },
                    { title: 'Snapchat', icon: '👻', url: 'https://snapchat.com/add/' },
                    { title: 'Website', icon: '🌐', url: 'https://' },
                    { title: 'Email', icon: '📧', url: 'mailto:' },
                  ].map((template) => (
                    <button
                      key={template.title}
                      onClick={() => setNewLink({ ...template, url: template.url })}
                      className="text-xs bg-white hover:bg-gray-50 border border-gray-200 rounded px-2 py-1 flex items-center space-x-1"
                    >
                      <span>{template.icon}</span>
                      <span>{template.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add Link Form */}
            {showAddLink && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Link</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link title (e.g., Instagram, Website)"
                  />
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                  <input
                    type="text"
                    value={newLink.icon}
                    onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Icon (emoji or text, optional)"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={addLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Add Link
                    </button>
                    <button
                      onClick={() => {
                        setShowAddLink(false);
                        setNewLink({ title: '', url: '', icon: '' });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Links List */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No links added yet. Click "Add Link" to get started!
                </p>
              ) : (
                links.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-4 border rounded-md ${
                      link.is_active ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {link.icon && <span className="text-xl">{link.icon}</span>}
                      <div>
                        <h4 className={`font-medium ${link.is_active ? 'text-gray-900' : 'text-gray-500'}`}>
                          {link.title}
                        </h4>
                        <p className={`text-sm ${link.is_active ? 'text-gray-600' : 'text-gray-400'}`}>
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLinkActive(link)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          link.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {link.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}