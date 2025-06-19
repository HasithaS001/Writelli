const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS_PER_WINDOW = 1000; // Maximum requests per window
const requestLog = [];

// Check if we're rate limited
function isRateLimited() {
  const now = Date.now();
  // Remove expired entries
  while (requestLog.length > 0 && requestLog[0] < now - RATE_LIMIT_WINDOW) {
    requestLog.shift();
  }
  
  // Check if we're over the limit
  return requestLog.length >= MAX_REQUESTS_PER_WINDOW;
}

// Add a request to the log
function logRequest() {
  requestLog.push(Date.now());
}

// Middleware to check rate limiting
const checkRateLimit = (req, res, next) => {
  if (isRateLimited()) {
    console.log('Rate limit exceeded');
    return res.status(429).json({ 
      error: 'API quota exceeded. Please try again later.',
      isRateLimited: true
    });
  }
  next();
};

// Helper function to strip HTML tags for processing
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '');
}

// Helper function to generate content with Gemini API
async function generateContent(prompt) {
  try {
    console.log('Starting content generation with prompt:', prompt.substring(0, 100) + '...');
    // Log the request for rate limiting
    logRequest();
    
    // Add a timeout to prevent long-running requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 15000); // 15 second timeout
    });
    
    // Make the API request with timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise
    ]);
    
    // Check if result is valid
    if (!result || !result.response) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const response = await result.response;
    const text = response.text();
    
    // Check if text is valid
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    const errorMessage = error.message || 'Unknown error';
    
    // Map errors to specific codes
    let errorResponse = {
      error: errorMessage,
      code: 'UNKNOWN_ERROR'
    };
    
    if (errorMessage.includes('API key')) {
      errorResponse = { error: 'Invalid or expired API key', code: 'INVALID_API_KEY' };
    } else if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      errorResponse = { error: 'API quota exceeded', code: 'QUOTA_EXCEEDED' };
    } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      errorResponse = { error: 'Request timed out', code: 'TIMEOUT' };
    } else if (errorMessage.includes('model is overloaded') || errorMessage.includes('Service Unavailable')) {
      errorResponse = { error: 'Service temporarily unavailable', code: 'SERVICE_UNAVAILABLE' };
    }
    
    // Log the error details for debugging
    console.error('Error response:', errorResponse);
    
    // Throw the error to be caught by the route handler
    throw errorResponse;
  }
}

