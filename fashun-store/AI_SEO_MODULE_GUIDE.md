# AI SEO Module - Complete Implementation Guide

## 🚀 Overview

The AI SEO Module is a comprehensive, autonomous SEO optimization system designed for FashUn.Co.in. It provides real-time content analysis, automatic optimization suggestions, performance monitoring, and seamless integration with Next.js applications.

## ✨ Key Features

### 🤖 Autonomous SEO Engine
- **Real-time Content Analysis**: Instant SEO scoring and suggestions
- **Auto-optimization**: AI-powered title and meta description generation
- **Performance Monitoring**: Core Web Vitals tracking and alerts
- **Structured Data**: Automatic JSON-LD schema generation
- **Keyword Analysis**: Intelligent keyword extraction and optimization

### 🎯 Smart Optimization
- **Content Type Recognition**: Product, collection, blog, and page optimization
- **Brand-aware Optimization**: All suggestions include "FashUn.Co.in" branding
- **A/B Testing**: Multiple optimization variants for testing
- **Readability Analysis**: Content quality assessment and improvements
- **Internal Linking**: Smart suggestion engine for better site structure

### 📊 Comprehensive Monitoring
- **SEO Task Queue**: Background processing with priority management
- **Performance Alerts**: Automatic detection of Core Web Vitals issues
- **Weekly Reports**: Comprehensive SEO health analysis
- **Real-time Dashboard**: Live monitoring interface
- **Progress Tracking**: Visual SEO score indicators

## 🔧 Installation & Setup

### 1. Module Structure
```
src/lib/ai-seo/
├── engine.ts              # Core SEO analysis engine
├── manager.ts             # Autonomous task management
├── hooks.ts               # React hooks for integration
├── index.ts               # Main exports and utilities
└── components/
    ├── SEODashboard.tsx    # Comprehensive dashboard
    └── SEOWidget.tsx       # Real-time optimization widget
```

### 2. Environment Variables
Add to your `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_PAGESPEED_API_KEY=your_pagespeed_api_key
```

### 3. Dependencies
Ensure these are in your `package.json`:
```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "zustand": "^4.4.0"
  }
}
```

## 💻 Usage Examples

### Basic Integration

```tsx
import { SEOWidget, SEOProgress, seoUtils } from '@/lib/ai-seo'

// Real-time SEO widget
<SEOWidget 
  content={{
    title: 'Premium Hoodies - FashUn.Co.in',
    description: 'Shop premium streetwear hoodies',
    type: 'collection'
  }}
  onOptimization={(optimized) => {
    // Handle optimized content
    console.log('Optimized:', optimized)
  }}
/>

// SEO score indicator
<SEOProgress 
  content={content} 
  size="md" 
  showLabel={true} 
/>
```

### Advanced Usage

```tsx
import { useAISEOAnalysis, useAISEOOptimization } from '@/lib/ai-seo'

function ProductPage({ product }) {
  const content = {
    title: product.title,
    description: product.description,
    type: 'product',
    url: `/products/${product.slug}`
  }

  // Real-time analysis
  const { analysis, loading } = useAISEOAnalysis(content)
  
  // Auto-optimization
  const { optimizeContent } = useAISEOOptimization()

  const handleOptimize = async () => {
    const result = await optimizeContent(content)
    // Apply optimizations
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <SEOScoreBadge content={content} />
      {analysis && analysis.score < 80 && (
        <button onClick={handleOptimize}>
          Optimize SEO
        </button>
      )}
    </div>
  )
}
```

### Metadata Generation

```tsx
// In your page.tsx file
import { seoUtils } from '@/lib/ai-seo'

export async function generateMetadata({ params }) {
  const content = {
    title: 'Your Page Title',
    description: 'Your page description',
    url: `https://fashun.co.in/your-page`,
    type: 'page'
  }

  return await seoUtils.generateMetadata(content)
}
```

## 🎛️ Components Reference

### SEOWidget
Real-time optimization widget with auto-suggestions.

```tsx
<SEOWidget
  content={ContentInput}       // Required: Content to analyze
  onOptimization={function}    // Optional: Callback for optimizations
  className={string}           // Optional: CSS classes
  compact={boolean}            // Optional: Compact mode (default: false)
