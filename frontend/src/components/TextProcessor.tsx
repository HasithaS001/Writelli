"use client";

import React, { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
declare global {
  interface Window {
    handleGrammarCorrectionClick?: (element: HTMLElement) => void;
  }
}
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import InsertOptions from '@/components/ui/InsertOptions';
import BulletPointSummary from '@/components/ui/BulletPointSummary';
import ModeSelector from '@/components/ModeSelector';
import LanguageSelector from '@/components/LanguageSelector';
import ReadabilityScoreDisplay from '@/components/ReadabilityScoreDisplay';
import RevisedExampleDisplay from '@/components/RevisedExampleDisplay';
import ReadabilityImprovementPoints from '@/components/ReadabilityImprovementPoints';
import ArticleRewriterOptions from './ArticleRewriterOptions';
import TypingAnimation from '@/components/ui/TypingAnimation';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  ToolType, 
  ReadabilityCheckerResponse, 
  GrammarCheckerResponse,
  ParaphraserResponse,
  SummarizerResponse,
  TranslatorResponse,
  ToneConverterResponse,
  HumanizerResponse,
  ArticleRewriterResponse,
  ReadabilityScores,
  GrammarCheckerMode,
  ArticleRewriterMode
} from '@/types';
import { processText } from '@/services/api';

