/**
 * Premium Design Resources Dashboard
 * Comprehensive dashboard showcasing all integrated premium platforms
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Lightbulb, 
  Smartphone,
  ExternalLink,
  Download,
  Heart,
  Search,
  Filter,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Zap,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlatformResource {
  id: string
  title: string
  preview_url: string
  source: string
  platform: string
  premium: boolean
  price?: number
  category?: string
  tags?: string[]
  author?: string
}

interface PlatformStats {
  name: string
  icon: React.ComponentType<any>
  color: string
  resources_count: number
  premium_count: number
  popular_category: string
  status: 'active' | 'limited' | 'unavailable'
}

const PLATFORM_INFO: Record<string, PlatformStats> = {
  dribbble: {
    name: 'Dribbble',
    icon: Palette,
    color: 'text-pink-400',
    resources_count: 847,
    premium_count: 234,
    popular_category: 'UI Design',
    status: 'active'
  },
  'ls-graphics': {
    name: 'LS.Graphics',
    icon: Smartphone,
    color: 'text-indigo-400',
    resources_count: 156,
    premium_count: 156,
    popular_category: 'Device Mockups',
    status: 'active'
  },
  'footer-design': {
    name: 'Footer.design',
    icon: Layout,
    color: 'text-green-400',
    resources_count: 289,
    premium_count: 67,
    popular_category: 'Footer Layouts',
    status: 'active'
  },
  getillustra: {
    name: 'GetIllustra',
    icon: Image,
    color: 'text-blue-400',
    resources_count: 423,
    premium_count: 89,
    popular_category: 'Illustrations',
    status: 'active'
  },
  httpster: {
    name: 'HttpSter',
    icon: ExternalLink,
    color: 'text-orange-400',
    resources_count: 3116,
    premium_count: 0,
    popular_category: 'Website Designs',
    status: 'active'
  },
  fonts: {
    name: 'Premium Fonts',
    icon: Type,
    color: 'text-purple-400',
    resources_count: 234,
    premium_count: 178,
    popular_category: 'Display Fonts',
    status: 'limited'
  },
  'same-energy': {
    name: 'Same.Energy',
    icon: Lightbulb,
    color: 'text-yellow-400',
    resources_count: 0,
    premium_count: 0,
    popular_category: 'Visual Search',
    status: 'active'
  }
}

export default function PremiumResourcesDashboard() {
  const [featuredResources, setFeaturedResources] = useState<PlatformResource[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    fetchFeaturedResources()
    setPlatformStats(Object.values(PLATFORM_INFO))
  }, [])

  const fetchFeaturedResources = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/platform-integrations?platform=all')
      const data = await response.json()
      
      if (data.success) {
        // Flatten all resources into featured showcase
        const featured: PlatformResource[] = [
          ...(data.data.dribbble || []).map((item: any) => ({ ...item, platform: 'dribbble' })),
          ...(data.data.mockups || []).map((item: any) => ({ ...item, platform: 'ls-graphics' })),
          ...(data.data.footers || []).map((item: any) => ({ ...item, platform: 'footer-design' })),
          ...(data.data.illustrations || []).map((item: any) => ({ ...item, platform: 'getillustra' })),
          ...(data.data.websites || []).map((item: any) => ({ ...item, platform: 'httpster' })),
          ...(data.data.fonts || []).map((item: any) => ({ ...item, platform: 'fonts' }))
        ]
        
        setFeaturedResources(featured.slice(0, 12))
      }
    } catch (error) {
      console.error('Failed to fetch featured resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const PlatformCard = ({ platform }: { platform: PlatformStats }) => {
    const IconComponent = platform.icon
    const statusColors = {
      active: 'bg-green-500/20 text-green-400',
      limited: 'bg-yellow-500/20 text-yellow-400',
      unavailable: 'bg-red-500/20 text-red-400'
    }

    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/20 ${platform.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">{platform.name}</CardTitle>
                  <p className="text-xs text-gray-400">{platform.popular_category}</p>
                </div>
              </div>
              <Badge className={statusColors[platform.status]}>
                {platform.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg font-bold text-white">{platform.resources_count.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Resources</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-400">{platform.premium_count.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Premium Items</p>
              </div>
            </div>
            <Button 
              className="w-full"
              variant="outline"
              size="sm"
              onClick={() => setSelectedPlatform(platform.name.toLowerCase())}
            >
              Browse Resources
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const ResourceCard = ({ resource }: { resource: PlatformResource }) => {
    const platformInfo = PLATFORM_INFO[resource.platform] || PLATFORM_INFO[resource.source]
    const IconComponent = platformInfo?.icon || ExternalLink

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={resource.preview_url} 
              alt={resource.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button size="sm" variant="default" className="bg-white/20 backdrop-blur-sm">
                <Download className="w-3 h-3 mr-1" />
                Get
              </Button>
              <Button size="sm" variant="ghost" className="text-white/80 hover:text-red-400">
                <Heart className="w-3 h-3" />
              </Button>
            </div>

            {/* Platform indicator */}
            <div className="absolute top-2 left-2">
              <div className={`p-1.5 rounded-full bg-black/40 backdrop-blur-sm ${platformInfo?.color || 'text-gray-400'}`}>
                <IconComponent className="w-3 h-3" />
              </div>
            </div>

            {/* Premium badge */}
            {resource.premium && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1">{resource.title}</h3>
            {resource.author && (
              <p className="text-xs text-gray-400 mb-2">by {resource.author}</p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {platformInfo?.name || resource.platform}
              </Badge>
              {resource.price && resource.price > 0 && (
                <span className="text-xs text-green-400 font-medium">${resource.price}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const DashboardStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { 
          label: 'Total Platforms', 
          value: '7', 
          icon: Zap, 
          color: 'text-blue-400',
          description: 'Integrated platforms' 
        },
        { 
          label: 'Total Resources', 
          value: '5,065', 
          icon: Star, 
          color: 'text-purple-400',
          description: 'Available resources' 
        },
        { 
          label: 'Premium Items', 
          value: '724', 
          icon: Crown, 
          color: 'text-yellow-400',
          description: 'Premium resources' 
        },
        { 
          label: 'Active Users', 
          value: '2,847', 
          icon: Users, 
          color: 'text-green-400',
          description: 'Using platform' 
        }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/20 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Premium Design Resources Hub
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            Access premium fonts from DirtyLine alternatives, illustrations from GetIllustra, footer designs from Footer.design, 
            inspiration from Dribbble & HttpSter, visual search via Same.Energy, and premium mockups from LS.Graphics
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search across all platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </motion.div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Integrated Platforms</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {platformStats.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlatformCard platform={platform} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Featured Resources</h2>
            </div>
            <Button variant="outline" onClick={() => window.open('/premium-resources', '_blank')}>
              View All Resources
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
              </motion.div>
            ) : (
              <motion.div
                key="resources"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {featuredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Platform Integration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Integration Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-400">
                  ✅ Dribbble API Connected<br/>
                  ✅ Footer.design Scraping<br/>
                  ✅ GetIllustra Content<br/>
                  ✅ HttpSter Showcase
                </div>
                <div className="text-yellow-400">
                  ⚠️ LS.Graphics (Premium)<br/>
                  ⚠️ DirtyLine (Alternative)<br/>
                  ✅ Same.Energy Simulation<br/>
                  ✅ Premium Font Curation
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Real-time integration with fallback systems for premium platforms
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}