/>
```

### SEODashboard
Comprehensive monitoring dashboard.

```tsx
<SEODashboard
  className={string}           // Optional: CSS classes
/>
```

### SEOProgress
Visual SEO score indicator.

```tsx
<SEOProgress
  content={ContentInput}       // Required: Content to analyze
  showLabel={boolean}          // Optional: Show score label (default: true)
  size={'sm'|'md'|'lg'}       // Optional: Size variant (default: 'md')
  className={string}           // Optional: CSS classes
/>
```

### SEOScoreBadge
Compact SEO score display.

```tsx
<SEOScoreBadge
  content={ContentInput}       // Required: Content to analyze
  className={string}           // Optional: CSS classes
/>
```

## 🪝 Hooks Reference

### useAISEOAnalysis
Real-time content analysis with debouncing.

```tsx
const { analysis, loading, error, refetch } = useAISEOAnalysis(
  content,                     // ContentInput
  enabled                      // boolean (default: true)
)
```

### useAISEOOptimization
Content optimization with AI suggestions.

```tsx
const { 
  optimization, 
  optimizeContent, 
  loading, 
  error 
} = useAISEOOptimization()

// Usage
const result = await optimizeContent(content)
```

### useAISEOTasks
Monitor SEO tasks and queue new ones.

```tsx
const { 
  tasks, 
  loading, 
  refreshTasks, 
  queueAnalysis 
} = useAISEOTasks(filters)

// Queue new analysis
const taskId = await queueAnalysis(content, 'high')
```

### useAISEOPerformance
Core Web Vitals monitoring.

```tsx
const { 
  performance, 
  monitorPerformance, 
  loading, 
  error 
} = useAISEOPerformance(url, autoMonitor)
```

### useAISEOReport
Generate comprehensive SEO reports.

```tsx
const { 
  report, 
  generateReport, 
  loading, 
  error 
} = useAISEOReport('weekly')
```

### useAISEOScore
Get SEO score with visual indicators.

```tsx
const { 
  score, 
  scoreColor, 
  scoreLabel, 
  breakdown, 
  loading 
} = useAISEOScore(content)
```

### useAISEOAutoOptimize
Automatic optimization with user confirmation.

```tsx
const {
  suggestions,
  optimizedContent,
  hasOptimizations,
  applyOptimizations,
  rejectOptimizations,
  applied
} = useAISEOAutoOptimize(content, autoApply)
```

## 🎯 ContentInput Interface

```typescript
interface ContentInput {
  title?: string              // Page title
  description?: string        // Meta description
  content?: string           // Page content for analysis
  url?: string               // Page URL
  type?: 'product' | 'collection' | 'blog' | 'page'
  meta?: Record<string, any> // Additional metadata
}
```

## 📊 SEOAnalysis Interface

```typescript
interface SEOAnalysis {
  score: number              // Overall SEO score (0-100)
  title: {
    score: number
    suggestions: string[]
    optimized?: string
  }
  description: {
    score: number
    suggestions: string[]
    optimized?: string
  }
  keywords: {
    primary: string[]
    secondary: string[]
    missing: string[]
  }
  readability: {
    score: number
    grade: string
    improvements: string[]
  }
  performance: {
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
    }
    pageSpeed: number
  }
  schema: {
    hasStructuredData: boolean
    suggestions: string[]
  }
  internalLinks: {
    count: number
    suggestions: Array<{
      anchor: string
      target: string
      relevance: number
    }>
  }
}
```

## 🔧 Configuration

### SEOConfig Interface

```typescript
interface SEOConfig {
  autoOptimize: boolean          // Enable auto-optimization
  monitoringInterval: number     // Monitoring interval in minutes
  performanceThreshold: number   // Performance score threshold
  enableRealTimeAnalysis: boolean
  targetKeywords: string[]       // Primary keywords to target
  competitorUrls?: string[]      // Competitor URLs for analysis
}
```

### Default Configuration

```typescript
const defaultConfig = {
  autoOptimize: true,
  monitoringInterval: 30,
  performanceThreshold: 80,
  enableRealTimeAnalysis: true,
  targetKeywords: [
    'streetwear', 
    'premium fashion', 
    'hoodies', 
    'custom design', 
    'FashUn.Co.in'
  ]
}
```

## 🚀 Auto-start Configuration

The AI SEO module automatically starts monitoring in production:

```typescript
// Auto-start in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  seoUtils.startMonitoring({
    autoOptimize: true,
    monitoringInterval: 30,
    performanceThreshold: 80,
    enableRealTimeAnalysis: true,
    targetKeywords: ['streetwear', 'premium fashion', 'hoodies', 'custom design', 'FashUn.Co.in']
  })
}
```

## 🎨 Styling & Theming

The components use FashUn.Co.in's design system:

- **Primary Color**: `#E4C590` (Gold accent)
- **Background**: `#0F0F10` (Dark background)
- **Text**: `#E8E8E8` (Light text)
- **Border**: `border-gray-800`

