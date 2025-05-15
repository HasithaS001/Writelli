import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import InsertOptions from '@/components/ui/InsertOptions';
import BulletPointSummary from '@/components/ui/BulletPointSummary';
import ModeSelector from '@/components/ModeSelector';
import LanguageSelector from '@/components/LanguageSelector';
import ReadabilityScoreDisplay from '@/components/ReadabilityScoreDisplay';
import ReadabilityImprovementPoints from '@/components/ReadabilityImprovementPoints';
import RevisedExampleDisplay from '@/components/RevisedExampleDisplay';
import TypingAnimation from '@/components/ui/TypingAnimation';
import { 
  ToolType, 
  ReadabilityCheckerResponse, 
  GrammarCheckerResponse,
  ParaphraserResponse,
  SummarizerResponse,
  TranslatorResponse,
  ToneConverterResponse,
  HumanizerResponse
} from '@/types';
import { processText } from '@/services/api';

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

// All features are now available (no pro-only features)
const isProOnlyMode = (toolType: ToolType, mode: string): boolean => {
  return false; // All features available
};

const TextProcessor: React.FC<TextProcessorProps> = ({ toolType }) => {
  const router = useRouter();
  // All features available (no restrictions)
  const isProUser = true;
  const wordLimit = 10000; // High limit (effectively no limit)
  const checkFeatureAccess = (feature: string) => true;
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('');
  const [language, setLanguage] = useState('English');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readabilityScores, setReadabilityScores] = useState<{ fleschKincaid: number; gunningFog: number } | null>(null);
  const [improvementPoints, setImprovementPoints] = useState<string[]>([]);
  const [revisedExample, setRevisedExample] = useState<string | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Update word count when input text changes (no limit enforced)
  useEffect(() => {
    const plainText = inputText.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/) : [];
    setWordCount(words.length);
  }, [inputText]);

  // Set initial mode based on tool type
  useEffect(() => {
    if (getToolModes(toolType).length > 0) {
      setMode(getToolModes(toolType)[0]);
    }
    
    // Reset states when tool type changes
    setInputText('');
    setOutputText('');
    setError(null);
    setReadabilityScores(null);
    setRevisedExample(null);
    setTypingComplete(false);
    setShowCopyButton(false);
  }, [toolType]);

  const handleProcess = async () => {
    // Strip HTML tags for validation
    const plainText = inputText.replace(/<[^>]*>/g, '').trim();
    if (!plainText) {
      setError('Please enter some text to process');
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
      const result = await processText(toolType, inputText, mode, language);
      
      // Function to convert Markdown-style bold (**text**) to HTML bold tags (<b>text</b>)
      const convertMarkdownBoldToHtml = (text: string): string => {
        return text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
      };
      
      // Extract the appropriate field based on the tool type
      let processedText = '';
      if (toolType === 'grammar-checker') {
        const grammarResult = result as GrammarCheckerResponse;
        
        // Get the corrected text
        let correctedText = grammarResult.correctedText;
        
        // Check if there are any actual corrections (where original and corrected are different)
        const hasRealCorrections = grammarResult.corrections && 
          grammarResult.corrections.some(correction => correction.original !== correction.corrected);
        
        // If we have corrections, use the color-coded text if available
        if (hasRealCorrections) {
          // Use color-coded text if available, otherwise fallback to the previous highlighting method
          if (grammarResult.colorCodedText) {
            processedText = grammarResult.colorCodedText;
          } else {
            // Start with the corrected text (fallback to old method)
            let highlightedText = correctedText;
            
            // Process each correction to highlight it in bold
            grammarResult.corrections.forEach((correction: { original: string; corrected: string; color?: string }) => {
              // Only highlight if the correction is different from the original
              if (correction.original !== correction.corrected) {
                // Escape special regex characters in the corrected text
                const escapedCorrected = correction.corrected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                // Create a regex to find the corrected text
                const regex = new RegExp(`(${escapedCorrected})`, 'g');
                
                // Use color if available, otherwise use bold
                const color = correction.color || '#3b82f6'; // Default to blue if no color
                highlightedText = highlightedText.replace(
                  regex, 
                  `<span style="color: ${color}; font-weight: bold;" title="Original: ${correction.original}">$1</span>`
                );
              }
            });
            
            processedText = highlightedText;
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
      } else if (toolType === 'readability-checker') {
        const readabilityResult = result as ReadabilityCheckerResponse;
        setReadabilityScores(readabilityResult.scores);
        if (readabilityResult.improvementPoints) {
          setImprovementPoints(readabilityResult.improvementPoints);
        }
        if (readabilityResult.revisedExample) {
          setRevisedExample(readabilityResult.revisedExample);
        }
        processedText = readabilityResult.readabilityAnalysis;
      } else if (toolType === 'paraphraser') {
        const paraphraserResult = result as ParaphraserResponse;
        processedText = paraphraserResult.paraphrasedText;
      } else if (toolType === 'summarizer') {
        const summarizerResult = result as SummarizerResponse;
        processedText = summarizerResult.summary;
      } else if (toolType === 'translator') {
        const translatorResult = result as TranslatorResponse;
        processedText = translatorResult.translatedText;
      } else if (toolType === 'tone-converter') {
        const toneResult = result as ToneConverterResponse;
        processedText = toneResult.convertedText;
      } else if (toolType === 'humanizer') {
        const humanizerResult = result as HumanizerResponse;
        processedText = humanizerResult.humanizedText;
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
    const textToCopy = outputText ? stripHtml(outputText) : inputText;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
      {/* Left Column - Input Section */}
      <div className="lg:w-1/2 flex flex-col space-y-6 h-screen overflow-y-auto pr-3">
        {/* Input Box */}
        <div className="bg-white p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200 sticky top-0">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black">Input</h2>
              <p className="text-black text-sm">Enter your text below</p>
            </div>
            <div className={`text-sm font-medium ${wordCount > wordLimit ? 'text-red-500' : 'text-black'}`}>
              {wordCount} / {wordLimit} words
              {wordCount > wordLimit && (
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
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter your text to ${getToolActionText(toolType)}...`}
              className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-open-sans"
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
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 sticky top-0 z-10">
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
      <div className="lg:w-1/2 flex flex-col space-y-6 h-screen overflow-y-auto pl-3">
        {/* Empty state for Readability Checker (right column) */}
        {toolType === 'readability-checker' && !readabilityScores && !isProcessing && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200 flex flex-col items-center justify-center">
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
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 border-t-4 border-gray-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-black">Readability Analysis</h2>
            </div>
            

            
            <div className="bg-gray-50 rounded-xl p-5 flex-1 overflow-auto">
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
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex flex-col border-t-4 border-gray-200">
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
            
            <div className="bg-gray-50 rounded-xl p-5 flex-1 overflow-auto">
              {outputText ? (
                <>
                  {/* Check if this is the Perfect Grammar message and display it without animation */}
                  {outputText.includes('Your text has perfect grammar') ? (
                    <div className="text-black" dangerouslySetInnerHTML={{ __html: outputText }} />
                  ) : toolType === 'summarizer' && mode === 'bullet' && typingComplete ? (
                    <BulletPointSummary 
                      summaryText={outputText}
                      className="mt-2"
                    />
                  ) : (
                    <TypingAnimation 
                      text={outputText} 
                      typingSpeed={200} 
                      className="prose max-w-none text-black"
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
