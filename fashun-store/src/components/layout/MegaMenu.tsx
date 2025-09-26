'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const megaMenuData = {
  'T-Shirts': {
    featured: {
      title: 'Featured Collections',
      items: [
        { name: 'Oversized Tees', href: '/collections/oversized-tees', image: '/api/placeholder/150/200' },
        { name: 'Graphic Tees', href: '/collections/graphic-tees', image: '/api/placeholder/150/200' },
        { name: 'Anime Collection', href: '/collections/anime', image: '/api/placeholder/150/200' }
      ]
    },
    categories: [
      {
        title: 'By Style',
        items: [
          { name: 'Oversized Fit', href: '/collections/t-shirts/oversized' },
          { name: 'Regular Fit', href: '/collections/t-shirts/regular' },
          { name: 'Slim Fit', href: '/collections/t-shirts/slim' },
          { name: 'Longline Tees', href: '/collections/t-shirts/longline' }
        ]
      },
      {
        title: 'By Design',
        items: [
          { name: 'Graphic Prints', href: '/collections/t-shirts/graphic' },
          { name: 'Typography', href: '/collections/t-shirts/typography' },
          { name: 'Minimalist', href: '/collections/t-shirts/minimalist' },
          { name: 'Vintage', href: '/collections/t-shirts/vintage' }
        ]
      },
      {
        title: 'By Theme',
        items: [
          { name: 'Anime & Manga', href: '/collections/t-shirts/anime' },
          { name: 'Music Bands', href: '/collections/t-shirts/music' },
          { name: 'Street Art', href: '/collections/t-shirts/street-art' },
          { name: 'Pop Culture', href: '/collections/t-shirts/pop-culture' }
        ]
      }
    ],
    trending: [
      { name: 'Best Sellers', href: '/collections/t-shirts/bestsellers', badge: 'HOT' },
      { name: 'New Arrivals', href: '/collections/t-shirts/new', badge: 'NEW' },
      { name: 'Sale Items', href: '/collections/t-shirts/sale', badge: 'SALE' }
    ]
  },
  'Hoodies': {
    featured: {
      title: 'Featured Collections',
      items: [
        { name: 'Zip Hoodies', href: '/collections/zip-hoodies', image: '/api/placeholder/150/200' },
        { name: 'Pullover Hoodies', href: '/collections/pullover-hoodies', image: '/api/placeholder/150/200' },
        { name: 'Crop Hoodies', href: '/collections/crop-hoodies', image: '/api/placeholder/150/200' }
      ]
    },
    categories: [
      {
        title: 'By Style',
        items: [
          { name: 'Zip Hoodies', href: '/collections/hoodies/zip' },
          { name: 'Pullover', href: '/collections/hoodies/pullover' },
          { name: 'Crop Hoodies', href: '/collections/hoodies/crop' },
          { name: 'Oversized', href: '/collections/hoodies/oversized' }
        ]
      },
      {
        title: 'By Material',
        items: [
          { name: 'Cotton Blend', href: '/collections/hoodies/cotton' },
          { name: 'Fleece', href: '/collections/hoodies/fleece' },
          { name: 'French Terry', href: '/collections/hoodies/terry' },
          { name: 'Heavyweight', href: '/collections/hoodies/heavyweight' }
        ]
      },
      {
        title: 'By Design',
        items: [
          { name: 'Solid Colors', href: '/collections/hoodies/solid' },
          { name: 'Graphic Prints', href: '/collections/hoodies/graphic' },
          { name: 'Embroidered', href: '/collections/hoodies/embroidered' },
          { name: 'Tie-Dye', href: '/collections/hoodies/tie-dye' }
        ]
      }
    ],
    trending: [
      { name: 'Winter Essentials', href: '/collections/hoodies/winter', badge: 'TRENDING' },
      { name: 'Limited Edition', href: '/collections/hoodies/limited', badge: 'LIMITED' },
      { name: 'Bestsellers', href: '/collections/hoodies/bestsellers', badge: 'HOT' }
    ]
  }
  // Add more categories as needed
};

interface MegaMenuProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ category, isOpen, onClose }) => {
  const menuData = megaMenuData[category as keyof typeof megaMenuData];

  if (!menuData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-t border-white/10 z-50"
          onMouseLeave={onClose}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Featured Products */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-4">{menuData.featured.title}</h3>
                <div className="space-y-4">
                  {menuData.featured.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      onClick={onClose}
                    >
                      <div className="w-16 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-gray-500 text-2xl">👕</div>
                      </div>
                      <div>
                        <div className="text-white font-medium group-hover:text-purple-400 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-400">Explore Collection</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuData.categories.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-base font-semibold text-white mb-4">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={item.href}
                            className="text-gray-300 hover:text-purple-400 transition-colors text-sm"
                            onClick={onClose}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Trending */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-white mb-4">Trending Now</h3>
                <div className="space-y-3">
                  {menuData.trending.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                      onClick={onClose}
                    >
                      <span className="text-white group-hover:text-purple-400 transition-colors">
                        {item.name}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        item.badge === 'HOT' ? 'bg-red-500 text-white' :
                        item.badge === 'NEW' ? 'bg-blue-500 text-white' :
                        item.badge === 'SALE' ? 'bg-green-500 text-white' :
                        item.badge === 'TRENDING' ? 'bg-purple-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* CTA Banner */}
                <div className="mt-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4">
                  <div className="text-sm font-bold text-purple-400 mb-1">MEGA SALE</div>
                  <div className="text-white text-sm mb-2">Up to 70% OFF</div>
                  <Link
                    href="/collections/sale"
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-colors"
                    onClick={onClose}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NavigationItemProps {
  name: string;
  href: string;
  hasDropdown?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ name, href, hasDropdown }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => hasDropdown && setIsHovered(true)}
      onMouseLeave={() => hasDropdown && setIsHovered(false)}
    >
      <Link 
        href={href}
        className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors py-2"
      >
        <span>{name}</span>
        {hasDropdown && (
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isHovered ? 'rotate-180' : ''}`} />
        )}
      </Link>
      
      {hasDropdown && (
        <MegaMenu
          category={name}
          isOpen={isHovered}
          onClose={() => setIsHovered(false)}
        />
      )}
    </div>
  );
};

export { NavigationItem, MegaMenu };
export default MegaMenu;