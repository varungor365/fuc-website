'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: string, message: string} | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotification({ type: 'error', message: 'Failed to load profile settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          website: profile.website,
          display_mode: profile.display_mode,
        })
        .eq('id', profile.id);

      if (error) throw error;

      setNotification({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
        
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
            <p className={notification.type === 'success' ? 'text-green-200' : 'text-red-200'}>
              {notification.message}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="full_name" className="block text-white font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                value={profile?.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-white font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={profile?.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-white font-medium mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={profile?.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="avatar_url" className="block text-white font-medium mb-2">
                Avatar URL
              </label>
              <input
                type="text"
                id="avatar_url"
                value={profile?.avatar_url || ''}
                onChange={(e) => handleChange('avatar_url', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-white font-medium mb-2">
                Website
              </label>
              <input
                type="text"
                id="website"
                value={profile?.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="display_mode" className="block text-white font-medium mb-2">
                Display Mode
              </label>
              <select
                id="display_mode"
                value={profile?.display_mode || 'standard'}
                onChange={(e) => handleChange('display_mode', e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="standard" className="bg-gray-800">Standard</option>
                <option value="live" className="bg-gray-800">Live Mode</option>
                <option value="closet" className="bg-gray-800">Virtual Closet</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}