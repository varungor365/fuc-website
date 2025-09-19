/**
 * SEO Enhancement Service
 * Provides comprehensive search engine optimization with dynamic content and analytics
 */

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  socialMedia: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  analytics: {
    googleAnalytics?: string;
    googleTagManager?: string;
    facebookPixel?: string;
  };
  verification: {
    google?: string;
    bing?: string;
    yandex?: string;
  };
}

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  alternateUrls?: Record<string, string>;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    url?: string;
  };
  twitter: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  schema?: SchemaMarkup[];
  robots?: {
    index?: boolean;
    follow?: boolean;
    archive?: boolean;
    snippet?: boolean;
    imageindex?: boolean;
  };
}

export interface SchemaMarkup {
  type: 'Product' | 'Organization' | 'Website' | 'Article' | 'BreadcrumbList' | 'FAQPage' | 'Review';
  data: Record<string, any>;
}

export interface SEOAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  searchTraffic: {
    organic: number;
    paid: number;
    social: number;
    direct: number;
  };
  topKeywords: Array<{
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
    ctr: number;
  }>;
  topPages: Array<{
    url: string;
    views: number;
    uniqueViews: number;
    averageTime: number;
  }>;
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
}

export interface SEOAuditResult {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: 'content' | 'technical' | 'performance' | 'mobile' | 'accessibility';
    message: string;
    element?: string;
    recommendation: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  opportunities: Array<{
    category: string;
    description: string;
    potentialImpact: number;
    effort: 'low' | 'medium' | 'high';
    implementation: string;
  }>;
  technicalSEO: {
    crawlability: number;
    indexability: number;
    siteSpeed: number;
    mobileOptimization: number;
    securityScore: number;
  };
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: Record<string, string>;
  images?: Array<{
    url: string;
    title?: string;
    caption?: string;
  }>;
}

class SEOEnhancementService {
  private config: SEOConfig;
  private baseUrl = '/api/seo';
  private performanceObserver: PerformanceObserver | null = null;
  private coreWebVitals: Record<string, number> = {};

  constructor(config: SEOConfig) {
    this.config = config;
    this.initializePerformanceMonitoring();
  }

  /**
   * Generate comprehensive meta tags for a page
   */
  generateMetaTags(pageSEO: PageSEO): string {
    const tags: string[] = [];

    // Basic meta tags
    tags.push(`<title>${this.escapeHtml(pageSEO.title)}</title>`);
    tags.push(`<meta name="description" content="${this.escapeHtml(pageSEO.description)}" />`);
    
    if (pageSEO.keywords && pageSEO.keywords.length > 0) {
      tags.push(`<meta name="keywords" content="${pageSEO.keywords.join(', ')}" />`);
    }

    // Canonical URL
    if (pageSEO.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${pageSEO.canonicalUrl}" />`);
    }

    // Alternate language URLs
    if (pageSEO.alternateUrls) {
      Object.entries(pageSEO.alternateUrls).forEach(([lang, url]) => {
        tags.push(`<link rel="alternate" hreflang="${lang}" href="${url}" />`);
      });
    }

    // Robots meta
    if (pageSEO.robots) {
      const robotsContent = Object.entries(pageSEO.robots)
        .filter(([, value]) => value === true)
        .map(([key]) => key)
        .join(', ');
      
      if (robotsContent) {
        tags.push(`<meta name="robots" content="${robotsContent}" />`);
      }
    }

    // Open Graph tags
    if (pageSEO.openGraph) {
      const og = pageSEO.openGraph;
      if (og.title) tags.push(`<meta property="og:title" content="${this.escapeHtml(og.title)}" />`);
      if (og.description) tags.push(`<meta property="og:description" content="${this.escapeHtml(og.description)}" />`);
      if (og.image) tags.push(`<meta property="og:image" content="${og.image}" />`);
      if (og.type) tags.push(`<meta property="og:type" content="${og.type}" />`);
      if (og.url) tags.push(`<meta property="og:url" content="${og.url}" />`);
      
      tags.push(`<meta property="og:site_name" content="${this.escapeHtml(this.config.siteName)}" />`);
    }

    // Twitter Card tags
    if (pageSEO.twitter) {
      const twitter = pageSEO.twitter;
      if (twitter.card) tags.push(`<meta name="twitter:card" content="${twitter.card}" />`);
      if (twitter.title) tags.push(`<meta name="twitter:title" content="${this.escapeHtml(twitter.title)}" />`);
      if (twitter.description) tags.push(`<meta name="twitter:description" content="${this.escapeHtml(twitter.description)}" />`);
      if (twitter.image) tags.push(`<meta name="twitter:image" content="${twitter.image}" />`);
      if (twitter.creator) tags.push(`<meta name="twitter:creator" content="${twitter.creator}" />`);
      
      if (this.config.socialMedia.twitter) {
        tags.push(`<meta name="twitter:site" content="${this.config.socialMedia.twitter}" />`);
      }
    }

    // Verification tags
    if (this.config.verification.google) {
      tags.push(`<meta name="google-site-verification" content="${this.config.verification.google}" />`);
    }
    if (this.config.verification.bing) {
      tags.push(`<meta name="msvalidate.01" content="${this.config.verification.bing}" />`);
    }
    if (this.config.verification.yandex) {
      tags.push(`<meta name="yandex-verification" content="${this.config.verification.yandex}" />`);
    }

    return tags.join('\n    ');
  }

