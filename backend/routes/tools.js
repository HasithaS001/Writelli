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
        prompt = `You are a highly skilled human writer tasked with rewriting a paragraph to feel unmistakably written by a thoughtful, expressive human being — not an AI. Rewrite the text using a natural writing rhythm that reflects how people genuinely communicate in formal writing. This includes:

1. Varying sentence lengths and structures naturally (some short, some long, some complex).

2. Using proper transitions and idiomatic language that maintains a professional tone.

3. Introducing subtle variations in phrasing that adds a human fingerprint without using casual spoken language elements like 'ah', 'so', 'well', etc.

4. Avoiding mechanical or overly polished grammar — allow for natural flow and personal nuance while maintaining proper writing style.

5. Embedding thoughtful reflections or perspectives where appropriate.

6. Making it sound like it was written thoughtfully by a human — optimized for both clarity and authentic expression.

The final result must:

- Be undetectable by AI detectors (aim for a 0% AI score).

- Sound like it was written by a human with genuine thoughts, a distinct voice, and a natural flow.

- Use organic transitions, like how someone would write in a professional blog post, article, or opinion piece.

- Maintain proper writing style without casual spoken language elements or filler words.

Text to rewrite: "${plainText}"`;
        break;
      case 'bypass':
        prompt = `You are a human writer with a unique, natural voice. Rewrite the following text so it reads with the rhythm, nuance, and unpredictability of real human writing. Add subtle variations in phrasing, natural transitions, thoughtful tone, and contextual reflections. Vary sentence lengths, occasionally start sentences with conjunctions, use contractions, idioms, and rhetorical questions where appropriate. Incorporate thoughtful commentary that enhances the content — as if carefully crafting a well-considered piece. Avoid robotic perfection or patterns common in AI-generated content while maintaining proper writing style throughout. 

The goal is to fully humanize the paragraph to the point where AI detection tools (like GPTZero, Turnitin, Originality.ai) will classify it as 100% human-written. The final result should feel polished and professional — like something written by a thoughtful writer or content creator. Do not use casual spoken language elements like 'ah', 'so', 'well', etc.

Text to rewrite: "${plainText}"`;
        break;
      case 'emotional':
        prompt = `Rewrite the following paragraph with deep emotional nuance and a distinct human voice. Infuse it with natural rhythm, varied sentence lengths, and an organic flow of thoughts that conveys genuine experience or reflection. The tone should be rich with feeling, vulnerability, and authenticity while maintaining proper writing style. Use expressive language, thoughtful phrasing, and evocative descriptions that resonate emotionally. 

Avoid robotic tone, perfect structure, or generic phrasing. Include metaphors, sensory descriptions, or meaningful reflections that add emotional depth. The goal is to craft a paragraph that feels completely human-written — emotionally resonant, stylistically refined, and undetectable by AI detectors. 

Do not use casual spoken language elements like 'ah', 'so', 'well', etc. Maintain a proper writing style throughout while still conveying authentic emotion.

Text to rewrite: "${plainText}"`;
        break;
      case 'conversational':
        prompt = `Rewrite the following paragraph in a natural, conversational, and human tone that maintains proper writing style. The text should be engaging and approachable while still being polished and professional. Use contractions, varied sentence lengths, and natural transitions to create a friendly yet refined tone.

Make it sound fluid, expressive, and genuinely human while avoiding casual spoken language elements like 'ah', 'so', 'well', etc. Include thoughtful perspectives, engaging explanations, and natural rhythm. Balance conversational approachability with professional writing standards.

Use your best judgment to make it feel 100% written by a real person — not AI. The end result should pass any AI detection tool by sounding like natural, thoughtful writing that maintains proper writing style throughout.

Text to rewrite: "${plainText}"`;
        break;
      case 'genz':
        prompt = `Rewrite the following text in a consistent, professional Gen Z style. The text should incorporate modern Gen Z terminology and expressions while maintaining proper writing style and grammar. Do not use multiple options or variations - provide only ONE rewritten version. Avoid casual spoken language elements like 'ah', 'so', 'well', etc., but do include appropriate Gen Z terminology that would be used in written communication. The tone should be fresh and contemporary while still being polished and coherent.

Text to rewrite: "${plainText}"`;
        break;
      default:
        prompt = `Rewrite the following text to sound more human while maintaining proper writing style. Use varied sentence structures, natural transitions, and thoughtful phrasing to create content that feels written by a human rather than AI. Avoid casual spoken language elements like 'ah', 'so', 'well', etc. The result should be polished, professional, and undetectable by AI content detectors.

Text to rewrite: "${plainText}"`;
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

// Article Rewriter endpoint has been removed

module.exports = router;
