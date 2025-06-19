import {
  ToolType,
  GrammarCheckerMode,
  ParaphraserMode,
  SummarizerMode,
  ToneConverterMode,
  HumanizerMode,
  ArticleRewriterMode,
  GrammarCheckerResponse,
  ReadabilityCheckerResponse,
  ParaphraserResponse,
  SummarizerResponse,
  TranslatorResponse,
  ToneConverterResponse,
  HumanizerResponse,
  ArticleRewriterResponse
} from '@/types';

import { API_URL } from '@/app/env';
import {
  getFallbackGrammarResponse,
  getFallbackReadabilityResponse,
  getFallbackParaphraserResponse,
  getFallbackSummarizerResponse,
  getFallbackTranslatorResponse,
  getFallbackToneConverterResponse,
  getFallbackHumanizerResponse,
  getFallbackArticleRewriterResponse
} from './fallbacks';

/**
 * Base API request function with timeout handling
 */
async function apiRequest<T>(endpoint: string, data: any): Promise<T | null> {
  // Set a timeout for API requests (30 seconds)
  const TIMEOUT_MS = 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const baseUrl = 'http://localhost:5000';
    const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    console.log('Making request to:', url);
    console.log('Request data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      mode: 'cors',
      body: JSON.stringify(data)
    });
    
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response status:', response.status);
    clearTimeout(timeoutId);
    console.log('Response received:', response.status, response.statusText);

    if (response.status === 404) {
      console.warn(`API endpoint ${endpoint} not found, using fallback response`);
      return null;
    }

    try {
      const responseData = await response.json();

      if (!response.ok) {
        const { error, code } = responseData || {};
        if (code === 'QUOTA_EXCEEDED' || code === 'TIMEOUT' || 
            code === 'SERVICE_UNAVAILABLE' || code === 'INVALID_API_KEY') {
          console.warn(`${error}, using fallback response`);
          return null;
        }
        throw new Error(error || `Error ${response.status}: ${response.statusText}`);
      }

      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format');
      }

      return responseData as T;
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      return null;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('API request error:', error);

    if (error instanceof TypeError || 
        (error instanceof DOMException && error.name === 'AbortError') ||
        (error instanceof Error && (
          error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('network') ||
          error.message.includes('Network') ||
          error.message.includes('CORS') ||
          error.message.includes('Content Security Policy')
        ))) {
      console.warn('Network or timeout error, using fallback');
      return null;
    }

    // For any other error, return null to trigger fallbacks
    console.error('Unhandled API error:', error);
    return null;
  }
}

/**
 * Grammar Checker API
 */
export async function checkGrammar(text: string, mode: GrammarCheckerMode = 'standard'): Promise<GrammarCheckerResponse | null> {
  try {
    return await apiRequest<GrammarCheckerResponse>('/api/tools/grammar-checker', { text, mode });
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
    return await apiRequest<ReadabilityCheckerResponse>('/api/tools/readability-checker', { text });
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
    return await apiRequest<ParaphraserResponse>('/api/tools/paraphraser', { text, mode });
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
    return await apiRequest<SummarizerResponse>('/api/tools/summarizer', { text, mode });
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
    return await apiRequest<TranslatorResponse>('/api/tools/translator', { text, targetLanguage });
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
    return await apiRequest<ToneConverterResponse>('/api/tools/tone-converter', { text, tone });
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
    return await apiRequest<HumanizerResponse>('/api/tools/humanizer', { text, mode });
  } catch (error) {
    console.warn('Humanizer API error, using fallback:', error);
    return getFallbackHumanizerResponse(text);
  }
}

/**
 * Article Rewriter API
 */
