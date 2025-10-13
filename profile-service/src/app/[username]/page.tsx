import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProfilePage from '@/components/ProfilePage';
import LiveModeProfile from '@/components/LiveModeProfile';
import VirtualCloset from '@/components/VirtualCloset';

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, links(*)')
    .eq('username', params.username)
    .single();

  if (!profile) notFound();

  // Track view
  await supabase.from('analytics').insert({
    profile_id: profile.id,
    event_type: 'profile_view',
    metadata: { timestamp: new Date().toISOString() }
  });

  // Fetch user designs for virtual closet
  const { data: designs } = await supabase
    .from('design_submissions')
    .select('id, design_url, title')
    .eq('creator_id', profile.id)
    .eq('status', 'approved')
    .limit(10);

  const displayMode = profile.display_mode || 'standard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900">
      {displayMode === 'live' && (
        <LiveModeProfile username={profile.username} location={profile.location} />
      )}
      
      {displayMode === 'closet' && designs && (
        <VirtualCloset designs={designs.map(d => ({ id: d.id, imageUrl: d.design_url, title: d.title }))} />
      )}
      
      {displayMode === 'standard' && (
        <ProfilePage profile={profile} links={profile.links || []} />
      )}
    </div>
  );
}