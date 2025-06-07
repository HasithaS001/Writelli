import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the API key is set
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  return res.status(200).json({
    apiKeyExists: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 4) + '...' : 'not set',
    envVars: Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('API_KEY'))
  });
}
