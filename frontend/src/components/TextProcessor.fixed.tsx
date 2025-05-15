import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ModeSelector from '@/components/ModeSelector';
import LanguageSelector from '@/components/LanguageSelector';
import ReadabilityScoreDisplay from '@/components/ReadabilityScoreDisplay';
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
  const [revisedExample, setRevisedExample] = useState<string | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Update word count when input text changes
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
    
    // Word limit and pro feature checks removed - all features available

    setIsProcessing(true);
    setError(null);
    setTypingComplete(false);
    setShowCopyButton(false);
    setReadabilityScores(null);
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
        
        // If we have corrections, highlight them in bold
        if (hasRealCorrections) {
          // Start with the corrected text
          let highlightedText = correctedText;
          
          // Process each correction to highlight it in bold
          grammarResult.corrections.forEach((correction: { original: string; corrected: string }) => {
            // Only highlight if the correction is different from the original
            if (correction.original !== correction.corrected) {
              // Escape special regex characters in the corrected text
              const escapedCorrected = correction.corrected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              
              // Create a regex to find the corrected text (with word boundaries if possible)
              const regex = new RegExp(`(${escapedCorrected})`, 'g');
              
              // Replace with bold version
              highlightedText = highlightedText.replace(regex, '<strong>$1</strong>');
            }
          });
          
          processedText = highlightedText;
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
      
      // Set the output text
      setOutputText(processedText);
      
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

  const handleCopy = () => {
    const textToCopy = outputText ? stripHtml(outputText) : inputText;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full">
      {/* Input Section */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Input Box */}
        <div className="bg-white p-6 rounded-xl shadow-md flex-1 border-t-4 border-[#0072df]">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Input</h2>
              <p className="text-gray-500 text-sm">Enter your text below</p>
            </div>
            <div className={`text-sm font-medium ${wordCount > wordLimit ? 'text-red-500' : 'text-gray-500'}`}>
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
          
          <RichTextEditor 
            value={inputText} 
            onChange={setInputText} 
            placeholder={`Enter your text to ${getToolActionText(toolType)}...`}
            className="min-h-[200px]"
          />
          
          <div className="flex justify-between mt-4">
            <Button 
              onClick={handleClear} 
              variant="outline"
              className="text-gray-700 border border-gray-200 hover:bg-gray-50"
            >
              Clear Text
            </Button>
            <Button 
              onClick={handleCopy} 
              variant="outline"
              className="text-gray-700 border border-gray-200 hover:bg-gray-50"
              disabled={!inputText.trim()}
            >
              Copy Text
            </Button>
          </div>
        </div>
        
        {/* Controls Section */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Readability Checker Results */}
        {toolType === 'readability-checker' && readabilityScores && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 border-t-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Readability Analysis</h2>
            <ReadabilityScoreDisplay fleschKincaid={readabilityScores.fleschKincaid} gunningFog={readabilityScores.gunningFog} />
            {revisedExample && <RevisedExampleDisplay revisedExample={revisedExample} />}
          </div>
        )}
        
        {/* Loading indicator for readability-checker when processing */}
        {toolType === 'readability-checker' && isProcessing && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex items-center justify-center border-t-4 border-[#0072df]">
            <div className="flex flex-col items-center">
              <Spinner size="lg" className="text-[#0072df]" />
              <p className="mt-4 text-[#0072df] font-medium">Analyzing readability...</p>
            </div>
          </div>
        )}
        
        {/* Output section for all tools except readability-checker */}
        {toolType !== 'readability-checker' && (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 flex flex-col border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-700">Output</h2>
              </div>
              
              {/* Copy button */}
              {showCopyButton && (
                <Button 
                  onClick={handleCopy} 
                  variant="outline" 
                  className="text-gray-700 border border-gray-200 hover:bg-gray-50 transition-all duration-300 rounded-lg px-4 py-2 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <div dangerouslySetInnerHTML={{ __html: outputText }} />
                  ) : (
                    <TypingAnimation 
                      text={outputText} 
                      typingSpeed={5} 
                      className="prose max-w-none"
                      onComplete={() => {
                        setTypingComplete(true);
                        setShowCopyButton(true);
                      }}
                    />
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  {/* Tool-specific empty states */}
                  {toolType === 'grammar-checker' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <p>Enter your text and click "Process Grammar" to check for grammar, spelling, and punctuation errors.</p>
                    </div>
                  )}
                  
                  {toolType === 'paraphraser' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <p>Enter your text and click "Process Paraphraser" to rewrite it in a different style.</p>
                    </div>
                  )}
                  
                  {toolType === 'summarizer' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p>Enter your text and click "Process Summarizer" to create a concise summary.</p>
                    </div>
                  )}
                  
                  {toolType === 'translator' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <p>Enter your text and select a language to translate it.</p>
                    </div>
                  )}
                  
                  {toolType === 'tone-converter' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p>Enter your text and select a tone to convert it.</p>
                    </div>
                  )}
                  
                  {toolType === 'humanizer' && (
                    <div className="text-gray-500">
                      <div className="w-24 h-24 mx-auto mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p>Enter AI-generated text and click "Process Humanizer" to make it sound more natural.</p>
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
