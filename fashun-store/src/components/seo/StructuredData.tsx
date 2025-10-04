import Script from 'next/script'

interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    currency?: string
    availability: 'InStock' | 'OutOfStock' | 'PreOrder'
    condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
    brand: string
    category: string
    image: string[]
    sku: string
    rating?: {
      value: number
      count: number
    }
    reviews?: Array<{
      author: string
      rating: number
      text: string
      datePublished: string
    }>
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: `https://schema.org/${product.availability}`,
      condition: `https://schema.org/${product.condition || 'NewCondition'}`,
      seller: {
        '@type': 'Organization',
        name: 'FASHUN.CO',
        url: 'https://fashun.co.in',
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value,
        ratingCount: product.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(product.reviews && product.reviews.length > 0 && {
      review: product.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: review.text,
        datePublished: review.datePublished,
      })),
    }),
  }

  return (
    <Script
      id="product-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

interface OrganizationSchemaProps {
  organization: {
    name: string
    url: string
    logo: string
    description: string
    address?: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
    contactPoint?: {
      telephone: string
      contactType: string
      email: string
    }
    sameAs?: string[]
  }
}

export function OrganizationSchema({ organization }: OrganizationSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: organization.name,
    url: organization.url,
    logo: organization.logo,
    description: organization.description,
    ...(organization.address && {
      address: {
        '@type': 'PostalAddress',
        ...organization.address,
      },
    }),
    ...(organization.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...organization.contactPoint,
      },
    }),
    ...(organization.sameAs && {
      sameAs: organization.sameAs,
    }),
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

interface WebsiteSchemaProps {
  website: {
    name: string
    url: string
    description: string
    potentialAction?: {
      target: string
      queryInput: string
    }
  }
}

export function WebsiteSchema({ website }: WebsiteSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: website.name,
    url: website.url,
    description: website.description,
    ...(website.potentialAction && {
      potentialAction: {
        '@type': 'SearchAction',
        target: website.potentialAction.target,
        'query-input': website.potentialAction.queryInput,
      },
    }),
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}