import { notFound } from 'next/navigation';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto py-12 px-4">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {profile.displayName}
          </h1>
          <p className="text-gray-600">@{profile.username}</p>
          {profile.bio && (
            <p className="text-gray-700 mt-3 text-sm leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No links added yet</p>
            </div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white hover:bg-gray-50 p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {link.icon && (
                      <span className="text-xl">{link.icon}</span>
                    )}
                    <span className="font-medium text-gray-900">
                      {link.title}
                    </span>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Create your own profile at{' '}
            <a
              href="/"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              FUC Profile & QR
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}