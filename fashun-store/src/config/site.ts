// Site configuration - centralized for easy updates
export const siteConfig = {
  name: "FashUn.Co.in",
  title: "FashUn.Co.in - Premium Streetwear & Custom Fashion",
  description: "Discover premium streetwear and create custom designs with FashUn.Co.in. Hoodies, t-shirts, polos, and exclusive fashion pieces for the modern wardrobe.",
  url: "https://fashun.co.in",
  ogImage: "https://fashun.co.in/og.jpg",
  links: {
    twitter: "https://twitter.com/fashunco",
    instagram: "https://instagram.com/fashun.co.in",
    tiktok: "https://tiktok.com/@fashunco",
    youtube: "https://youtube.com/@fashunco",
  },
  keywords: [
    "streetwear",
    "custom fashion",
    "hoodies",
    "t-shirts",
    "premium clothing",
    "fashion",
    "apparel",
    "custom design",
    "india fashion",
    "online shopping",
    "polo shirts",
    "jackets",
    "sweatshirts",
    "pants",
    "shorts",
    "accessories"
  ],
  author: "FashUn.Co.in Team",
  creator: "FashUn.Co.in",
  metadataBase: new URL("https://fashun.co.in"),
  
  // Business Information
  business: {
    name: "FashUn.Co.in",
    legalName: "FashUn Fashion Private Limited",
    email: "hello@fashun.co.in",
    phone: "+91 98765 43210",
    address: {
      street: "123 Fashion Street",
      city: "Mumbai",
      state: "Maharashtra",
      postalCode: "400001",
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
  }
};

export type SiteConfig = typeof siteConfig;
