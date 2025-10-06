'use client';

import { ClerkProvider as BaseClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getSettings } from '@/lib/settings';

export default function ClerkProvider({ children }: { children: React.ReactNode }) {
  const [publishableKey, setPublishableKey] = useState('');

  useEffect(() => {
    const settings = getSettings();
    if (settings.authProvider === 'clerk' && settings.clerkPublishableKey) {
      setPublishableKey(settings.clerkPublishableKey);
    }
  }, []);

  if (!publishableKey) {
    return <>{children}</>;
  }

  return (
    <BaseClerkProvider publishableKey={publishableKey}>
      {children}
    </BaseClerkProvider>
  );
}
