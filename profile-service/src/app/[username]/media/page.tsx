import React from 'react';
import MediaGallery from '@/components/media/MediaGallery';
import InteractiveEmbeds from '@/components/media/InteractiveEmbeds';

interface MediaPageProps {
  params: {
    username: string;
  };
}

export default function MediaPage({ params }: MediaPageProps) {
  const { username } = params;
  const isOwner = true; // In real app, check if current user owns this profile

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {username}'s Media Gallery
          </h1>
          <p className="text-xl text-gray-600">
            Explore multimedia content and interactive elements
          </p>
        </div>

        {/* Media Gallery Section */}
        <section>
          <MediaGallery 
            userId={username} 
            isEditable={isOwner}
          />
        </section>

        {/* Interactive Embeds Section */}
        <section>
          <InteractiveEmbeds 
            userId={username} 
            isEditable={isOwner}
          />
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>Powered by Rich Media Embeds System</p>
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: 'Media Gallery | Rich Media Profile',
  description: 'Interactive multimedia gallery with videos, audio, documents, and embedded content',
};