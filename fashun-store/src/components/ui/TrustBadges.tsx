import { Shield, Lock, Award, Truck, RefreshCw, Star } from 'lucide-react'

interface TrustBadgeProps {
  type: 'security' | 'guarantee' | 'shipping' | 'returns' | 'rating' | 'certification'
  title: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function TrustBadge({ type, title, description, icon, className = '' }: TrustBadgeProps) {
  const getDefaultIcon = () => {
    switch (type) {
      case 'security':
        return <Lock className="w-5 h-5" />
      case 'guarantee':
        return <Shield className="w-5 h-5" />
      case 'shipping':
        return <Truck className="w-5 h-5" />
      case 'returns':
        return <RefreshCw className="w-5 h-5" />
      case 'rating':
        return <Star className="w-5 h-5" />
      case 'certification':
        return <Award className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getThemeClasses = () => {
    switch (type) {
      case 'security':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'guarantee':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'shipping':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'returns':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'rating':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'certification':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`flex items-center space-x-3 p-3 border rounded-lg ${getThemeClasses()} ${className}`}>
      {icon || getDefaultIcon()}
      <div>
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="text-xs opacity-80">{description}</div>
        )}
      </div>
    </div>
  )
}

interface TrustBadgesGroupProps {
  badges: Array<Omit<TrustBadgeProps, 'className'>>
  layout?: 'grid' | 'stack' | 'horizontal'
  className?: string
}

export function TrustBadgesGroup({ badges, layout = 'grid', className = '' }: TrustBadgesGroupProps) {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'stack':
        return 'space-y-3'
      case 'horizontal':
        return 'flex flex-wrap gap-4'
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
    }
  }

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {badges.map((badge, index) => (
        <TrustBadge key={index} {...badge} />
      ))}
    </div>
  )
}

// Pre-configured badge sets
export const securityBadges = [
  {
    type: 'security' as const,
    title: '256-bit SSL Encryption',
    description: 'Your data is protected',
  },
  {
    type: 'security' as const,
    title: 'Secure Payments',
    description: 'Razorpay & Stripe protected',
  },
  {
    type: 'guarantee' as const,
    title: 'Money-Back Guarantee',
    description: '30-day return policy',
  },
]

export const shippingBadges = [
  {
    type: 'shipping' as const,
    title: 'Free Shipping',
    description: 'On orders over ₹999',
  },
  {
    type: 'shipping' as const,
    title: 'Fast Delivery',
    description: '2-5 business days',
  },
  {
    type: 'returns' as const,
    title: 'Easy Returns',
    description: 'Hassle-free process',
  },
]

export const qualityBadges = [
  {
    type: 'certification' as const,
    title: 'Premium Quality',
    description: 'Carefully curated products',
  },
  {
    type: 'rating' as const,
    title: '4.8/5 Rating',
    description: 'Based on 1,200+ reviews',
  },
  {
    type: 'guarantee' as const,
    title: 'Authenticity Guaranteed',
    description: '100% genuine products',
  },
]

// Footer trust section component
export function FooterTrustSection() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quality You Can Trust
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trust is our priority. We're committed to providing a secure, 
            reliable shopping experience with every order.
          </p>
        </div>
        
        <TrustBadgesGroup 
          badges={[...securityBadges, ...shippingBadges]} 
          layout="grid"
          className="mb-8"
        />
        
        {/* Payment Methods */}
        <div className="text-center border-t border-gray-200 pt-8">
          <h3 className="font-medium text-gray-900 mb-4">Accepted Payment Methods</h3>
          <div className="flex justify-center items-center space-x-6 flex-wrap">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border">
              <span className="text-sm font-medium">Visa</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border">
              <span className="text-sm font-medium">Mastercard</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border">
              <span className="text-sm font-medium">UPI</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border">
              <span className="text-sm font-medium">Razorpay</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg border">
              <span className="text-sm font-medium">Net Banking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}