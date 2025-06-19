import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - change this to your actual backend URL
const BACKEND_API_URL = 'https://backend-yd4nj.ondigitalocean.app';

export async function POST(
  request: NextRequest,
  { params }: { params: { tool: string } }
) {
  try {
    const tool = params.tool;
    const data = await request.json();
    
    // Log the request for debugging
    console.log(`API proxy request to ${tool}:`, data);
    
    // Forward the request to the backend API
    const response = await fetch(`${BACKEND_API_URL}/tools/${tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // If the backend returns an error, pass it through
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
    
    // Return the backend response
    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
