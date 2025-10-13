'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMedusaCart } from '@/hooks/useMedusaCart';

interface MedusaContextType {
  cart: any;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<any>;
  updateItem: (lineId: string, quantity: number) => Promise<any>;
  removeItem: (lineId: string) => Promise<any>;
  totalItems: number;
  subtotal: number;
  total: number;
  refresh: () => Promise<void>;
}

const MedusaContext = createContext<MedusaContextType | undefined>(undefined);

export function MedusaProvider({ children }: { children: ReactNode }) {
  const cartData = useMedusaCart();

  return (
    <MedusaContext.Provider value={cartData}>
      {children}
    </MedusaContext.Provider>
  );
}

export function useMedusa() {
  const context = useContext(MedusaContext);
  if (context === undefined) {
    throw new Error('useMedusa must be used within a MedusaProvider');
  }
  return context;
}
