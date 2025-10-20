'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import QRCodeCustomizer from '@/components/QRCodeCustomizer';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function QRCustomizerPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profile);
      setLoading(false);
    };
    
    getUser();
  }, []);

  const handleSave = async (qrSettings: any, qrCodeUrl: string) => {
    if (!user || !profile) return;
    
    setSaving(true);
    
    try {
      // Update profile with QR settings
      const { error } = await supabase
        .from('profiles')
        .update({
          qr_settings: qrSettings,
          custom_qr_url: qrCodeUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Show success message
      alert('QR code saved successfully! It will be used for your next phygital orders.');
      
      // Navigate back to profile
      router.push(`/${profile.username}`);
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Error saving QR code. Please try again.');
    }
    
    setSaving(false);
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-white/60 mb-6">Please log in to customize your QR code.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/${profile.username}`;

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <motion.button
          onClick={handleClose}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Profile
        </motion.button>
      </div>

      <QRCodeCustomizer
        username={profile.username}
        profileUrl={profileUrl}
        currentSettings={profile.qr_settings}
        onSave={handleSave}
        onClose={handleClose}
      />
      
      {saving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Saving QR Code</h3>
              <p className="text-white/60">Please wait while we save your custom QR code...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}