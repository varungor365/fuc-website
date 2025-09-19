import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  preferences: {
    newsletter: boolean;
    smsUpdates: boolean;
    personalizedRecommendations: boolean;
    socialSharing: boolean;
  };
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: string;
  lastLoginAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'netbanking';
  name: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'rupay';
  upiId?: string;
  walletProvider?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  customization?: {
    design: string;
    text: string;
    position: string;
  };
}

export interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  addedAt: string;
  notifyWhenAvailable: boolean;
}

interface AuthState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User data
  orders: Order[];
  wishlists: Wishlist[];
  
  // Auth actions
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: Partial<User> & { email: string; password: string; name: string }) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Address management
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Payment methods
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  
  // Order management
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  
  // Wishlist management
  createWishlist: (name: string, isPublic?: boolean) => string;
  addToWishlist: (wishlistId: string, item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromWishlist: (wishlistId: string, itemId: string) => void;
  removeWishlist: (wishlistId: string) => void;
  
  // Utility functions
  getDefaultAddress: () => Address | null;
  getDefaultPaymentMethod: () => PaymentMethod | null;
  getTotalOrders: () => number;
  getTotalSpent: () => number;
  getLoyaltyProgress: () => { current: number; nextTier: string; pointsNeeded: number };
}

// Mock authentication functions (replace with real API calls)
const mockSignIn = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'demo@fashun.co.in' && password === 'demo123') {
    return {
      id: '1',
      email: 'demo@fashun.co.in',
      name: 'Demo User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format',
      phone: '+91 98765 43210',
      preferences: {
        newsletter: true,
        smsUpdates: true,
        personalizedRecommendations: true,
        socialSharing: false,
      },
      addresses: [
        {
          id: '1',
          type: 'home',
          name: 'Home',
          street: '123 Fashion Street',
          apartment: 'Apt 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          phone: '+91 98765 43210',
          isDefault: true,
        }
      ],
      paymentMethods: [
        {
          id: '1',
          type: 'card',
          name: 'Primary Card',
          last4: '4242',
          expiryMonth: 12,
          expiryYear: 2028,
          cardType: 'visa',
          isDefault: true,
        }
      ],
      loyaltyPoints: 2500,
      tier: 'gold',
      createdAt: '2024-01-15T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
    };
  }
  return null;
};

