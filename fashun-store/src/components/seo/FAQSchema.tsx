import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema, null, 2)
      }}
    />
  );
}

// Default FAQ data for FASHUN.CO
export const defaultFAQs: FAQItem[] = [
  {
    question: "What is FASHUN.CO's return policy?",
    answer: "We offer a 30-day return policy for all unworn items with original tags. Returns are free for orders over ₹2000."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-7 business days across India. Express shipping (1-3 days) is available in major cities."
  },
  {
    question: "Do you offer cash on delivery?",
    answer: "Yes, we offer cash on delivery (COD) for orders across India. COD is available for orders up to ₹10,000."
  },
  {
    question: "What sizes do you offer?",
    answer: "We offer sizes from XS to 3XL for most products. Check individual product pages for specific size charts."
  },
  {
    question: "Are your products authentic?",
    answer: "Yes, all products on FASHUN.CO are 100% authentic. We source directly from brands and authorized distributors."
  },
  {
    question: "Do you offer custom printing services?",
    answer: "Yes, we offer custom printing on select products. Visit our Custom Design section to create your unique apparel."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, digital wallets, and cash on delivery."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via SMS and email. You can also track orders in your account."
  }
];