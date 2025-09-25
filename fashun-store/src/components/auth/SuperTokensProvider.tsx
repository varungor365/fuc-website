'use client';

import React, { useEffect, useState } from 'react';
import { frontendConfig } from '@/config/supertokensFrontend';
import SuperTokensReact from 'supertokens-auth-react';

export default function SuperTokensProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize SuperTokens on client side only
    if (typeof window !== 'undefined' && !isInitialized) {
      frontendConfig();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <SuperTokensReact.SuperTokensWrapper>
      {children}
    </SuperTokensReact.SuperTokensWrapper>
  );
}