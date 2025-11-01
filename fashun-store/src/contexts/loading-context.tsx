"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FlickeringGridHero } from "@/components/ui/flickering-grid";
import { AnimatePresence } from "framer-motion";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: React.ReactNode;
  logo?: string;
  title?: string;
  subtitle?: string;
  minLoadingTime?: number;
  showOnFirstVisit?: boolean;
}

export function LoadingProvider({
  children,
  logo = "/logo.png",
  title = "FUC!",
  subtitle = "Fashion Unleashed Culture",
  minLoadingTime = 1500, // 1.5 seconds
  showOnFirstVisit = true,
}: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if it's first visit or if we should always show
    const hasVisited = sessionStorage.getItem("fashun_visited");
    
    if (!hasVisited || !showOnFirstVisit) {
      setShouldShow(true);
      sessionStorage.setItem("fashun_visited", "true");
    } else {
      setIsLoading(false);
      setShouldShow(false);
    }
  }, [showOnFirstVisit]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <AnimatePresence mode="wait">
        {shouldShow && isLoading && (
          <FlickeringGridHero
            logo={logo}
            title={title}
            subtitle={subtitle}
            isLoading={isLoading}
            onLoadingComplete={handleLoadingComplete}
            minLoadingTime={minLoadingTime}
          />
        )}
      </AnimatePresence>
      {!isLoading && children}
    </LoadingContext.Provider>
  );
}