// Mock implementation for development until backend API is available
function mockArticleRewriterAPI(text: string, mode: ArticleRewriterMode, keyword?: string): ArticleRewriterResponse {
  console.log('Using mock Article Rewriter API with mode:', mode, 'and keyword:', keyword);
  
  // Ensure we have some text to work with
  if (!text || text.trim() === '') {
    return { rewrittenText: 'Please provide some text to rewrite.' };
  }
  
  // Create a completely different response based on the mode
  let rewrittenText = '';
  
  switch (mode) {
    case 'readability':
      // For readability mode, create a simplified version with shorter sentences
      let readableText = text
        .replace(/\b(utilize|implement|facilitate|endeavor)\b/gi, 'use')
        .replace(/\b(sufficient)\b/gi, 'enough')
        .replace(/\b(approximately)\b/gi, 'about')
        .replace(/\b(nevertheless|furthermore|additionally)\b/gi, 'also')
        .replace(/\b(in order to)\b/gi, 'to')
        .replace(/\b(concerning the matter of)\b/gi, 'about')
        .replace(/\b(in the event that)\b/gi, 'if')
        .replace(/\b(at this point in time)\b/gi, 'now')
        .replace(/\b(due to the fact that)\b/gi, 'because');
      
      // Break long sentences into shorter ones
      readableText = readableText.replace(/([^.!?]+?)(,\s[^.!?]+?)+([.!?])/g, (match, p1, p2, p3) => {
        if (match.length > 80) { // If sentence is long
          return `${p1}${p3} ${p2.substring(2)}${p3}`; // Split at comma
        }
        return match;
      });
      
      rewrittenText = `<h3>Readability Enhanced</h3>

<p>Your text has been simplified for better readability and comprehension.</p>

<p>Readability improvements applied:</p>
<ul>
  <li>Sentences shortened and simplified</li>
  <li>Complex vocabulary replaced with simpler alternatives</li>
  <li>Paragraph structure improved</li>
  <li>Unnecessary jargon removed</li>
  <li>Clarity enhanced throughout</li>
</ul>

<p><strong>Simplified version:</strong></p>
<p>${readableText}</p>`;
      break;
      
    case 'tone':
      // For tone mode, create a more professional version
      let professionalText = text
        // Replace casual words with more formal alternatives
        .replace(/\b(good|great)\b/gi, 'excellent')
        .replace(/\b(bad|poor)\b/gi, 'suboptimal')
        .replace(/\b(big)\b/gi, 'substantial')
        .replace(/\b(problem|issue)\b/gi, 'challenge')
        .replace(/\b(fix)\b/gi, 'address')
        .replace(/\b(get)\b/gi, 'acquire')
        .replace(/\b(use)\b/gi, 'utilize')
        .replace(/\b(make)\b/gi, 'develop')
        .replace(/\b(think|believe)\b/gi, 'assess')
        .replace(/\b(working)\b/gi, 'functioning')
        .replace(/\b(not working)\b/gi, 'non-functional')
        .replace(/\b(tool)\b/gi, 'application')
        .replace(/\b(same)\b/gi, 'identical')
        .replace(/\b(input)\b/gi, 'data entry')
        .replace(/\b(output)\b/gi, 'resultant output')
        .replace(/\b(result)\b/gi, 'outcome')
        .replace(/\b(text)\b/gi, 'content')
        .replace(/\b(process)\b/gi, 'execute');
      
      // Add professional phrases
      if (!professionalText.includes('please')) {
        professionalText += '. We kindly request your attention to this matter.';
      } else {
        professionalText = professionalText.replace('please', 'we kindly request that you');
      }
      
      // Add formal introduction
      professionalText = `Upon examination of the current situation, it has been determined that ${professionalText}`;
      
      rewrittenText = `<h3>Professional Tone Applied</h3>

<p>Your text has been transformed to convey a more professional and authoritative tone.</p>

<p>Tone improvements applied:</p>
<ul>
  <li>Casual language replaced with formal expressions</li>
  <li>Personal opinions converted to evidence-based statements</li>
  <li>Simple vocabulary upgraded to sophisticated terminology</li>
  <li>Authoritative phrasing implemented throughout</li>
  <li>Professional structure and formatting applied</li>
</ul>

<p><strong>Professional version:</strong></p>
<p>${professionalText}</p>`;
      break;
      
    case 'seo':
      // For SEO mode, optimize with the keyword
      const keywordPhrase = keyword || 'digital marketing';
      rewrittenText = `<h2>Optimized for SEO: Focus on "${keywordPhrase}"</h2>

<p>This content has been optimized for search engines with the target keyword: <strong>${keywordPhrase}</strong>.</p>

<h3>SEO Improvements:</h3>
<ul>
  <li>Added keyword in title and headings</li>
  <li>Optimized keyword density (3-5%)</li>
  <li>Improved meta description potential</li>
  <li>Enhanced content structure</li>
</ul>

<h3>${keywordPhrase.charAt(0).toUpperCase() + keywordPhrase.slice(1)}: Complete Guide</h3>

<p>${text.replace(new RegExp('([^.!?]*\\.)'), `$1 When considering ${keywordPhrase}, it's important to understand the fundamentals. `)}</p>

<p>For more information about ${keywordPhrase}, contact our experts today.</p>`;
      break;
      
    case 'unique':
      // For uniqueness mode, create a completely different version with restructured sentences
      // Create a significantly different version of the text
      let uniqueText = text;
      
      // Apply multiple transformations to make the text truly unique
      // 1. Replace common words with synonyms
      uniqueText = uniqueText
        .replace(/\b(also|additionally)\b/gi, 'moreover')
        .replace(/\b(but)\b/gi, 'however')
        .replace(/\b(because|since)\b/gi, 'as a result of')
        .replace(/\b(use|utilize)\b/gi, 'employ')
        .replace(/\b(get)\b/gi, 'obtain')
        .replace(/\b(make)\b/gi, 'create')
        .replace(/\b(problem|issue)\b/gi, 'challenge')
        .replace(/\b(fix)\b/gi, 'resolve')
        .replace(/\b(working)\b/gi, 'functioning')
        .replace(/\b(properly)\b/gi, 'correctly')
        .replace(/\b(tool)\b/gi, 'utility')
        .replace(/\b(same)\b/gi, 'identical')
        .replace(/\b(input)\b/gi, 'entered data')
        .replace(/\b(output)\b/gi, 'generated result')
        .replace(/\b(result)\b/gi, 'outcome')
        .replace(/\b(text)\b/gi, 'content')
        .replace(/\b(process)\b/gi, 'handle');
      
      // 2. Restructure sentences
      const sentences = uniqueText.split(/[.!?]\s+/);
      if (sentences.length > 1) {
        // Reverse sentence order for dramatic restructuring
        uniqueText = sentences.reverse().join('. ');
      }
      
      // 3. Add introductory and concluding phrases
      uniqueText = `It has come to my attention that ${uniqueText}. This situation requires immediate attention.`;
      
      // For production, this would use Gemini API instead of the mock implementation
      // Example Gemini API integration would look like:
      /*
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Rewrite the following text to make it completely unique and avoid plagiarism detection: "${text}"`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });
      const geminiData = await geminiResponse.json();
      uniqueText = geminiData.candidates[0].content.parts[0].text;
      */
      
      // Show only the unique version without explanatory text
      rewrittenText = uniqueText;
      break;
      
    default:
      // Fallback to a simple transformation
      rewrittenText = `<p>Rewritten version:</p>
<p>${text}</p>`;
  }
  
  return {
    rewrittenText: rewrittenText
  };
}

