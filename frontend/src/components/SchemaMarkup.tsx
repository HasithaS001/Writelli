import React from 'react';
import Head from 'next/head';

interface SchemaMarkupProps {
  toolName: string;
  toolDescription: string;
  toolUrl: string;
  toolImage?: string;
}

export default function SchemaMarkup({ 
  toolName, 
  toolDescription, 
  toolUrl,
  toolImage = 'https://writelli.com/images/writelli-logo.png'
}: SchemaMarkupProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': `${toolName} | Writelli`,
    'description': toolDescription,
    'applicationCategory': 'WritingApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'operatingSystem': 'Web',
    'url': toolUrl,
    'image': toolImage,
    'provider': {
      '@type': 'Organization',
      'name': 'Writelli',
      'url': 'https://writelli.com'
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
