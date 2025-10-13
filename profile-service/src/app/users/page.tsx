import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login');
  }
  
  // Fetch user profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching profiles:', error);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">User Profiles</h1>
        
        {error ? (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">Error loading profiles: {error.message}</p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles && profiles.length > 0 ? (
            profiles.map((profile: any) => (
              <div 
                key={profile.id} 
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-colors duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.username} 
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{profile.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-white">{profile.full_name || profile.username}</h2>
                      <p className="text-purple-300">@{profile.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-white/70 mb-4">
                    <div>
                      <span className="font-medium">Links:</span> {profile.links_count || 0}
                    </div>
                    <div>
                      <span className="font-medium">Views:</span> {profile.profile_views || 0}
                    </div>
                  </div>
                  
                  <a 
                    href={`/ ${profile.username}`} 
                    className="block w-full text-center py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/70">No profiles found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}