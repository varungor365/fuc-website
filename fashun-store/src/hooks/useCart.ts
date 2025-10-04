'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  customization?: {
    design?: string
    text?: string
    position?: 'front' | 'back'
  }
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      itemCount: 0,
      totalPrice: 0,

      addItem: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          (item) => 
            item.id === newItem.id && 
            item.size === newItem.size && 
            item.color === newItem.color
        )

        let updatedItems: CartItem[]
        
        if (existingItemIndex > -1) {
          // Update quantity of existing item
          updatedItems = items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          // Add new item
          updatedItems = [...items, { ...newItem, quantity: 1 }]
        }

        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, itemCount, totalPrice })
      },

      removeItem: (id, size, color) => {
        const { items } = get()
        const updatedItems = items.filter(
          (item) => !(item.id === id && item.size === size && item.color === color)
        )
        
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, itemCount, totalPrice })
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color)
          return
        }

        const { items } = get()
        const updatedItems = items.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        )

        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        set({ items: updatedItems, itemCount, totalPrice })
      },

      clearCart: () => set({ items: [], itemCount: 0, totalPrice: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'fashun-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export const useCart = () => {
  const store = useCartStore()
  
  // Recalculate derived values on state change
  const itemCount = store.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = store.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return {
    ...store,
    itemCount,
    totalPrice,
  }
}
