import React from 'react';

interface LocalBusinessSchemaProps {
  businessName?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  url?: string;
  openingHours?: string[];
  priceRange?: string;
  logo?: string;
  image?: string[];
  category?: string;
  areaServed?: string[];
  paymentAccepted?: string[];
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export default function LocalBusinessSchema({
  businessName = "FASHUN.CO",
  description = "Premium streetwear fashion platform offering curated collections of trendy apparel, accessories, and lifestyle products for the modern style-conscious consumer.",
  address = {
    streetAddress: "Fashion District",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "400001",
    addressCountry: "IN"
  },
  telephone = "+91-XXXX-XXXXXX",
  email = "contact@fashun.co.in",
  url = "https://fashun.co.in",
  openingHours = [
    "Mo-Su 00:00-23:59" // 24/7 online store
  ],
  priceRange = "₹₹-₹₹₹",
  logo = "https://fashun.co.in/images/brand/logo.svg",
  image = [
    "https://fashun.co.in/images/store-front.jpg",
    "https://fashun.co.in/images/product-collection.jpg"
  ],
  category = "Clothing Store",
  areaServed = ["India", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"],
  paymentAccepted = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash on Delivery"],
  socialMedia = {
    facebook: "https://facebook.com/fashunco",
    twitter: "https://twitter.com/fashunco", 
    instagram: "https://instagram.com/fashunco"
  }
}: LocalBusinessSchemaProps) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": businessName,
    "description": description,
    "url": url,
    "logo": logo,
    "image": image,
    "telephone": telephone,
    "email": email,
    "priceRange": priceRange,
    "category": category,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "addressRegion": address.addressRegion,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "19.0760",
      "longitude": "72.8777"
    },
    "openingHoursSpecification": openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.split(' ')[0].split('-').length > 1 ? 
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] :
        [hours.split(' ')[0]],
      "opens": hours.split(' ')[1].split('-')[0],
      "closes": hours.split(' ')[1].split('-')[1]
    })),
    "areaServed": areaServed.map(area => ({
      "@type": "Country",
      "name": area
    })),
    "paymentAccepted": paymentAccepted,
    "sameAs": Object.values(socialMedia).filter(Boolean),
    "potentialAction": {
      "@type": "BuyAction",
      "target": url
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Fashion Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Streetwear Collection",
            "category": "Clothing"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Accessories Collection",
            "category": "Fashion Accessories"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Fashion Enthusiast"
        },
        "reviewBody": "Amazing quality streetwear with fast delivery. Love the unique designs!"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema, null, 2)
      }}
    />
  );
}