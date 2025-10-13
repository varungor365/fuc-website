'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function FeaturesPage() {
  const [features, setFeatures] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadFeatures();
  }, []);

  async function loadFeatures() {
    const { data } = await supabase.from('feature_flags').select('*').order('name');
    setFeatures(data || []);
  }

  async function toggleFeature(id: string, enabled: boolean) {
    await supabase.from('feature_flags').update({ enabled }).eq('id', id);
    loadFeatures();
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Feature Control</h1>

        <div className="space-y-4">
          {features.map(feature => (
            <div key={feature.id} className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold capitalize">{feature.name.replace(/_/g, ' ')}</h3>
                  <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
                </div>
                <button
                  onClick={() => toggleFeature(feature.id, !feature.enabled)}
                  className={`px-6 py-3 rounded-lg font-bold transition ${
                    feature.enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