  /**
   * Generate JSON-LD structured data
   */
  generateStructuredData(schemas: SchemaMarkup[]): string {
    const structuredData = schemas.map(schema => ({
      '@context': 'https://schema.org',
      '@type': schema.type,
      ...schema.data
    }));

    return `<script type="application/ld+json">
${JSON.stringify(structuredData.length === 1 ? structuredData[0] : structuredData, null, 2)}
</script>`;
  }

  /**
   * Generate product schema for e-commerce
   */
  generateProductSchema(product: {
    name: string;
    description: string;
    image: string[];
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand: string;
    sku: string;
    reviews?: Array<{
      author: string;
      rating: number;
      reviewBody: string;
      datePublished: string;
    }>;
  }): SchemaMarkup {
    const schema: any = {
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        seller: {
          '@type': 'Organization',
          name: this.config.siteName
        }
      }
    };

    // Add aggregated rating if reviews exist
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / product.reviews.length;

      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: averageRating,
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1
      };

      schema.review = product.reviews.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.reviewBody,
        datePublished: review.datePublished
      }));
    }

    return {
      type: 'Product',
      data: schema
    };
  }

  /**
   * Generate organization schema
   */
  generateOrganizationSchema(): SchemaMarkup {
    return {
      type: 'Organization',
      data: {
        name: this.config.siteName,
        url: this.config.siteUrl,
        logo: `${this.config.siteUrl}/logo.png`,
        sameAs: Object.values(this.config.socialMedia).filter(Boolean)
      }
    };
  }

  /**
   * Generate breadcrumb schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): SchemaMarkup {
    return {
      type: 'BreadcrumbList',
      data: {
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      }
    };
  }

  /**
   * Optimize images for SEO
   */
  async optimizeImageSEO(
    imageUrl: string,
    altText: string,
    title?: string,
    caption?: string
  ): Promise<{
    optimizedUrl: string;
    altText: string;
    title?: string;
    caption?: string;
    structuredData?: SchemaMarkup;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/optimize-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: imageUrl,
          altText,
          title,
          caption
        })
      });

      if (!response.ok) {
        throw new Error(`Image SEO optimization failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Image SEO optimization failed:', error);
      return {
        optimizedUrl: imageUrl,
        altText,
        title,
        caption
      };
    }
  }

  /**
   * Generate dynamic sitemap
   */
  async generateSitemap(
    entries: SitemapEntry[],
    options?: {
      includePriority?: boolean;
      includeImages?: boolean;
      includeAlternates?: boolean;
      maxUrls?: number;
    }
  ): Promise<string> {
    try {
      const opts = {
        includePriority: true,
        includeImages: true,
        includeAlternates: true,
        maxUrls: 50000,
        ...options
      };

      const limitedEntries = entries.slice(0, opts.maxUrls);

      let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
      
      if (opts.includeImages) {
        sitemap += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
      }
      
      if (opts.includeAlternates) {
        sitemap += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
      }
      
      sitemap += '>\n';

      for (const entry of limitedEntries) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;
        sitemap += `    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n`;
        sitemap += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
        
        if (opts.includePriority) {
          sitemap += `    <priority>${entry.priority}</priority>\n`;
        }

        // Add alternate language links
        if (opts.includeAlternates && entry.alternates) {
          Object.entries(entry.alternates).forEach(([lang, url]) => {
            sitemap += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${this.escapeXml(url)}" />\n`;
          });
        }

        // Add image entries
        if (opts.includeImages && entry.images) {
          entry.images.forEach(image => {
            sitemap += '    <image:image>\n';
            sitemap += `      <image:loc>${this.escapeXml(image.url)}</image:loc>\n`;
            if (image.title) {
              sitemap += `      <image:title>${this.escapeXml(image.title)}</image:title>\n`;
            }
            if (image.caption) {
              sitemap += `      <image:caption>${this.escapeXml(image.caption)}</image:caption>\n`;
            }
            sitemap += '    </image:image>\n';
          });
        }

        sitemap += '  </url>\n';
      }

      sitemap += '</urlset>';
      return sitemap;

    } catch (error) {
      console.error('Sitemap generation failed:', error);
      return '';
    }
  }

  /**
   * Perform comprehensive SEO audit
   */
  async performSEOAudit(url: string): Promise<SEOAuditResult> {
    try {
      const response = await fetch(`${this.baseUrl}/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          config: this.config,
          coreWebVitals: this.coreWebVitals
        })
      });

      if (!response.ok) {
        throw new Error(`SEO audit failed: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('SEO audit failed:', error);
      
      // Return basic audit result
      return {
        score: 0,
        issues: [{
          type: 'error',
          category: 'technical',
          message: 'Unable to perform SEO audit',
          recommendation: 'Check network connectivity and try again',
          impact: 'high'
        }],
        opportunities: [],
        technicalSEO: {
          crawlability: 0,
          indexability: 0,
          siteSpeed: 0,
          mobileOptimization: 0,
          securityScore: 0
        }
      };
    }
  }

  /**
   * Track SEO performance metrics
   */
  async trackSEOMetrics(
    pageUrl: string,
    eventType: 'pageview' | 'interaction' | 'conversion',
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      // Google Analytics 4
      if (this.config.analytics.googleAnalytics && typeof gtag !== 'undefined') {
        gtag('event', eventType, {
          page_url: pageUrl,
          page_title: document.title,
          ...additionalData
        });
      }

      // Custom analytics tracking
      await fetch(`${this.baseUrl}/track-metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: pageUrl,
          eventType,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          coreWebVitals: this.coreWebVitals,
          ...additionalData
        })
      });

    } catch (error) {
      console.error('SEO metrics tracking failed:', error);
    }
  }

  /**
   * Get SEO analytics dashboard data
   */
  async getSEOAnalytics(
    timeframe: 'day' | 'week' | 'month' | 'quarter' = 'week'
  ): Promise<SEOAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SEO analytics: ${response.statusText}`);
      }
      
      return await response.json();

    } catch (error) {
      console.error('Failed to fetch SEO analytics:', error);
      
      // Return empty analytics
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        averageTimeOnPage: 0,
        searchTraffic: {
          organic: 0,
          paid: 0,
          social: 0,
          direct: 0
        },
        topKeywords: [],
        topPages: [],
        coreWebVitals: {
          lcp: 0,
          fid: 0,
          cls: 0,
          fcp: 0,
          ttfb: 0
        }
      };
    }
  }

  /**
   * Optimize page for featured snippets
   */
  optimizeForFeaturedSnippets(content: {
    question: string;
    answer: string;
    additionalInfo?: string;
  }): string {
    return `
      <div itemScope itemType="https://schema.org/Question">
        <h3 itemprop="name">${this.escapeHtml(content.question)}</h3>
        <div itemScope itemType="https://schema.org/Answer" itemprop="acceptedAnswer">
          <div itemprop="text">
            <p>${this.escapeHtml(content.answer)}</p>
            ${content.additionalInfo ? `<p>${this.escapeHtml(content.additionalInfo)}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate FAQ schema
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaMarkup {
    return {
      type: 'FAQPage',
      data: {
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    };
  }

  /**
   * Initialize Core Web Vitals monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.coreWebVitals.lcp = entry.startTime;
          } else if (entry.entryType === 'first-input') {
            this.coreWebVitals.fid = (entry as any).processingStart - entry.startTime;
          } else if (entry.entryType === 'layout-shift') {
            if (!(entry as any).hadRecentInput) {
              this.coreWebVitals.cls = (this.coreWebVitals.cls || 0) + (entry as any).value;
            }
          } else if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            this.coreWebVitals.fcp = entry.startTime;
          } else if (entry.entryType === 'navigation') {
            this.coreWebVitals.ttfb = (entry as any).responseStart;
          }
        });
      });

      try {
        this.performanceObserver.observe({ 
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }

    // Track CLS over time
    let clsValue = 0;
    let clsEntries: any[] = [];

    const trackCLS = (entries: any[]) => {
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      });
      this.coreWebVitals.cls = clsValue;
    };

    // Report CLS on page unload
    window.addEventListener('beforeunload', () => {
      if (clsEntries.length > 0) {
        this.trackSEOMetrics(window.location.href, 'interaction', {
          metric: 'cls',
          value: clsValue
        });
      }
    });
  }

  /**
   * Helper methods
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Cleanup performance monitoring
   */
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

// Global performance tracking functions for Core Web Vitals
declare global {
  function gtag(...args: any[]): void;
}

export default SEOEnhancementService;