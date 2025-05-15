import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Get the URL from the request body
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Fetch the content from the URL
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000, // 10 seconds timeout
    });
    
    // Return the HTML content
    return NextResponse.json({ html: response.data });
  } catch (error) {
    console.error('Error fetching URL:', error);
    
    // Handle specific errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Connection refused by the server' },
          { status: 502 }
        );
      }
      
      if (error.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 504 }
        );
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: `Server responded with status code ${error.response.status}` },
          { status: error.response.status }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}
