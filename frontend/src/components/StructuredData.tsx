import React from 'react';
import Head from 'next/head';

interface StructuredDataProps {
  type: 'WebApplication' | 'Article' | 'FAQPage';
  name: string;
  description: string;
  url: string;
  image?: string;
  additionalData?: Record<string, any>;
}

/**
 * Component to add structured data (Schema.org) to pages
 * This helps search engines better understand your content
 */
export default function StructuredData({
  type,
  name,
  description,
  url,
  image = 'https://writelli.com/images/writelli-logo.png',
  additionalData = {}
}: StructuredDataProps) {
  // Base schema
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    'name': name,
    'description': description,
    'url': url,
    'image': image
  };

  // Add type-specific properties
  let schema = { ...baseSchema };
  
  if (type === 'WebApplication') {
    schema = {
      ...schema,
      'applicationCategory': 'WritingApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'operatingSystem': 'Web',
      'provider': {
        '@type': 'Organization',
        'name': 'Writelli',
        'url': 'https://writelli.com'
      },
      ...additionalData
    } as any; // Type assertion to avoid TypeScript errors with schema properties
  }
  
  // Add any additional custom data
  schema = { ...schema, ...additionalData };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