// Create a client-side only component for the Article Rewriter illustration
const ArticleRewriterIllustration = dynamic(
  () => Promise.resolve(() => (
    <div className="relative w-full h-full">
      {/* Left document */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-24 bg-white border-2 border-blue-500 rounded-md"></div>
      
      {/* Right document */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-24 bg-white border-2 border-blue-600 rounded-md"></div>
      
      {/* Center arrow */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 border-t-2 border-r-2 border-blue-600 transform rotate-45"></div>
      </div>
    </div>
  )),
  { ssr: false }
);

interface TextProcessorProps {
  toolType: ToolType;
}

// Helper functions for tool display and action text
const getToolDisplayName = (toolType: ToolType): string => {
  switch (toolType) {
    case 'grammar-checker': return 'Grammar';
    case 'readability-checker': return 'Readability';
    case 'paraphraser': return 'Paraphraser';
    case 'summarizer': return 'Summarizer';
    case 'translator': return 'Translator';
    case 'tone-converter': return 'Tone';
    case 'humanizer': return 'Humanizer';

    default: return 'Text';
  }
};

const getToolActionText = (toolType: ToolType): string => {
  switch (toolType) {
    case 'grammar-checker': return 'check';
    case 'readability-checker': return 'analyze';
    case 'paraphraser': return 'paraphrase';
    case 'summarizer': return 'summarize';
    case 'translator': return 'translate';
    case 'tone-converter': return 'convert';
    case 'humanizer': return 'humanize';

    default: return 'process';
  }
};

const getToolModes = (toolType: ToolType): string[] => {
  switch (toolType) {
    case 'grammar-checker': return ['standard', 'advanced'];
    case 'readability-checker': return ['standard'];
    case 'paraphraser': return ['standard', 'fluency', 'formal', 'creative', 'shorten', 'expand', 'academic', 'seo'];
    case 'summarizer': return ['bullet', 'executive', 'detailed'];
    case 'tone-converter': return ['formal', 'friendly', 'professional', 'empathetic', 'witty'];
    case 'humanizer': return ['natural', 'bypass', 'emotional', 'conversational', 'genz'];

    default: return [];
  }
};

const isProOnlyMode = (toolType: ToolType, mode: string): boolean => {
  // Define which modes are Pro-only for each tool
  switch (toolType) {
    case 'paraphraser': return ['academic', 'seo', 'expand'].includes(mode);
    case 'summarizer': return ['detailed'].includes(mode);
    case 'humanizer': return ['bypass', 'genz'].includes(mode);
    case 'tone-converter': return ['professional', 'witty'].includes(mode);

    default: return false;
  }
};

const TextProcessor: React.FC<TextProcessorProps> = ({ toolType }): React.ReactElement => {
  const router = useRouter();
  
  // Use subscription data to determine plan limits
  const { 
    hasActiveSubscription, 
    subscriptionPlan, 
    isLoading: isLoadingSubscription 
  } = useSubscription();
  
  const isProUser = hasActiveSubscription && subscriptionPlan !== 'Default';
  const wordLimit = isProUser ? 100000 : 700; // 700 for free plan, 10000 for pro
  
  // Check if user has access to a feature based on their plan
  const checkFeatureAccess = (feature: string): boolean => {
    if (!isProOnlyMode(toolType, feature)) {
      return true; // Feature is available to all users
    }
    return isProUser; // Only pro users get pro features
  };
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('');
  const [language, setLanguage] = useState<string>('Spanish');
  const [keyword, setKeyword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readabilityScores, setReadabilityScores] = useState<ReadabilityScores | null>(null);
  const [improvementPoints, setImprovementPoints] = useState<string[]>([]);
  const [revisedExample, setRevisedExample] = useState<string | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState<number>(0);
  const [apiResult, setApiResult] = useState<any>(null);

  // Update word count when input text changes
  useEffect(() => {
    const plainText = inputText.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/) : [];
    setWordCount(words.length);
  }, [inputText]);

  useEffect(() => {
    // Initialize Google Analytics
    const loadGoogleAnalytics = () => {
      // Create and inject the GA4 script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=G-LN4M0YTJFC`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize the dataLayer
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;

      // Configure GA4
      gtag('js', new Date());
      gtag('config', 'G-LN4M0YTJFC', {
        page_path: window.location.pathname,
        send_page_view: true
      });

      // Track tool type as a custom event
      gtag('event', 'tool_view', {
        'tool_type': toolType
      });
    };

    // Load GA4
    loadGoogleAnalytics();

    // Set initial mode based on tool type
    const modes = getToolModes(toolType);
    if (modes.length > 0) {
      if (toolType === 'article-rewriter') {
        console.log('Setting default mode for article rewriter to readability');
        setMode('readability'); // Default mode for article rewriter
      } else {
        setMode(modes[0]);
      }
    }
    console.log('Initial mode set to:', mode, 'for tool:', toolType);
    
    // Reset states when tool type changes
    setInputText('');
    setOutputText('');
    setError(null);
    setReadabilityScores(null);
    setRevisedExample(null);
    setKeyword(''); // Reset keyword for article rewriter
    setTypingComplete(false);
    setShowCopyButton(false);

    // Cleanup function
    return () => {
      // Remove the GA script when component unmounts
      const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (gaScript) {
        gaScript.remove();
      }
    };
  }, [toolType]);

  const handleProcess = async () => {
    // Strip HTML tags for validation
    const plainText = inputText.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      setError('Please enter some text to process');
      return;
    }

    // Track tool usage event
    window.gtag?.('event', 'tool_use', {
      'event_category': 'engagement',
      'event_label': toolType,
      'tool_type': toolType,
      'mode': mode,
      'word_count': wordCount
    });
    
    // Validate that a keyword is provided for SEO mode
    if (toolType === 'article-rewriter' && mode === 'seo' && !keyword.trim()) {
      setError('Please enter a target keyword for SEO optimization.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setTypingComplete(false);
    setShowCopyButton(false);
    setReadabilityScores(null);
    setImprovementPoints([]);
    setRevisedExample(null);

    try {
      let result;
      try {
        console.log('Processing text for tool:', toolType, 'with mode:', mode);
        if (toolType === 'translator') {
          result = await processText(toolType as ToolType, inputText, mode, language);
        } else if (toolType === 'article-rewriter' && mode === 'seo') {
          console.log('Article rewriter with SEO mode and keyword:', keyword);
          // Explicitly pass the mode as a string literal for type safety
          const seoMode: ArticleRewriterMode = 'seo';
          result = await processText(toolType as ToolType, inputText, seoMode, undefined, [keyword]);
        } else if (toolType === 'article-rewriter') {
          // Ensure mode is one of the valid ArticleRewriterMode values
          let safeMode: ArticleRewriterMode = 'readability';
          if (mode === 'tone' || mode === 'unique' || mode === 'readability') {
            safeMode = mode as ArticleRewriterMode;
          }
          console.log('Article rewriter with mode:', safeMode);
          result = await processText(toolType as ToolType, inputText, safeMode);
        } else {
          result = await processText(toolType as ToolType, inputText, mode);
        }
        console.log('API result:', result);
      } catch (error) {
        console.error('Error in processText call:', error);
        throw error;
      }
      setApiResult(result); // Store the API result for later use
      
      // Function to convert Markdown-style bold (**text**) to HTML bold tags (<b>text</b>)
      const convertMarkdownBoldToHtml = (text: string): string => {
        return text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      };
      
      // Extract the appropriate field based on the tool type
      let processedText = '';
      
      if (error) {
        processedText = `
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium text-red-800">Error</span>
            </div>
            <p class="mt-2 text-sm text-red-700">${error}</p>
          </div>
        `;
      } else if (!result) {
        processedText = `
          <div class="p-6 bg-blue-50 rounded-xl border border-blue-100">
            <div class="flex items-center mb-3">
              <span class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </span>
              <h3 class="text-lg font-semibold text-blue-800">Service Temporarily Unavailable</h3>
            </div>
            <p class="text-blue-700 ml-11 mb-2">We're currently experiencing high demand on our servers. The ${getToolDisplayName(toolType).toLowerCase()} service is temporarily unavailable.</p>
            <p class="text-blue-700 ml-11">Please try again in a few moments when our services are less busy.</p>
          </div>
        `;
      } else if (toolType === 'grammar-checker') {
        const grammarResult = result as GrammarCheckerResponse;
        if (grammarResult && grammarResult.correctedText) {
          let coloredText = grammarResult.correctedText;
          
          // Process the original text instead of the corrected text
          let originalText = grammarResult.originalText;
          
          // Apply corrections with color coding and hover functionality
          if (grammarResult.corrections && grammarResult.corrections.length > 0) {
            // Sort corrections by length (longest first) to handle nested corrections
            const sortedCorrections = [...grammarResult.corrections].sort(
              (a, b) => b.original.length - a.original.length
            );

            // Create a deep copy of the original text to work with
            let processedOriginalText = originalText;

            sortedCorrections.forEach((correction, index) => {
              if (correction.original !== correction.corrected) {
                const escapedOriginal = correction.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escapedOriginal})`, 'g');
                
                // Use different colors for different types of corrections
                const colorClass = correction.color === 'red' ? 'text-red-500' :
                                  correction.color === 'blue' ? 'text-blue-500' :
                                  correction.color === 'green' ? 'text-green-500' :
                                  'text-red-500'; // Default to red for errors
                
                // Determine the error type based on the color
                let errorType = '';
                if (correction.color === 'red') {
                  errorType = 'Grammar Error';
                } else if (correction.color === 'blue') {
                  errorType = 'Spelling Error';
                } else if (correction.color === 'green') {
                  errorType = 'Punctuation Error';
                } else {
                  errorType = 'Writing Error';
                }
                
                // In standard mode (now the only mode), show all types of corrections
                const currentMode = 'standard';
                
                // Create an element with modern hover tooltip showing error type and correction
                processedOriginalText = processedOriginalText.replace(
                  regex,
                  `<span class="${colorClass} border-b-2 border-solid border-current relative group cursor-pointer grammar-correction" data-original="${correction.original}" data-corrected="${correction.corrected}" data-error-type="${errorType}" onclick="window.handleGrammarCorrectionClick && window.handleGrammarCorrectionClick(this)">${correction.original}<div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-max max-w-xs bg-white text-gray-900 text-sm rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"><div class="font-medium ${colorClass} mb-1">${errorType}</div><div class="text-gray-700">Suggestion: <span class="font-medium">${correction.corrected}</span></div><div class="text-gray-500 text-xs mt-1">Click to replace</div></div></span>`
                );
              }
            });
            
            // Use the processed original text with underlined mistakes
            processedText = processedOriginalText;
          } else {
            processedText = `
              <div class="p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-100">
                <div class="flex items-center space-x-4">
                  <div class="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Your text has perfect grammar!</h3>
                    <p class="text-gray-600">No corrections needed. Well done!</p>
                  </div>
                </div>
              </div>
            `;
          }
        } else {
          // If no corrections were found, show a success message with thumbs up illustration
          processedText = `
            <div class="p-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-sm border border-green-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="bg-green-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-800">Your text has perfect grammar!</h3>
                    <p class="text-gray-600">No corrections needed. Well done!</p>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
      } else if (toolType as ToolType === 'readability-checker') {
        const readabilityResult = result as ReadabilityCheckerResponse;
        if (readabilityResult.scores) {
          setReadabilityScores(readabilityResult.scores);
        }
        if (readabilityResult.improvementPoints) {
          setImprovementPoints(readabilityResult.improvementPoints);
        }
        if (readabilityResult.revisedExample) {
          setRevisedExample(readabilityResult.revisedExample);
        }
        processedText = readabilityResult.readabilityAnalysis;
      } else if (toolType as ToolType === 'paraphraser') {
        const paraphraserResult = result as ParaphraserResponse;
        if (paraphraserResult && paraphraserResult.paraphrasedText) {
          processedText = paraphraserResult.paraphrasedText;
        }
      } else if (toolType as ToolType === 'summarizer') {
        const summarizerResult = result as SummarizerResponse;
        if (summarizerResult && summarizerResult.summary) {
          processedText = summarizerResult.summary;
        }
      } else if (toolType as ToolType === 'translator') {
        const translatorResult = result as TranslatorResponse;
        if (translatorResult && translatorResult.translatedText) {
          processedText = translatorResult.translatedText;
        }
      } else if (toolType as ToolType === 'tone-converter') {
        const toneResult = result as ToneConverterResponse;
        if (toneResult && toneResult.convertedText) {
          processedText = toneResult.convertedText;
        }
      } else if (toolType as ToolType === 'humanizer') {
        const humanizerResult = result as HumanizerResponse;
        if (humanizerResult && humanizerResult.humanizedText) {
          processedText = humanizerResult.humanizedText;
        }
      } else if (toolType as ToolType === 'article-rewriter') {
        const articleRewriterResult = result as ArticleRewriterResponse;
        console.log('Article Rewriter result:', articleRewriterResult);
        if (articleRewriterResult && articleRewriterResult.rewrittenText) {
          // Ensure we're getting a completely different text than the input
          if (articleRewriterResult.rewrittenText === inputText) {
            console.error('Article Rewriter returned the same text as input');
            processedText = `<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span class="font-medium text-red-800">Error</span>
              </div>
              <p class="mt-2 text-sm text-red-700">The rewriter returned the same text. Please try again with different text.</p>
            </div>`;
          } else {
            processedText = articleRewriterResult.rewrittenText;
          }
        } else {
          console.error('Article Rewriter returned null or empty rewrittenText');
          processedText = `<div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium text-red-800">Error</span>
            </div>
            <p class="mt-2 text-sm text-red-700">Failed to rewrite the article. Please try again.</p>
          </div>`;
        }
      }
      
      // Convert Markdown-style bold syntax to HTML bold tags
      const formattedText = convertMarkdownBoldToHtml(processedText);
      
      // Set the output text
      setOutputText(formattedText);
      
      // If it's not the readability checker, show the copy button immediately
      // For other tools, it will be shown after the typing animation completes
      if (toolType === 'readability-checker' || processedText.includes('Your text has perfect grammar')) {
        setShowCopyButton(true);
        setTypingComplete(true);
      }
      
      // Add the click handler for grammar corrections if this is the grammar checker
      if (toolType === 'grammar-checker' && !processedText.includes('Your text has perfect grammar')) {
        // Add the click handler to the window object so it can be accessed from the HTML
        window.handleGrammarCorrectionClick = (element) => {
          const original = element.getAttribute('data-original');
          const corrected = element.getAttribute('data-corrected');
          
          // Create a new text node with the corrected word
          const textNode = document.createTextNode(corrected || '');
          
          // Get the parent element
          const parentElement = element.parentNode;
          
          if (parentElement) {
            // Replace the element with just the text node
            parentElement.replaceChild(textNode, element);
          } else {
            // Fallback if parent is not available
            // First, remove all child elements (including tooltips)
            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
            
            // Replace the text in the element with the correction
            element.textContent = corrected;
            
            // Remove all styling classes
            element.className = '';
            
            // Remove the click handler and data attributes
            element.removeAttribute('onclick');
            element.removeAttribute('data-original');
            element.removeAttribute('data-corrected');
            element.removeAttribute('data-error-type');
            element.removeAttribute('style');
          }
        };
      } else {
        // Clean up the handler if not needed
        if (window.handleGrammarCorrectionClick) {
          delete window.handleGrammarCorrectionClick;
        }
      }
      
    } catch (error) {
      console.error('Error processing text:', error);
      setError('An error occurred while processing your text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };



  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
    setReadabilityScores(null);
    setRevisedExample(null);
  };

  // Helper function to strip HTML tags for copying
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    
    // Remove all tooltip elements before getting the text content
    const tooltips = tmp.querySelectorAll('.grammar-correction span');
    tooltips.forEach(tooltip => {
      tooltip.parentNode?.removeChild(tooltip);
    });
    
    return tmp.textContent || tmp.innerText || '';
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        // Append the clipboard text to the existing text with a line break if needed
        const newText = inputText ? `${inputText}\n\n${clipboardText}` : clipboardText;
        setInputText(newText);
      }
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
      setError('Unable to access clipboard. Please check your browser permissions.');
    }
  };

  const handleCopy = () => {
    let textToCopy;
    
    // For grammar checker, use the fully corrected text
    if (toolType === 'grammar-checker' && apiResult && (apiResult as GrammarCheckerResponse).correctedText) {
      textToCopy = (apiResult as GrammarCheckerResponse).correctedText;
      
      // Update the output text to show the fully corrected text without underlines
      setOutputText(textToCopy);
    } else {
      // For other tools, use the processed output or input
      textToCopy = outputText ? stripHtml(outputText) : inputText;
    }
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Track copy event
        window.gtag?.('event', 'copy_result', {
          'event_category': 'engagement',
          'event_label': toolType,
          'tool_type': toolType,
          'mode': mode
        });
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
        setError('Failed to copy text. Please try again.');
      });
  };



  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full overflow-hidden">
      {/* Left Column - Input Section */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-6 h-auto lg:h-[calc(100vh-2rem)] overflow-y-auto lg:pr-3 pb-6">
        {/* Input Box */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black">Input</h2>
              <p className="text-black text-sm">Enter your text below</p>
            </div>
             <div className={`text-sm font-medium ${wordCount > wordLimit ? 'text-red-500' : 'text-black'}`}>
              {wordCount} / {wordLimit} words
              {wordCount > wordLimit && !isProUser && (
                <div className="text-xs mt-1">
                  <button 
                    onClick={() => router.push('/pricing')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center mb-2 justify-between">
              <InsertOptions 
                onInsertContent={(content) => {
                  // Append the content to the existing text with a line break if needed
                  const newText = inputText ? `${inputText}\n\n${content}` : content;
                  setInputText(newText);
                }}
              />
              <div className="text-sm text-gray-500">
                {inputText ? inputText.split(' ').length : 0} {inputText ? inputText.split(' ').length === 1 ? 'word' : 'words' : 'words'}
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter your text to ${getToolActionText(toolType)}...`}
              className="w-full min-h-[150px] sm:min-h-[200px] p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-open-sans"
              style={{ fontFamily: '"Open Sans", sans-serif', color: '#172b4d' }}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              onClick={handleClear} 
              variant="outline"
              className="text-black border border-gray-200 hover:bg-gray-50"
            >
              Clear Text
            </Button>
            <Button 
              onClick={handlePaste} 
              variant="outline"
              className="text-black border border-gray-200 hover:bg-gray-50"
            >
              Paste from Clipboard
            </Button>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 sticky top-0 z-10">
          {/* Mode Selector */}
          {getToolModes(toolType).length > 0 && (
            <div className="flex-1">
              <ModeSelector
                toolType={toolType}
                selectedMode={mode}
                onModeChange={setMode}
                isProUser={isProUser}
              />
            </div>
          )}
          
          {/* Language Selector for Translator */}
          {toolType === 'translator' && (
            <div className="flex-1">
              <LanguageSelector
                selectedLanguage={language}
                onSelectLanguage={setLanguage}
              />
            </div>
          )}

          {/* Article Rewriter Options */}
          {toolType === 'article-rewriter' && (
            <div className="flex-1">
              <ArticleRewriterOptions
                selectedMode={mode as ArticleRewriterMode}
                onModeChange={setMode}
                keyword={keyword}
                onKeywordChange={setKeyword}
              />
            </div>
          )}
          
          {/* Process Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleProcess}
              disabled={isProcessing || !inputText.trim() || wordCount > wordLimit}
              className="w-full md:w-auto bg-[#0072df] text-white hover:bg-blue-700"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </div>
              ) : (
                `Process ${getToolDisplayName(toolType)}`
              )}
            </Button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-black px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Loading indicator for readability-checker when processing (left column) */}
        {toolType === 'readability-checker' && isProcessing && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center justify-center border-t-4 border-gray-200">
            <div className="flex flex-col items-center">
              <Spinner size="lg" className="text-[#0072df]" />
              <p className="mt-4 text-black font-medium">Analyzing readability...</p>
            </div>
          </div>
        )}
        
      </div>

      {/* Right Column - Output Section */}
      <div className="w-full lg:w-1/2 flex flex-col space-y-6 h-auto lg:h-screen overflow-y-auto lg:pl-3 pb-6">
        {/* Empty state for Readability Checker (right column) */}
        {toolType === 'readability-checker' && !readabilityScores && !isProcessing && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200 flex flex-col items-center justify-center">
            <div className="text-center max-w-md flex flex-col items-center justify-center w-full">
              <svg width="240" height="160" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" className="mb-8">
                {/* Modern gradient background */}
                <defs>
                  <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0f9ff" />
                    <stop offset="100%" stopColor="#dbeafe" />
                  </linearGradient>
                  <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0000001a" />
                  </filter>
                </defs>
                
                {/* Background */}
                <rect x="0" y="0" width="240" height="160" fill="url(#bgGradient)" rx="12" ry="12" />
                
                {/* Modern document */}
                <rect x="40" y="40" width="70" height="90" fill="white" stroke="none" rx="8" ry="8" filter="url(#shadow)" />
                <line x1="50" y1="60" x2="100" y2="60" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="80" x2="100" y2="80" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="100" x2="85" y2="100" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
                
                {/* Modern arrow */}
                <path d="M120,80 C130,80 130,80 140,80" stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M135,75 L145,80 L135,85" fill="none" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Modern readability meter */}
                <rect x="150" y="65" width="50" height="10" rx="5" ry="5" fill="#e5e7eb" />
                <rect x="150" y="65" width="25" height="10" rx="5" ry="5" fill="url(#meterGradient)" />
                
                {/* Modern readability score */}
                <circle cx="175" cy="95" r="20" fill="white" filter="url(#shadow)" />
                <text x="175" y="99" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="#3b82f6" textAnchor="middle">A+</text>
                
                {/* Modern icons */}
                <circle cx="75" cy="30" r="8" fill="#3b82f6" opacity="0.2" />
                <circle cx="175" cy="30" r="8" fill="#3b82f6" opacity="0.2" />
                <path d="M72,30 L78,30 M75,27 L75,33" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M172,30 L178,30 M175,27 L175,33" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Title */}
                <text x="120" y="140" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="#1e40af" textAnchor="middle">Readability Analysis</text>
              </svg>
              <h3 className="text-xl font-semibold mb-2 text-black">Readability Checker</h3>
              <p className="text-black mb-6 max-w-sm">Enter your text on the left and click "Process Readability" to analyze how easy your content is to read and understand.</p>
            </div>
          </div>
        )}
        
        {/* Readability Checker Results (right column) */}
        {toolType === 'readability-checker' && readabilityScores && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-black">Readability Analysis</h2>
            </div>
            

            
            <div className="bg-gray-50 rounded-xl p-0 flex-1 overflow-auto h-full w-full">
              <ReadabilityScoreDisplay fleschKincaid={readabilityScores.fleschKincaid} gunningFog={readabilityScores.gunningFog} />
              {revisedExample && <RevisedExampleDisplay revisedExample={revisedExample} />}
              {outputText && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-black mb-3">Analysis Details</h3>
                  <div className="text-black prose max-w-none" dangerouslySetInnerHTML={{ __html: outputText }} />
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Loading indicator for readability-checker (right column) */}
        {toolType === 'readability-checker' && isProcessing && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center justify-center border-t-4 border-gray-200">
            <div className="flex flex-col items-center">
              <Spinner size="lg" className="text-[#0072df]" />
              <p className="mt-4 text-black font-medium">Analyzing readability...</p>
            </div>
          </div>
        )}
        
        {/* Output section for all tools except readability-checker */}
        {toolType !== 'readability-checker' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex-1 flex flex-col border-t-4 border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-black">Output</h2>
              </div>
              
              {/* Copy button */}
              {showCopyButton && (
                <Button 
                  onClick={handleCopy} 
                  variant="outline" 
                  className="text-black border border-gray-200 hover:bg-gray-50 transition-all duration-300 rounded-lg px-4 py-2 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </Button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-0 flex-1 overflow-auto h-full w-full">
              {outputText ? (
                <>
                  {/* Check if this is the Perfect Grammar message and display it without animation */}
                  {outputText.includes('Your text has perfect grammar') ? (
                    <div className="text-black p-4 h-full" dangerouslySetInnerHTML={{ __html: outputText }} />
                  ) : toolType === 'summarizer' && mode === 'bullet' && typingComplete ? (
                    <BulletPointSummary 
                      summaryText={outputText}
                      className="mt-2"
                    />
                  ) : (
                    <TypingAnimation 
                      text={outputText} 
                      typingSpeed={200} 
                      className="prose max-w-none text-black p-4 h-full w-full"
                      onComplete={() => {
                        setTypingComplete(true);
                        setShowCopyButton(true);
                        // Force a re-render for bullet point summarizer
                        if (toolType === 'summarizer' && mode === 'bullet') {
                          setOutputText(prev => prev);
                        }
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  {/* Tool-specific empty states */}
                  {toolType === 'grammar-checker' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#f0f9ff" rx="20" ry="20" />
                          
                          {/* Document with text */}
                          <rect x="100" y="80" width="200" height="240" fill="white" stroke="#3b82f6" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Text lines */}
                          <line x1="120" y1="120" x2="280" y2="120" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="150" x2="280" y2="150" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="180" x2="280" y2="180" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="210" x2="220" y2="210" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Pencil */}
                          <polygon points="290,160 320,130 340,150 310,180" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
                          <rect x="285" y="175" width="10" height="10" fill="#f59e0b" transform="rotate(-45 290 180)" />
                          <line x1="340" y1="150" x2="350" y2="140" stroke="#f59e0b" strokeWidth="2" />
                          
                          {/* Correction marks */}
                          <circle cx="250" cy="150" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />
                          <circle cx="160" cy="180" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                          
                          {/* Checkmark */}
                          <path d="M155,180 L160,185 L165,175" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          
                          {/* Magnifying glass */}
                          <circle cx="200" cy="280" r="20" fill="white" stroke="#3b82f6" strokeWidth="3" />
                          <line x1="215" y1="295" x2="230" y2="310" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Grammar Checker</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Grammar" to check for grammar, spelling, and punctuation errors. Our AI will highlight issues and suggest corrections to improve your writing.</p>
                    </div>
                  )}
                  
                  {toolType === 'paraphraser' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#f5f3ff" rx="20" ry="20" />
                          
                          {/* Speech bubbles */}
                          <path d="M80,140 Q80,120 100,120 L180,120 Q200,120 200,140 L200,180 Q200,200 180,200 L140,200 L120,220 L120,200 L100,200 Q80,200 80,180 Z" 
                            fill="#c7d2fe" stroke="#6366f1" strokeWidth="3" />
                          
                          <path d="M220,180 Q220,160 240,160 L320,160 Q340,160 340,180 L340,220 Q340,240 320,240 L280,240 L260,260 L260,240 L240,240 Q220,240 220,220 Z" 
                            fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="3" />
                          
                          {/* Text in bubbles */}
                          <line x1="100" y1="140" x2="180" y2="140" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                          <line x1="100" y1="160" x2="160" y2="160" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                          <line x1="100" y1="180" x2="170" y2="180" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                          
                          <line x1="240" y1="180" x2="320" y2="180" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                          <line x1="240" y1="200" x2="300" y2="200" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                          <line x1="240" y1="220" x2="310" y2="220" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                          
                          {/* Circular arrows */}
                          <path d="M200,120 C230,100 270,100 300,120" stroke="#a78bfa" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <polygon points="300,120 310,110 310,130" fill="#a78bfa" />
                          
                          <path d="M200,240 C230,260 270,260 300,240" stroke="#a78bfa" strokeWidth="4" fill="none" strokeLinecap="round" />
                          <polygon points="200,240 190,230 190,250" fill="#a78bfa" />
                          
                          {/* Decorative elements */}
                          <circle cx="80" cy="280" r="15" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                          <circle cx="120" cy="280" r="15" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                          <circle cx="160" cy="280" r="15" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
                          
                          <rect x="240" y="270" width="80" height="20" rx="10" ry="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
                          <rect x="260" y="300" width="60" height="20" rx="10" ry="10" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Paraphraser</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Paraphraser" to rewrite it in a different style. Choose from various modes like formal, creative, academic, or SEO-friendly to transform your content while preserving its meaning.</p>
                    </div>
                  )}
                  
                  {toolType === 'summarizer' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#ecfdf5" rx="20" ry="20" />
                          
                          {/* Large document */}
                          <rect x="80" y="80" width="160" height="240" fill="white" stroke="#10b981" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Text lines in large document */}
                          <line x1="100" y1="110" x2="220" y2="110" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="130" x2="220" y2="130" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="150" x2="220" y2="150" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="170" x2="220" y2="170" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="190" x2="220" y2="190" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="210" x2="220" y2="210" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="230" x2="220" y2="230" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="250" x2="220" y2="250" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="270" x2="220" y2="270" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          <line x1="100" y1="290" x2="180" y2="290" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Small document (summary) */}
                          <rect x="260" y="140" width="100" height="120" fill="white" stroke="#059669" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Text lines in small document */}
                          <line x1="270" y1="160" x2="350" y2="160" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                          <line x1="270" y1="180" x2="350" y2="180" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                          <line x1="270" y1="200" x2="350" y2="200" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                          <line x1="270" y1="220" x2="320" y2="220" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Arrow connecting documents */}
                          <path d="M240,200 L260,200" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
                          <polygon points="260,200 250,195 250,205" fill="#059669" />
                          
                          {/* Magnifying glass */}
                          <circle cx="200" cy="160" r="25" fill="none" stroke="#047857" strokeWidth="3" />
                          <line x1="215" y1="175" x2="230" y2="190" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Decorative elements */}
                          <circle cx="320" cy="100" r="15" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
                          <circle cx="350" cy="100" r="10" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
                          <circle cx="320" cy="280" r="10" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
                          <circle cx="350" cy="280" r="15" fill="#a7f3d0" stroke="#10b981" strokeWidth="2" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Summarizer</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Summarizer" to create a concise summary. Our AI will extract the key points and main ideas from your content, making it easier to digest lengthy information.</p>
                    </div>
                  )}
                  
                  {toolType === 'translator' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#dbeafe" rx="20" ry="20" />
                          
                          {/* Document with different languages */}
                          <rect x="100" y="80" width="200" height="240" fill="white" stroke="#3b82f6" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Language labels and text */}
                          <text x="120" y="110" fontFamily="Arial" fontSize="14" fill="#1e40af" fontWeight="bold">English:</text>
                          <line x1="180" y1="110" x2="280" y2="110" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="150" fontFamily="Arial" fontSize="14" fill="#1e40af" fontWeight="bold">Spanish:</text>
                          <line x1="180" y1="150" x2="280" y2="150" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="190" fontFamily="Arial" fontSize="14" fill="#1e40af" fontWeight="bold">French:</text>
                          <line x1="180" y1="190" x2="280" y2="190" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="230" fontFamily="Arial" fontSize="14" fill="#1e40af" fontWeight="bold">German:</text>
                          <line x1="180" y1="230" x2="280" y2="230" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="270" fontFamily="Arial" fontSize="14" fill="#1e40af" fontWeight="bold">Japanese:</text>
                          <line x1="180" y1="270" x2="260" y2="270" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Globe icon */}
                          <circle cx="320" cy="120" r="30" fill="white" stroke="#3b82f6" strokeWidth="2" />
                          <ellipse cx="320" cy="120" rx="30" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                          <line x1="290" y1="120" x2="350" y2="120" stroke="#3b82f6" strokeWidth="1.5" />
                          <line x1="320" y1="90" x2="320" y2="150" stroke="#3b82f6" strokeWidth="1.5" />
                          <path d="M305,105 Q320,90 335,105 Q320,115 305,105" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" />
                          
                          {/* Translation arrows */}
                          <line x1="150" y1="310" x2="250" y2="310" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                          <polygon points="250,310 240,305 240,315" fill="#3b82f6" />
                          <polygon points="150,310 160,305 160,315" fill="#3b82f6" />
                          
                          {/* Language symbols */}
                          <text x="130" y="320" fontFamily="Arial" fontSize="18" fill="#1e40af" fontWeight="bold">A</text>
                          <text x="270" y="320" fontFamily="Arial" fontSize="18" fill="#1e40af" fontWeight="bold">文</text>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Translator</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Translator" to translate it to another language. Select your target language from the dropdown menu to convert your content with high accuracy.</p>
                    </div>
                  )}
                  
                  {toolType === 'tone-converter' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#fdf2f8" rx="20" ry="20" />
                          
                          {/* Main document */}
                          <rect x="100" y="80" width="200" height="240" fill="white" stroke="#ec4899" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Text lines with different tones */}
                          <text x="120" y="110" fontFamily="Arial" fontSize="12" fill="#be185d" fontWeight="bold">Professional:</text>
                          <line x1="120" y1="125" x2="280" y2="125" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="140" x2="250" y2="140" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="170" fontFamily="Arial" fontSize="12" fill="#be185d" fontWeight="bold">Casual:</text>
                          <line x1="120" y1="185" x2="280" y2="185" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="200" x2="260" y2="200" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="230" fontFamily="Arial" fontSize="12" fill="#be185d" fontWeight="bold">Friendly:</text>
                          <line x1="120" y1="245" x2="280" y2="245" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="260" x2="240" y2="260" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          
                          <text x="120" y="290" fontFamily="Arial" fontSize="12" fill="#be185d" fontWeight="bold">Formal:</text>
                          <line x1="120" y1="305" x2="280" y2="305" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Tone adjustment dial */}
                          <circle cx="320" cy="120" r="30" fill="white" stroke="#ec4899" strokeWidth="2" />
                          <circle cx="320" cy="120" r="25" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3,2" />
                          <circle cx="320" cy="120" r="20" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3,2" />
                          <circle cx="320" cy="120" r="15" fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3,2" />
                          <circle cx="320" cy="120" r="10" fill="#ec4899" />
                          <line x1="320" y1="90" x2="320" y2="95" stroke="#ec4899" strokeWidth="2" />
                          <line x1="320" y1="145" x2="320" y2="150" stroke="#ec4899" strokeWidth="2" />
                          <line x1="290" y1="120" x2="295" y2="120" stroke="#ec4899" strokeWidth="2" />
                          <line x1="345" y1="120" x2="350" y2="120" stroke="#ec4899" strokeWidth="2" />
                          
                          {/* Tone adjustment slider */}
                          <rect x="290" y="200" width="60" height="120" rx="10" ry="10" fill="white" stroke="#ec4899" strokeWidth="2" />
                          <text x="320" y="220" fontFamily="Arial" fontSize="10" fill="#be185d" textAnchor="middle" fontWeight="bold">TONE</text>
                          <line x1="300" y1="240" x2="340" y2="240" stroke="#fbcfe8" strokeWidth="2" />
                          <line x1="300" y1="270" x2="340" y2="270" stroke="#fbcfe8" strokeWidth="2" />
                          <line x1="300" y1="300" x2="340" y2="300" stroke="#fbcfe8" strokeWidth="2" />
                          <circle cx="320" cy="270" r="10" fill="#ec4899" />
                          
                          {/* Tone indicator */}
                          <text x="200" y="40" fontFamily="Arial" fontSize="16" fill="#be185d" textAnchor="middle" fontWeight="bold">Tone Converter</text>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Tone Converter</h3>
                      <p className="max-w-md mx-auto">Enter your text and select a tone to convert it. Transform your writing to sound professional, casual, friendly, formal, or any other tone that suits your needs.</p>
                    </div>
                  )}
                  
                  {toolType === 'humanizer' && (
                    <div className="text-black">
                      <div className="w-64 h-64 mx-auto mb-4">
                        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                          <rect width="400" height="400" fill="#ffedd5" rx="20" ry="20" />
                          
                          {/* Main document */}
                          <rect x="100" y="80" width="200" height="240" fill="white" stroke="#f97316" strokeWidth="3" rx="10" ry="10" />
                          
                          {/* Robot text (before) */}
                          <text x="120" y="110" fontFamily="Arial" fontSize="14" fill="#7c2d12" fontWeight="bold">AI Text:</text>
                          <line x1="120" y1="130" x2="280" y2="130" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="150" x2="280" y2="150" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="170" x2="250" y2="170" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Divider */}
                          <line x1="120" y1="200" x2="280" y2="200" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3" />
                          
                          {/* Human text (after) */}
                          <text x="120" y="230" fontFamily="Arial" fontSize="14" fill="#7c2d12" fontWeight="bold">Human Text:</text>
                          <line x1="120" y1="250" x2="280" y2="250" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="270" x2="280" y2="270" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          <line x1="120" y1="290" x2="260" y2="290" stroke="#fdba74" strokeWidth="3" strokeLinecap="round" />
                          
                          {/* Robot icon */}
                          <rect x="330" y="120" width="40" height="50" fill="#e5e7eb" stroke="#4b5563" strokeWidth="2" rx="5" ry="5" />
                          <circle cx="340" cy="135" r="3" fill="#3b82f6" />
                          <circle cx="360" cy="135" r="3" fill="#3b82f6" />
                          <line x1="340" y1="150" x2="360" y2="150" stroke="#4b5563" strokeWidth="1.5" />
                          <line x1="350" y1="120" x2="350" y2="110" stroke="#4b5563" strokeWidth="1.5" />
                          <circle cx="350" cy="105" r="3" fill="#ef4444" />
                          
                          {/* Human icon */}
                          <circle cx="350" cy="250" r="20" fill="#fdba74" stroke="#f97316" strokeWidth="2" />
                          <circle cx="343" cy="245" r="3" fill="#7c2d12" />
                          <circle cx="357" cy="245" r="3" fill="#7c2d12" />
                          <path d="M343,255 Q350,260 357,255" stroke="#7c2d12" strokeWidth="1.5" fill="none" />
                          
                          {/* Transformation arrow */}
                          <line x1="350" y1="180" x2="350" y2="220" stroke="#f97316" strokeWidth="3" />
                          <polygon points="350,220 345,210 355,210" fill="#f97316" />
                          
                          {/* Magic sparkles */}
                          <circle cx="340" cy="200" r="4" fill="#fbbf24" />
                          <circle cx="360" cy="200" r="4" fill="#fbbf24" />
                          <path d="M340,200 L335,195 L345,195" stroke="#fbbf24" strokeWidth="1" />
                          <path d="M340,200 L335,205 L345,205" stroke="#fbbf24" strokeWidth="1" />
                          
                          {/* Title */}
                          <text x="200" y="40" fontFamily="Arial" fontSize="16" fill="#f97316" textAnchor="middle" fontWeight="bold">AI Text Humanizer</text>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Humanizer</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Humanizer" to make AI-generated content sound more natural and human-written. This tool adds personality and warmth to robotic-sounding text.</p>
                    </div>
                  )}
                  
                  {toolType === 'article-rewriter' && (
                    <div className="text-black">
                      <div className="w-48 h-48 mx-auto mb-6 bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                        <ArticleRewriterIllustration />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Article Rewriter</h3>
                      <p className="max-w-md mx-auto">Enter your text and click "Process Article Rewriter" to transform your content. Choose from different modes like readability, tone, SEO, or unique to enhance your article while maintaining its core message.</p>
                    </div>
                  )}
                  
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextProcessor;
