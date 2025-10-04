import { notFound } from 'next/navigation';
import { getSocialIcon, getSocialGradient, formatSocialUrl } from '@/lib/social-media';

interface Profile {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  theme: string;
}

interface Link {
  id: number;
  title: string;
  url: string;
  icon?: string;
  order_index: number;
}

async function getProfile(username: string): Promise<{ profile: Profile; links: Link[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/profile/${username}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

function detectPlatform(title: string, url: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  if (lowerTitle.includes('instagram') || lowerUrl.includes('instagram')) return 'instagram';
  if (lowerTitle.includes('twitter') || lowerUrl.includes('twitter') || lowerUrl.includes('x.com')) return 'twitter';
  if (lowerTitle.includes('facebook') || lowerUrl.includes('facebook')) return 'facebook';
  if (lowerTitle.includes('youtube') || lowerUrl.includes('youtube')) return 'youtube';
  if (lowerTitle.includes('linkedin') || lowerUrl.includes('linkedin')) return 'linkedin';
  if (lowerTitle.includes('tiktok') || lowerUrl.includes('tiktok')) return 'tiktok';
  if (lowerTitle.includes('snapchat') || lowerUrl.includes('snapchat')) return 'snapchat';
  if (lowerTitle.includes('telegram') || lowerUrl.includes('telegram') || lowerUrl.includes('t.me')) return 'telegram';
  if (lowerTitle.includes('whatsapp') || lowerUrl.includes('whatsapp') || lowerUrl.includes('wa.me')) return 'whatsapp';
  if (lowerTitle.includes('github') || lowerUrl.includes('github')) return 'github';
  if (lowerTitle.includes('discord') || lowerUrl.includes('discord')) return 'discord';
  if (lowerTitle.includes('twitch') || lowerUrl.includes('twitch')) return 'twitch';
  if (lowerTitle.includes('spotify') || lowerUrl.includes('spotify')) return 'spotify';
  if (lowerTitle.includes('behance') || lowerUrl.includes('behance')) return 'behance';
  if (lowerTitle.includes('dribbble') || lowerUrl.includes('dribbble')) return 'dribbble';
  if (lowerTitle.includes('medium') || lowerUrl.includes('medium')) return 'medium';
  if (lowerTitle.includes('pinterest') || lowerUrl.includes('pinterest')) return 'pinterest';
  if (lowerTitle.includes('reddit') || lowerUrl.includes('reddit')) return 'reddit';
  if (lowerTitle.includes('soundcloud') || lowerUrl.includes('soundcloud')) return 'soundcloud';
  if (lowerTitle.includes('patreon') || lowerUrl.includes('patreon')) return 'patreon';
  if (lowerTitle.includes('website') || lowerTitle.includes('portfolio')) return 'website';
  
  return 'website';
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getProfile(username);
  
  if (!data) {
    notFound();
  }

  const { profile, links } = data;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* AI-Generated Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-900/50 via-transparent to-emerald-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-md mx-auto py-12 px-6">
        {/* Profile Header with Enhanced Design */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-8">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-32 h-32 rounded-full mx-auto border-4 border-white/30 shadow-2xl backdrop-blur-sm"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30 shadow-2xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur opacity-30 animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-3 tracking-wide bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
            {profile.displayName}
          </h1>
          <p className="text-purple-200 text-xl mb-6 font-medium">@{profile.username}</p>
          {profile.bio && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <p className="text-gray-100 text-center leading-relaxed max-w-sm mx-auto">
                {profile.bio}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Links with Platform-Specific Gradients */}
        <div className="space-y-4 mb-10">
          {links.length === 0 ? (
            <div className="text-center text-gray-300 py-16 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-xl font-semibold mb-2">No links added yet</p>
              <p className="text-sm text-gray-400">Check back soon for updates!</p>
            </div>
          ) : (
            links.map((link) => {
              const platform = detectPlatform(link.title, link.url);
              const gradient = getSocialGradient(platform);
              const icon = getSocialIcon(platform);
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full bg-gradient-to-r ${gradient} hover:shadow-2xl hover:shadow-purple-500/25 backdrop-blur-sm p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-white/10 group relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center text-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {link.icon || icon}
                      </span>
                      <span className="font-bold text-white text-lg tracking-wide">
                        {link.title}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* Enhanced Social Media Quick Links */}
        {links.length > 0 && (
          <div className="mb-10">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-white text-center text-sm font-semibold mb-4 uppercase tracking-widest">Quick Connect</h3>
              <div className="flex justify-center flex-wrap gap-3">
                {links.slice(0, 8).map((link) => {
                  const platform = detectPlatform(link.title, link.url);
                  const gradient = getSocialGradient(platform);
                  const icon = getSocialIcon(platform);
                  
                  return (
                    <a
                      key={`social-${link.id}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20`}
                      title={link.title}
                    >
                      <span className="text-xl">{link.icon || icon}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="text-2xl mb-3">✨</div>
            <p className="text-xs text-gray-300 mb-4 uppercase tracking-widest font-semibold">
              Create Your Stunning Portfolio
            </p>
            <a
              href="/"
              className="inline-block text-white hover:text-purple-200 font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
            >
              🚀 Get Started Free
            </a>
            <p className="text-xs text-gray-400 mt-3">
              Lifetime Free • No Limits • Your Permanent Link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}