### Custom Styling

```tsx
<SEOWidget 
  className="custom-seo-widget bg-custom-bg border-custom-border"
  content={content}
/>
```

## 📈 Performance Considerations

### Optimization Features
- **Debounced Analysis**: 500ms debounce for real-time analysis
- **Background Processing**: SEO tasks run in background
- **Caching**: Analysis results are cached for performance
- **Lazy Loading**: Components load only when needed

### Memory Management
- **Auto-cleanup**: Timers and intervals are properly cleaned up
- **Efficient Updates**: Only re-analyze when content actually changes
- **Task Limits**: Maximum 5 tasks processed per cycle

## 🔍 Monitoring & Debugging

### Debug Mode
Enable debug logging:

```typescript
localStorage.setItem('ai-seo-debug', 'true')
```

### Task Monitoring
View active tasks:

```typescript
import { aiSeoManager } from '@/lib/ai-seo'

// Get all tasks
const tasks = aiSeoManager.getAllTasks()

// Get specific task
const task = aiSeoManager.getTask(taskId)

// Filter tasks
const pendingTasks = aiSeoManager.getAllTasks({ status: 'pending' })
```

## 🔗 Integration Examples

### Product Pages
```tsx
// src/app/products/[id]/page.tsx
import { SEOWidget, seoUtils } from '@/lib/ai-seo'

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  
  return await seoUtils.generateMetadata({
    title: product.name,
    description: product.description,
    type: 'product',
    url: `https://fashun.co.in/products/${params.id}`,
    meta: {
      image: product.image,
      price: product.price,
      availability: product.stock > 0 ? 'InStock' : 'OutOfStock'
    }
  })
}

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  
  useEffect(() => {
    getProduct(params.id).then(setProduct)
  }, [params.id])
  
  if (!product) return <div>Loading...</div>
  
  const content = {
    title: product.name,
    description: product.description,
    type: 'product' as const,
    url: `https://fashun.co.in/products/${params.id}`
  }
  
  return (
    <div>
      <h1>{product.name}</h1>
      <SEOWidget content={content} compact={true} />
      {/* Rest of your product page */}
    </div>
  )
}
```

### Collection Pages
```tsx
// src/app/collections/[slug]/page.tsx
import { SEOProgress, useAISEOScore } from '@/lib/ai-seo'

export default function CollectionPage({ params }) {
  const content = {
    title: `${params.slug} Collection - FashUn.Co.in`,
    description: `Shop premium ${params.slug} at FashUn.Co.in`,
    type: 'collection' as const,
    url: `https://fashun.co.in/collections/${params.slug}`
  }
  
  const { score, scoreLabel } = useAISEOScore(content)
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>{params.slug} Collection</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">SEO: {scoreLabel}</span>
          <SEOProgress content={content} size="sm" showLabel={false} />
        </div>
      </div>
      {/* Rest of your collection page */}
    </div>
  )
}
```

### Blog Posts
```tsx
// src/app/blog/[slug]/page.tsx
import { SEOScoreBadge, seoUtils } from '@/lib/ai-seo'

export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug)
  
  return await seoUtils.generateMetadata({
    title: post.title,
    description: post.excerpt,
    type: 'blog',
    url: `https://fashun.co.in/blog/${params.slug}`,
    meta: {
      author: post.author,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags
    }
  })
}