// 1. Grammar Checker
router.post('/grammar-checker', checkRateLimit, async (req, res) => {
  console.log('Received grammar checker request');
  try {
    const { text, mode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    let prompt;
    if (mode === 'advanced') {
      prompt = `You are a world-class editor with expertise in academic, professional, and creative writing. Review the following text meticulously.

Your task is to:

Correct advanced grammar issues, including subject-verb agreement, tense consistency, parallelism, misplaced modifiers, and punctuation.

Improve writing style and tone, optimizing for clarity, coherence, fluency, and sophistication without altering the original meaning.

Refine sentence structure to reduce wordiness, eliminate passive voice (unless justified), and enhance logical flow.

Maintain or enhance the intended tone (formal, academic, casual, persuasive, etc.) if recognizable; ask if unclear.

Highlight (or note) any significant style suggestions that may enhance the text (e.g., variation in sentence length, stronger transitions, better vocabulary).

Ensure that the output meets professional publishing standards (e.g., academic journals, business writing, high-end content).

Provide the improved version of the text first, followed by a bullet-point list explaining the key changes.

Original text: "${plainText}"

Provide your response in the following format:

CORRECTED_TEXT: [Your corrected version of the text]

CORRECTIONS: [List each correction you made in the format "original text -> corrected text", one per line]`;
    } else {
      // Standard check by default
      prompt = `Please perform a standard grammar check on the following text. Fix basic spelling, punctuation, and grammar errors.

Original text: "${plainText}"

Provide your response in the following format:

CORRECTED_TEXT: [Your corrected version of the text]

CORRECTIONS: [List each correction you made in the format "original text -> corrected text", one per line]`;
    }
    
    const result = await generateContent(prompt);
    
    // Parse the structured response
    let correctedText = '';
    let corrections = [];
    
    // Extract the corrected text
    const correctedMatch = result.match(/CORRECTED_TEXT:\s*([\s\S]*?)(?=\nCORRECTIONS:|$)/i);
    if (correctedMatch && correctedMatch[1]) {
      correctedText = correctedMatch[1].trim();
    }
    
    // Extract the corrections list
    const correctionsMatch = result.match(/CORRECTIONS:\s*([\s\S]*?)(?=\n\w+:|$)/i);
    if (correctionsMatch && correctionsMatch[1]) {
      const correctionsList = correctionsMatch[1].trim().split('\n');
      corrections = correctionsList.map(correction => {
        const parts = correction.split('->');
        if (parts.length === 2) {
          return {
            original: parts[0].trim(),
            corrected: parts[1].trim(),
            // Add a random color for each correction (frontend can override this)
            color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random color
          };
        }
        return null;
      }).filter(Boolean);
    }
    
    // If we couldn't parse the structured data, use the full response as the corrected text
    if (!correctedText) {
      correctedText = result;
    }
    
    // Note: Color-coded text generation is implemented but not included in response yet
    // This function generates color-coded HTML but we're not using it in the response currently
    const generateColorCodedText = (text, corrections) => {
      if (!text || !corrections || corrections.length === 0) {
        return text;
      }
      
      let colorCodedText = text;
      
      // Sort corrections by length (longest first) to avoid nested replacements
      const sortedCorrections = [...corrections].sort((a, b) => 
        b.corrected.length - a.corrected.length
      );
      
      // Replace each correction with a colored span
      sortedCorrections.forEach(correction => {
        // Escape special regex characters in the corrected text
        const escapedText = correction.corrected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedText, 'g');
        
        // Replace with colored span
        colorCodedText = colorCodedText.replace(
          regex, 
          `<span style="color: ${correction.color}; font-weight: bold;" title="Original: ${correction.original}">${correction.corrected}</span>`
        );
      });
      
      return colorCodedText;
    };
    
    // Generate the color-coded text (but don't include it in response yet)
    // const colorCodedText = generateColorCodedText(correctedText, corrections);
    
    res.json({
      originalText: plainText,
      correctedText: correctedText,
      corrections: corrections,
      message: corrections.length === 0 ? 'Your text is perfect!' : undefined
      // colorCodedText: colorCodedText // Commented out until we're ready to use it
    });
  } catch (error) {
    // If it's our custom error response, use it
    if (error.code) {
      res.status(500).json(error);
    } else {
      // For unexpected errors
      res.status(500).json({
        error: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      });
    }
  }
});

