'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDownIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

interface FAQItem {
  id: string
  question: string
  answer: string
  category?: string
}

interface FAQProps {
  variant?: 'default' | 'searchable' | 'categorized'
  faqs?: FAQItem[]
}

const defaultFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'What makes FASHUN different from other fashion brands?',
    answer: 'FASHUN combines cutting-edge AI technology with premium streetwear design. Our Smart Shopping experience personalizes recommendations, while our limited-edition collections ensure exclusivity. Every piece is crafted with attention to detail and sustainable practices.',
    category: 'About FASHUN'
  },
  {
    id: '2',
    question: 'How does the AI-powered style recommendation work?',
    answer: 'Our AI analyzes your browsing history, purchase patterns, body type, and style preferences to suggest products that match your aesthetic. The more you shop, the smarter our recommendations become, helping you discover pieces you\'ll love.',
    category: 'Technology'
  },
  {
    id: '3',
    question: 'What are your shipping and delivery options?',
    answer: 'We offer free standard shipping on orders over ₹2,500 (3-5 business days) and express delivery within 24-48 hours for major cities. All orders are tracked and securely packaged to ensure safe delivery.',
    category: 'Shipping'
  },
  {
    id: '4',
    question: 'What is your return and exchange policy?',
    answer: 'We offer a 30-day hassle-free return and exchange policy. Items must be in original condition with tags attached. Limited edition items can be returned within 14 days. Return shipping is free for defective items.',
    category: 'Returns'
  },
  {
    id: '5',
    question: 'How do I determine my size for FASHUN products?',
    answer: 'Each product page includes a detailed size guide with measurements. Our AI can also recommend sizes based on your previous purchases and body measurements. When in doubt, our customer support team is happy to help.',
    category: 'Sizing'
  },
  {
    id: '6',
    question: 'Are FASHUN products sustainable and ethically made?',
    answer: 'Yes! We\'re committed to sustainable fashion. Our products use eco-friendly materials, ethical manufacturing processes, and minimal packaging. We partner with certified suppliers who share our values of fair labor practices.',
    category: 'Sustainability'
  },
  {
    id: '7',
    question: 'How often do you release new collections?',
    answer: 'We launch new seasonal collections quarterly, with limited-edition drops monthly. Our AI helps predict trends, ensuring fresh, relevant designs. VIP members get early access to all new releases.',
    category: 'Collections'
  },
  {
    id: '8',
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship across India with plans to expand internationally soon. We\'re working on partnerships to bring FASHUN to fashion enthusiasts worldwide. Join our newsletter for updates on international availability.',
    category: 'Shipping'
  },
  {
    id: '9',
    question: 'How can I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track orders in real-time through your account dashboard or our order tracking page.',
    category: 'Orders'
  },
  {
    id: '10',
    question: 'Do you offer personalization or customization services?',
    answer: 'Yes! We offer embroidery, printing, and minor alterations for select items. Our premium customization service lets you create unique pieces. Contact our design team to discuss your vision.',
    category: 'Customization'
  }
]

const categories = ['All', 'About FASHUN', 'Technology', 'Shipping', 'Returns', 'Sizing', 'Sustainability', 'Collections', 'Orders', 'Customization']

export default function FAQ({ variant = 'default', faqs = defaultFAQs }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (variant === 'searchable') {
    return (
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <QuestionMarkCircleIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Frequently Asked
              <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                {' '}Questions
              </span>
            </h2>
            <p className="text-xl text-primary-200">
              Find quick answers to common questions about FASHUN
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-12"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="w-full bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50"
              />
            </div>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-primary-800/30 transition-colors"
                >
                  <span className="text-white font-semibold pr-4">{faq.question}</span>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-primary-400 transition-transform flex-shrink-0 ${
                      openItems.has(faq.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-primary-200 leading-relaxed border-t border-white/10 pt-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                <QuestionMarkCircleIcon className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">No Results Found</h3>
                <p className="text-primary-300 mb-8">
                  We couldn't find any FAQs matching your search. Try different keywords or contact our support team.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'categorized') {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Help Center
            </h2>
            <p className="text-xl text-primary-200">
              Browse by category or search for specific topics
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-accent-500 text-primary-900'
                    : 'bg-primary-800/30 text-primary-300 hover:text-white border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mb-12 max-w-2xl mx-auto"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="w-full bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50"
              />
            </div>
          </motion.div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-6 text-left flex items-start justify-between hover:bg-primary-800/30 transition-colors"
                >
                  <div className="pr-4">
                    {faq.category && (
                      <span className="text-xs text-accent-400 font-medium mb-2 block">
                        {faq.category}
                      </span>
                    )}
                    <span className="text-white font-semibold">{faq.question}</span>
                  </div>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-primary-400 transition-transform flex-shrink-0 mt-1 ${
                      openItems.has(faq.id) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-primary-200 leading-relaxed border-t border-white/10 pt-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Default variant
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <QuestionMarkCircleIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Got Questions?
            <span className="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              {' '}We\'ve Got Answers
            </span>
          </h2>
          <p className="text-xl text-primary-200 max-w-3xl mx-auto">
            Everything you need to know about shopping with FASHUN, from sizing to sustainability
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-accent-400/30 transition-all"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-primary-800/30 transition-colors group"
              >
                <span className="text-white font-semibold text-lg pr-4 group-hover:text-accent-400 transition-colors">
                  {faq.question}
                </span>
                <ChevronDownIcon 
                  className={`w-6 h-6 text-primary-400 transition-all flex-shrink-0 group-hover:text-accent-400 ${
                    openItems.has(faq.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openItems.has(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-primary-200 leading-relaxed border-t border-white/10 pt-6 text-lg">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <h3 className="text-2xl font-semibold text-white mb-4">Still Have Questions?</h3>
            <p className="text-primary-300 mb-8">
              Our customer support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-glass">
                Contact Support
              </button>
              <button className="btn btn-outline">
                Live Chat
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}