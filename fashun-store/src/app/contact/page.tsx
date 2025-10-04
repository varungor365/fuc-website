'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Our Location',
      info: 'Mumbai, Maharashtra, India',
      details: 'Building the future from the heart of India'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      info: '+91 98765 43210',
      details: 'Mon-Fri 9AM-7PM IST'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      info: 'hello@fashun.co.in',
      details: 'We typically respond within 24 hours'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      info: 'Mon-Fri: 9AM-7PM',
      details: 'Saturday: 10AM-4PM'
    }
  ]

  const supportCategories = [
    { value: 'general', label: 'General Inquiry', icon: ChatBubbleLeftRightIcon },
    { value: 'order', label: 'Order Support', icon: ShieldCheckIcon },
    { value: 'collaboration', label: 'Collaboration', icon: UserGroupIcon },
    { value: 'feedback', label: 'Feedback', icon: HeartIcon }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
          >
            Let's Create Something
            <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              Amazing Together
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed"
          >
            We're here to help with your orders, answer your questions, 
            or explore collaboration opportunities. Your feedback drives our innovation.
          </motion.p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-16 bg-primary-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-primary-900/70 transition-all duration-300"
              >
                <div className="bg-accent-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-accent-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-accent-400 font-semibold mb-2">{item.info}</p>
                <p className="text-primary-300 text-sm">{item.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">Send us a Message</h2>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6 flex items-center"
                >
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-green-300">Message sent successfully! We'll get back to you soon.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">What can we help you with?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {supportCategories.map((category) => (
                      <label
                        key={category.value}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.category === category.value
                            ? 'border-accent-400 bg-accent-400/20'
                            : 'border-white/10 bg-primary-800/30 hover:bg-primary-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={formData.category === category.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <category.icon className="w-5 h-5 text-accent-400 mr-3" />
                        <span className="text-white text-sm">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-primary-800/50 text-white rounded-lg border border-white/10 focus:border-accent-400 focus:outline-none transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-primary-800/50 text-white rounded-lg border border-white/10 focus:border-accent-400 focus:outline-none transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-primary-800/50 text-white rounded-lg border border-white/10 focus:border-accent-400 focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-primary-800/50 text-white rounded-lg border border-white/10 focus:border-accent-400 focus:outline-none transition-colors"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-primary-800/50 text-white rounded-lg border border-white/10 focus:border-accent-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about what you need help with..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-glass btn-lg group"
                >
                  Send Message
                  <EnvelopeIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* FAQ Section */}
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-6">Quick Answers</h3>
                <div className="space-y-4">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-white font-semibold py-2">
                      How long does shipping take?
                      <span className="transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-primary-200 mt-2 pl-4 border-l-2 border-accent-400/30">
                      Standard shipping takes 3-7 business days. Express shipping (1-3 days) is available for urgent orders.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-white font-semibold py-2">
                      What's your return policy?
                      <span className="transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-primary-200 mt-2 pl-4 border-l-2 border-accent-400/30">
                      30-day hassle-free returns. Items must be unworn with tags attached. Free return shipping on defective items.
                    </p>
                  </details>
                  
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-white font-semibold py-2">
                      Do you offer custom designs?
                      <span className="transform group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="text-primary-200 mt-2 pl-4 border-l-2 border-accent-400/30">
                      Yes! Our AI design tool lets you create custom pieces. For bulk orders, contact our collaboration team.
                    </p>
                  </details>
                </div>
              </div>

              {/* Social & Alternative Contact */}
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-display font-bold text-white mb-6">Connect With Us</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent-500/20 rounded-full p-3">
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Live Chat</p>
                      <p className="text-primary-200 text-sm">Available 9AM-7PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-accent-500/20 rounded-full p-3">
                      <UserGroupIcon className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Community Forum</p>
                      <p className="text-primary-200 text-sm">Join discussions with other creators</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-primary-200 text-sm mb-4">Follow us for updates:</p>
                    <div className="flex space-x-4">
                      {['Instagram', 'Twitter', 'YouTube', 'Discord'].map((social) => (
                        <button
                          key={social}
                          className="px-4 py-2 bg-primary-800/50 text-accent-400 rounded-lg hover:bg-primary-800/70 transition-colors text-sm font-semibold"
                        >
                          {social}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}