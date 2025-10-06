'use client';

import { Link } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface LinkButtonProps {
  link: Link;
  profileId: string;
}

export default function LinkButton({ link, profileId }: LinkButtonProps) {
  const handleClick = async () => {
    // Track click analytics
    await supabase.from('analytics').insert({
      profile_id: profileId,
      event_type: 'click',
      link_id: link.id,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full"
    >
      <div className="group relative w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 hover:scale-[1.02] transition-all duration-200 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          {/* Optional Icon */}
          {link.icon && (
            <span className="text-xl">{link.icon}</span>
          )}
          
          {/* Link Title */}
          <span className="text-white font-medium text-center">
            {link.title}
          </span>
          
          {/* Featured Badge */}
          {link.is_featured && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-yellow-400 text-black rounded-full font-semibold">
              ⭐ Featured
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
