// Site configuration - centralized for easy updates
export const siteConfig = {
  name: "FASHUN",
  title: "FASHUN - Premium Streetwear & AI-Powered Fashion",
  description: "Discover premium streetwear, exclusive collections, and AI-powered style recommendations at FASHUN. Elevate your style with our curated fashion pieces.",
  url: "https://fashun.co",
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://fashun.co' : 'http://localhost:3000',
  ogImage: "https://fashun.co/og.jpg",
  links: {
    twitter: "https://twitter.com/fashun.co.in",
    instagram: "https://instagram.com/fashun.co.in",
    tiktok: "https://tiktok.com/@fashun_official",
    youtube: "https://youtube.com/@fashun_official",
    facebook: "https://facebook.com/fashun.official",
    pinterest: "https://pinterest.com/fashun_official",
    linkedin: "https://linkedin.com/company/fashun"
  },
  keywords: [
    "streetwear", 
    "fashion", 
    "premium clothing", 
    "AI fashion", 
    "style recommendations",
    "exclusive collections",
    "urban fashion",
    "designer clothing",
    "smart shopping",
    "personalized fashion",
    "limited edition",
    "sustainable fashion"
  ],
  author: "FASHUN Team",
  creator: "FASHUN",
  metadataBase: new URL("https://fashun.co"),
  
  // Business Information
  business: {
    name: "FASHUN",
    legalName: "FASHUN Fashion Private Limited",
    email: "fashun.co.in@gmail.com",
    supportEmail: "fashun.co.in@gmail.com",
    businessEmail: "fashun.co.in@gmail.com",
    phone: "+919310632271",
    whatsapp: "+919310632271",
    address: {
      street: "Jakhan",
      city: "Dehradun", 
      state: "Uttarakhand",
      postalCode: "248001",
      country: "India"
    },
    gst: "27AAAAA0000A1Z5",
    cin: "U18101MH2024PTC123456"
  },

  // Features and capabilities
  features: {
    customDesign: true,
    aiMockups: true,
    multiplePayments: true,
    internationalShipping: true,
    loyaltyProgram: true,
    sizeGuide: true,
    wishlist: true,
    reviews: true,
    liveChat: true,
    notifications: true
  },

  // Theme and styling
  theme: {
    colors: {
      primary: "#E4C590", // Gold accent
      secondary: "#E8E8E8", // Light text
      background: "#0F0F10", // Dark background
      surface: "#1A1A1A", // Card background
      muted: "#252525", // Muted background
      border: "#333333", // Border color
      text: {
        primary: "#E8E8E8",
        secondary: "#B8B8B8",
        muted: "#888888"
      }
    },
    fonts: {
      sans: ["Inter", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"]
    }
  },

  // Navigation structure
  navigation: {
    main: [
      {
        title: "Shop",
        href: "/shop",
        submenu: [
          { title: "All Products", href: "/shop" },
          { title: "New Arrivals", href: "/shop/new-arrivals" },
          { title: "Best Sellers", href: "/shop/best-sellers" },
          { title: "Sale", href: "/shop/sale" }
        ]
      },
      {
        title: "Categories",
        href: "/categories",
        submenu: [
          { title: "Hoodies", href: "/categories/hoodies" },
          { title: "T-Shirts", href: "/categories/t-shirts" },
          { title: "Polos", href: "/categories/polos" },
          { title: "Jackets", href: "/categories/jackets" },
          { title: "Sweatshirts", href: "/categories/sweatshirts" },
          { title: "Accessories", href: "/categories/accessories" }
        ]
      },
      {
        title: "Custom Design",
        href: "/customize"
      },
      {
        title: "Collections",
        href: "/collections",
        submenu: [
          { title: "Street Essentials", href: "/collections/street-essentials" },
          { title: "Premium Line", href: "/collections/premium" },
          { title: "Limited Edition", href: "/collections/limited-edition" },
          { title: "Collaborations", href: "/collections/collaborations" }
        ]
      }
    ],
    footer: {
      shop: [
        { title: "All Products", href: "/shop" },
        { title: "New Arrivals", href: "/shop/new-arrivals" },
        { title: "Best Sellers", href: "/shop/best-sellers" },
        { title: "Sale", href: "/shop/sale" },
        { title: "Size Guide", href: "/size-guide" }
      ],
      categories: [
        { title: "Hoodies", href: "/categories/hoodies" },
        { title: "T-Shirts", href: "/categories/t-shirts" },
        { title: "Polos", href: "/categories/polos" },
        { title: "Jackets", href: "/categories/jackets" },
        { title: "Accessories", href: "/categories/accessories" }
      ],
      company: [
        { title: "About Us", href: "/about" },
        { title: "Contact", href: "/contact" },
        { title: "Careers", href: "/careers" },
        { title: "Press", href: "/press" },
        { title: "Blog", href: "/blog" }
      ],
      support: [
        { title: "Help Center", href: "/help" },
        { title: "Shipping Info", href: "/shipping" },
        { title: "Returns", href: "/returns" },
        { title: "Size Guide", href: "/size-guide" },
        { title: "Care Instructions", href: "/care" }
      ],
      legal: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
        { title: "Shipping Policy", href: "/shipping-policy" },
        { title: "Return Policy", href: "/return-policy" },
        { title: "Cookie Policy", href: "/cookies" }
      ]
    }
  },

  // Product categories with detailed information
  categories: {
    hoodies: {
      name: "Hoodies",
      slug: "hoodies",
      description: "Premium streetwear hoodies crafted for comfort and style",
      image: "/images/categories/hoodies.jpg",
      seo: {
        title: "Premium Hoodies - FashUn.Co.in",
        description: "Shop premium streetwear hoodies at FashUn.Co.in. High-quality materials, unique designs, and custom options available."
      }
    },
    tshirts: {
      name: "T-Shirts",
      slug: "t-shirts", 
      description: "Essential tees with bold graphics and premium quality",
      image: "/images/categories/tshirts.jpg",
      seo: {
        title: "Designer T-Shirts - FashUn.Co.in",
        description: "Discover premium designer t-shirts with unique graphics and superior comfort at FashUn.Co.in."
      }
    },
    polos: {
      name: "Polos",
      slug: "polos",
      description: "Sophisticated polo shirts blending casual and formal",
      image: "/images/categories/polos.jpg",
      seo: {
        title: "Premium Polo Shirts - FashUn.Co.in", 
        description: "Shop sophisticated polo shirts that blend casual comfort with formal elegance at FashUn.Co.in."
      }
    },
    jackets: {
      name: "Jackets",
      slug: "jackets",
      description: "Statement outerwear for every season and style",
      image: "/images/categories/jackets.jpg",
      seo: {
        title: "Designer Jackets - FashUn.Co.in",
        description: "Premium jackets and outerwear collection featuring unique designs and quality craftsmanship."
      }
    },
    sweatshirts: {
      name: "Sweatshirts", 
      slug: "sweatshirts",
      description: "Cozy comfort meets street style in our sweatshirt collection",
      image: "/images/categories/sweatshirts.jpg",
      seo: {
        title: "Premium Sweatshirts - FashUn.Co.in",
        description: "Comfortable and stylish sweatshirts for everyday wear. Quality materials and unique designs."
      }
    },
    accessories: {
      name: "Accessories",
      slug: "accessories", 
      description: "Complete your look with our curated accessories",
      image: "/images/categories/accessories.jpg",
      seo: {
        title: "Fashion Accessories - FashUn.Co.in",
        description: "Complete your streetwear look with our premium accessories collection including caps, bags, and more."
      }
    }
  },

  // E-commerce settings
  ecommerce: {
    currency: "INR",
    currencySymbol: "₹",
    defaultLanguage: "en",
    supportedLanguages: ["en", "hi"],
    freeShippingThreshold: 2500,
    returnPeriod: 30, // days
    exchangePeriod: 30, // days
    warranty: 6, // months
    
    // Payment methods
    paymentMethods: [
      "credit_card",
      "debit_card", 
      "upi",
      "net_banking",
      "wallet",
      "cod" // Cash on Delivery
    ],

    // Shipping options
    shipping: {
      standard: {
        name: "Standard Delivery",
        description: "3-5 business days",
        cost: 99,
        freeThreshold: 2500
      },
      express: {
        name: "Express Delivery", 
        description: "1-2 business days",
        cost: 199
      },
      premium: {
        name: "Premium Delivery",
        description: "Same day delivery",
        cost: 299,
        availability: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"]
      }
    },

    // Tax settings
    tax: {
      gst: 18, // GST percentage in India
      includedInPrice: false
    }
  },

  // Enhanced feature flags
  advancedFeatures: {
    aiRecommendations: true,
    wishlist: true,
    compareProducts: true,
    guestCheckout: true,
    socialLogin: true,
    newsletter: true,
    reviews: true,
    notifications: true,
    darkMode: true,
    multiCurrency: false,
    inventory: true,
    analytics: true,
    seo: true,
    pwa: true,
    chatSupport: true,
    videoProducts: true,
    ar: false, // Augmented Reality try-on
    personalizedHomepage: true
  },

  // Analytics and tracking
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
    facebookPixel: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID,
    mixpanel: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    gtm: process.env.NEXT_PUBLIC_GTM_ID
  },

  // API configuration
  api: {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.fashun.co' 
      : 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
    retryAttempts: 3
  },

  // Search and AI settings
  search: {
    provider: "internal", // or "algolia", "elasticsearch"
    enableAutocomplete: true,
    enableSpellcheck: true,
    enableSynonyms: true,
    resultsPerPage: 24,
    maxSuggestions: 5
  },

  ai: {
    recommendations: {
      enabled: true,
      maxRecommendations: 8,
      algorithm: "collaborative_filtering" // or "content_based", "hybrid"
    },
    chatbot: {
      enabled: true,
      provider: "openai" // or "dialogflow", "custom"
    }
  },

  // Security settings
  security: {
    enableCSP: true, // Content Security Policy
    enableHSTS: true, // HTTP Strict Transport Security
    enableXSSProtection: true,
    enableRateLimiting: true,
    rateLimitRequests: 100, // requests per minute
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    passwordMinLength: 8
  },

  // Performance settings
  performance: {
    enableImageOptimization: true,
    enableLazyLoading: true,
    enableCaching: true,
    cacheMaxAge: 86400, // 24 hours in seconds
    enableCompression: true,
    enableMinification: true
  }
};

// Helper functions
export const getBaseUrl = () => siteConfig.baseUrl
export const getApiUrl = (endpoint: string) => `${siteConfig.api.baseUrl}${endpoint}`
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: siteConfig.ecommerce.currency,
    minimumFractionDigits: 0
  }).format(amount)
}
export const isFeatureEnabled = (feature: keyof typeof siteConfig.advancedFeatures) => {
  return siteConfig.advancedFeatures[feature]
}

export type SiteConfig = typeof siteConfig;
