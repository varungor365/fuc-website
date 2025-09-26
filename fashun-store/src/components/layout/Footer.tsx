'use client''use client'



import React from 'react'import Link from 'next/link'

import Link from 'next/link'import { motion } from 'framer-motion'

import { motion } from 'framer-motion'import { 

import {   EnvelopeIcon, 

  EnvelopeIcon,  PhoneIcon, 

  PhoneIcon,  MapPinIcon 

  MapPinIcon} from '@heroicons/react/24/outline'

} from '@heroicons/react/24/outline'

import {const footerSections = [

  FaInstagram,  {

  FaTwitter,    title: 'Shop',

  FaFacebook,    links: [

  FaYoutube,      { name: 'All Products', href: '/collections/all' },

  FaTiktok      { name: 'Hoodies', href: '/collections/hoodies' },

} from 'react-icons/fa'      { name: 'T-Shirts', href: '/collections/tees' },

      { name: 'Polos', href: '/collections/polos' },

const footerSections = {      { name: 'Custom Design', href: '/designer' },

  shop: [    ],

    { name: 'New Arrivals', href: '/collections/new-arrivals' },  },

    { name: 'T-Shirts', href: '/collections/t-shirts' },  {

    { name: 'Hoodies', href: '/collections/hoodies' },    title: 'Company',

    { name: 'Polos', href: '/collections/polos' },    links: [

    { name: 'Accessories', href: '/collections/accessories' },      { name: 'About Us', href: '/about' },

    { name: 'Sale', href: '/collections/sale' }      { name: 'Affiliate Program', href: '/affiliate' },

  ],      { name: 'Sustainability', href: '/sustainability' },

  company: [      { name: 'Careers', href: '/careers' },

    { name: 'About Us', href: '/about' },      { name: 'Press', href: '/press' },

    { name: 'Careers', href: '/careers' },    ],

    { name: 'Press', href: '/press' },  },

    { name: 'Sustainability', href: '/sustainability' },  {

    { name: 'Affiliate Program', href: '/affiliate' }    title: 'Support',

  ],    links: [

  support: [      { name: 'Contact Us', href: '/contact' },

    { name: 'Size Guide', href: '/size-guide' },      { name: 'Track Order', href: '/track' },

    { name: 'Shipping & Returns', href: '/shipping-returns' },      { name: 'Size Guide', href: '/size-guide' },

    { name: 'Contact Us', href: '/contact' },      { name: 'Shipping Info', href: '/policies/shipping' },

    { name: 'FAQ', href: '/faq' },      { name: 'Returns', href: '/policies/returns' },

    { name: 'Track Order', href: '/track-order' }      { name: 'FAQ', href: '/faq' },

  ],    ],

  legal: [  },

    { name: 'Privacy Policy', href: '/privacy' },  {

    { name: 'Terms of Service', href: '/terms' },    title: 'Legal',

    { name: 'Refund Policy', href: '/refund-policy' },    links: [

    { name: 'Cookie Policy', href: '/cookies' }      { name: 'Privacy Policy', href: '/policies/privacy' },

  ]      { name: 'Terms of Service', href: '/policies/terms' },

}      { name: 'Refund Policy', href: '/policies/returns' },

      { name: 'Cookie Policy', href: '/cookies' },

const socialLinks = [    ],

  { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com/fashun.co', color: 'hover:text-pink-400' },  },

  { name: 'TikTok', icon: FaTiktok, href: 'https://tiktok.com/@fashun.co', color: 'hover:text-pink-400' },]

  { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com/fashun_co', color: 'hover:text-blue-400' },

  { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com/fashun.co', color: 'hover:text-blue-600' },const socialLinks = [

  { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/@fashun.co', color: 'hover:text-red-500' }  { name: 'Instagram', href: 'https://instagram.com/fashun.co', icon: 'instagram' },

]  { name: 'Twitter', href: 'https://twitter.com/fashunco', icon: 'twitter' },

  { name: 'Facebook', href: 'https://facebook.com/fashunco', icon: 'facebook' },

const instagramPosts = [  { name: 'YouTube', href: 'https://youtube.com/@fashunco', icon: 'youtube' },

  { id: 1, alt: 'FASHUN.CO Post 1' },]

  { id: 2, alt: 'FASHUN.CO Post 2' },

  { id: 3, alt: 'FASHUN.CO Post 3' },export function Footer() {

  { id: 4, alt: 'FASHUN.CO Post 4' },  return (

  { id: 5, alt: 'FASHUN.CO Post 5' },    <footer className="bg-primary-800 border-t border-primary-700">

  { id: 6, alt: 'FASHUN.CO Post 6' }      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

]        {/* Main Footer Content */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

export default function Footer() {          {/* Brand Section */}

  return (          <div className="lg:col-span-2">

    <footer className="bg-primary-950 border-t border-white/10">            <motion.div

      {/* Newsletter Section */}              initial={{ opacity: 0, y: 20 }}

      <div className="bg-gradient-to-r from-accent-500/20 to-accent-600/20 border-b border-white/10">              whileInView={{ opacity: 1, y: 0 }}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">              transition={{ duration: 0.6 }}

          <div className="text-center max-w-2xl mx-auto">              viewport={{ once: true }}

            <h3 className="font-hero text-3xl lg:text-4xl text-white mb-4">            >

              Stay in the Loop              <Link href="/" className="text-2xl font-display font-bold gradient-text">

            </h3>                FashUn.Co.in

            <p className="text-white/80 text-lg mb-8">              </Link>

              Get exclusive access to new drops, limited editions, and special offers.              <p className="mt-4 text-sm text-primary-300 max-w-md">

            </p>                Premium streetwear and custom apparel designed for the next generation. 

                            Express yourself with bold designs and sustainable fashion.

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">              </p>

              <input              

                type="email"              {/* Contact Info */}

                placeholder="Enter your email"              <div className="mt-6 space-y-3">

                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"                <div className="flex items-center space-x-3 text-sm text-primary-300">

              />                  <EnvelopeIcon className="h-4 w-4" />

              <motion.button                  <span>hello@fashun.co.in</span>

                whileHover={{ scale: 1.05 }}                </div>

                whileTap={{ scale: 0.95 }}                <div className="flex items-center space-x-3 text-sm text-primary-300">

                className="btn-primary px-8 py-4 rounded-xl font-semibold"                  <PhoneIcon className="h-4 w-4" />

              >                  <span>+91 98765 43210</span>

                Subscribe                </div>

              </motion.button>                <div className="flex items-center space-x-3 text-sm text-primary-300">

            </div>                  <MapPinIcon className="h-4 w-4" />

                              <span>Mumbai, India</span>

            <p className="text-white/60 text-sm mt-4">                </div>

              Join 50,000+ fashion enthusiasts. Unsubscribe anytime.              </div>

            </p>            </motion.div>

          </div>          </div>

        </div>

      </div>          {/* Footer Links */}

          {footerSections.map((section, index) => (

      {/* Instagram Feed */}            <motion.div

      <div className="border-b border-white/10">              key={section.title}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">              initial={{ opacity: 0, y: 20 }}

          <div className="text-center mb-12">              whileInView={{ opacity: 1, y: 0 }}

            <h3 className="font-hero text-2xl lg:text-3xl text-white mb-4">              transition={{ duration: 0.6, delay: index * 0.1 }}

              Follow @FASHUN.CO              viewport={{ once: true }}

            </h3>            >

            <p className="text-white/80">              <h3 className="text-sm font-semibold text-primary-100 uppercase tracking-wider">

              See how our community styles their FASHUN pieces                {section.title}

            </p>              </h3>

          </div>              <ul className="mt-4 space-y-3">

                          {section.links.map((link) => (

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">                  <li key={link.name}>

            {instagramPosts.map((post, index) => (                    <Link

              <motion.div                      href={link.href}

                key={post.id}                      className="text-sm text-primary-300 hover:text-accent-500 transition-colors duration-200"

                initial={{ opacity: 0, y: 20 }}                    >

                whileInView={{ opacity: 1, y: 0 }}                      {link.name}

                transition={{ delay: index * 0.1 }}                    </Link>

                className="aspect-square group cursor-pointer overflow-hidden rounded-xl"                  </li>

              >                ))}

                <div className="relative w-full h-full bg-gradient-to-br from-accent-500/20 to-accent-600/20 glass-card">              </ul>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />            </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">          ))}

                    <FaInstagram className="w-8 h-8 text-white" />        </div>

                  </div>

                  <div className="w-full h-full bg-gradient-to-br from-accent-500/30 to-accent-600/30 flex items-center justify-center">        {/* Newsletter Signup */}

                    <FaInstagram className="w-12 h-12 text-white/40" />        <motion.div

                  </div>          initial={{ opacity: 0, y: 20 }}

                </div>          whileInView={{ opacity: 1, y: 0 }}

              </motion.div>          transition={{ duration: 0.6, delay: 0.4 }}

            ))}          viewport={{ once: true }}

          </div>          className="mt-12 pt-8 border-t border-primary-700"

        </div>        >

      </div>          <div className="max-w-md">

            <h3 className="text-lg font-semibold text-primary-100">

      {/* Main Footer Content */}              Stay Updated

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">            </h3>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">            <p className="mt-2 text-sm text-primary-300">

                        Get the latest drops, exclusive designs, and special offers.

          {/* Brand Section */}            </p>

          <div className="lg:col-span-2">            <form className="mt-4 flex flex-col sm:flex-row gap-3">

            <Link href="/" className="inline-block mb-6">              <input

              <div className="font-hero text-3xl text-white">                type="email"

                FASHUN                placeholder="Enter your email"

                <span className="text-accent-500">.CO</span>                className="input-primary flex-1"

              </div>                required

            </Link>              />

                          <button

            <p className="text-white/80 text-lg mb-8 max-w-md">                type="submit"

              Elevating streetwear culture with premium designs that speak to the modern generation.                 className="btn-accent whitespace-nowrap"

              Every piece tells a story.              >

            </p>                Subscribe

                          </button>

            {/* Contact Info */}            </form>

            <div className="space-y-4">          </div>

              <div className="flex items-center space-x-3 text-white/80">        </motion.div>

                <EnvelopeIcon className="w-5 h-5 text-accent-400" />

                <span>hello@fashun.co</span>        {/* Social Links & Copyright */}

              </div>        <motion.div

              <div className="flex items-center space-x-3 text-white/80">          initial={{ opacity: 0, y: 20 }}

                <PhoneIcon className="w-5 h-5 text-accent-400" />          whileInView={{ opacity: 1, y: 0 }}

                <span>+1 (555) 123-4567</span>          transition={{ duration: 0.6, delay: 0.5 }}

              </div>          viewport={{ once: true }}

              <div className="flex items-center space-x-3 text-white/80">          className="mt-8 pt-8 border-t border-primary-700 flex flex-col sm:flex-row justify-between items-center"

                <MapPinIcon className="w-5 h-5 text-accent-400" />        >

                <span>Los Angeles, CA</span>          <div className="flex space-x-6">

              </div>            {socialLinks.map((social) => (

            </div>              <Link

          </div>                key={social.name}

                href={social.href}

          {/* Links Sections */}                target="_blank"

          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">                rel="noopener noreferrer"

                            className="text-primary-400 hover:text-accent-500 transition-colors duration-200"

            {/* Shop */}                aria-label={social.name}

            <div>              >

              <h4 className="font-heading text-white text-lg font-semibold mb-6">Shop</h4>                <motion.div

              <ul className="space-y-4">                  whileHover={{ scale: 1.2 }}

                {footerSections.shop.map((link) => (                  whileTap={{ scale: 0.9 }}

                  <li key={link.name}>                  className="w-6 h-6"

                    <Link                 >

                      href={link.href}                  {/* Social Icons - Replace with actual icons */}

                      className="text-white/70 hover:text-white transition-colors duration-300"                  <div className="w-6 h-6 bg-current rounded" />

                    >                </motion.div>

                      {link.name}              </Link>

                    </Link>            ))}

                  </li>          </div>

                ))}          

              </ul>          <div className="mt-4 sm:mt-0 text-sm text-primary-400">

            </div>            © 2025 FashUn.Co.in. All rights reserved. Made with ❤️ in India.

          </div>

            {/* Company */}        </motion.div>

            <div>      </div>

              <h4 className="font-heading text-white text-lg font-semibold mb-6">Company</h4>    </footer>

              <ul className="space-y-4">  )

                {footerSections.company.map((link) => (}

                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-heading text-white text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-4">
                {footerSections.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading text-white text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                {footerSections.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            
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
                    className={`text-white/70 ${social.color} transition-colors duration-300`}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.a>
                )
              })}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-white/60 text-sm">
                © 2024 FASHUN.CO. All rights reserved.
              </p>
              <p className="text-white/40 text-xs mt-1">
                Designed & built with ❤️ in Los Angeles
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}