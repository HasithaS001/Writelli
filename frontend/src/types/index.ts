// Tool types
export type ToolType = 
  | 'grammar-checker'
  | 'readability-checker'
  | 'paraphraser'
  | 'summarizer'
  | 'translator'
  | 'tone-converter'
  | 'humanizer';

// Mode types for each tool
export type GrammarCheckerMode = 'standard' | 'advanced';
export type ReadabilityCheckerMode = 'standard';
export type ParaphraserMode = 
  | 'standard'
  | 'fluency'
  | 'formal'
  | 'creative'
  | 'shorten'
  | 'expand'
  | 'academic'
  | 'seo';
export type SummarizerMode = 'bullet' | 'executive' | 'detailed';
export type ToneConverterMode = 'formal' | 'friendly' | 'professional' | 'empathetic' | 'witty';
export type HumanizerMode = 'natural' | 'bypass' | 'emotional' | 'conversational' | 'genz';

// API response types
export interface ApiResponse {
  error?: string;
}

export interface GrammarCheckerResponse extends ApiResponse {
  originalText: string;
  correctedText: string;
  colorCodedText?: string; // HTML with color-coded corrections
  corrections: Array<{
    original: string;
    corrected: string;
    color?: string; // Color for highlighting the correction
  }>;
}

export interface ReadabilityScores {
  fleschKincaid: number;
  gunningFog: number;
}

export interface ReadabilityCheckerResponse extends ApiResponse {
  readabilityAnalysis: string;
  scores: ReadabilityScores;
  improvementPoints: string[];
  revisedExample?: string;
}

export interface ParaphraserResponse extends ApiResponse {
  paraphrasedText: string;
}

export interface SummarizerResponse extends ApiResponse {
  summary: string;
}

export interface TranslatorResponse extends ApiResponse {
  translatedText: string;
}

export interface ToneConverterResponse extends ApiResponse {
  convertedText: string;
}

export interface HumanizerResponse extends ApiResponse {
  humanizedText: string;
}


// Tool descriptions for UI
export interface ToolDescription {
  id: ToolType;
  name: string;
  description: string;
  modes: {
    id: string;
    name: string;
    description: string;
  }[];
}

export const TOOLS: ToolDescription[] = [
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    description: 'Fix spelling, punctuation, and grammar issues in your text',
    modes: [
      {
        id: 'standard',
        name: 'Standard Check',
        description: 'Fixes basic spelling, punctuation, and grammar'
      },
      {
        id: 'advanced',
        name: 'Advanced Check',
        description: 'Fixes style issues, complex grammar, and writing clarity'
      }
    ]
  },
  {
    id: 'readability-checker',
    name: 'Readability Checker',
    description: 'Analyze how readable your text is and get suggestions for improvement',
    modes: [
      {
        id: 'standard',
        name: 'Standard Analysis',
        description: 'Provides readability scores and improvement suggestions'
      }
    ]
  },
  {
    id: 'paraphraser',
    name: 'Paraphraser',
    description: 'Rewrite your text in different styles while preserving the original meaning',
    modes: [
      {
        id: 'standard',
        name: 'Standard',
        description: 'General paraphrasing for casual use'
      },
      {
        id: 'fluency',
        name: 'Fluency',
        description: 'Makes content more readable and grammatically correct'
      },
      {
        id: 'formal',
        name: 'Formal',
        description: 'Transforms text into a professional tone'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Adds flair or literary style to your content'
      },
      {
        id: 'shorten',
        name: 'Shorten',
        description: 'Reduces word count while keeping meaning'
      },
      {
        id: 'expand',
        name: 'Expand',
        description: 'Lengthens the text with more detail or explanation'
      },
      {
        id: 'academic',
        name: 'Academic',
        description: 'Keeps tone formal and avoids plagiarism'
      },
      {
        id: 'seo',
        name: 'SEO-Friendly',
        description: 'Optimized rephrasing for content marketing'
      }
    ]
  },
  {
    id: 'summarizer',
    name: 'Summarizer',
    description: 'Create concise summaries of your text in different formats',
    modes: [
      {
        id: 'bullet',
        name: 'Bullet Points',
        description: 'Key points in list format'
      },
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'Brief professional summary'
      },
      {
        id: 'detailed',
        name: 'Detailed Summary',
        description: 'Long-form overview with main ideas'
      }
    ]
  },
  {
    id: 'translator',
    name: 'Translator',
    description: 'Translate your text to over 50 languages',
    modes: []
  },
  {
    id: 'tone-converter',
    name: 'Tone Converter',
    description: 'Convert the tone of your text to match different styles',
    modes: [
      {
        id: 'formal',
        name: 'Formal',
        description: 'Professional and structured tone'
      },
      {
        id: 'friendly',
        name: 'Friendly',
        description: 'Warm and approachable tone'
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Business-appropriate and polished tone'
      },
      {
        id: 'empathetic',
        name: 'Empathetic',
        description: 'Understanding and compassionate tone'
      },
      {
        id: 'witty',
        name: 'Witty',
        description: 'Clever and humorous tone'
      }
    ]
  },
  {
    id: 'humanizer',
    name: 'Humanizer',
    description: 'Make AI-generated text sound more natural and human-like',
    modes: [
      {
        id: 'natural',
        name: 'Natural Flow',
        description: 'Improves the natural flow of text'
      },
      {
        id: 'bypass',
        name: 'AI Detection Bypass',
        description: 'Makes text less detectable as AI-generated'
      },
      {
        id: 'emotional',
        name: 'Emotional Touch',
        description: 'Adds emotional depth to the text'
      },
      {
        id: 'conversational',
        name: 'Conversational',
        description: 'Makes text sound more casual and conversational'
      },
      {
        id: 'genz',
        name: 'Gen Z Style',
        description: 'Adds youthful, contemporary language style'
      }
    ]
  }
];
