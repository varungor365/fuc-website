'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline'
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa'

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/collections/all' },
      { name: 'Hoodies', href: '/collections/hoodies' },
      { name: 'T-Shirts', href: '/collections/tshirts' },
      { name: 'Polos', href: '/collections/polos' },
      { name: 'Custom Design', href: '/designer' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Affiliate Program', href: '/affiliate' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Track Order', href: '/track' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'FAQ', href: '/faq' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ]
  }
]

const socialLinks = [
  { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/fashun.co', color: 'hover:text-pink-400' },
  { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@fashun.co', color: 'hover:text-pink-400' },
  { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/fashun_co', color: 'hover:text-blue-400' },
  { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/fashun.co', color: 'hover:text-blue-600' },
  { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@fashun.co', color: 'hover:text-red-500' }
]

export default function Footer() {
  return (
    <footer className="bg-primary-950 border-t border-white/10">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-accent-500/20 to-accent-600/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-hero text-3xl lg:text-4xl text-white mb-4">
              Stay in the Loop
            </h3>
            <p className="text-white/80 text-lg mb-8">
              Get exclusive access to new drops, limited editions, and special offers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-4 rounded-xl font-semibold"
              >
                Subscribe
              </motion.button>
            </div>
            
            <p className="text-white/60 text-sm mt-4">
              Join 50,000+ fashion enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="text-2xl font-display font-bold gradient-text">
                FashUn.Co.in
              </Link>
              <p className="mt-4 text-sm text-primary-300 max-w-md">
                Premium streetwear and custom apparel designed for the next generation. 
                Express yourself with bold designs and sustainable fashion.
              </p>
              
              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-primary-300">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>hello@fashun.co.in</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-primary-300">
                  <PhoneIcon className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-primary-300">
                  <MapPinIcon className="h-4 w-4" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-primary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`text-primary-400 ${social.color} transition-colors duration-300`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-primary-400 text-sm">
                © 2025 FashUn.Co.in. All rights reserved.
              </p>
              <p className="text-primary-500 text-xs mt-1">
                Made with ❤️ in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}