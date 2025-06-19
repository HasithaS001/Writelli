import { NextResponse } from 'next/server';
import { API_URL } from '@/app/env';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the request to the actual backend API
    const backendUrl = `${API_URL}/tools/paraphraser`;
    console.log(`Proxying request to: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // If the backend returns an error status
    if (!response.ok) {
      console.error(`Backend returned error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      
      // Return the error response
      return NextResponse.json(
        { error: `Backend API error: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // Return the successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in paraphraser proxy:', error);
    return NextResponse.json(
      { error: `API proxy error: ${error.message}` },
      { status: 500 }
    );
  }
}
