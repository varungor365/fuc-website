import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
  slug: string
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Computed values
  totalItems: number
  totalPrice: number
}

const getItemKey = (id: string, size?: string, color?: string): string => {
  return `${id}-${size || 'default'}-${color || 'default'}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (newItem) => {
        const { items } = get()
        const itemKey = getItemKey(newItem.id, newItem.size, newItem.color)
        
        const existingItemIndex = items.findIndex(item => 
          getItemKey(item.id, item.size, item.color) === itemKey
        )
        
        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...items]
          const currentQuantity = updatedItems[existingItemIndex].quantity
          const newQuantity = currentQuantity + (newItem.quantity || 1)
          const maxQuantity = newItem.maxQuantity || 99
          
          updatedItems[existingItemIndex].quantity = Math.min(newQuantity, maxQuantity)
          
          set({ items: updatedItems })
        } else {
          // New item, add to cart
          const cartItem: CartItem = {
            ...newItem,
            quantity: newItem.quantity || 1,
          }
          
          set({ items: [...items, cartItem] })
        }
        
        // Auto-open cart when item is added
        set({ isOpen: true })
      },
      
      removeItem: (id, size, color) => {
        const { items } = get()
        const itemKey = getItemKey(id, size, color)
        
        const updatedItems = items.filter(item => 
          getItemKey(item.id, item.size, item.color) !== itemKey
        )
        
        set({ items: updatedItems })
      },
      
      updateQuantity: (id, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color)
          return
        }
        
        const { items } = get()
        const itemKey = getItemKey(id, size, color)
        
        const updatedItems = items.map(item => {
          if (getItemKey(item.id, item.size, item.color) === itemKey) {
            const maxQuantity = item.maxQuantity || 99
            return {
              ...item,
              quantity: Math.min(quantity, maxQuantity),
            }
          }
          return item
        })
        
        set({ items: updatedItems })
      },
      
      clearCart: () => {
        set({ items: [], isOpen: false })
      },
      
      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }))
      },
      
      openCart: () => {
        set({ isOpen: true })
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      get totalPrice() {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'fashun-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items,
        // Don't persist isOpen state
      }),
    }
  )
)