'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function SubmitDesignPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [designImage, setDesignImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please login to submit designs');
        router.push('/login');
        return;
      }

      const { error } = await supabase.from('design_submissions').insert({
        user_id: user.id,
        title,
        description,
        design_image: designImage,
        status: 'pending',
      });

      if (error) throw error;

      alert('Design submitted successfully! You\'ll earn 10% royalty on every sale if approved.');
      router.push('/community');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit design');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit Your Design</h1>
          <p className="text-white/70">Earn 10% royalty on every sale!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Design Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="e.g., Cyberpunk Dreams"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="Tell us about your design..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Design Image URL</label>
              <input
                type="url"
                value={designImage}
                onChange={(e) => setDesignImage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                placeholder="https://..."
              />
            </div>

            {designImage && (
              <div className="border border-white/20 rounded-lg p-4">
                <p className="text-sm mb-2">Preview:</p>
                <img src={designImage} alt="Preview" className="w-full rounded-lg" />
              </div>
            )}

            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💰 Creator Royalty Program</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Earn 10% on every sale</li>
                <li>✅ Track earnings in dashboard</li>
                <li>✅ Monthly payouts</li>
                <li>✅ Keep full creative rights</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Design'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
