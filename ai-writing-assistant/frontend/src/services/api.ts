import {
  ToolType,
  GrammarCheckerMode,
  ParaphraserMode,
  SummarizerMode,
  ToneConverterMode,
  HumanizerMode,
  GrammarCheckerResponse,
  ReadabilityCheckerResponse,
  ParaphraserResponse,
  SummarizerResponse,
  TranslatorResponse,
  ToneConverterResponse,
  HumanizerResponse
} from '@/types';

import { API_URL } from '@/app/env';
import {
  getFallbackGrammarResponse,
  getFallbackReadabilityResponse,
  getFallbackParaphraserResponse,
  getFallbackSummarizerResponse,
  getFallbackTranslatorResponse,
  getFallbackToneConverterResponse,
  getFallbackHumanizerResponse
} from './fallbacks';

/**
 * Base API request function with timeout handling
 */
async function apiRequest<T>(endpoint: string, data: any): Promise<T> {
  // Set a timeout for API requests (30 seconds)
  const TIMEOUT_MS = 30000;
  
  // Create an AbortController to handle timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    console.log(`Making API request to ${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      // Add credentials to handle CORS issues
      credentials: 'include',
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    console.log(`API response status: ${response.status}`);

    if (!response.ok) {
      // Special handling for rate limiting (429 status)
      if (response.status === 429) {
        console.warn('Rate limit exceeded, using fallback response');
        throw new Error('RATE_LIMITED');
      }
      
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
        const isRateLimited = errorData.isRateLimited === true;
        
        // Handle specific error types
        if (isRateLimited || 
            errorMessage.includes('quota exceeded') || 
            errorMessage.includes('API quota')) {
          console.warn('API quota exceeded, using fallback response');
          throw new Error('RATE_LIMITED');
        }
      } catch (parseError) {
        console.warn('Could not parse error response:', parseError);
      }
      
      // Log the error for debugging
      console.warn(`API Error (${response.status}):`, errorMessage);
      
      // Handle Gemini model overload errors
      if (errorMessage.includes('model is overloaded') || 
          errorMessage.includes('Service Unavailable') ||
          response.status === 503) {
        console.warn('Gemini API is overloaded, using fallback response');
        throw new Error('MODEL_OVERLOADED');
      }
      
      if (errorMessage.includes('API key')) {
        throw new Error('Invalid API key. Please contact support to resolve this issue.');
      }
      
      // For any error response, throw a NETWORK_ERROR to trigger fallbacks
      throw new Error('NETWORK_ERROR');
    }

    return response.json();
  } catch (error) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    // Handle AbortController timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request timed out after', TIMEOUT_MS/1000, 'seconds');
      throw new Error('TIMEOUT');
    }
    
    // If it's already our special error types, re-throw them
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'MODEL_OVERLOADED' || 
         error.message === 'TIMEOUT')) {
      throw error;
    }
    
    // Handle network errors or other exceptions
    if (error instanceof TypeError || 
        (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('Error fetching') ||
          error.message.includes('network') ||
          error.message.includes('Network') ||
          error.message.includes('CORS') ||
          error.message.includes('Content Security Policy')))) {
      console.error('Network Error:', error);
      throw new Error('NETWORK_ERROR');
    }
    
    // For any other error, throw a NETWORK_ERROR to trigger fallbacks
    console.error('Unhandled API error:', error);
    throw new Error('NETWORK_ERROR');
  }
}

/**
 * Grammar Checker API
 */
export async function checkGrammar(text: string, mode: GrammarCheckerMode = 'standard'): Promise<GrammarCheckerResponse> {
  try {
    return await apiRequest<GrammarCheckerResponse>('/tools/grammar-checker', { text, mode });
  } catch (error) {
    console.warn('Grammar checker API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackGrammarResponse(text);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Readability Checker API
 */
export async function checkReadability(text: string): Promise<ReadabilityCheckerResponse> {
  try {
    return await apiRequest<ReadabilityCheckerResponse>('/tools/readability-checker', { text });
  } catch (error) {
    console.warn('Readability checker API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackReadabilityResponse();
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Paraphraser API
 */
export async function paraphraseText(text: string, mode: ParaphraserMode = 'standard'): Promise<ParaphraserResponse> {
  try {
    return await apiRequest<ParaphraserResponse>('/tools/paraphraser', { text, mode });
  } catch (error) {
    console.warn('Paraphraser API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackParaphraserResponse(text);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Summarizer API
 */
export async function summarizeText(text: string, mode: SummarizerMode = 'bullet'): Promise<SummarizerResponse> {
  try {
    return await apiRequest<SummarizerResponse>('/tools/summarizer', { text, mode });
  } catch (error) {
    console.warn('Summarizer API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackSummarizerResponse(text);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Translator API
 */
export async function translateText(text: string, targetLanguage: string): Promise<TranslatorResponse> {
  try {
    return await apiRequest<TranslatorResponse>('/tools/translator', { text, targetLanguage });
  } catch (error) {
    console.warn('Translator API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackTranslatorResponse(text, targetLanguage);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Tone Converter API
 */
export async function convertTone(text: string, tone: ToneConverterMode): Promise<ToneConverterResponse> {
  try {
    return await apiRequest<ToneConverterResponse>('/tools/tone-converter', { text, tone });
  } catch (error) {
    console.warn('Tone converter API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackToneConverterResponse(text, tone);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Humanizer API
 */
export async function humanizeText(text: string, mode: HumanizerMode = 'natural'): Promise<HumanizerResponse> {
  try {
    return await apiRequest<HumanizerResponse>('/tools/humanizer', { text, mode });
  } catch (error) {
    console.warn('Humanizer API error, using fallback:', error);
    if (error instanceof Error && 
        (error.message === 'RATE_LIMITED' || 
         error.message === 'TIMEOUT' ||
         error.message === 'MODEL_OVERLOADED' ||
         error.message === 'NETWORK_ERROR' ||
         error.message.includes('quota') || 
         error.message.includes('API key') ||
         error.message.includes('timed out') ||
         error.message.includes('model is overloaded') ||
         error.message.includes('Service Unavailable') ||
         error.message.includes('fetch failed') ||
         error.message.includes('Error fetching'))) {
      return getFallbackHumanizerResponse(text);
    }
    throw error; // Re-throw if it's not a handled issue
  }
}

/**
 * Generic function to process text based on tool type
 */
export async function processText(
  toolType: ToolType, 
  text: string, 
  mode?: string,
  targetLanguage?: string
): Promise<any> {
  switch (toolType) {
    case 'grammar-checker':
      return checkGrammar(text, mode as GrammarCheckerMode);
    case 'readability-checker':
      return checkReadability(text);
    case 'paraphraser':
      return paraphraseText(text, mode as ParaphraserMode);
    case 'summarizer':
      return summarizeText(text, mode as SummarizerMode);
    case 'translator':
      return translateText(text, targetLanguage || 'English');
    case 'tone-converter':
      return convertTone(text, mode as ToneConverterMode);
    case 'humanizer':
      return humanizeText(text, mode as HumanizerMode);
    default:
      throw new Error('Invalid tool type');
  }
}
