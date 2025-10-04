'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  NewspaperIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Posts', count: 24 },
    { id: 'fashion', label: 'Fashion Trends', count: 8 },
    { id: 'streetwear', label: 'Streetwear', count: 6 },
    { id: 'styling', label: 'Styling Tips', count: 5 },
    { id: 'brand', label: 'Brand News', count: 3 },
    { id: 'lifestyle', label: 'Lifestyle', count: 2 }
  ]

  const blogPosts = [
    {
      id: 'post-1',
      title: 'The Evolution of Streetwear: From Underground to Mainstream',
      excerpt: 'Explore how streetwear transformed from a subculture movement to a global fashion phenomenon that influences luxury brands and high fashion.',
      category: 'streetwear',
      author: 'Arjun Sharma',
      date: '2024-01-15',
      readTime: '8 min read',
      views: 1240,
      comments: 23,
      likes: 156,
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      tags: ['streetwear', 'fashion history', 'culture'],
      featured: true
    },
    {
      id: 'post-2',
      title: 'Sustainable Fashion: Why Eco-Friendly Streetwear Matters',
      excerpt: 'Discover how sustainable practices are reshaping the streetwear industry and why conscious consumers are driving this change.',
      category: 'fashion',
      author: 'Priya Patel',
      date: '2024-01-12',
      readTime: '6 min read',
      views: 892,
      comments: 34,
      likes: 98,
      image: '/images/products/t-shirts/tshirt-1-main.jpg',
      tags: ['sustainability', 'eco-fashion', 'environment'],
      featured: false
    },
    {
      id: 'post-3',
      title: 'How to Style Oversized Hoodies: 5 Fresh Looks for 2024',
      excerpt: 'Master the art of styling oversized hoodies with these versatile outfit combinations that work for any occasion.',
      category: 'styling',
      author: 'Rohit Kumar',
      date: '2024-01-10',
      readTime: '5 min read',
      views: 2150,
      comments: 67,
      likes: 234,
      image: '/images/products/hoodies/hoodie-2-main.jpg',
      tags: ['styling', 'hoodies', 'outfit ideas'],
      featured: false
    },
    {
      id: 'post-4',
      title: 'FASHUN x Local Artists: Celebrating Indian Street Art',
      excerpt: 'We collaborate with talented local artists to create unique designs that celebrate Indian street art culture.',
      category: 'brand',
      author: 'Team FASHUN',
      date: '2024-01-08',
      readTime: '4 min read',
      views: 756,
      comments: 19,
      likes: 87,
      image: '/images/products/t-shirts/tshirt-2-main.jpg',
      tags: ['collaboration', 'art', 'community'],
      featured: false
    },
    {
      id: 'post-5',
      title: 'The Psychology of Color in Streetwear Fashion',
      excerpt: 'Understanding how colors influence perception and mood in streetwear choices, and what your color preferences say about you.',
      category: 'fashion',
      author: 'Dr. Meera Singh',
      date: '2024-01-05',
      readTime: '7 min read',
      views: 1080,
      comments: 28,
      likes: 142,
      image: '/images/products/accessories/cap-1-main.jpg',
      tags: ['psychology', 'color theory', 'fashion'],
      featured: false
    },
    {
      id: 'post-6',
      title: 'Building a Capsule Wardrobe: Essential Streetwear Pieces',
      excerpt: 'Create a versatile and sustainable wardrobe with these essential streetwear pieces that work for every season.',
      category: 'lifestyle',
      author: 'Sneha Reddy',
      date: '2024-01-03',
      readTime: '6 min read',
      views: 1456,
      comments: 45,
      likes: 189,
      image: '/images/products/shoes/sneaker-1-main.jpg',
      tags: ['wardrobe', 'essentials', 'minimalism'],
      featured: false
    }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <NewspaperIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              FASHUN
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Journal
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Stay updated with the latest in streetwear fashion, styling tips, 
              brand stories, and cultural insights.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-8 p-8">
                <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-500 text-primary-900 px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-4 text-primary-300 text-sm mb-4">
                    <span className="bg-primary-800/50 text-accent-400 px-3 py-1 rounded-full capitalize">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-primary-200 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-6 text-primary-300 text-sm">
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{featuredPost.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        <span>{featuredPost.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HeartIcon className="w-4 h-4" />
                        <span>{featuredPost.likes}</span>
                      </div>
                    </div>
                    <span className="text-accent-400 text-sm">{featuredPost.readTime}</span>
                  </div>
                  
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="btn btn-glass w-fit"
                  >
                    Read Full Article
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-accent-500 text-primary-900'
                    : 'bg-primary-800/30 text-primary-200 hover:bg-primary-700/50 hover:text-white'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-accent-400/50 transition-all group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-900/80 backdrop-blur-sm text-accent-400 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                    <HeartIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between text-primary-300 text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-accent-400 transition-colors">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-primary-200 text-sm mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-primary-300 text-sm">
                    <UserIcon className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-primary-300 text-sm">
                    <div className="flex items-center space-x-1">
                      <EyeIcon className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChatBubbleLeftIcon className="w-3 h-3" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-800/50 text-primary-300 rounded-lg text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.id}`}
                  className="text-accent-400 hover:text-accent-300 font-semibold text-sm flex items-center"
                >
                  Read More
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center"
        >
          <NewspaperIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Stay in the Loop</h2>
          <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter and never miss the latest fashion insights, 
            styling tips, and brand updates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50"
            />
            <button className="btn btn-glass px-8">
              Subscribe
            </button>
          </div>
          
          <p className="text-primary-400 text-sm mt-3">
            Join 5,000+ fashion enthusiasts who get our weekly updates
          </p>
        </motion.div>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Popular Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['streetwear', 'fashion trends', 'styling tips', 'sustainability', 'brand stories', 'culture', 'lifestyle', 'outfit ideas'].map((tag) => (
              <button
                key={tag}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 text-primary-200 px-4 py-2 rounded-xl hover:border-accent-400/50 hover:text-accent-400 transition-all"
              >
                <TagIcon className="w-4 h-4 inline-block mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}