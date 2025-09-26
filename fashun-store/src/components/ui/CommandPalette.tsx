'use client';

import React from 'react';
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  ActionImpl,
  useKBar,
} from 'kbar';
import { 
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  PlusIcon,
  SwatchIcon,
  QrCodeIcon,
  HomeIcon,
  ShoppingBagIcon,
  HeartIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface CommandPaletteProps {
  children: React.ReactNode;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ children }) => {
  const router = useRouter();

  const actions = [
    // Navigation Actions
    {
      id: 'home',
      name: 'Go to Homepage',
      shortcut: ['h'],
      keywords: 'home dashboard',
      section: 'Navigation',
      perform: () => router.push('/'),
      icon: <HomeIcon className="w-4 h-4" />,
    },
    {
      id: 'collections',
      name: 'Browse Collections',
      shortcut: ['c'],
      keywords: 'collections products browse shop',
      section: 'Navigation',
      perform: () => router.push('/collections'),
      icon: <ShoppingBagIcon className="w-4 h-4" />,
    },
    {
      id: 'search',
      name: 'Advanced Search',
      shortcut: ['s'],
      keywords: 'search find products ai visual',
      section: 'Navigation',
      perform: () => router.push('/search'),
      icon: <MagnifyingGlassIcon className="w-4 h-4" />,
    },
    {
      id: 'outfit-builder',
      name: 'AI Outfit Builder',
      shortcut: ['o'],
      keywords: 'outfit builder ai design create',
      section: 'AI Tools',
      perform: () => router.push('/outfit-builder'),
      icon: <SwatchIcon className="w-4 h-4" />,
    },
    {
      id: 'ai-features',
      name: 'AI Features Showcase',
      shortcut: ['a'],
      keywords: 'ai features showcase smart recommendations',
      section: 'AI Tools',
      perform: () => router.push('/ai-features'),
      icon: <ChartBarIcon className="w-4 h-4" />,
    },
    // Profile Actions
    {
      id: 'profile',
      name: 'View Profile',
      shortcut: ['p'],
      keywords: 'profile user account settings',
      section: 'Profile',
      perform: () => router.push('/profile'),
      icon: <UserIcon className="w-4 h-4" />,
    },
    {
      id: 'wishlist',
      name: 'My Wishlist',
      shortcut: ['w'],
      keywords: 'wishlist favorites saved items',
      section: 'Profile',
      perform: () => router.push('/wishlist'),
      icon: <HeartIcon className="w-4 h-4" />,
    },
    {
      id: 'qr-code',
      name: 'Show QR Code',
      shortcut: ['q'],
      keywords: 'qr code share profile',
      section: 'Profile',
      perform: () => {
        // This would trigger QR code modal
        console.log('Show QR Code modal');
      },
      icon: <QrCodeIcon className="w-4 h-4" />,
    },
    // Quick Actions
    {
      id: 'new-design',
      name: 'Start New T-shirt Design',
      shortcut: ['n'],
      keywords: 'new design create tshirt custom',
      section: 'Quick Actions',
      perform: () => router.push('/design-studio'),
      icon: <PlusIcon className="w-4 h-4" />,
    },
    {
      id: 'settings',
      name: 'Settings',
      shortcut: ['⌘', ','],
      keywords: 'settings preferences configuration',
      section: 'Quick Actions',
      perform: () => router.push('/settings'),
      icon: <Cog6ToothIcon className="w-4 h-4" />,
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <KBarAnimator className="relative max-w-xl mx-auto mt-16 overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4">
              <KBarSearch className="w-full px-4 py-3 text-white placeholder-white/70 bg-transparent border-none outline-none text-lg" 
                placeholder="Type a command or search..." />
            </div>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-xs uppercase tracking-widest text-white/50 bg-white/5">
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId || undefined}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef<
  HTMLDivElement,
  {
    action: ActionImpl;
    active: boolean;
    currentRootActionId?: ActionImpl['id'];
  }
>(({ action, active, currentRootActionId }, ref) => {
  const ancestors = React.useMemo(() => {
    if (!currentRootActionId) return action.ancestors;
    const index = action.ancestors.findIndex(
      (ancestor) => ancestor.id === currentRootActionId,
    );
    return action.ancestors.slice(index + 1);
  }, [action.ancestors, currentRootActionId]);

  return (
    <div
      ref={ref}
      className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
          : 'text-white/80 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center justify-center w-8 h-8">
        {action.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {ancestors.length > 0 &&
            ancestors.map((ancestor) => (
              <React.Fragment key={ancestor.id}>
                <span className="text-white/50">{ancestor.name}</span>
                <span className="text-white/30">›</span>
              </React.Fragment>
            ))}
          <span className="font-medium">{action.name}</span>
        </div>
        {action.subtitle && (
          <div className="text-sm text-white/60">{action.subtitle}</div>
        )}
      </div>
      {action.shortcut?.length && (
        <div className="flex gap-1">
          {action.shortcut.map((shortcut) => (
            <kbd
              key={shortcut}
              className="px-2 py-1 text-xs bg-white/10 rounded border border-white/20"
            >
              {shortcut}
            </kbd>
          ))}
        </div>
      )}
    </div>
  );
});

ResultItem.displayName = 'ResultItem';

// Hook to trigger command palette
export const useCommandPalette = () => {
  const { query } = useKBar();
  return { toggle: query.toggle };
};

export default CommandPalette;