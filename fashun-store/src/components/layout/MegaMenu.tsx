'use client';

import * as React from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MegaMenuItem {
  title: string;
  href: string;
  description?: string;
  image?: string;
  badge?: string;
}

interface MegaMenuCategory {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenuSection {
  title: string;
  categories: MegaMenuCategory[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

const megaMenuData: Record<string, MegaMenuSection> = {
  men: {
    title: 'Men\'s Collection',
    categories: [
      {
        title: 'Clothing',
        items: [
          { title: 'Hoodies & Sweatshirts', href: '/collections/mens-hoodies', description: 'Premium streetwear hoodies' },
          { title: 'T-Shirts', href: '/collections/mens-tshirts', description: 'Essential graphic tees' },
          { title: 'Jackets', href: '/collections/mens-jackets', description: 'Outerwear collection' },
          { title: 'Pants & Joggers', href: '/collections/mens-pants', description: 'Comfort meets style' },
          { title: 'Shorts', href: '/collections/mens-shorts', description: 'Summer essentials' }
        ]
      },
      {
        title: 'Footwear',
        items: [
          { title: 'Sneakers', href: '/collections/mens-sneakers', description: 'Latest drops' },
          { title: 'Boots', href: '/collections/mens-boots', description: 'Urban & rugged' },
          { title: 'Sandals', href: '/collections/mens-sandals', description: 'Casual comfort' }
        ]
      },
      {
        title: 'Accessories',
        items: [
          { title: 'Hats & Caps', href: '/collections/mens-hats', description: 'Complete your look' },
          { title: 'Bags', href: '/collections/mens-bags', description: 'Street-ready bags' },
          { title: 'Jewelry', href: '/collections/mens-jewelry', description: 'Urban accessories' }
        ]
      }
    ],
    featured: {
      title: 'New Drop: Urban Legends',
      description: 'Discover our latest streetwear collection inspired by urban culture',
      image: '/images/featured/mens-collection.jpg',
      href: '/collections/urban-legends'
    }
  },
  women: {
    title: 'Women\'s Collection',
    categories: [
      {
        title: 'Clothing',
        items: [
          { title: 'Hoodies & Sweatshirts', href: '/collections/womens-hoodies', description: 'Cozy streetwear' },
          { title: 'T-Shirts & Tops', href: '/collections/womens-tops', description: 'Essential styles' },
          { title: 'Dresses', href: '/collections/womens-dresses', description: 'Street-chic dresses' },
          { title: 'Pants & Leggings', href: '/collections/womens-pants', description: 'Comfortable fits' },
          { title: 'Skirts', href: '/collections/womens-skirts', description: 'Urban feminine' }
        ]
      },
      {
        title: 'Footwear',
        items: [
          { title: 'Sneakers', href: '/collections/womens-sneakers', description: 'Fashion-forward styles' },
          { title: 'Boots', href: '/collections/womens-boots', description: 'Edgy & elegant' },
          { title: 'Heels', href: '/collections/womens-heels', description: 'Street luxury' }
        ]
      },
      {
        title: 'Accessories',
        items: [
          { title: 'Bags & Purses', href: '/collections/womens-bags', description: 'Statement pieces' },
          { title: 'Jewelry', href: '/collections/womens-jewelry', description: 'Urban elegance' },
          { title: 'Scarves & Wraps', href: '/collections/womens-scarves', description: 'Style accents' }
        ]
      }
    ],
    featured: {
      title: 'Goddess Collection',
      description: 'Empowering streetwear for the modern woman',
      image: '/images/featured/womens-collection.jpg',
      href: '/collections/goddess'
    }
  },
  collections: {
    title: 'Collections',
    categories: [
      {
        title: 'Seasonal',
        items: [
          { title: 'Spring 2024', href: '/collections/spring-2024', badge: 'New' },
          { title: 'Winter Collection', href: '/collections/winter-2024' },
          { title: 'Summer Essentials', href: '/collections/summer-2024' }
        ]
      },
      {
        title: 'Collaborations',
        items: [
          { title: 'Artist Series', href: '/collections/artist-series', badge: 'Limited' },
          { title: 'Brand Collabs', href: '/collections/collaborations' },
          { title: 'Community Drops', href: '/collections/community' }
        ]
      },
      {
        title: 'Special Editions',
        items: [
          { title: 'Limited Drops', href: '/collections/limited-drops', badge: 'Exclusive' },
          { title: 'Vintage Revival', href: '/collections/vintage' },
          { title: 'Eco-Friendly', href: '/collections/sustainable', badge: 'Eco' }
        ]
      }
    ],
    featured: {
      title: 'Collector\'s Edition',
      description: 'Rare pieces for the ultimate streetwear enthusiast',
      image: '/images/featured/collectors-edition.jpg',
      href: '/collections/collectors'
    }
  }
};

interface MegaMenuProps {
  activeMenu: string | null;
  onClose: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  const menuData = activeMenu ? megaMenuData[activeMenu] : null;

  if (!menuData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl z-50"
      >
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuData.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/10">
                      {category.title}
                    </h3>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="group block"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-primary-600 text-white rounded">
                                    {item.badge}
                                  </span>
                                )}
                                {item.description && (
                                  <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Section */}
            {menuData.featured && (
              <div className="lg:col-span-1">
                <Link
                  href={menuData.featured.href}
                  onClick={onClose}
                  className="group block"
                >
                  <div className="bg-gradient-to-br from-primary-600/20 to-primary-800/20 border border-primary-500/30 rounded-xl p-6 hover:border-primary-400/50 transition-colors">
                    <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={menuData.featured.image}
                        alt={menuData.featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik03NSA3NUgxMjVWMTI1SDc1Vjc1WiIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4=';
                        }}
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {menuData.featured.title}
                    </h4>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      {menuData.featured.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-primary-400 font-medium text-sm group-hover:text-primary-300 transition-colors">
                        Explore Collection →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 mb-4">
              Can't find what you're looking for?
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/collections/all"
                onClick={onClose}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                View All Products
              </Link>
              <Link
                href="/search"
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium border border-white/20 transition-colors"
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MegaMenu;
