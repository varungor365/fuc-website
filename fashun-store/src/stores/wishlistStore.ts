"use client"
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem { id: string }

interface WishlistState {
  items: WishlistItem[]
  has: (id: string) => boolean
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some(i => i.id === id),
      add: (id) => set((s) => s.items.some(i => i.id === id) ? s : { items: [...s.items, { id }] }),
      remove: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
      toggle: (id) => get().has(id) ? get().remove(id) : get().add(id),
    }),
    { name: 'fashun-wishlist' }
  )
)
