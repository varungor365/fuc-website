/**
 * Enhanced Type Definitions for FASHUN Platform
 * Comment 12 Fix: Replace any types with proper TypeScript definitions
 */

// ==================== REVIEW TYPES ====================

export interface ReviewMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  alt?: string;
  thumbnail?: string;
  reviewId: string;
}

export interface ReviewImage {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ReviewVideo {
  id: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  title?: string;
}

export interface ReviewData {
  productId: string;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend: boolean;
  verified?: boolean;
  images?: ReviewImage[];
  videos?: ReviewVideo[];
  fit?: 'runs_small' | 'true_to_size' | 'runs_large';
  sizing?: {
    ordered: string;
    usually_wear: string;
    fits_like: string;
  };
  user?: {
    name?: string;
    email?: string;
    verified?: boolean;
  };
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  images: File[];
  videos: File[];
  fit: 'runs_small' | 'true_to_size' | 'runs_large';
  sizing: {
    ordered: string;
    usually_wear: string;
    fits_like: string;
  };
}

// ==================== FILTER TYPES ====================

export interface FilterValue {
  label: string;
  value: string | number | boolean;
  count?: number;
  selected?: boolean;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'range' | 'select' | 'color' | 'size';
  values: FilterValue[];
  multiSelect?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export interface ActiveFilters {
  category?: string[];
  price?: {
    min: number;
    max: number;
  };
  size?: string[];
  color?: string[];
  brand?: string[];
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  tags?: string[];
}

export type FilterChangeValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | { min: number; max: number }
  | null;

// ==================== ORDER TRACKING TYPES ====================

export interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  location?: string;
  description: string;
  details?: string;
}

export interface TrackingNotification {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface ShippingDetails {
  carrier: string;
  trackingNumber: string;
  service: string;
  estimatedDelivery: string;
  actualDelivery?: string;
}

export interface OrderTracking {
  orderId: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currentLocation?: string;
  events: TrackingEvent[];
  notifications: TrackingNotification[];
  shipping: ShippingDetails;
  estimatedDelivery: string;
  lastUpdated: string;
}

// ==================== MEASUREMENT TYPES ====================

export interface UserMeasurements {
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  shoulder: number;
  sleeve: number;
  height: number;
  weight?: number;
  units: 'metric' | 'imperial';
}

export type MeasurementField = keyof UserMeasurements;
export type MeasurementValue = number | string;

// ==================== ERROR HANDLING TYPES ====================

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
}

export interface RetryableOperation<T = any> {
  (): Promise<T>;
}

export interface RUMDataPoint {
  type: 'navigation' | 'resource' | 'paint' | 'interaction';
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  metadata?: Record<string, any>;
}

// ==================== AUTH TYPES ====================

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
    verified: boolean;
  };
  token?: string;
  error?: string;
}

export interface PasswordlessAuthResult extends AuthResult {
  method: 'magic_link' | 'otp' | 'social';
  redirectUrl?: string;
}

// ==================== DRAG & DROP TYPES ====================

export interface DragInfo {
  offset: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  point: {
    x: number;
    y: number;
  };
}

export interface CarouselDragEndEvent {
  info: DragInfo;
  currentIndex: number;
  totalItems: number;
}

// ==================== UTILITY TYPES ====================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ==================== COMPONENT PROP TYPES ====================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  error?: string;
  message?: string;
  timestamp: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}