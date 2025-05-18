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
async function apiRequest<T>(endpoint: string, data: any): Promise<T | null> {
  // Set a timeout for API requests (30 seconds)
  const TIMEOUT_MS = 30000;
  
  // Create an AbortController to handle timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    console.log(`Making API request to ${endpoint}`);
    
    try {
      // Remove leading slash from endpoint if present to avoid double slashes
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        credentials: 'include',
      });
    
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      console.log(`API response status: ${response.status}`);

      // First try to parse the response
      const responseData = await response.json();

      if (!response.ok) {
        const { error, code } = responseData;
        
        // Only use fallbacks for specific error cases
        if (code === 'QUOTA_EXCEEDED' || code === 'TIMEOUT' || 
            code === 'SERVICE_UNAVAILABLE' || code === 'INVALID_API_KEY') {
          console.warn(`${error}, using fallback response`);
          return null;
        }
        
        // For other errors, throw to be handled by the caller
        throw new Error(error || 'An unknown error occurred');
      }

      // Check if the response has the expected data
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format');
      }

      return responseData as T;
    } catch (error) {
      console.error('API request error:', error);
      
      // Only use fallback for network errors or timeouts
      if (error instanceof TypeError || 
          (error instanceof DOMException && error.name === 'AbortError')) {
        console.warn('Network or timeout error, using fallback');
        return null;
      }
      
      // For other errors, throw to be handled by the caller
      throw error
    }
  } catch (error) {
    // Clear the timeout to prevent memory leaks
    clearTimeout(timeoutId);
    
    // Handle AbortController timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.warn('Request timed out after', TIMEOUT_MS/1000, 'seconds');
      return null as any; // Return null to trigger fallback
    }
    
    // Handle network errors or other exceptions
    if (error instanceof TypeError || 
        (error instanceof Error && 
         (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('network') ||
          error.message.includes('Network') ||
          error.message.includes('CORS') ||
          error.message.includes('Content Security Policy')))) {
      console.error('Network Error:', error);
      return null as any; // Return null to trigger fallback
    }
    
    // For any other error, return null to trigger fallbacks
    console.error('Unhandled API error:', error);
    return null as any; // Return null to trigger fallback
  }
}

/**
 * Grammar Checker API
 */
export async function checkGrammar(text: string, mode: GrammarCheckerMode = 'standard'): Promise<GrammarCheckerResponse | null> {
  try {
    return await apiRequest<GrammarCheckerResponse>('/tools/grammar-checker', { text, mode });
  } catch (error) {
    console.warn('Grammar checker API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackGrammarResponse(text);
  }
}

/**
 * Readability Checker API
 */
export async function checkReadability(text: string): Promise<ReadabilityCheckerResponse | null> {
  try {
    return await apiRequest<ReadabilityCheckerResponse>('/tools/readability-checker', { text });
  } catch (error) {
    console.warn('Readability checker API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackReadabilityResponse();
  }
}

/**
 * Paraphraser API
 */
export async function paraphraseText(text: string, mode: ParaphraserMode = 'standard'): Promise<ParaphraserResponse | null> {
  try {
    return await apiRequest<ParaphraserResponse>('/tools/paraphraser', { text, mode });
  } catch (error) {
    console.warn('Paraphraser API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackParaphraserResponse(text);
  }
}

/**
 * Summarizer API
 */
export async function summarizeText(text: string, mode: SummarizerMode = 'bullet'): Promise<SummarizerResponse | null> {
  try {
    return await apiRequest<SummarizerResponse>('/tools/summarizer', { text, mode });
  } catch (error) {
    console.warn('Summarizer API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackSummarizerResponse(text);
  }
}

/**
 * Translator API
 */
export async function translateText(text: string, targetLanguage: string): Promise<TranslatorResponse | null> {
  try {
    return await apiRequest<TranslatorResponse>('/tools/translator', { text, targetLanguage });
  } catch (error) {
    console.warn('Translator API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackTranslatorResponse(text, targetLanguage);
  }
}

/**
 * Tone Converter API
 */
export async function convertTone(text: string, tone: ToneConverterMode): Promise<ToneConverterResponse | null> {
  try {
    return await apiRequest<ToneConverterResponse>('/tools/tone-converter', { text, tone });
  } catch (error) {
    console.warn('Tone converter API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackToneConverterResponse(text, tone);
  }
}

/**
 * Humanizer API
 */
export async function humanizeText(text: string, mode: HumanizerMode = 'natural'): Promise<HumanizerResponse | null> {
  try {
    return await apiRequest<HumanizerResponse>('/tools/humanizer', { text, mode });
  } catch (error) {
    console.warn('Humanizer API error, using fallback:', error);
    // Always return fallback response for any error
    return getFallbackHumanizerResponse(text);
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
