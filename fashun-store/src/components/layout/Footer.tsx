'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline'

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/collections/all' },
      { name: 'Hoodies', href: '/collections/hoodies' },
      { name: 'T-Shirts', href: '/collections/tees' },
      { name: 'Polos', href: '/collections/polos' },
      { name: 'Custom Design', href: '/designer' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Affiliate Program', href: '/affiliate' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Track Order', href: '/track' },
      { name: 'Size Guide', href: '/size-guide' },
      { name: 'Shipping Info', href: '/policies/shipping' },
      { name: 'Returns', href: '/policies/returns' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/policies/privacy' },
      { name: 'Terms of Service', href: '/policies/terms' },
      { name: 'Refund Policy', href: '/policies/returns' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
]

const socialLinks = [
  { name: 'Instagram', href: 'https://instagram.com/fashun.co', icon: 'instagram' },
  { name: 'Twitter', href: 'https://twitter.com/fashunco', icon: 'twitter' },
  { name: 'Facebook', href: 'https://facebook.com/fashunco', icon: 'facebook' },
  { name: 'YouTube', href: 'https://youtube.com/@fashunco', icon: 'youtube' },
]

export function Footer() {
  return (
    <footer className="bg-primary-800 border-t border-primary-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
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
            >
              <h3 className="text-sm font-semibold text-primary-100 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-300 hover:text-accent-500 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-primary-700"
        >
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-primary-100">
              Stay Updated
            </h3>
            <p className="mt-2 text-sm text-primary-300">
              Get the latest drops, exclusive designs, and special offers.
            </p>
            <form className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-primary flex-1"
                required
              />
              <button
                type="submit"
                className="btn-accent whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        {/* Social Links & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-primary-700 flex flex-col sm:flex-row justify-between items-center"
        >
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-accent-500 transition-colors duration-200"
                aria-label={social.name}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-6 h-6"
                >
                  {/* Social Icons - Replace with actual icons */}
                  <div className="w-6 h-6 bg-current rounded" />
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-0 text-sm text-primary-400">
            © 2025 FashUn.Co.in. All rights reserved. Made with ❤️ in India.
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
