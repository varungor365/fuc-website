export interface SocialMediaPlatform {
  name: string;
  icon: string;
  color: string;
  urlPattern: string;
  gradient?: string;
}

export const socialMediaPlatforms: Record<string, SocialMediaPlatform> = {
  // Major Social Platforms
  twitter: {
    name: 'Twitter',
    icon: '𝕏',
    color: '#000000',
    gradient: 'from-gray-900 to-black',
    urlPattern: 'https://twitter.com/{username}'
  },
  instagram: {
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    gradient: 'from-pink-500 via-red-500 to-yellow-500',
    urlPattern: 'https://instagram.com/{username}'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0077B5',
    gradient: 'from-blue-600 to-blue-800',
    urlPattern: 'https://linkedin.com/in/{username}'
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    color: '#333333',
    gradient: 'from-gray-700 to-gray-900',
    urlPattern: 'https://github.com/{username}'
  },
  youtube: {
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    gradient: 'from-red-600 to-red-800',
    urlPattern: 'https://youtube.com/@{username}'
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    gradient: 'from-black via-pink-500 to-cyan-400',
    urlPattern: 'https://tiktok.com/@{username}'
  },
  facebook: {
    name: 'Facebook',
    icon: '👥',
    color: '#1877F2',
    gradient: 'from-blue-600 to-blue-800',
    urlPattern: 'https://facebook.com/{username}'
  },
  discord: {
    name: 'Discord',
    icon: '🎮',
    color: '#5865F2',
    gradient: 'from-indigo-600 to-purple-600',
    urlPattern: 'https://discord.gg/{username}'
  },
  twitch: {
    name: 'Twitch',
    icon: '📹',
    color: '#9146FF',
    gradient: 'from-purple-600 to-purple-800',
    urlPattern: 'https://twitch.tv/{username}'
  },
  spotify: {
    name: 'Spotify',
    icon: '🎧',
    color: '#1DB954',
    gradient: 'from-green-500 to-green-700',
    urlPattern: 'https://open.spotify.com/user/{username}'
  },
  
  // Professional & Portfolio
  website: {
    name: 'Website',
    icon: '🌐',
    color: '#007bff',
    gradient: 'from-blue-500 to-cyan-500',
    urlPattern: '{url}'
  },
  portfolio: {
    name: 'Portfolio',
    icon: '💼',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-500',
    urlPattern: '{url}'
  },
  behance: {
    name: 'Behance',
    icon: '🎨',
    color: '#1769ff',
    gradient: 'from-blue-500 to-indigo-600',
    urlPattern: 'https://behance.net/{username}'
  },
  dribbble: {
    name: 'Dribbble',
    icon: '🏀',
    color: '#ea4c89',
    gradient: 'from-pink-500 to-rose-500',
    urlPattern: 'https://dribbble.com/{username}'
  },
  
  // Communication & Messaging
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    color: '#0088cc',
    gradient: 'from-sky-500 to-blue-600',
    urlPattern: 'https://t.me/{username}'
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: '💬',
    color: '#25d366',
    gradient: 'from-green-400 to-green-600',
    urlPattern: 'https://wa.me/{username}'
  },
  snapchat: {
    name: 'Snapchat',
    icon: '👻',
    color: '#fffc00',
    gradient: 'from-yellow-400 to-yellow-600',
    urlPattern: 'https://snapchat.com/add/{username}'
  },
  
  // Music & Audio
  soundcloud: {
    name: 'SoundCloud',
    icon: '🎵',
    color: '#ff5500',
    gradient: 'from-orange-500 to-red-500',
    urlPattern: 'https://soundcloud.com/{username}'
  },
  bandcamp: {
    name: 'Bandcamp',
    icon: '🎶',
    color: '#629aa0',
    gradient: 'from-teal-500 to-cyan-600',
    urlPattern: 'https://{username}.bandcamp.com'
  },
  applemusic: {
    name: 'Apple Music',
    icon: '🍎',
    color: '#fa2d48',
    gradient: 'from-red-500 to-pink-500',
    urlPattern: 'https://music.apple.com/profile/{username}'
  },
  
  // Professional Networks
  medium: {
    name: 'Medium',
    icon: '✍️',
    color: '#00ab6c',
    gradient: 'from-green-500 to-emerald-600',
    urlPattern: 'https://medium.com/@{username}'
  },
  substack: {
    name: 'Substack',
    icon: '📝',
    color: '#ff6719',
    gradient: 'from-orange-500 to-red-500',
    urlPattern: 'https://{username}.substack.com'
  },
  
  // Gaming & Entertainment
  steam: {
    name: 'Steam',
    icon: '🎮',
    color: '#171a21',
    gradient: 'from-gray-800 to-black',
    urlPattern: 'https://steamcommunity.com/id/{username}'
  },
  xbox: {
    name: 'Xbox',
    icon: '🎯',
    color: '#107c10',
    gradient: 'from-green-600 to-green-800',
    urlPattern: 'https://account.xbox.com/en-us/profile?gamertag={username}'
  },
  playstation: {
    name: 'PlayStation',
    icon: '🎮',
    color: '#003087',
    gradient: 'from-blue-800 to-indigo-900',
    urlPattern: 'https://psnprofiles.com/{username}'
  },
  
  // Others
  pinterest: {
    name: 'Pinterest',
    icon: '📌',
    color: '#bd081c',
    gradient: 'from-red-500 to-pink-500',
    urlPattern: 'https://pinterest.com/{username}'
  },
  reddit: {
    name: 'Reddit',
    icon: '🗨️',
    color: '#ff4500',
    gradient: 'from-orange-500 to-red-500',
    urlPattern: 'https://reddit.com/u/{username}'
  },
  patreon: {
    name: 'Patreon',
    icon: '🎭',
    color: '#f96854',
    gradient: 'from-orange-400 to-pink-500',
    urlPattern: 'https://patreon.com/{username}'
  },
  onlyfans: {
    name: 'OnlyFans',
    icon: '💎',
    color: '#00aeef',
    gradient: 'from-sky-400 to-blue-600',
    urlPattern: 'https://onlyfans.com/{username}'
  }
};

export function getSocialIcon(platform: string): string {
  const socialPlatform = socialMediaPlatforms[platform.toLowerCase()];
  return socialPlatform?.icon || '🔗';
}

export function getSocialColor(platform: string): string {
  const socialPlatform = socialMediaPlatforms[platform.toLowerCase()];
  return socialPlatform?.color || '#6b7280';
}

export function getSocialGradient(platform: string): string {
  const socialPlatform = socialMediaPlatforms[platform.toLowerCase()];
  return socialPlatform?.gradient || 'from-gray-500 to-gray-700';
}

export function formatSocialUrl(platform: string, username: string): string {
  const socialPlatform = socialMediaPlatforms[platform.toLowerCase()];
  if (!socialPlatform) return username;
  
  if (platform.toLowerCase() === 'website' || platform.toLowerCase() === 'portfolio') {
    return username.startsWith('http') ? username : `https://${username}`;
  }
  
  return socialPlatform.urlPattern.replace('{username}', username).replace('{url}', username);
}