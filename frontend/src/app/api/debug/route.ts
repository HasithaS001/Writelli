import { NextResponse } from 'next/server';
import { API_URL } from '@/app/env';

export async function GET() {
  // Collect environment information
  const envInfo = {
    apiUrl: API_URL,
    nodeEnv: process.env.NODE_ENV,
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      // Include any important headers for debugging
    }
  };

  return NextResponse.json({
    status: 'ok',
    message: 'Debug API endpoint',
    timestamp: new Date().toISOString(),
    environment: envInfo
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testBackend } = body;
    
    let backendTest = null;
    
    // Test connection to backend if requested
    if (testBackend) {
      try {
        // Construct backend URL
        let backendUrl;
        if (API_URL.startsWith('/')) {
          // This is a relative URL, we can't test it from the server
          backendUrl = null;
        } else {
          backendUrl = `${API_URL}/tools/ping`;
        }
        
        if (backendUrl) {
          const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store'
          });
          
          const data = await response.text();
          
          backendTest = {
            url: backendUrl,
            status: response.status,
            statusText: response.statusText,
            data
          };
        }
      } catch (error: any) {
        backendTest = {
          error: error.message,
          stack: error.stack
        };
      }
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Debug API endpoint',
      timestamp: new Date().toISOString(),
      environment: {
        apiUrl: API_URL,
        nodeEnv: process.env.NODE_ENV,
        nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL
      },
      backendTest,
      requestBody: body
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