const mockSignUp = async (userData: { email: string; name: string; password: string }): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    preferences: {
      newsletter: true,
      smsUpdates: true,
      personalizedRecommendations: true,
      socialSharing: false,
    },
    addresses: [],
    paymentMethods: [],
    loyaltyPoints: 100, // Welcome bonus
    tier: 'bronze',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const tierThresholds = {
  bronze: 0,
  silver: 1000,
  gold: 2500,
  platinum: 5000,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      orders: [],
      wishlists: [],

      // Auth actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockSignIn(email, password);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      signUp: async (userData) => {
        set({ isLoading: true });
        try {
          const user = await mockSignUp(userData);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          orders: [],
          wishlists: [],
        });
      },

      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates }
          });
        }
      },

      // Address management
      addAddress: (address) => {
        const { user } = get();
        if (user) {
          const newAddress = { ...address, id: generateId() };
          
          // If this is the first address, make it default
          if (user.addresses.length === 0) {
            newAddress.isDefault = true;
          }
          
          // If setting as default, unset others
          if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
          }
          
          set({
            user: {
              ...user,
              addresses: [...user.addresses, newAddress]
            }
          });
        }
      },

      updateAddress: (id, updates) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(addr => {
            if (addr.id === id) {
              const updated = { ...addr, ...updates };
              
              // If setting as default, unset others
              if (updated.isDefault && !addr.isDefault) {
                user.addresses.forEach(a => a.isDefault = false);
              }
              
              return updated;
            }
            return addr;
          });
          
          set({
            user: { ...user, addresses: updatedAddresses }
          });
        }
      },

      removeAddress: (id) => {
        const { user } = get();
        if (user) {
          const remainingAddresses = user.addresses.filter(addr => addr.id !== id);
          
          // If we removed the default address, make the first remaining address default
          if (remainingAddresses.length > 0 && !remainingAddresses.some(addr => addr.isDefault)) {
            remainingAddresses[0].isDefault = true;
          }
          
          set({
            user: { ...user, addresses: remainingAddresses }
          });
        }
      },

      setDefaultAddress: (id) => {
        const { user } = get();
        if (user) {
          const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }));
          
          set({
            user: { ...user, addresses: updatedAddresses }
          });
        }
      },

      // Payment methods
      addPaymentMethod: (paymentMethod) => {
        const { user } = get();
        if (user) {
          const newPaymentMethod = { ...paymentMethod, id: generateId() };
          
          // If this is the first payment method, make it default
          if (user.paymentMethods.length === 0) {
            newPaymentMethod.isDefault = true;
          }
          
          // If setting as default, unset others
          if (newPaymentMethod.isDefault) {
            user.paymentMethods.forEach(pm => pm.isDefault = false);
          }
          
          set({
            user: {
              ...user,
              paymentMethods: [...user.paymentMethods, newPaymentMethod]
            }
          });
        }
      },

      updatePaymentMethod: (id, updates) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.map(pm => {
            if (pm.id === id) {
              const updated = { ...pm, ...updates };
              
              // If setting as default, unset others
              if (updated.isDefault && !pm.isDefault) {
                user.paymentMethods.forEach(p => p.isDefault = false);
              }
              
              return updated;
            }
            return pm;
          });
          
          set({
            user: { ...user, paymentMethods: updatedPaymentMethods }
          });
        }
      },

      removePaymentMethod: (id) => {
        const { user } = get();
        if (user) {
          const remainingPaymentMethods = user.paymentMethods.filter(pm => pm.id !== id);
          
          // If we removed the default payment method, make the first remaining one default
          if (remainingPaymentMethods.length > 0 && !remainingPaymentMethods.some(pm => pm.isDefault)) {
            remainingPaymentMethods[0].isDefault = true;
          }
          
          set({
            user: { ...user, paymentMethods: remainingPaymentMethods }
          });
        }
      },

      setDefaultPaymentMethod: (id) => {
        const { user } = get();
        if (user) {
          const updatedPaymentMethods = user.paymentMethods.map(pm => ({
            ...pm,
            isDefault: pm.id === id
          }));
          
          set({
            user: { ...user, paymentMethods: updatedPaymentMethods }
          });
        }
      },

      // Order management
      addOrder: (order) => {
        const { orders } = get();
        set({ orders: [order, ...orders] });
      },

      updateOrder: (id, updates) => {
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.id === id ? { ...order, ...updates } : order
        );
        set({ orders: updatedOrders });
      },

      // Wishlist management
      createWishlist: (name, isPublic = false) => {
        const { wishlists } = get();
        const newWishlist: Wishlist = {
          id: generateId(),
          name,
          items: [],
          isPublic,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({ wishlists: [...wishlists, newWishlist] });
        return newWishlist.id;
      },

      addToWishlist: (wishlistId, item) => {
        const { wishlists } = get();
        const updatedWishlists = wishlists.map(wishlist => {
          if (wishlist.id === wishlistId) {
            const newItem: WishlistItem = {
              ...item,
              id: generateId(),
              addedAt: new Date().toISOString(),
            };
            
            return {
              ...wishlist,
              items: [...wishlist.items, newItem],
              updatedAt: new Date().toISOString(),
            };
          }
          return wishlist;
        });
        
        set({ wishlists: updatedWishlists });
      },

      removeFromWishlist: (wishlistId, itemId) => {
        const { wishlists } = get();
        const updatedWishlists = wishlists.map(wishlist => {
          if (wishlist.id === wishlistId) {
            return {
              ...wishlist,
              items: wishlist.items.filter(item => item.id !== itemId),
              updatedAt: new Date().toISOString(),
            };
          }
          return wishlist;
        });
        
        set({ wishlists: updatedWishlists });
      },

      removeWishlist: (wishlistId) => {
        const { wishlists } = get();
        set({ wishlists: wishlists.filter(wishlist => wishlist.id !== wishlistId) });
      },

      // Utility functions
      getDefaultAddress: () => {
        const { user } = get();
        return user?.addresses.find(addr => addr.isDefault) || null;
      },

      getDefaultPaymentMethod: () => {
        const { user } = get();
        return user?.paymentMethods.find(pm => pm.isDefault) || null;
      },

      getTotalOrders: () => {
        const { orders } = get();
        return orders.length;
      },

      getTotalSpent: () => {
        const { orders } = get();
        return orders
          .filter(order => order.status !== 'cancelled')
          .reduce((total, order) => total + order.total, 0);
      },

      getLoyaltyProgress: () => {
        const { user } = get();
        if (!user) return { current: 0, nextTier: 'bronze', pointsNeeded: 0 };
        
        const currentPoints = user.loyaltyPoints;
        const currentTier = user.tier;
        
        let nextTier: string;
        let pointsNeeded: number;
        
        switch (currentTier) {
          case 'bronze':
            nextTier = 'silver';
            pointsNeeded = tierThresholds.silver - currentPoints;
            break;
          case 'silver':
            nextTier = 'gold';
            pointsNeeded = tierThresholds.gold - currentPoints;
            break;
          case 'gold':
            nextTier = 'platinum';
            pointsNeeded = tierThresholds.platinum - currentPoints;
            break;
          default:
            nextTier = 'platinum';
            pointsNeeded = 0;
        }
        
        return {
          current: currentPoints,
          nextTier,
          pointsNeeded: Math.max(0, pointsNeeded),
        };
      },
    }),
    {
      name: 'fashun-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        orders: state.orders,
        wishlists: state.wishlists,
      }),
    }
  )
);
