/**
 * FASHUN.CO Store - Zustand State Management
 * Complete state management for cart, wishlist, user, and UI
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  images: string[]
  category: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
  badge?: string
  slug: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size?: string
  color?: string
  customization?: {
    text?: string
    design?: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  addresses: Address[]
  orders: Order[]
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: Address
  trackingNumber?: string
}

// Cart Store
interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, options?: { size?: string; color?: string; quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, options = {}) => {
        const { size, color, quantity = 1 } = options
        const itemId = `${product.id}-${size || 'default'}-${color || 'default'}`
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(item => 
            item.id === itemId
          )

          if (existingItemIndex > -1) {
            // Update existing item quantity
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
            return { items: newItems, isOpen: true }
          } else {
            // Add new item
            const newItem: CartItem = {
              id: itemId,
              product,
              quantity,
              size,
              color
            }
            return { items: [...state.items, newItem], isOpen: true }
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          return total + (item.product.price * item.quantity)
        }, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'fashun-cart',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// Wishlist Store
interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const exists = state.items.find(item => item.id === product.id)
          if (exists) return state
          return { items: [...state.items, product] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }))
      },

      isInWishlist: (productId) => {
        const { items } = get()
        return items.some(item => item.id === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'fashun-wishlist',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// User Store
interface UserStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (addressId: string, updates: Partial<Address>) => void
  deleteAddress: (addressId: string) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false })
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }))
      },

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: Date.now().toString()
        }

        set((state) => ({
          user: state.user ? {
            ...state.user,
            addresses: [...state.user.addresses, newAddress]
          } : null
        }))
      },

      updateAddress: (addressId, updates) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            addresses: state.user.addresses.map(addr =>
              addr.id === addressId ? { ...addr, ...updates } : addr
            )
          } : null
        }))
      },

      deleteAddress: (addressId) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            addresses: state.user.addresses.filter(addr => addr.id !== addressId)
          } : null
        }))
      }
    }),
    {
      name: 'fashun-user',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// UI Store
interface UIStore {
  searchQuery: string
  isSearchOpen: boolean
  isCommandMenuOpen: boolean
  isMobileMenuOpen: boolean
  currentCategory: string | null
  filters: {
    priceRange: [number, number]
    sizes: string[]
    colors: string[]
    category: string | null
    sortBy: 'featured' | 'price-low' | 'price-high' | 'newest' | 'popular'
  }
  setSearchQuery: (query: string) => void
  toggleSearch: () => void
  toggleCommandMenu: () => void
  toggleMobileMenu: () => void
  setCurrentCategory: (category: string | null) => void
  updateFilters: (filters: Partial<UIStore['filters']>) => void
  resetFilters: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  searchQuery: '',
  isSearchOpen: false,
  isCommandMenuOpen: false,
  isMobileMenuOpen: false,
  currentCategory: null,
  filters: {
    priceRange: [0, 500],
    sizes: [],
    colors: [],
    category: null,
    sortBy: 'featured'
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  toggleSearch: () => {
    set((state) => ({ isSearchOpen: !state.isSearchOpen }))
  },

  toggleCommandMenu: () => {
    set((state) => ({ isCommandMenuOpen: !state.isCommandMenuOpen }))
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }))
  },

  setCurrentCategory: (category) => {
    set({ currentCategory: category })
  },

  updateFilters: (newFilters) => {
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    }))
  },

  resetFilters: () => {
    set({
      filters: {
        priceRange: [0, 500],
        sizes: [],
        colors: [],
        category: null,
        sortBy: 'featured'
      }
    })
  }
}))

// Notification Store for toast messages
interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      duration: notificationData.duration || 5000
    }

    set((state) => ({
      notifications: [...state.notifications, notification]
    }))

    // Auto remove after duration
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== notification.id)
      }))
    }, notification.duration)
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },

  clearNotifications: () => {
    set({ notifications: [] })
  }
}))

// Product Store for product data and loading states
interface ProductStore {
  products: Product[]
  featuredProducts: Product[]
  newArrivals: Product[]
  categories: string[]
  isLoading: boolean
  error: string | null
  setProducts: (products: Product[]) => void
  setFeaturedProducts: (products: Product[]) => void
  setNewArrivals: (products: Product[]) => void
  setCategories: (categories: string[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  searchProducts: (query: string) => Product[]
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  newArrivals: [],
  categories: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setFeaturedProducts: (products) => set({ featuredProducts: products }),
  setNewArrivals: (products) => set({ newArrivals: products }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getProductById: (id) => {
    const { products } = get()
    return products.find(product => product.id === id)
  },

  getProductsByCategory: (category) => {
    const { products } = get()
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    )
  },

  searchProducts: (query) => {
    const { products } = get()
    const searchTerm = query.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  }
}))

// Combined store hooks for convenience
export const useStore = () => ({
  cart: useCartStore(),
  wishlist: useWishlistStore(),
  user: useUserStore(),
  ui: useUIStore(),
  notifications: useNotificationStore(),
  products: useProductStore()
})