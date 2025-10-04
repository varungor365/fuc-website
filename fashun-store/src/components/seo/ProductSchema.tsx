import React from 'react';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition?: 'New' | 'Used' | 'Refurbished';
  brand?: string;
  category?: string;
  sku?: string;
  gtin?: string;
  url: string;
  reviews?: {
    rating: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  offers?: {
    priceCurrency: string;
    price: number;
    priceValidUntil?: string;
    availability: string;
    seller: string;
  };
}

export default function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'INR',
  availability = 'InStock',
  condition = 'New',
  brand = 'FASHUN.CO',
  category,
  sku,
  gtin,
  url,
  reviews,
  offers
}: ProductSchemaProps) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "sku": sku,
    "gtin": gtin,
    "category": category,
    "url": url,
    "offers": {
      "@type": "Offer",
      "priceCurrency": currency,
      "price": price,
      "priceValidUntil": offers?.priceValidUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": `https://schema.org/${availability}`,
      "itemCondition": `https://schema.org/${condition}Condition`,
      "seller": {
        "@type": "Organization",
        "name": offers?.seller || "FASHUN.CO"
      },
      "url": url,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": currency
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue", 
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(reviews && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviews.rating,
        "reviewCount": reviews.reviewCount,
        "bestRating": reviews.bestRating || 5,
        "worstRating": reviews.worstRating || 1
      }
    }),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": "Premium Cotton Blend"
      },
      {
        "@type": "PropertyValue", 
        "name": "Care Instructions",
        "value": "Machine wash cold, tumble dry low"
      },
      {
        "@type": "PropertyValue",
        "name": "Return Policy",
        "value": "30-day return policy"
      }
    ],
    "isRelatedTo": [
      {
        "@type": "Product",
        "name": "Streetwear Accessories"
      }
    ],
    "manufacturer": {
      "@type": "Organization",
      "name": brand
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema, null, 2)
      }}
    />
  );
}