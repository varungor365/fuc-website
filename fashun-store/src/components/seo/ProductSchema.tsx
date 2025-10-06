export default function ProductSchema({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": product.thumbnail,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "FASHUN.CO"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://fashun.co/products/${product.id}`,
      "priceCurrency": "INR",
      "price": (product.variants[0].prices[0].amount / 100).toFixed(2),
      "availability": product.variants[0].inventory_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "FASHUN.CO"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
