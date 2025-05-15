/**
 * Fetches content from a URL and extracts text
 * @param url URL to fetch content from
 * @returns Promise that resolves to the extracted text
 */
export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    // Use our server-side API route to fetch the URL content
    const response = await fetch('/api/extract-web-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch URL: ${response.status}`);
    }
    
    // Get the response data
    const data = await response.json();
    const html = data.html;
    
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract text from the main content
    // First try to find the main content
    const mainContent = 
      doc.querySelector('main') || 
      doc.querySelector('article') || 
      doc.querySelector('.content') || 
      doc.querySelector('#content') || 
      doc.body;
    
    // Remove script and style elements
    const scripts = mainContent.querySelectorAll('script, style, nav, footer, header, aside');
    scripts.forEach(script => script.remove());
    
    // Get the text content
    let text = mainContent.textContent || '';
    
    // Clean up the text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
      .trim();
    
    return text;
  } catch (error) {
    console.error('Error extracting text from URL:', error);
    throw new Error('Failed to extract text from URL');
  }
}