export async function rewriteArticle(text: string, mode: ArticleRewriterMode = 'readability', keyword?: string): Promise<ArticleRewriterResponse | null> {
  try {
    console.log('Calling Article Rewriter API with mode:', mode, 'and keyword:', keyword);
    
    // Use our backend API route that calls Gemini API
    console.log('Using Gemini API via proxy for', mode, 'mode');
    
    const data = await apiRequest<ArticleRewriterResponse>('/api/tools/article-rewriter', {
      text,
      mode,
      keyword
    });
    
    if (!data) {
      throw new Error('Failed to get response from API');
    }
    
    return data;
  } catch (error: any) {
    console.error('Article Rewriter API error:', error);
    // Return a fallback response with the error message
    return {
      rewrittenText: `Error: Unable to rewrite text using Gemini API. Please check your API key configuration and try again. (${error.message || 'Unknown error'})`
    };
  }
}

/**
 * Generic function to process text based on tool type
 */
export async function processText(
  toolType: ToolType, 
  text: string, 
  mode?: string,
  targetLanguage?: string,
  keywords?: string[]
): Promise<any> {
  try {
    switch (toolType) {
      case 'grammar-checker':
        return await checkGrammar(text, mode as GrammarCheckerMode);
      case 'readability-checker':
        return await checkReadability(text);
      case 'paraphraser':
        return await paraphraseText(text, mode as ParaphraserMode);
      case 'summarizer':
        return await summarizeText(text, mode as SummarizerMode);
      case 'translator':
        if (!targetLanguage) throw new Error('Target language is required for translation');
        return await translateText(text, targetLanguage);
      case 'tone-converter':
        return await convertTone(text, mode as ToneConverterMode);
      case 'humanizer':
        return await humanizeText(text, mode as HumanizerMode);
      case 'article-rewriter':
        console.log('Processing article rewriter with mode:', mode, 'and keyword:', keywords?.[0]);
        return await rewriteArticle(text, mode as ArticleRewriterMode, keywords && keywords.length > 0 ? keywords[0] : undefined);
      default:
        throw new Error('Invalid tool type');
    }
  } catch (error) {
    console.error('Error processing text:', error);
    throw error;
  }
}
