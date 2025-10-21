'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const footerLinks = {
  shop: [
    { name: 'Printed T-Shirts', href: '/collections/printed-tshirts' },
    { name: 'Hoodies', href: '/collections/hoodies' },
    { name: 'Plain T-Shirts', href: '/collections/plain-tshirts' },
    { name: 'Women\'s Collection', href: '/collections/womens-tshirts' },
    { name: 'New Arrivals', href: '/collections/new-arrivals' },
    { name: 'Best Sellers', href: '/collections/best-sellers' }
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' }
  ],
  support: [
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'FAQ', href: '/faq' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Shipping Policy', href: '/shipping-policy' },
    { name: 'Returns Policy', href: '/returns-policy' }
  ]
};

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="FASHUN.CO" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-brand bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    FASHUN.CO
                  </h3>
                  <p className="text-xs text-neutral-400 -mt-1">PREMIUM STREETWEAR</p>
                </div>
              </Link>
              
              <p className="text-neutral-300 mb-6 max-w-md">
                India's premier streetwear destination. Express yourself with our premium collection of 
                printed tees, hoodies, and custom apparel designed for the modern trendsetter.
              </p>
              
              <div className="flex space-x-4">
                <motion.a
                  href="https://instagram.com/fashunco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-bold">IG</span>
                </motion.a>
                <motion.a
                  href="https://twitter.com/fashunco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-bold">TW</span>
                </motion.a>
                <motion.a
                  href="https://facebook.com/fashunco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-white font-bold">FB</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-neutral-300">support@fashun.co</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-neutral-300">+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-neutral-300">Mumbai, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 bg-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-neutral-400 hover:text-yellow-400 transition-colors text-xs"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-2 text-neutral-400 text-sm">
              <span>© 2024 FASHUN.CO. Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;