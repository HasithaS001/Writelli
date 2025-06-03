import React from 'react';
import { ToolType } from '@/types';
import { usePathname } from 'next/navigation';
import Head from 'next/head';

interface ToolPageWrapperProps {
  toolType: ToolType;
  children: React.ReactNode;
}

// Tool metadata mapping
const toolMetadata: Record<string, {
  title: string;
  description: string;
  keywords: string;
  image: string;
}> = {
  'paraphraser': {
    title: 'AI Paraphrasing Tool | Writelli',
    description: 'Improve your writing with our powerful AI paraphraser — the best paraphrasing tool to rewrite content quickly and accurately.',
    keywords: 'paraphrasing tool, paraphraser​, paraphrasing, ai paraphraser, free paraphrasing tool',
    image: 'paraphraser-og.png'
  },
  'grammar-checker': {
    title: 'AI Grammar Checker | Writelli',
    description: 'Fix grammar errors instantly with our free AI grammar checker. Improve your writing with advanced grammar correction.',
    keywords: 'grammar checker, ai grammar checker, free grammar checker, grammar correction',
    image: 'grammar-checker-og.png'
  },
  'summarizer': {
    title: 'AI Text Summarizer | Writelli',
    description: 'Summarize any text instantly with our free AI text summarizer. Create concise summaries of articles and documents in seconds.',
    keywords: 'text summarizer, ai summarizer, article summarizer, free text summarizer',
    image: 'summarizer-og.png'
  },
  'readability-checker': {
    title: 'AI Readability Checker | Writelli',
    description: "Analyze and improve your text's readability with our free AI readability checker. Get instant readability scores.",
    keywords: 'readability checker, readability score, readability analyzer, reading level checker',
    image: 'readability-checker-og.png'
  },
  'humanizer': {
    title: 'AI Text Humanizer | Writelli',
    description: 'Make AI-generated text sound human with our free AI text humanizer. Remove robotic patterns and create more authentic content.',
    keywords: 'ai text humanizer, humanize ai text, bypass ai detection, make ai text sound human',
    image: 'humanizer-og.png'
  },
  'tone-converter': {
    title: 'AI Tone Converter | Writelli',
    description: 'Transform your writing tone instantly with our free AI tone converter. Convert between formal, casual, and professional tones.',
    keywords: 'tone converter, writing tone changer, text tone adjuster, formal tone converter',
    image: 'tone-converter-og.png'
  },
  'translator': {
    title: 'AI Text Translator | Writelli',
    description: 'Translate text accurately between 100+ languages with our free AI translator. Get natural-sounding translations.',
    keywords: 'ai translator, language translator, text translator, document translator',
    image: 'translator-og.png'
  }
};

export default function ToolPageWrapper({ toolType, children }: ToolPageWrapperProps) {
  const pathname = usePathname();
  const baseUrl = 'https://writelli.com';
  const toolUrl = `${baseUrl}/${toolType}`;
  
  const metadata = toolMetadata[toolType] || {
    title: `AI ${toolType.charAt(0).toUpperCase() + toolType.slice(1)} Tool | Writelli`,
    description: `Use our free AI ${toolType} tool to improve your writing quickly and easily.`,
    keywords: `${toolType}, ai ${toolType}, free ${toolType} tool`,
    image: 'writelli-logo.png'
  };

  // Schema.org structured data for search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': metadata.title,
    'description': metadata.description,
    // Custom properties for WebApplication schema
    'applicationCategory': 'WritingApplication',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'operatingSystem': 'Web',
    'url': toolUrl,
    'image': `${baseUrl}/images/${metadata.image}`,
    'provider': {
      '@type': 'Organization',
      'name': 'Writelli',
      'url': baseUrl
    }
  } as any; // Type assertion to avoid TypeScript errors with custom schema properties

  return (
    <>
      <Head>
        {/* Ensure proper metadata is available to search engines */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* OpenGraph tags for social sharing */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={toolUrl} />
        <meta property="og:image" content={`${baseUrl}/images/${metadata.image}`} />
        
        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={`${baseUrl}/images/${metadata.image}`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={toolUrl} />
        
        {/* Structured data for search engines */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      {children}
    </>
  );
}
