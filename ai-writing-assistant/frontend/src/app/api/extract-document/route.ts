import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { Readable } from 'stream';

// Helper function to convert ArrayBuffer to Buffer
function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

export async function POST(request: NextRequest) {
  try {
    // Set proper content type header to ensure JSON response
    const headers = {
      'Content-Type': 'application/json',
    };
    
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400, headers }
        );
      }
      
      // Check file type
      const fileType = file.type;
      let text = '';
      
      // Process based on file type
      if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileType === 'application/msword'
      ) {
        try {
          // Process DOCX/DOC file
          console.log('Processing DOCX file:', file.name, 'Size:', file.size, 'Type:', file.type);
          const arrayBuffer = await file.arrayBuffer();
          console.log('Buffer size:', arrayBuffer.byteLength);
          
          // Convert ArrayBuffer to Buffer for better compatibility
          const buffer = arrayBufferToBuffer(arrayBuffer);
          
          let extractionSuccessful = false;
          let extractionError = null;
          
          // Try multiple extraction methods in sequence
          try {
            // Method 1: Standard arrayBuffer approach
            console.log('Trying extraction method 1: arrayBuffer');
            const result = await mammoth.extractRawText({ 
              arrayBuffer: arrayBuffer
            });
            
            // Log any warnings
            if (result.messages && result.messages.length > 0) {
              console.log('Extraction warnings (method 1):', JSON.stringify(result.messages));
            }
            
            text = result.value || '';
            if (text && text.trim().length > 0) {
              extractionSuccessful = true;
              console.log('Method 1 successful, text length:', text.length);
            } else {
              console.log('Method 1 produced empty text, trying next method');
            }
          } catch (error) {
            console.log('Method 1 failed:', error);
            extractionError = error;
          }
          
          // Method 2: Try with buffer approach if method 1 failed
          if (!extractionSuccessful) {
            try {
              console.log('Trying extraction method 2: buffer');
              const result = await mammoth.extractRawText({ 
                buffer: buffer
              });
              
              text = result.value || '';
              if (text && text.trim().length > 0) {
                extractionSuccessful = true;
                console.log('Method 2 successful, text length:', text.length);
              } else {
                console.log('Method 2 produced empty text, trying next method');
              }
            } catch (error) {
              console.log('Method 2 failed:', error);
              extractionError = error;
            }
          }
          
          // Method 3: Try with path approach if methods 1 and 2 failed
          if (!extractionSuccessful) {
            try {
              console.log('Trying extraction method 3: HTML extraction');
              const result = await mammoth.convertToHtml({ 
                arrayBuffer: arrayBuffer
              });
              
              // Extract text from HTML
              text = result.value
                .replace(/<[^>]*>/g, ' ') // Remove HTML tags
                .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
                .trim();
                
              if (text && text.trim().length > 0) {
                extractionSuccessful = true;
                console.log('Method 3 successful, text length:', text.length);
              } else {
                console.log('Method 3 produced empty text');
              }
            } catch (error) {
              console.log('Method 3 failed:', error);
              extractionError = error;
            }
          }
          
          if (!extractionSuccessful) {
            console.error('All extraction methods failed:', extractionError);
            return NextResponse.json(
              { error: 'Failed to extract text from DOCX file. The file may be corrupted or in an unsupported format.' },
              { status: 422, headers }
            );
          }
          
          console.log('DOCX extraction successful, text length:', text.length);
        } catch (docxError) {
          console.error('DOCX parsing error details:', docxError);
          return NextResponse.json(
            { error: 'Failed to parse DOCX file. The file may be corrupted or in an unsupported format.' },
            { status: 422, headers }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a DOCX file.' },
          { status: 400, headers }
        );
      }
      
      if (!text || text.trim() === '') {
        return NextResponse.json(
          { error: 'No text could be extracted from the document.' },
          { status: 422, headers }
        );
      }
      
      // Clean up the text
      text = text
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
        .trim();
      
      return NextResponse.json({ text }, { headers });
    } catch (innerError) {
      console.error('Error in document processing:', innerError);
      return NextResponse.json(
        { error: 'Failed to process document' },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error('Error extracting text from document:', error);
    
    return NextResponse.json(
      { error: 'Failed to extract text from document' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
