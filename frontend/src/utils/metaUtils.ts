import { ToolType } from '@/types';

interface MetaInfo {
  title: string;
  description: string;
}

export const getToolMetaInfo = (toolType: ToolType): MetaInfo => {
  switch (toolType) {
    case 'grammar-checker':
      return {
        title: 'Grammar Checker | Writelli',
        description: 'Perfect your writing with our advanced AI Grammar Checker. Catch grammar, spelling, and punctuation errors instantly with professional-grade proofreading.',
      };
    case 'readability-checker':
      return {
        title: 'Readability Checker | Writelli',
        description: 'Improve your content\'s clarity with our AI Readability Checker. Get instant feedback on readability scores and suggestions to make your writing more engaging.',
      };
    case 'paraphraser':
      return {
        title: 'AI Paraphrasing Tool | Writelli',
        description: 'Transform your writing with our intelligent AI Paraphrasing Tool. Rewrite content while maintaining meaning, with multiple styles including academic, creative, and formal.',
      };
    case 'summarizer':
      return {
        title: 'Text Summarizer | Writelli',
        description: 'Condense long content instantly with our AI Text Summarizer. Create concise summaries in bullet points, executive format, or detailed overviews.',
      };
    case 'translator':
      return {
        title: 'AI Text Translator | Writelli',
        description: 'Translate your content accurately across multiple languages with our AI-powered Translation Tool. Maintain context and nuance in your translations.',
      };
    case 'tone-converter':
      return {
        title: 'Tone Converter | Writelli',
        description: 'Adjust your writing tone with our AI Tone Converter. Switch between formal, friendly, professional, empathetic, and witty styles effortlessly.',
      };
    case 'humanizer':
      return {
        title: 'AI Text Humanizer | Writelli',
        description: 'Make AI-generated content sound more natural with our Text Humanizer. Add personality and warmth to robotic-sounding text.',
      };
    case 'article-rewriter':
      return {
        title: 'AI Article Rewriter | Writelli',
        description: 'Rewrite and enhance your articles with our AI Article Rewriter. Improve readability, SEO, and engagement while maintaining your core message.',
      };
    default:
      return {
        title: 'Writelli | AI Writing Assistant',
        description: 'Unlock faster, smarter writing with our powerful AI Writing Assistant SaaS tool. Instantly generate blog posts, emails, ad copy, product descriptions, and more.',
      };
  }
};