// 2. Readability Checker
router.post('/readability-checker', checkRateLimit, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    // Check if text is too short for meaningful analysis
    if (plainText.trim().length < 10) {
      return res.json({
        readabilityAnalysis: 'The text is too short for a meaningful readability analysis. Please provide a longer text.',
        scores: {
          fleschKincaid: 90, // Default high score for short text
          gunningFog: 6 // Default low score (easy to read) for short text
        },
        revisedExample: ''
      });
    }
    
    const prompt = `Analyze the readability of the following text. Provide a detailed analysis including:

1. A comprehensive readability assessment
2. The exact Flesch-Kincaid score (as a number between 0-100)
3. The exact Gunning Fog Index score (as a number)
4. Specific point-wise suggestions for improving readability
5. A revised example of a portion of the text with improved readability

Format your response as follows:

ANALYSIS: [Your detailed analysis here]

FLESCH_KINCAID_SCORE: [Exact score as a number between 0-100]

GUNNING_FOG_SCORE: [Exact score as a number]

IMPROVEMENT_POINTS:
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]
- [Point 5]

REVISED_EXAMPLE: [A revised example of a portion of the text]

Text to analyze: "${plainText}"`;
    
    console.log('Sending readability analysis request to Gemini API');
    const result = await generateContent(prompt);
    console.log('Received response from Gemini API');
    
    // Parse the structured response
    let readabilityAnalysis = '';
    let fleschKincaidScore = 0;
    let gunningFogScore = 0;
    let revisedExample = '';
    let improvementPoints = [];
    
    try {
      // Extract the analysis
      const analysisMatch = result.match(/ANALYSIS:\s*([\s\S]*?)(?=\nFLESCH_KINCAID_SCORE:|$)/i);
      if (analysisMatch && analysisMatch[1]) {
        readabilityAnalysis = analysisMatch[1].trim();
      }
      
      // Extract the Flesch-Kincaid score
      const fleschMatch = result.match(/FLESCH_KINCAID_SCORE:\s*(\d+(?:\.\d+)?)/i);
      if (fleschMatch && fleschMatch[1]) {
        fleschKincaidScore = parseFloat(fleschMatch[1]);
      }
      
      // Extract the Gunning Fog score
      const fogMatch = result.match(/GUNNING_FOG_SCORE:\s*(\d+(?:\.\d+)?)/i);
      if (fogMatch && fogMatch[1]) {
        gunningFogScore = parseFloat(fogMatch[1]);
      }
      
      // Extract the improvement points
      const pointsMatch = result.match(/IMPROVEMENT_POINTS:\s*([\s\S]*?)(?=\nREVISED_EXAMPLE:|$)/i);
      if (pointsMatch && pointsMatch[1]) {
        // Split by bullet points and clean up
        improvementPoints = pointsMatch[1]
          .split('\n')
          .map(point => point.trim())
          .filter(point => point.startsWith('-'))
          .map(point => point.substring(1).trim())
          .filter(point => point.length > 0);
      }
      
      // Extract the revised example
      const revisedMatch = result.match(/REVISED_EXAMPLE:\s*([\s\S]*?)(?=\n\w+:|$)/i);
      if (revisedMatch && revisedMatch[1]) {
        revisedExample = revisedMatch[1].trim();
      }
      
      // If we couldn't parse the structured data, use the full response as the analysis
      if (!readabilityAnalysis) {
        readabilityAnalysis = result;
      }
    } catch (parseError) {
      console.error('Error parsing readability response:', parseError);
      // If parsing fails, use the raw result
      readabilityAnalysis = result || 'Analysis completed but format could not be parsed.';
    }
    
    // Ensure scores are within expected ranges
    fleschKincaidScore = Math.max(0, Math.min(100, fleschKincaidScore || 50));
    gunningFogScore = Math.max(0, Math.min(20, gunningFogScore || 10));
    
    // Ensure we have a valid response
    if (!readabilityAnalysis || readabilityAnalysis.trim() === '') {
      readabilityAnalysis = 'The readability analysis could not be generated. Please try again with different text.';
    }
    
    console.log('Sending readability analysis response to client');
    res.json({
      readabilityAnalysis,
      scores: {
        fleschKincaid: fleschKincaidScore,
        gunningFog: gunningFogScore
      },
      improvementPoints: improvementPoints || [],
      revisedExample: revisedExample || ''
    });
  } catch (error) {
    console.error('Readability checker error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'There was an error processing your request. Please try again with different text or contact support.'
    });
  }
});

