'use client';

import { motion } from 'framer-motion';
import { 
  ShoppingBag, ShoppingCart, Heart, Star, TrendingUp, Zap, Sparkles,
  Package, Truck, Shield, Check, X, AlertCircle, Info,
  User, Users, UserPlus, Mail, Phone, MapPin,
  Search, Filter, Grid, List, Eye, EyeOff,
  Plus, Minus, Edit, Trash2, Download, Upload,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown,
  Clock, Calendar, Bell, Settings, Menu, MoreVertical,
  Tag, Percent, DollarSign, CreditCard, Wallet,
  Flame, Rocket, Award, Trophy, Target, TrendingDown,
  Image, Camera, Video, Play, Pause, Volume2,
  Share2, Link2, Copy, ExternalLink, Bookmark,
  MessageCircle, Send, ThumbsUp, ThumbsDown,
  Sun, Moon, Cloud, CloudRain, Wind,
  Home, Store, Box, Layers, Package2,
  Shirt, Palette, Paintbrush, Scissors, Ruler,
  Gift, PartyPopper, Sparkle, Wand2
} from 'lucide-react';

// Animation variants for different icon behaviors
const iconVariants = {
  // Bounce animation
  bounce: {
    initial: { y: 0 },
    animate: { 
      y: [-5, 0, -5],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Pulse animation
  pulse: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.2, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Spin animation
  spin: {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  
  // Wiggle animation
  wiggle: {
    initial: { rotate: 0 },
    animate: { 
      rotate: [-10, 10, -10, 10, 0],
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  },
  
  // Float animation
  float: {
    initial: { y: 0 },
    animate: { 
      y: [-10, 10, -10],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Shake animation
  shake: {
    initial: { x: 0 },
    animate: { 
      x: [-5, 5, -5, 5, 0],
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  },
  
  // Glow animation
  glow: {
    initial: { opacity: 1 },
    animate: { 
      opacity: [1, 0.5, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Pop animation
  pop: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.3, 1],
      transition: { 
        duration: 0.3,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  }
};

interface AnimatedIconProps {
  icon: keyof typeof iconMap;
  animation?: keyof typeof iconVariants;
  size?: number;
  className?: string;
  color?: string;
  gradient?: boolean;
}

// Icon mapping
const iconMap = {
  // E-commerce
  shoppingBag: ShoppingBag,
  shoppingCart: ShoppingCart,
  heart: Heart,
  star: Star,
  trending: TrendingUp,
  zap: Zap,
  sparkles: Sparkles,
  
  // Delivery & Package
  package: Package,
  truck: Truck,
  shield: Shield,
  box: Box,
  package2: Package2,
  
  // Actions
  check: Check,
  x: X,
  alert: AlertCircle,
  info: Info,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash: Trash2,
  download: Download,
  upload: Upload,
  
  // User & Social
  user: User,
  users: Users,
  userPlus: UserPlus,
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  
  // Navigation
  search: Search,
  filter: Filter,
  grid: Grid,
  list: List,
  eye: Eye,
  eyeOff: EyeOff,
  menu: Menu,
  more: MoreVertical,
  
  // Arrows & Chevrons
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  
  // Time & Calendar
  clock: Clock,
  calendar: Calendar,
  bell: Bell,
  
  // Commerce
  tag: Tag,
  percent: Percent,
  dollar: DollarSign,
  creditCard: CreditCard,
  wallet: Wallet,
  
  // Special Effects
  flame: Flame,
  rocket: Rocket,
  award: Award,
  trophy: Trophy,
  target: Target,
  
  // Media
  image: Image,
  camera: Camera,
  video: Video,
  play: Play,
  pause: Pause,
  volume: Volume2,
  
  // Sharing
  share: Share2,
  link: Link2,
  copy: Copy,
  external: ExternalLink,
  bookmark: Bookmark,
  
  // Communication
  message: MessageCircle,
  send: Send,
  thumbsUp: ThumbsUp,
  thumbsDown: ThumbsDown,
  
  // Weather
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  cloudRain: CloudRain,
  wind: Wind,
  
  // Other
  home: Home,
  store: Store,
  layers: Layers,
  settings: Settings,
  
  // Fashion
  shirt: Shirt,
  palette: Palette,
  paintbrush: Paintbrush,
  scissors: Scissors,
  ruler: Ruler,
  
  // Celebration
  gift: Gift,
  party: PartyPopper,
  sparkle: Sparkle,
  wand: Wand2
};

export function AnimatedIcon({
  icon,
  animation = 'bounce',
  size = 24,
  className = '',
  color,
  gradient = false
}: AnimatedIconProps) {
  const Icon = iconMap[icon];
  const variant = iconVariants[animation];
  
  if (!Icon) return null;

  return (
    <motion.div
      variants={variant}
      initial="initial"
      animate="animate"
      className={`inline-flex items-center justify-center ${gradient ? 'text-gradient-primary' : ''} ${className}`}
      style={{ color: color || undefined }}
    >
      <Icon size={size} />
    </motion.div>
  );
}

// Pre-configured animated icon components for common use cases
export function CartIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="shoppingCart" animation="bounce" size={size} className={className} />;
}

export function HeartIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="heart" animation="pulse" size={size} className={className} />;
}

export function TruckIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="truck" animation="bounce" size={size} className={className} />;
}

export function FlameIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="flame" animation="wiggle" size={size} className={className} gradient />;
}

export function RocketIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="rocket" animation="float" size={size} className={className} gradient />;
}

export function SparklesIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="sparkles" animation="glow" size={size} className={className} gradient />;
}

export function ZapIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="zap" animation="shake" size={size} className={className} gradient />;
}

export function ShieldIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="shield" animation="pulse" size={size} className={className} />;
}

export function StarIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="star" animation="pop" size={size} className={className} gradient />;
}

