import { ToolType } from '@/types';

interface MetaInfo {
  title: string;
  description: string;
  keywords: string;
}

export const getToolMetaInfo = (toolType: ToolType): MetaInfo => {
  switch (toolType) {
    case 'grammar-checker':
      return {
        title: 'Free AI Grammar Checker |(No required signup)',
        description: 'Fix grammar, spelling, and punctuation instantly with our AI Grammar Checker tool. Write error-free, clear, and professional content in seconds.',
        keywords: 'grammar checker,grammar check​,grammer check​,free grammar checker​, grammar checker free​, spanish grammar check, hindi grammar check, how to do grammar check in word, best ai grammar checker​, spelling and grammar check,grammar check japanese,bangla grammar check​,japanese grammar checker,russian grammar checker​',
      };
    case 'readability-checker':
      return {
        title: 'AI Readability Checker|(No required signup)',
        description: 'Analyze and improve your content with our free readability checker. Instantly calculate your readability score using Flesch readability score, Flesch-Kincaid readability scores, and Gunning Fog readability scores. Perfect for writers, educators, and marketers who want clear, reader-friendly content.',
        keywords: 'readability checker, readability score, flesch readability score,flesch-kincaid readability scores,gunning fog readability scores',
      };
    case 'paraphraser':
      return {
        title: 'Free AI Paraphrasing Tool |(No required signup)',
        description: 'Improve your writing with our powerful AI paraphraser — the best paraphrasing tool to rewrite content quickly and accurately. Our free paraphrasing tool helps students, bloggers, and professionals rephrase text with ease. Try the best AI paraphrasing tool for clear, plagiarism-free writing using advanced paraphrasing technology.',
        keywords: 'paraphrasing tool, paraphraser​, paraphrasing, ai paraphraser, free paraphrasing tool, best ai paraphrasing tool,best paraphrasing tool​,best paraphrasing tool.',
      };
    case 'summarizer':
      return {
        title: 'Free AI Summarizer | (No required signup)',
        description: 'Quickly condense long content with our powerful AI summarization tool. Use our text summarizer, article summarizer, and summarizing tool to generate clear, concise summaries in seconds. The best summarize tool for students, researchers, and content creators.',
        keywords: 'text summarizer, AI summarization, summerize tool​, article summarizer, summerizing tool, is there an ai tool that will summerize a webpage​',
      };
    case 'translator':
      return {
        title: 'AI Text Translator | 150+ Languages ',
        description: 'Instantly translate text with our powerful AI translate tool. Effortlessly translate English to Spanish, Spanish to English, Chinese to English, English to Tamil, Telugu to English, and Romanian to English. A fast, accurate, and reliable multilingual tool for global communication.. Get natural and fluent translations for your content.',
        keywords: 'translate​, Ai translate, translate english to spanish​, translate spanish to english, chinese to english translator, english to tamil translation,telugu to english translation​, translate romanian to english​,multilingual tool',
      };
    case 'tone-converter':
      return {
        title: 'Free AI Tone Converter | ( No required signup)',
        description: 'Easily adjust your writing with our tone converter and text tone modifier. Change the writing style and content style to match any audience using advanced AI writing tone technology. The perfect writing style changer for professionals, students, and content creators.',
        keywords: 'tone converter, writing style changer, text tone modifier, AI writing tone, content style',
      };
    case 'humanizer':
      return {
        title: 'Free AI Humanizer |100% Human Score',
        description: 'Humanize AI content effortlessly with our advanced AI Humanizer tool. Instantly transform robotic, AI-generated text into natural, engaging, and authentic writing. Perfect for content creators, marketers, and students. Use our Humanizer AI to improve clarity, tone, and flow. The best solution for content humanization and making AI text sound real. Try our AI Text Improver and Humanize AI content now!',
        keywords: 'hummanize ai, ai hummanizer​, AI text improver, hummanizer ai, content humanization',
      };
    case 'article-rewriter':
      return {
        title: 'Free AI Article Rewriter |(No required signup)',
        description: 'Rewrite your articles to improve readability, change tone, optimize for SEO, or make content unique while preserving meaning.',
        keywords: 'article rewriter, content rewriter, ai article generator, blog post rewriter, seo content optimizer, unique article creator, text rewriter, article spinner, content refresher',
      };
    default:
      return {
        title: 'Writelli | AI Writing Assistant',
        description: 'Unlock faster, smarter writing with our powerful AI Writing Assistant SaaS tool. Instantly generate blog posts, emails, ad copy, product descriptions, and more.',
        keywords: 'ai writing assistant, content generation tool, writing productivity, ai copywriting, blog post generator, email writer, ad copy creator, product description generator, writelli',
      };
  }
};