// 3. Paraphraser
router.post('/paraphraser', checkRateLimit, async (req, res) => {
  try {
    const { text, mode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    let prompt;
    switch (mode) {
      case 'standard':
        prompt = `Paraphrase the following text for general casual use. Maintain approximately the same length as the original text: "${plainText}"`;
        break;
      case 'fluency':
        prompt = `Paraphrase the following text to make it more readable and grammatically correct. Keep the output length similar to the input: "${plainText}"`;
        break;
      case 'formal':
        prompt = `Paraphrase the following text into a professional tone. Maintain approximately the same word count as the original: "${plainText}"`;
        break;
      case 'creative':
        prompt = `Paraphrase the following text with creative flair and literary style. Keep the output length similar to the input length: "${plainText}"`;
        break;
      case 'shorten':
        prompt = `Paraphrase the following text to be slightly more concise while keeping the essential meaning: "${plainText}"`;
        break;
      case 'expand':
        prompt = `Paraphrase the following text to add more detail and explanation. Aim for about 20-30% more words than the original: "${plainText}"`;
        break;
      case 'academic':
        prompt = `Paraphrase the following text in a formal academic tone while avoiding plagiarism. Maintain approximately the same length as the source text: "${plainText}"`;
        break;
      case 'seo':
        prompt = `Paraphrase the following text to be SEO-friendly for content marketing. Keep the output length similar to the input: "${plainText}"`;
        break;
      default:
        prompt = `Paraphrase the following text while maintaining approximately the same length as the original: "${plainText}"`;
    }
    
    const result = await generateContent(prompt);
    res.json({ paraphrasedText: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Summarizer
router.post('/summarizer', checkRateLimit, async (req, res) => {
  try {
    const { text, mode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    let prompt;
    switch (mode) {
      case 'bullet':
        prompt = `Summarize the following text into bullet points of key information: "${plainText}"`;
        break;
      case 'executive':
        prompt = `Create a brief professional executive summary of the following text: "${plainText}"`;
        break;
      case 'detailed':
        prompt = `Create a detailed summary with the main ideas and supporting points from the following text: "${plainText}"`;
        break;
      default:
        prompt = `Summarize the following text: "${plainText}"`;
    }
    
    const result = await generateContent(prompt);
    res.json({ summary: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Translator
router.post('/translator', checkRateLimit, async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required' });
    }
    
    const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text without any notes, explanations, or additional content. Do not include phrases like 'Translation:' or 'Here is the translation:' or any NOTE section at the end. Just provide the direct translation: "${plainText}"`;
    
    const result = await generateContent(prompt);
    res.json({ translatedText: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Tone Converter
router.post('/tone-converter', checkRateLimit, async (req, res) => {
  try {
    const { text, tone } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    if (!tone) {
      return res.status(400).json({ error: 'Tone is required' });
    }
    
    const prompt = `Convert the tone of the following text to be ${tone}: "${plainText}"`;
    
    const result = await generateContent(prompt);
    res.json({ convertedText: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Humanizer
router.post('/humanizer', checkRateLimit, async (req, res) => {
  try {
    const { text, mode } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    let prompt;
    switch (mode) {
      case 'natural':
        prompt = `You are a highly skilled human writer tasked with rewriting a paragraph to feel unmistakably written by a thoughtful, expressive human being — not an AI. Start your response in a unique way - avoid starting with common phrases like 'ok so', 'well', or 'you know'. Each response should begin differently. Rewrite the text using a natural writing rhythm that reflects how people genuinely communicate in writing. This includes:

Varying sentence lengths and structures naturally (some short, some long, some fragmented).

Using conversational transitions, casual interjections, and idiomatic language (e.g., “to be honest,” “let’s face it,” “oddly enough”).

Introducing light redundancy, filler words, and slightly offbeat phrasing that adds a human fingerprint.

Avoiding mechanical or overly polished grammar — allow for natural pauses, mild imperfection, and personal nuance.

Embedding small reflections, opinions, or emotional undertones where appropriate.

Making it sound like it was written spontaneously by a human — not optimized for clarity or perfection, but for authenticity and expression.

The final result must:

Be undetectable by AI detectors (aim for a 0% AI score).

Sound like it was written by a human with genuine thoughts, a distinct voice, and a natural flow.

Use organic transitions, like how someone would write in an email, blog post, or opinion piece.

Do not make it sound academic, robotic, or over-structured.

Text to rewrite: "${plainText}"`;
        break;
      case 'bypass':
        prompt = `You are a human writer with a unique, natural voice. Begin your response in an engaging and unexpected way - never start with the same phrases or patterns. Each response should have its own unique opening. Rewrite the following text so it reads with the rhythm, nuance, and unpredictability of real human writing. Add subtle imperfections, informal phrasing, natural transitions, emotional tone, and contextual reflections. Vary sentence lengths, occasionally start sentences with conjunctions, use contractions, idioms, rhetorical questions, and soft interjections. Introduce mild hesitations, digressions, or personal commentary if appropriate — as if the thoughts are unfolding in real time. Avoid robotic perfection or patterns common in AI-generated content. Make the paragraph sound like something written by someone typing casually but thoughtfully — maybe while sipping coffee or telling a story to a friend. Your goal is to make it undetectable by any AI detector, indistinguishable from something written by a real human with a natural voice.The goal is to fully humanize the paragraph to the point where AI detection tools (like GPTZero, Turnitin, Originality.ai) will classify it as 100% human-written. The final result should feel informal but polished — like something written by a thoughtful blogger, student, or online writer. Make it sound alive.

Text to rewrite: "${plainText}"`;
        break;
      case 'emotional':
        prompt = `"Start with a fresh, emotionally resonant opening - avoid any standard or repetitive beginnings. Make each response start uniquely. Rewrite the following paragraph with deep emotional nuance and a distinct human voice. Infuse it with natural rhythm, varied sentence lengths, and an organic flow of thoughts — as if someone is expressing a genuine experience, memory, or personal reflection. The tone should be rich with feeling, vulnerability, and authenticity. Use expressive language, mild imperfection, and occasional hesitations, like someone truly thinking aloud or journaling from the heart. Avoid robotic tone, perfect structure, or generic phrasing. You may include metaphors, sensory descriptions, or relatable side-notes if it adds realism. The goal is to craft a paragraph that feels completely human-written — emotionally resonant, stylistically natural, and undetectable by AI detectors. Write as if this is a piece of your own story, not an assignment."${plainText}"`;
        break;
      case 'conversational':
        prompt = `"Begin with a fresh, conversational opener - as if jumping into the middle of a natural discussion. Avoid standard starts and make each response begin differently. Take the following paragraph and completely rewrite it in a natural, conversational, and human tone, as if someone is speaking directly to a friend or writing a casual blog post. Add realistic imperfections like mild hesitations, contractions, varied sentence lengths, and the occasional filler word (like ‘honestly’, ‘you know’, ‘kind of’, ‘actually’, etc.).

Make it sound fluid, expressive, and genuinely human — like someone is thinking aloud or telling a story. Include small emotional cues, personal reflection, and natural rhythm. Avoid robotic grammar or overly formal sentence structures. You can slightly rephrase or reorder ideas if that helps it sound more organic.

Use your best judgment to make it feel 100% written by a real person — not AI. The end result should pass any AI detection tool by sounding like natural, thoughtful, spoken-language writing."${plainText}"`;
        break;
      case 'genz':
        prompt = `Start with a totally random Gen Z vibe - different each time, super casual and unique. Then rewrite the following text in Gen Z style with appropriate slang and tone: "${plainText}"`;
        break;
      default:
        prompt = `Start with a fresh, unique opening sentence, then rewrite the following text to sound more human: "${plainText}"`;
    }
    
    let result = await generateContent(prompt);
    
    // Clean up the output
    result = result
      .replace(/^\s*ok\s+so\s*\.{0,3}\s*right[,.]?\s*/i, '') // Remove "ok so ... right"
      .replace(/[\*\-]\s*/g, '') // Remove * and - symbols
      .trim();
    
    res.json({ humanizedText: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Article Rewriter endpoint
router.post('/article-rewriter', checkRateLimit, async (req, res) => {
  try {
    const { text, mode, keyword } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Strip HTML tags for processing
    const plainText = stripHtml(text);
    
    let prompt;
    switch (mode) {
      case 'readability':
        prompt = `You are a professional editor focused on improving text clarity and readability while maintaining a formal tone. Please rewrite the following text to be more clear, concise, and well-structured. Focus on:

1. Using precise vocabulary and professional language
2. Maintaining consistent formal tone throughout
3. Organizing ideas logically with proper transitions
4. Eliminating redundancy while preserving key information
5. Ensuring proper paragraph structure and flow

Text to rewrite: "${plainText}"`;
        break;
        
      case 'tone':
        if (!keyword) {
          return res.status(400).json({ error: 'Tone selection is required' });
        }
        
        switch (keyword) {
          case 'academic':
            prompt = `You are a scholarly writer with expertise in academic writing. Rewrite the following text in a rigorous academic style suitable for scholarly publications. Focus on:

1. Using discipline-specific terminology and formal academic language
2. Maintaining objective, evidence-based argumentation
3. Employing precise citations and references where appropriate
4. Structuring content with clear thesis statements and topic sentences
5. Following academic writing conventions and style guidelines

Text to rewrite: "${plainText}"`;
            break;
            
          case 'business':
            prompt = `You are a professional business writer. Rewrite the following text in a clear, authoritative business style suitable for corporate communications. Focus on:

1. Using concise, action-oriented business language
2. Maintaining professional tone and executive-level vocabulary
3. Emphasizing key metrics and business outcomes
4. Structuring content for busy professionals
5. Following business writing best practices

Text to rewrite: "${plainText}"`;
            break;
            
          case 'technical':
            prompt = `You are a technical writer specializing in detailed documentation. Rewrite the following text in a precise, technical style. Focus on:

1. Using industry-standard technical terminology
2. Maintaining clarity in complex technical explanations
3. Providing specific, actionable information
4. Organizing content in a logical, systematic way
5. Following technical writing standards

Text to rewrite: "${plainText}"`;
            break;
            
          case 'formal':
            prompt = `You are an expert in formal writing. Rewrite the following text in a sophisticated, elevated style suitable for formal documents. Focus on:

1. Using refined, elevated vocabulary
2. Maintaining consistent formal tone
3. Employing complex yet clear sentence structures
4. Following formal writing conventions
5. Avoiding any colloquialisms or informal language

Text to rewrite: "${plainText}"`;
            break;
            
          default:
            return res.status(400).json({ error: 'Invalid tone selection' });
        }
        break;
        
      case 'seo':
        if (!keyword) {
          return res.status(400).json({ error: 'Keyword is required for SEO mode' });
        }
        prompt = `You are an SEO content specialist. Rewrite the following text to optimize it for search engines while maintaining professional tone and readability. Focus on:

1. Naturally incorporating the keyword "${keyword}" at an optimal density
2. Using relevant semantic variations and LSI keywords
3. Maintaining clear heading structure and paragraph organization
4. Ensuring professional, authoritative tone
5. Preserving readability and user value

Text to rewrite: "${plainText}"`;
        break;
        
      case 'unique':
        prompt = `You are a professional content writer tasked with rewriting this text to be completely unique while maintaining high standards of formal writing. Focus on:

1. Restructuring sentences and paragraphs while preserving meaning
2. Using sophisticated synonyms and alternative phrasings
3. Maintaining professional tone and academic style
4. Ensuring logical flow and coherent organization
5. Preserving technical accuracy and precision

Text to rewrite: "${plainText}"`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid mode specified' });
    }
    
    const result = await generateContent(prompt);
    
    // Clean up the output - remove any markdown formatting or unnecessary prefixes
    const cleanedResult = result
      .replace(/^(?:Here's|Here is|The rewritten|Rewritten)\s+(?:the|your)?\s+(?:text|version|content)[:\s]*/i, '')
      .replace(/^[\*\-]\s*/gm, '')
      .trim();
    
    res.json({ rewrittenText: cleanedResult });
  } catch (error) {
    console.error('Article rewriter error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while rewriting the text',
      details: 'Please try again with different text or contact support.'
    });
  }
});

// Article Rewriter
router.post('/article-rewriter', checkRateLimit, async (req, res) => {
  try {
    const { text, mode, keyword } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Strip HTML tags for processing
    const plainText = stripHtml(text);

    let prompt;
    switch (mode) {
      case 'readability':
        prompt = `You are an expert content editor. Rewrite the following text to improve its readability while maintaining professional standards. Focus on:

1. Using clear, concise language
2. Breaking down complex sentences
3. Improving flow and coherence
4. Maintaining professional tone
5. Enhancing overall clarity

Text to rewrite: "${plainText}"`;
        break;

      case 'professional':
        prompt = `You are a professional content writer. Rewrite the following text to enhance its professional tone. Focus on:

1. Using formal business language
2. Maintaining authoritative tone
3. Incorporating industry terminology
4. Ensuring logical structure
5. Following professional writing standards

Text to rewrite: "${plainText}"`;
        break;

      case 'seo':
        if (!keyword) {
          return res.status(400).json({ error: 'Keyword is required for SEO mode' });
        }
        prompt = `You are an SEO content specialist. Rewrite the following text to optimize it for search engines while maintaining professional tone and readability. Focus on:

1. Naturally incorporating the keyword "${keyword}" at an optimal density
2. Using relevant semantic variations and LSI keywords
3. Maintaining clear heading structure
4. Ensuring professional tone
5. Preserving readability

Text to rewrite: "${plainText}"`;
        break;

      case 'unique':
        prompt = `You are a professional content writer. Rewrite the following text to be completely unique while maintaining high quality. Focus on:

1. Restructuring sentences while preserving meaning
2. Using sophisticated synonyms and alternative phrasings
3. Maintaining professional tone
4. Ensuring logical flow
5. Preserving technical accuracy

Text to rewrite: "${plainText}"`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid mode specified' });
    }

    const result = await generateContent(prompt);

    // Clean up the output
    const cleanedResult = result
      .replace(/^(?:Here's|Here is|The rewritten|Rewritten)\s+(?:the|your)?\s+(?:text|version|content)[:\s]*/i, '')
      .replace(/^[\*\-]\s*/gm, '')
      .trim();

    res.json({ rewrittenText: cleanedResult });
  } catch (error) {
    console.error('Article rewriter error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while rewriting the text',
      details: 'Please try again with different text or contact support.'
    });
  }
});

module.exports = router;