export function BellIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="bell" animation="wiggle" size={size} className={className} />;
}

export function GiftIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="gift" animation="bounce" size={size} className={className} gradient />;
}

export function PartyIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="party" animation="pop" size={size} className={className} gradient />;
}

export function TrophyIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="trophy" animation="bounce" size={size} className={className} gradient />;
}

export function PercentIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="percent" animation="spin" size={size} className={className} gradient />;
}

export function PackageIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return <AnimatedIcon icon="package" animation="bounce" size={size} className={className} />;
}

// Icon grid showcase component
export function AnimatedIconShowcase() {
  const showcaseIcons: Array<{ icon: keyof typeof iconMap; animation: keyof typeof iconVariants; label: string }> = [
    { icon: 'shoppingCart', animation: 'bounce', label: 'Cart' },
    { icon: 'heart', animation: 'pulse', label: 'Wishlist' },
    { icon: 'truck', animation: 'float', label: 'Shipping' },
    { icon: 'flame', animation: 'wiggle', label: 'Hot Deal' },
    { icon: 'rocket', animation: 'float', label: 'Fast' },
    { icon: 'sparkles', animation: 'glow', label: 'New' },
    { icon: 'zap', animation: 'shake', label: 'Sale' },
    { icon: 'shield', animation: 'pulse', label: 'Secure' },
    { icon: 'star', animation: 'pop', label: 'Featured' },
    { icon: 'gift', animation: 'bounce', label: 'Gift' },
    { icon: 'trophy', animation: 'bounce', label: 'Best' },
    { icon: 'percent', animation: 'spin', label: 'Discount' }
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-6">
      {showcaseIcons.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div className="glass-gradient-light p-4 rounded-2xl shadow-gradient-glow">
            <AnimatedIcon 
              icon={item.icon} 
              animation={item.animation} 
              size={32}
              gradient
            />
          </div>
          <span className="text-xs text-gray-600 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default AnimatedIcon;
