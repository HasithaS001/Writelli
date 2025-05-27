/**
 * Fallback responses for when the API is unavailable
 * These are used when the API quota is exceeded or there are other API issues
 */

import {
  GrammarCheckerResponse,
  ReadabilityCheckerResponse,
  ParaphraserResponse,
  SummarizerResponse,
  TranslatorResponse,
  ArticleRewriterResponse,
  ToneConverterResponse,
  HumanizerResponse
} from '@/types';

/**
 * Generate a fallback grammar checker response
 */
export function getFallbackGrammarResponse(text: string): GrammarCheckerResponse {
  return {
    originalText: text,
    correctedText: text,
    corrections: [],
    colorCodedText: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Grammar Check Temporarily Unavailable</h3>
        </div>
        <div class="ml-11 space-y-2">
          <p class="text-blue-700">Our grammar checking service is experiencing high demand. While you wait, here are some tips:</p>
          <ul class="list-disc text-blue-700 ml-5 space-y-1">
            <li>Review your text for common errors like subject-verb agreement</li>
            <li>Check punctuation, especially commas and periods</li>
            <li>Look for commonly confused words (their/there/they're, its/it's)</li>
            <li>Ensure consistent verb tense throughout</li>
          </ul>
          <p class="text-blue-700 mt-3">Please try again in a few moments.</p>
        </div>
      </div>
    `,
    error: 'Service temporarily unavailable'
  };
}

/**
 * Generate a fallback readability checker response
 */
export function getFallbackReadabilityResponse(): ReadabilityCheckerResponse {
  return {
    readabilityAnalysis: `
      <p>We're currently experiencing high demand on our servers. The readability analysis is temporarily unavailable.</p>
      <p>Here are some general tips for improving readability:</p>
      <ul>
        <li>Use shorter sentences (15-20 words max)</li>
        <li>Choose simpler words when possible</li>
        <li>Break up long paragraphs</li>
        <li>Use active voice instead of passive voice</li>
        <li>Include transitional phrases between paragraphs</li>
        <li>Eliminate unnecessary jargon and technical terms</li>
      </ul>
      <p>Please try again later when our services are less busy.</p>
    `,
    scores: {
      fleschKincaid: 50,
      gunningFog: 10
    },
    improvementPoints: [
      'Use shorter sentences (15-20 words max)',
      'Choose simpler words when possible',
      'Break up long paragraphs',
      'Use active voice instead of passive voice',
      'Include transitional phrases between paragraphs',
      'Eliminate unnecessary jargon and technical terms'
    ],
    revisedExample: 'Example text is temporarily unavailable.'
  };
}

/**
 * Generate a fallback paraphraser response
 */
export function getFallbackParaphraserResponse(text: string): ParaphraserResponse {
  return {
    error: 'Service temporarily unavailable',
    paraphrasedText: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Paraphrasing Service Temporarily Unavailable</h3>
        </div>
        <div class="ml-11 space-y-2">
          <p class="text-blue-700">Our paraphrasing service is experiencing high demand. While you wait, here are some tips for manual paraphrasing:</p>
          <ul class="list-disc text-blue-700 ml-5 space-y-1">
            <li>Try using synonyms for key words</li>
            <li>Restructure sentences by changing their order</li>
            <li>Convert active voice to passive voice (or vice versa)</li>
            <li>Break long sentences into shorter ones</li>
          </ul>
          <p class="text-blue-700 mt-3">Please try again in a few moments.</p>
        </div>
      </div>
    `
  };
}

/**
 * Generate a fallback summarizer response
 */
export function getFallbackSummarizerResponse(text: string): SummarizerResponse {
  return {
    error: 'Service temporarily unavailable',
    summary: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
        </div>
        <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The summarization service is temporarily unavailable.</p>
        <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
      </div>
    `
  };
}

/**
 * Generate a fallback translator response
 */
export function getFallbackTranslatorResponse(text: string, targetLanguage: string): TranslatorResponse {
  return {
    error: 'Service temporarily unavailable',
    translatedText: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Translation Service Temporarily Unavailable</h3>
        </div>
        <div class="ml-11 space-y-2">
          <p class="text-blue-700">Our translation service to ${targetLanguage} is experiencing high demand. While you wait, here are some tips:</p>
          <ul class="list-disc text-blue-700 ml-5 space-y-1">
            <li>Use online translation tools like Google Translate or DeepL</li>
            <li>Break complex sentences into simpler ones before translating</li>
            <li>Be mindful of idiomatic expressions that may not translate directly</li>
            <li>Consider cultural context when translating</li>
          </ul>
          <p class="text-blue-700 mt-3">Please try again in a few moments.</p>
        </div>
      </div>
    `
  };
}

/**
 * Generate a fallback tone converter response
 */
export function getFallbackToneConverterResponse(text: string, tone: string): ToneConverterResponse {
  return {
    error: 'Service temporarily unavailable',
    convertedText: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Tone Converter Temporarily Unavailable</h3>
        </div>
        <div class="ml-11 space-y-2">
          <p class="text-blue-700">Our tone conversion service to ${tone} style is experiencing high demand. While you wait, here are some tips:</p>
          <ul class="list-disc text-blue-700 ml-5 space-y-1">
            <li>Consider your audience and adjust vocabulary accordingly</li>
            <li>Use appropriate formality level for your context</li>
            <li>Pay attention to sentence structure and length</li>
            <li>Review examples of writing in your target tone</li>
          </ul>
          <p class="text-blue-700 mt-3">Please try again in a few moments.</p>
        </div>
      </div>
    `
  };
}

/**
 * Generate a fallback humanizer response
 */
export function getFallbackHumanizerResponse(text: string): HumanizerResponse {
  return {
    humanizedText: text
  };
}

/**
 * Generate a fallback article rewriter response
 * @param text The original text to rewrite
 * @returns ArticleRewriterResponse with default scores and the original text
 */
export function getFallbackArticleRewriterResponse(text: string): ArticleRewriterResponse {
  return {
    rewrittenText: text,
    readabilityScore: 70,
    uniquenessScore: 80,
    seoScore: 75,
    keywords: ['article', 'content']
  };
}