export default function BlogPost({ params }) {
  const [post, setPost] = useState(null)
  
  useEffect(() => {
    getBlogPost(params.slug).then(setPost)
  }, [params.slug])
  
  if (!post) return <div>Loading...</div>
  
  const content = {
    title: post.title,
    description: post.excerpt,
    content: post.content,
    type: 'blog' as const,
    url: `https://fashun.co.in/blog/${params.slug}`
  }
  
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{post.author}</span>
          <span>{post.publishedAt}</span>
          <SEOScoreBadge content={content} />
        </div>
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

## 🛠️ Troubleshooting

### Common Issues

**1. SEO Analysis Not Working**
- Check if `OPENAI_API_KEY` is set
- Verify content has `title` field
- Enable debug mode to see detailed logs

**2. Performance Monitoring Issues**
- Check if `GOOGLE_PAGESPEED_API_KEY` is set
- Verify URL is accessible
- Check network connectivity

**3. TypeScript Errors**
- Ensure all dependencies are installed
- Check import paths are correct
- Verify TypeScript configuration

### Debug Commands

```typescript
// Enable debug mode
localStorage.setItem('ai-seo-debug', 'true')

// Check manager status
console.log('SEO Manager:', aiSeoManager.isRunning)

// View all tasks
console.log('Tasks:', aiSeoManager.getAllTasks())

// Check analysis
const analysis = await aiSeoEngine.analyzeContent(content)
console.log('Analysis:', analysis)
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables set
- [ ] All dependencies installed
- [ ] TypeScript compilation successful
- [ ] Components render without errors
- [ ] Auto-monitoring starts correctly

### Environment Setup
```env
# Required for AI optimization
OPENAI_API_KEY=sk-...

# Required for performance monitoring
GOOGLE_PAGESPEED_API_KEY=...

# Optional: Enable additional features
NEXT_PUBLIC_SEO_DEBUG=false
```

## 📝 API Reference

### Core Methods

```typescript
// Engine Methods
aiSeoEngine.analyzeContent(content: ContentInput): Promise<SEOAnalysis>
aiSeoEngine.generateOptimizedTitle(content: ContentInput): Promise<string[]>
aiSeoEngine.generateOptimizedDescription(content: ContentInput): Promise<string[]>
aiSeoEngine.generateStructuredData(content: ContentInput): Record<string, any>
aiSeoEngine.monitorPerformance(url: string): Promise<PerformanceMetrics>

// Manager Methods
aiSeoManager.start(): void
aiSeoManager.stop(): void
aiSeoManager.queueAnalysis(content: ContentInput, priority: Priority): Promise<string>
aiSeoManager.analyzeContent(content: ContentInput): Promise<SEOAnalysis>
aiSeoManager.optimizeContent(content: ContentInput): Promise<OptimizationResult>
aiSeoManager.generateReport(timeframe: Timeframe): Promise<SEOReport>
aiSeoManager.monitorPerformance(urls: string[]): Promise<void>
aiSeoManager.getTask(taskId: string): SEOTask | undefined
aiSeoManager.getAllTasks(filter?: TaskFilter): SEOTask[]

// Utils Methods
seoUtils.optimizePage(content: ContentInput): Promise<ContentInput>
seoUtils.generateMetadata(content: ContentInput): Promise<Metadata>
seoUtils.startMonitoring(config?: Partial<SEOConfig>): void
seoUtils.analyzeSite(pages: ContentInput[]): Promise<string[]>
seoUtils.getSiteHealth(): Promise<SEOReport>
```

---

## 🎉 Summary

The AI SEO Module provides:

✅ **Autonomous SEO optimization** with real-time analysis  
✅ **Complete Next.js integration** with React hooks and components  
✅ **Performance monitoring** with Core Web Vitals tracking  
✅ **Brand-aware optimization** for FashUn.Co.in  
✅ **Comprehensive reporting** and analytics  
✅ **TypeScript support** with full type safety  
✅ **Production-ready** with auto-start configuration  

Start optimizing your SEO today with just a few lines of code! 🚀
