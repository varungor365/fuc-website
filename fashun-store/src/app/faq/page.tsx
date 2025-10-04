'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const categories = [
    { id: 'all', label: 'All Questions', icon: QuestionMarkCircleIcon },
    { id: 'orders', label: 'Orders & Shipping', icon: QuestionMarkCircleIcon },
    { id: 'products', label: 'Products & Sizing', icon: QuestionMarkCircleIcon },
    { id: 'returns', label: 'Returns & Exchanges', icon: QuestionMarkCircleIcon },
    { id: 'account', label: 'Account & Payment', icon: QuestionMarkCircleIcon },
    { id: 'general', label: 'General', icon: QuestionMarkCircleIcon }
  ]

  const faqs = [
    // Orders & Shipping
    {
      id: 'order-1',
      category: 'orders',
      question: 'How long does shipping take?',
      answer: 'We offer multiple shipping options: Standard delivery (5-7 business days), Express delivery (2-3 business days), and Same-day delivery (available in select cities). All orders are processed within 24 hours.'
    },
    {
      id: 'order-2',
      category: 'orders',
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within India only. We are working on expanding our international shipping options. Please subscribe to our newsletter to be notified when international shipping becomes available.'
    },
    {
      id: 'order-3',
      category: 'orders',
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order in real-time through your account dashboard or by entering your order number on our tracking page.'
    },
    {
      id: 'order-4',
      category: 'orders',
      question: 'What if my order is delayed?',
      answer: 'While we strive for timely delivery, occasional delays may occur due to weather or logistics issues. We\'ll notify you immediately if there are any delays and provide updated delivery estimates.'
    },

    // Products & Sizing
    {
      id: 'product-1',
      category: 'products',
      question: 'How do I choose the right size?',
      answer: 'Use our interactive size guide which includes detailed measurements for each product category. You can also use our AI size finder tool that recommends the best fit based on your measurements and preferences.'
    },
    {
      id: 'product-2',
      category: 'products',
      question: 'Are your products ethically made?',
      answer: 'Yes, we are committed to ethical manufacturing. All our products are made in certified facilities that follow fair labor practices and environmental standards. We regularly audit our supply chain to ensure compliance.'
    },
    {
      id: 'product-3',
      category: 'products',
      question: 'What materials do you use?',
      answer: 'We use premium materials including 100% organic cotton, recycled polyester, and sustainable blends. Each product page includes detailed material composition and care instructions.'
    },
    {
      id: 'product-4',
      category: 'products',
      question: 'Do you restock sold-out items?',
      answer: 'Popular items are regularly restocked. You can sign up for restock notifications on any sold-out product page. Limited edition items may not be restocked, so we recommend following our social media for updates.'
    },

    // Returns & Exchanges
    {
      id: 'return-1',
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all items in original condition with tags attached. Returns are free for defective items, while customer-initiated returns have a small processing fee.'
    },
    {
      id: 'return-2',
      category: 'returns',
      question: 'How do I initiate a return?',
      answer: 'Log into your account, go to your order history, and click "Return Item" next to the product you want to return. Follow the prompts to print a return label and schedule pickup or drop-off.'
    },
    {
      id: 'return-3',
      category: 'returns',
      question: 'When will I receive my refund?',
      answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method or store credit, based on your preference.'
    },
    {
      id: 'return-4',
      category: 'returns',
      question: 'Can I exchange for a different size?',
      answer: 'Yes! You can exchange for a different size or color within 30 days. Simply select "Exchange" instead of "Return" when initiating the process. We\'ll send the new item once we receive your return.'
    },

    // Account & Payment
    {
      id: 'account-1',
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top navigation, enter your email and create a password. You can also sign up using your Google or Facebook account for faster registration.'
    },
    {
      id: 'account-2',
      category: 'account',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI payments, net banking, and digital wallets including Paytm, PhonePe, and Google Pay. We also offer EMI options on orders above ₹3,000.'
    },
    {
      id: 'account-3',
      category: 'account',
      question: 'Is my payment information secure?',
      answer: 'Absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. We never store your complete card details on our servers and all transactions are processed through secure payment gateways.'
    },
    {
      id: 'account-4',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours for security reasons.'
    },

    // General
    {
      id: 'general-1',
      category: 'general',
      question: 'Do you have a loyalty program?',
      answer: 'Yes! Our FASHUN Rewards program lets you earn points on every purchase, refer friends, and engage with our community. Points can be redeemed for discounts and exclusive access to new collections.'
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'How can I stay updated with new releases?',
      answer: 'Subscribe to our newsletter, follow us on social media (@fashun.co), or enable push notifications on our website. We also recommend creating an account to get personalized recommendations.'
    },
    {
      id: 'general-3',
      category: 'general',
      question: 'Do you offer gift cards?',
      answer: 'Yes, we offer digital gift cards in denominations from ₹500 to ₹10,000. Perfect for gifting! Gift cards never expire and can be used multiple times until the balance is exhausted.'
    },
    {
      id: 'general-4',
      category: 'general',
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 1 hour of placing it through your account dashboard. After that, the order enters processing and can only be returned after delivery.'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/t-shirts/tshirt-1-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <QuestionMarkCircleIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Frequently Asked
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions. Can't find what you're looking for? 
              Our support team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-accent-500 text-primary-900'
                      : 'bg-primary-800/30 text-primary-200 hover:bg-primary-700/50 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <QuestionMarkCircleIcon className="w-16 h-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">No questions found</h3>
              <p className="text-primary-300">Try adjusting your search or browse different categories.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary-800/20 transition-colors"
                  >
                    <span className="text-white font-semibold text-lg">{faq.question}</span>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-accent-400 transition-transform ${
                        openItems.includes(faq.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10"
                    >
                      <div className="px-6 py-4 text-primary-200 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8 text-center"
        >
          <ChatBubbleLeftRightIcon className="w-12 h-12 text-accent-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-primary-200 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is available 24/7 
            to help you with any questions or concerns.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Live Chat</h3>
              <p className="text-primary-300 text-sm mb-4">Get instant help from our support team</p>
              <button className="w-full btn btn-glass btn-sm">Start Chat</button>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <EnvelopeIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Email Support</h3>
              <p className="text-primary-300 text-sm mb-4">Response within 24 hours</p>
              <button className="w-full btn btn-ghost btn-sm text-white border-white/30">Send Email</button>
            </div>
            
            <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <PhoneIcon className="w-8 h-8 text-accent-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Phone Support</h3>
              <p className="text-primary-300 text-sm mb-4">Mon-Fri, 9 AM - 6 PM IST</p>
              <button className="w-full btn btn-ghost btn-sm text-white border-white/30">Call Now</button>
            </div>
          </div>
        </motion.div>

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(1).map((category, index) => {
              const IconComponent = category.icon
              const categoryCount = faqs.filter(faq => faq.category === category.id).length
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-accent-400/50 transition-all group"
                >
                  <IconComponent className="w-8 h-8 text-accent-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold mb-2">{category.label}</h3>
                  <p className="text-primary-300 text-sm">{categoryCount} questions</p>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </main>
  )
}