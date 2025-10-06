'use client';

import { Profile, Link } from '@/lib/supabase';
import { FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';
import LinkButton from './LinkButton';

interface ProfilePageProps {
  profile: Profile;
  links: Link[];
}

const socialIcons: Record<string, any> = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  github: FaGithub,
};

export default function ProfilePage({ profile, links }: ProfilePageProps) {
  const backgroundImage = profile.theme_settings?.backgroundImage || 
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80';
  
  const primaryColor = profile.theme_settings?.primaryColor || '#8B5CF6';
  
  const socialLinks = links.filter(link => 
    ['instagram', 'twitter', 'linkedin', 'youtube', 'github'].some(social => 
      link.url.toLowerCase().includes(social)
    )
  );
  
  const regularLinks = links.filter(link => 
    !socialLinks.includes(link)
  );

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay for better readability */}
      <div className="min-h-screen w-full bg-black/30 backdrop-blur-sm">
        {/* Main Content Container */}
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-2xl mx-auto">
            {/* Profile Section */}
            <div className="text-center mb-8">
              {/* Profile Picture */}
              {profile.profile_image_url && (
                <img
                  src={profile.profile_image_url}
                  alt={profile.display_name || profile.username}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                />
              )}
              
              {/* Display Name */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {profile.display_name || `@${profile.username}`}
              </h1>
              
              {/* Bio */}
              {profile.bio && (
                <p className="text-white/90 text-sm max-w-md mx-auto">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Links Section */}
            <div className="space-y-4 mb-8">
              {regularLinks.map((link) => (
                <LinkButton key={link.id} link={link} profileId={profile.id} />
              ))}
            </div>

            {/* Social Icons Row */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                {socialLinks.map((link) => {
                  const platform = Object.keys(socialIcons).find(key => 
                    link.url.toLowerCase().includes(key)
                  );
                  const Icon = platform ? socialIcons[platform] : null;
                  
                  return Icon ? (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200"
                      onClick={() => trackClick(link.id, profile.id)}
                    >
                      <Icon size={20} />
                    </a>
                  ) : null;
                })}
              </div>
            )}

            {/* Brand Footer */}
            <div className="text-center">
              <a
                href="https://www.fashun.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                <span>Powered by</span>
                <span className="font-bold">Fashun.co.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function trackClick(linkId: string, profileId: string) {
  try {
    await fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, profileId }),
    });
  } catch (error) {
    console.error('Failed to track click:', error);
  }
}
