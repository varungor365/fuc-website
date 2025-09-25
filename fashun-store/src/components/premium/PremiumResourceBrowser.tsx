/**
 * Premium Resource Browser
 * Comprehensive browser for all integrated premium design resources
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Download, 
  Heart, 
  Star, 
  ExternalLink, 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Lightbulb,
  Smartphone,
  Crown,
  Zap,
  Grid3x3,
  List,
  ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ResourceItem {
  id: string
  title: string
  preview_url: string
  category: string
  source: string
  premium: boolean
  price?: number
  tags: string[]
  description?: string
  type?: string
}

const RESOURCE_SOURCES = {
  dirtyline: { name: 'DirtyLine', icon: Type, color: 'text-purple-400' },
  getillustra: { name: 'GetIllustra', icon: Image, color: 'text-blue-400' },
  footer_design: { name: 'Footer.design', icon: Layout, color: 'text-green-400' },
  dribbble: { name: 'Dribbble', icon: Palette, color: 'text-pink-400' },
  httpster: { name: 'HttpSter', icon: ExternalLink, color: 'text-orange-400' },
  same_energy: { name: 'Same.Energy', icon: Lightbulb, color: 'text-yellow-400' },
  ls_graphics: { name: 'LS.Graphics', icon: Smartphone, color: 'text-indigo-400' }
}

const RESOURCE_CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: Grid3x3 },
  { id: 'fonts', name: 'Premium Fonts', icon: Type },
  { id: 'illustrations', name: 'Illustrations', icon: Image },
  { id: 'footers', name: 'Footer Designs', icon: Layout },
  { id: 'inspirations', name: 'Design Inspiration', icon: Lightbulb },
  { id: 'mockups', name: 'Device Mockups', icon: Smartphone }
]

export default function PremiumResourceBrowser() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null)

  // Fetch resources based on current filters
  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'all') params.set('type', activeTab)
      if (selectedSource !== 'all') params.set('source', selectedSource)
      if (searchQuery) params.set('query', searchQuery)

      const response = await fetch(`/api/premium-resources?${params}`)
      const data = await response.json()

      if (data.success) {
        // Flatten the data structure if it's a search result
        if (data.data.fonts) {
          const allResources = [
            ...data.data.fonts.map((item: any) => ({ ...item, type: 'font' })),
            ...data.data.illustrations.map((item: any) => ({ ...item, type: 'illustration' })),
            ...data.data.footers.map((item: any) => ({ ...item, type: 'footer' })),
            ...data.data.inspirations.map((item: any) => ({ ...item, type: 'inspiration' })),
            ...data.data.mockups.map((item: any) => ({ ...item, type: 'mockup' }))
          ]
          setResources(allResources)
        } else {
          setResources(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setLoading(false)
    }
  }, [activeTab, selectedSource, searchQuery])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const handleDownload = async (resource: ResourceItem) => {
    try {
      const response = await fetch('/api/premium-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'download',
          resourceType: resource.type,
          resourceId: resource.id,
          userId: 'current_user' // Replace with actual user ID
        })
      })

      const data = await response.json()
      if (data.success) {
        window.open(data.download_url, '_blank')
      } else {
        // Handle premium upgrade requirement
        if (data.upgrade_url) {
          window.open(data.upgrade_url, '_blank')
        }
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
    const SourceIcon = RESOURCE_SOURCES[resource.source as keyof typeof RESOURCE_SOURCES]?.icon || ExternalLink
    const sourceColor = RESOURCE_SOURCES[resource.source as keyof typeof RESOURCE_SOURCES]?.color || 'text-gray-400'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleDownload(resource)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFavorite(resource.id)}
                className={`${favorites.includes(resource.id) ? 'text-red-400' : 'text-white/60'} hover:text-red-400`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(resource.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Premium badge */}
            {resource.premium && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}

            {/* Source indicator */}
            <div className="absolute top-2 left-2">
              <div className={`p-1.5 rounded-full bg-black/40 backdrop-blur-sm ${sourceColor}`}>
                <SourceIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white text-sm line-clamp-1">{resource.title}</h3>
              {resource.price && (
                <span className="text-xs text-green-400 font-medium">${resource.price}</span>
              )}
            </div>

            {resource.description && (
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{resource.description}</p>
            )}

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {resource.category}
              </Badge>
              <div className="flex gap-1">
                {resource.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const ResourceStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Resources', value: '2,847', icon: Grid3x3, color: 'text-blue-400' },
        { label: 'Premium Items', value: '1,923', icon: Crown, color: 'text-purple-400' },
        { label: 'Free Resources', value: '924', icon: Zap, color: 'text-green-400' },
        { label: 'New This Week', value: '47', icon: Star, color: 'text-yellow-400' }
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
                  <p className="text-lg font-bold text-white">{stat.value}</p>
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
            Premium Design Resources
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access premium fonts, illustrations, mockups, and design inspiration from top platforms
          </p>
        </motion.div>

        {/* Stats */}
        <ResourceStats />

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search fonts, illustrations, mockups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Source Filter */}
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-48 bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {Object.entries(RESOURCE_SOURCES).map(([key, source]) => (
                  <SelectItem key={key} value={key}>{source.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex bg-black/20 rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Resource Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6 bg-black/20 backdrop-blur-sm">
            {RESOURCE_CATEGORIES.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2 text-xs"
              >
                <category.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Resource Grid */}
          <div className="mt-8">
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
                  key={`${activeTab}-${selectedSource}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  } gap-6`}
                >
                  {resources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!loading && resources.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              </motion.div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}