import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the API key is set
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({
      status: 'error',
      message: 'API key not configured',
      envVars: Object.keys(process.env).filter(key => 
        key.includes('GEMINI') || key.includes('API_KEY')
      )
    });
  }
  
  try {
    // Test the Gemini API with a simple prompt using the correct model name
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello, please respond with 'Gemini API is working correctly!'"
          }]
        }]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        status: 'error',
        message: `Gemini API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    
    return res.status(200).json({
      status: 'success',
      message: 'Gemini API is working',
      apiKeyExists: true,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 4) + '...',
      response: data
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to test Gemini API',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
