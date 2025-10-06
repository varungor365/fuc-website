'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HomeIcon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as SearchIconSolid, ShoppingBagIcon as BagIconSolid, UserIcon as UserIconSolid, Squares2X2Icon as GridIconSolid } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, activeIcon: SearchIconSolid },
    { name: 'Categories', href: '/collections/all', icon: Squares2X2Icon, activeIcon: GridIconSolid },
    { name: 'Cart', href: '/cart', icon: ShoppingBagIcon, activeIcon: BagIconSolid },
    { name: 'Account', href: '/account', icon: UserIcon, activeIcon: UserIconSolid },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-purple-500/30 z-40"
    >
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className={`text-xs mt-1 relative z-10 ${isActive ? 'text-purple-400 font-semibold' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
