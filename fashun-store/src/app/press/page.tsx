'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  NewspaperIcon,
  PlayIcon,
  PhotoIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  EyeIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  MegaphoneIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function PressMediaPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const pressReleases = [
    {
      id: 1,
      title: 'FASHUN Raises ₹50 Crore Series A to Revolutionize Streetwear E-commerce in India',
      category: 'funding',
      date: '2024-01-15',
      excerpt: 'Leading streetwear platform secures significant funding to expand operations across tier-2 cities and enhance AI-powered personalization features.',
      image: '/api/placeholder/600/300',
      readTime: '3 min read',
      views: '12.5K'
    },
    {
      id: 2,
      title: 'FASHUN Partners with 50+ International Streetwear Brands for Exclusive Indian Launch',
      category: 'partnerships',
      date: '2024-01-08',
      excerpt: 'Platform announces exclusive partnerships bringing premium global streetwear brands to Indian consumers for the first time.',
      image: '/api/placeholder/600/300',
      readTime: '2 min read',
      views: '8.2K'
    },
    {
      id: 3,
      title: 'FASHUN Hits 1 Million Users Milestone, Becomes India\'s Fastest Growing Streetwear Platform',
      category: 'milestones',
      date: '2023-12-20',
      excerpt: 'Platform reaches significant user milestone just 18 months after launch, with 300% year-over-year growth in customer base.',
      image: '/api/placeholder/600/300',
      readTime: '4 min read',
      views: '15.8K'
    },
    {
      id: 4,
      title: 'CEO Speaks at India Fashion Week: "Streetwear is the Future of Indian Fashion"',
      category: 'events',
      date: '2023-12-05',
      excerpt: 'FASHUN\'s founder delivers keynote on democratizing fashion and the rise of streetwear culture among Indian youth.',
      image: '/api/placeholder/600/300',
      readTime: '5 min read',
      views: '6.1K'
    },
    {
      id: 5,
      title: 'FASHUN Launches AI-Powered Style Recommendation Engine',
      category: 'product',
      date: '2023-11-22',
      excerpt: 'Revolutionary AI technology personalizes shopping experience, increasing customer satisfaction by 40% and reducing return rates.',
      image: '/api/placeholder/600/300',
      readTime: '3 min read',
      views: '9.4K'
    },
    {
      id: 6,
      title: 'FASHUN Wins "Best E-commerce Innovation" at Digital India Awards 2023',
      category: 'awards',
      date: '2023-11-10',
      excerpt: 'Platform recognized for innovative approach to fashion retail and contribution to India\'s digital commerce ecosystem.',
      image: '/api/placeholder/600/300',
      readTime: '2 min read',
      views: '7.3K'
    }
  ]

  const mediaAssets = [
    {
      type: 'logo',
      title: 'FASHUN Logo Pack',
      description: 'High-resolution logos in various formats',
      files: ['PNG', 'SVG', 'EPS'],
      size: '2.1 MB'
    },
    {
      type: 'photos',
      title: 'Company Photos',
      description: 'Office spaces, team photos, events',
      files: ['High-res JPG'],
      size: '15.3 MB'
    },
    {
      type: 'executives',
      title: 'Executive Headshots',
      description: 'Leadership team professional photos',
      files: ['PNG', 'JPG'],
      size: '4.7 MB'
    },
    {
      type: 'products',
      title: 'Product Photography',
      description: 'Lifestyle and product shots',
      files: ['JPG', 'PNG'],
      size: '28.5 MB'
    }
  ]

  const mediaStats = [
    { label: 'Press Mentions', value: '150+', icon: NewspaperIcon },
    { label: 'Media Interviews', value: '25+', icon: PlayIcon },
    { label: 'Industry Awards', value: '8', icon: TrophyIcon },
    { label: 'Conference Talks', value: '12+', icon: UserGroupIcon }
  ]

  const executives = [
    {
      name: 'Arjun Sharma',
      role: 'Co-Founder & CEO',
      bio: 'Former McKinsey consultant with 8+ years in fashion retail. Led digital transformation at major fashion houses.',
      image: '/api/placeholder/200/200',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Priya Patel',
      role: 'Co-Founder & CTO',
      bio: 'Ex-Google engineer with expertise in AI/ML and e-commerce platforms. Built scalable systems serving millions.',
      image: '/api/placeholder/200/200',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Rohit Gupta',
      role: 'Head of Marketing',
      bio: 'Former Nike and Adidas marketing leader. Expert in youth culture and streetwear brand building.',
      image: '/api/placeholder/200/200',
      linkedin: '#',
      twitter: '#'
    }
  ]

  const categories = ['funding', 'partnerships', 'milestones', 'events', 'product', 'awards']

  const filteredPressReleases = selectedCategory === 'all' 
    ? pressReleases 
    : pressReleases.filter(release => release.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    const colors = {
      funding: 'bg-green-500/20 text-green-400',
      partnerships: 'bg-blue-500/20 text-blue-400',
      milestones: 'bg-purple-500/20 text-purple-400',
      events: 'bg-orange-500/20 text-orange-400',
      product: 'bg-accent-500/20 text-accent-400',
      awards: 'bg-yellow-500/20 text-yellow-400'
    }
    return colors[category as keyof typeof colors] || 'bg-primary-500/20 text-primary-400'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NewspaperIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Press &
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Media
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Stay updated with FASHUN's journey, milestones, and impact on India's 
              streetwear and e-commerce landscape.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Media Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-4 gap-6">
            {mediaStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className="bg-accent-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-primary-300 text-sm">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Press Releases */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Latest News</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-accent-500 text-primary-900'
                        : 'bg-primary-700/30 text-primary-300 hover:bg-primary-600/30'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize ${
                        selectedCategory === category
                          ? 'bg-accent-500 text-primary-900'
                          : 'bg-primary-700/30 text-primary-300 hover:bg-primary-600/30'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {filteredPressReleases.map((release, index) => (
                  <motion.article
                    key={release.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-accent-400/30 transition-all group"
                  >
                    <div className="aspect-video bg-primary-800/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getCategoryColor(release.category)}`}>
                          {release.category}
                        </span>
                        <div className="flex items-center text-white/70 text-xs">
                          <EyeIcon className="w-3 h-3 mr-1" />
                          {release.views}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-primary-400 text-sm mb-3">
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(release.date).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <span>•</span>
                        <span>{release.readTime}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-accent-400 transition-colors">
                        {release.title}
                      </h3>
                      
                      <p className="text-primary-200 mb-4 line-clamp-2">
                        {release.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button className="text-accent-400 hover:text-accent-300 text-sm font-medium flex items-center transition-colors">
                          Read More
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                        </button>
                        
                        <button className="p-2 hover:bg-primary-700/30 rounded-lg transition-colors">
                          <ShareIcon className="w-4 h-4 text-primary-400" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Media Assets */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <PhotoIcon className="w-5 h-5 mr-2 text-accent-400" />
                Media Kit
              </h3>
              
              <div className="space-y-4">
                {mediaAssets.map((asset, index) => (
                  <div key={asset.title} className="bg-primary-800/30 rounded-xl p-4 hover:bg-primary-700/30 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium">{asset.title}</h4>
                      <button className="p-1 hover:bg-primary-600/30 rounded transition-colors">
                        <DocumentArrowDownIcon className="w-4 h-4 text-accent-400" />
                      </button>
                    </div>
                    <p className="text-primary-300 text-sm mb-2">{asset.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-2">
                        {asset.files.map(format => (
                          <span key={format} className="bg-primary-600/30 text-primary-200 px-2 py-1 rounded">
                            {format}
                          </span>
                        ))}
                      </div>
                      <span className="text-primary-400">{asset.size}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 btn btn-glass">
                Download Complete Kit
              </button>
            </motion.div>

            {/* Leadership Team */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2 text-accent-400" />
                Leadership
              </h3>
              
              <div className="space-y-6">
                {executives.map((exec, index) => (
                  <div key={exec.name} className="text-center">
                    <div className="w-16 h-16 bg-primary-700/50 rounded-full mx-auto mb-3 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-accent-400/20 to-primary-600/20" />
                    </div>
                    <h4 className="text-white font-medium">{exec.name}</h4>
                    <p className="text-accent-400 text-sm mb-2">{exec.role}</p>
                    <p className="text-primary-300 text-xs leading-relaxed">{exec.bio}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Media Contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MegaphoneIcon className="w-5 h-5 mr-2 text-accent-400" />
                Media Inquiries
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-primary-200 font-medium">Press Contact</p>
                  <p className="text-primary-300">media@fashun.co.in</p>
                </div>
                
                <div>
                  <p className="text-primary-200 font-medium">Partnership Inquiries</p>
                  <p className="text-primary-300">partnerships@fashun.co.in</p>
                </div>
                
                <div>
                  <p className="text-primary-200 font-medium">General Contact</p>
                  <p className="text-primary-300">hello@fashun.co.in</p>
                </div>
              </div>
              
              <button className="w-full mt-6 btn btn-outline">
                Contact Us
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}