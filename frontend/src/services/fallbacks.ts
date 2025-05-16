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
    colorCodedText: text,
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
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
        </div>
        <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The paraphrasing service is temporarily unavailable.</p>
        <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
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
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
        </div>
        <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The translation service to ${targetLanguage} is temporarily unavailable.</p>
        <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
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
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
        </div>
        <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The tone conversion to ${tone} is temporarily unavailable.</p>
        <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
      </div>
    `
  };
}

/**
 * Generate a fallback humanizer response
 */
export function getFallbackHumanizerResponse(text: string): HumanizerResponse {
  return {
    error: 'Service temporarily unavailable',
    humanizedText: `
      <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div class="flex items-center mb-3">
          <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </span>
          <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
        </div>
        <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The humanizing service is temporarily unavailable.</p>
        <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
      </div>
    `
  };
}
