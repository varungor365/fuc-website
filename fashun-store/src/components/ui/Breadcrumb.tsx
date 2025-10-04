'use client';

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Prepare schema data
  const schemaItems = [
    { name: 'Home', url: 'https://fashun.co.in' },
    ...items.map(item => ({
      name: item.name,
      url: `https://fashun.co.in${item.href}`
    }))
  ]

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav className={`flex ${className}`} aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {/* Home Link */}
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </li>

          {/* Dynamic Breadcrumb Items */}
          {items.map((item, index) => (
            <li key={item.href} className="inline-flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {item.current ? (
                <span className="text-sm font-medium text-gray-500" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Helper function to generate breadcrumbs based on current path
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1

    // Convert segment to readable name
    let name = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())

    // Handle special cases
    if (segment === 'collections') {
      name = 'Collections'
    } else if (segment === 'products') {
      name = 'Products'
    } else if (segment === 'all' && segments[index - 1] === 'collections') {
      name = 'All Products'
    } else if (segment === 'hoodies') {
      name = 'Hoodies'
    } else if (segment === 'tshirts') {
      name = 'T-Shirts'
    } else if (segment === 'jeans') {
      name = 'Jeans'
    } else if (segment === 'sneakers') {
      name = 'Sneakers'
    } else if (segment === 'jackets') {
      name = 'Jackets'
    } else if (segment === 'shop-the-look') {
      name = 'Shop The Look'
    } else if (segment === 'track-order') {
      name = 'Track Order'
    } else if (segment === 'ugc') {
      name = 'User Gallery'
    }

    breadcrumbs.push({
      name,
      href: currentPath,
      current: isLast,
    })
  })

  return breadcrumbs
}

// Product-specific breadcrumb generator
export function generateProductBreadcrumbs(
  productName: string, 
  categorySlug: string,
  productSlug: string
): BreadcrumbItem[] {
  const categoryName = categorySlug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())

  return [
    {
      name: 'Collections',
      href: '/collections/all',
    },
    {
      name: categoryName,
      href: `/collections/${categorySlug}`,
    },
    {
      name: productName,
      href: `/products/${productSlug}`,
      current: true,
    },
  ]
}

// Collection-specific breadcrumb generator
export function generateCollectionBreadcrumbs(
  collectionName: string,
  collectionSlug: string
): BreadcrumbItem[] {
  return [
    {
      name: 'Collections',
      href: '/collections/all',
    },
    {
      name: collectionName,
      href: `/collections/${collectionSlug}`,
      current: true,
    },
  ]
}