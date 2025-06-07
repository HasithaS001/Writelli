import type { NextApiRequest, NextApiResponse } from 'next';

type GeminiResponse = {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, mode, keyword } = req.body;
  
  // Get the API key from environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('API key not configured');
    return res.status(500).json({ error: 'API key not configured. Please add GEMINI_API_KEY to your .env.local file.' });
  }

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Create a prompt based on the selected mode
    let prompt = '';
    
    switch (mode) {
      case 'readability':
        prompt = `Rewrite the following text to improve readability. Make it easier to understand, use simpler vocabulary, shorter sentences, and better paragraph structure. Return only the rewritten text without any additional explanations or headers: ${text}`;
        break;
      case 'tone':
        prompt = `Rewrite the following text to have a more professional and authoritative tone. Use formal language, sophisticated terminology, and evidence-based statements. Return only the rewritten text without any additional explanations or headers: ${text}`;
        break;
      case 'seo':
        if (keyword) {
          prompt = `Rewrite the following text to optimize it for SEO using the keyword "${keyword}". Include the keyword naturally throughout the text, improve readability, and enhance the content structure. Return only the rewritten text without any additional explanations or headers: ${text}`;
        } else {
          prompt = `Rewrite the following text to optimize it for SEO. Improve readability, enhance content structure, and make it more search-engine friendly. Return only the rewritten text without any additional explanations or headers: ${text}`;
        }
        break;
      case 'unique':
        prompt = `Rewrite the following text to make it completely unique and avoid plagiarism detection. Maintain the same meaning but use different words and sentence structures. Return only the rewritten text without any additional explanations or headers: ${text}`;
        break;
      default:
        prompt = `Rewrite the following text to improve it. Return only the rewritten text without any additional explanations or headers: ${text}`;
    }

    console.log(`Calling Gemini API for ${mode} mode with prompt length: ${prompt.length}`);
    
    // Call the Gemini API with the correct model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
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
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        errorMessage = `Gemini API error: ${errorData}`;
      } catch (e) {
        console.error('Failed to read error response:', e);
      }
      return res.status(500).json({ error: errorMessage });
    }

    // Parse the response
    const data = await response.json();
    console.log('Gemini API response structure:', JSON.stringify(data).substring(0, 100) + '...');
    
    // Extract the rewritten text
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const rewrittenText = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ rewrittenText });
    } else {
      console.error('Unexpected Gemini API response format:', JSON.stringify(data));
      return res.status(500).json({ error: 'Unexpected API response format' });
    }
  } catch (error) {
    console.error('Exception when calling Gemini API:', error);
    return res.status(500).json({ 
      error: 'Failed to process with Gemini API', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}
