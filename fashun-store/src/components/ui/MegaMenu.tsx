'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, TrendingUp, Star, ArrowRight, Tag, Zap, Crown, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  badge?: {
    text: string;
    type: 'new' | 'hot' | 'sale' | 'premium';
  };
  children?: MenuItem[];
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
  badge?: string;
}

interface MegaMenuColumn {
  title: string;
  items: MenuItem[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
    cta: string;
  };
}

interface MegaMenuProps {
  trigger: React.ReactNode;
  columns: MegaMenuColumn[];
  featuredProducts?: FeaturedProduct[];
  promotionalBanner?: {
    title: string;
    description: string;
    image: string;
    href: string;
    discount?: string;
  };
  className?: string;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  trigger,
  columns,
  featuredProducts = [],
  promotionalBanner,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveColumn(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveColumn(null);
    }, 150);
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case 'new':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'hot':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'sale':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'premium':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-accent-500/20 text-accent-300 border-accent-500/30';
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'new':
        return <Star className="w-3 h-3" />;
      case 'hot':
        return <TrendingUp className="w-3 h-3" />;
      case 'sale':
        return <Tag className="w-3 h-3" />;
      case 'premium':
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* Trigger */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-0 w-screen max-w-6xl bg-primary-900/95 backdrop-blur-lg 
                   border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden
                   transform origin-top animate-in slide-in-from-top-2 duration-200"
        >
          {/* Promotional Banner */}
          {promotionalBanner && (
            <div className="relative overflow-hidden bg-gradient-to-r from-accent-600/20 to-accent-500/20 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              <div className="relative z-10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={promotionalBanner.image}
                      alt={promotionalBanner.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {promotionalBanner.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {promotionalBanner.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {promotionalBanner.discount && (
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 
                                  text-red-300 rounded-full text-xs font-bold">
                      {promotionalBanner.discount}
                    </div>
                  )}
                  <Link
                    href={promotionalBanner.href}
                    className="flex items-center gap-1 text-accent-400 hover:text-accent-300 
                             text-xs font-medium transition-colors"
                  >
                    Shop Now
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Menu Columns */}
              <div className="col-span-8">
                <div className="grid grid-cols-3 gap-6">
                  {columns.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className="space-y-4"
                      onMouseEnter={() => setActiveColumn(columnIndex)}
                    >
                      {/* Column Header */}
                      <h3 className="text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 pb-2">
                        {column.title}
                      </h3>

                      {/* Menu Items */}
                      <div className="space-y-2">
                        {column.items.map((item) => (
                          <div key={item.id}>
                            <Link
                              href={item.href || '#'}
                              className="group flex items-center justify-between py-1 
                                       text-gray-400 hover:text-white transition-colors"
                            >
                              <span className="text-sm">{item.label}</span>
                              {item.badge && (
                                <div className={`
                                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                                  text-xs font-medium border ${getBadgeStyles(item.badge.type)}
                                `}>
                                  {getBadgeIcon(item.badge.type)}
                                  {item.badge.text}
                                </div>
                              )}
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 
                                                   transform translate-x-0 group-hover:translate-x-1 
                                                   transition-all duration-200" />
                            </Link>

                            {/* Submenu items */}
                            {item.children && (
                              <div className="ml-4 mt-1 space-y-1">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={child.href || '#'}
                                    className="block text-xs text-gray-500 hover:text-gray-300 
                                             transition-colors py-0.5"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Featured Content */}
                      {column.featured && activeColumn === columnIndex && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={column.featured.image}
                              alt={column.featured.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                          <h4 className="text-white font-semibold text-sm mb-1">
                            {column.featured.title}
                          </h4>
                          <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                            {column.featured.description}
                          </p>
                          <Link
                            href={column.featured.href}
                            className="inline-flex items-center gap-1 text-accent-400 
                                     hover:text-accent-300 text-xs font-medium"
                          >
                            {column.featured.cta}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Products Sidebar */}
              {featuredProducts.length > 0 && (
                <div className="col-span-4 border-l border-white/10 pl-6">
                  <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
                    Trending Now
                  </h3>
                  <div className="space-y-4">
                    {featuredProducts.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={product.href}
                        className="group block"
                      >
                        <div className="flex gap-3 p-3 rounded-lg hover:bg-white/5 
                                      transition-all duration-200 border border-transparent 
                                      hover:border-white/10">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.badge && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 
                                            bg-red-500 text-white text-xs font-bold rounded">
                                {product.badge}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-medium line-clamp-2 
                                         group-hover:text-accent-300 transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-accent-400 font-semibold text-sm">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-gray-500 line-through text-xs">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* View All Products */}
                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="flex items-center justify-center gap-2 w-full py-2 
                               bg-accent-500/20 hover:bg-accent-500/30 border border-accent-500/30 
                               text-accent-300 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      View All Products
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom CTA Bar */}
          <div className="bg-gradient-to-r from-accent-600/10 to-accent-500/10 border-t border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Gift className="w-4 h-4" />
                  <span>Free shipping over ₹3,000</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Zap className="w-4 h-4" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/sale"
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 
                           border border-red-500/30 text-red-300 rounded-lg 
                           hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
                >
                  <Tag className="w-3 h-3" />
                  Sale Items
                </Link>
                <Link
                  href="/new-arrivals"
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 
                           border border-green-500/30 text-green-300 rounded-lg 
                           hover:bg-green-500/30 transition-all duration-200 text-sm font-medium"
                >
                  <Star className="w-3 h-3" />
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage component
export const NavigationMegaMenu: React.FC = () => {
  const menuColumns: MegaMenuColumn[] = [
    {
      title: 'Clothing',
      items: [
        { id: 'hoodies', label: 'Hoodies & Sweatshirts', href: '/clothing/hoodies', badge: { text: 'Hot', type: 'hot' } },
        { id: 'tshirts', label: 'T-Shirts & Tops', href: '/clothing/tshirts' },
        { id: 'pants', label: 'Pants & Joggers', href: '/clothing/pants' },
        { id: 'jackets', label: 'Jackets & Coats', href: '/clothing/jackets', badge: { text: 'New', type: 'new' } },
        { id: 'shorts', label: 'Shorts', href: '/clothing/shorts' },
        { id: 'underwear', label: 'Underwear & Socks', href: '/clothing/underwear' }
      ],
      featured: {
        title: 'Winter Collection 2024',
        description: 'Stay warm with our premium winter streetwear collection featuring the latest trends.',
        image: '/images/winter-collection.jpg',
        href: '/collections/winter-2024',
        cta: 'Shop Collection'
      }
    },
    {
      title: 'Accessories',
      items: [
        { id: 'bags', label: 'Bags & Backpacks', href: '/accessories/bags' },
        { id: 'hats', label: 'Hats & Caps', href: '/accessories/hats' },
        { id: 'jewelry', label: 'Jewelry', href: '/accessories/jewelry', badge: { text: 'Premium', type: 'premium' } },
        { id: 'watches', label: 'Watches', href: '/accessories/watches' },
        { id: 'sunglasses', label: 'Sunglasses', href: '/accessories/sunglasses' },
        { id: 'belts', label: 'Belts', href: '/accessories/belts' }
      ]
    },
    {
      title: 'Footwear',
      items: [
        { id: 'sneakers', label: 'Sneakers', href: '/footwear/sneakers', badge: { text: 'Sale', type: 'sale' } },
        { id: 'boots', label: 'Boots', href: '/footwear/boots' },
        { id: 'sandals', label: 'Sandals', href: '/footwear/sandals' },
        { id: 'dress-shoes', label: 'Dress Shoes', href: '/footwear/dress-shoes' },
        { id: 'athletic', label: 'Athletic Shoes', href: '/footwear/athletic' }
      ]
    }
  ];

  const featuredProducts: FeaturedProduct[] = [
    {
      id: '1',
      name: 'Premium Streetwear Hoodie',
      price: 89.99,
      originalPrice: 129.99,
      image: '/images/products/hoodie-1.jpg',
      href: '/products/premium-hoodie',
      badge: '30% OFF'
    },
    {
      id: '2',
      name: 'Limited Edition Sneakers',
      price: 199.99,
      image: '/images/products/sneakers-1.jpg',
      href: '/products/limited-sneakers',
      badge: 'LIMITED'
    },
    {
      id: '3',
      name: 'Designer Cargo Pants',
      price: 149.99,
      originalPrice: 199.99,
      image: '/images/products/cargo-pants.jpg',
      href: '/products/cargo-pants'
    }
  ];

  return (
    <MegaMenu
      trigger={
        <div className="flex items-center gap-1 text-white hover:text-accent-400 
                      transition-colors cursor-pointer">
          <span>Shop</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      }
      columns={menuColumns}
      featuredProducts={featuredProducts}
      promotionalBanner={{
        title: 'Flash Sale - 48 Hours Only!',
        description: 'Up to 70% off on selected items',
        image: '/images/flash-sale-banner.jpg',
        href: '/flash-sale',
        discount: '70% OFF'
      }}
    />
  );
};

export default MegaMenu;