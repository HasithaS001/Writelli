import React from 'react';

// Helper function to convert Markdown-style bold (**word**) to HTML bold tags
const convertMarkdownBoldToHtml = (text: string) => {
  // Regular expression to match **text** pattern
  return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
};

interface BulletPointSummaryProps {
  summaryText: string;
  className?: string;
}

const BulletPointSummary: React.FC<BulletPointSummaryProps> = ({ 
  summaryText, 
  className = '' 
}) => {
  // Process the summary text to extract bullet points
  const processText = () => {
    // Split by new lines
    const lines = summaryText.split('\n').filter(line => line.trim() !== '');
    
    // Process each line to check if it's a bullet point
    return lines.map((line, index) => {
      // Check if line starts with a bullet marker (-, *, •)
      const bulletMatch = line.match(/^\s*[-*•]\s*(.*)/);
      
      // If it's a bullet point, format it nicely
      if (bulletMatch) {
        const content = bulletMatch[1];
        return {
          type: 'bullet',
          content: content,
          level: line.match(/^\s*/)?.[0].length || 0 // Determine indentation level
        };
      }
      
      // Check if it's a numbered point (1., 2., etc.)
      const numberedMatch = line.match(/^\s*(\d+)[\.)]\s*(.*)/);
      if (numberedMatch) {
        const number = numberedMatch[1];
        const content = numberedMatch[2];
        return {
          type: 'numbered',
          number: number,
          content: content,
          level: line.match(/^\s*/)?.[0].length || 0
        };
      }
      
      // If it's not a bullet point or numbered list, treat as a heading or paragraph
      return {
        type: line.trim().endsWith(':') ? 'heading' : 'paragraph',
        content: line.trim(),
        level: 0
      };
    });
  };
  
  const processedItems = processText();
  
  return (
    <div className={`${className} text-black`}>
      {processedItems.map((item, index) => {
        if (item.type === 'bullet') {
          return (
            <div 
              key={index} 
              className="flex items-start mb-3 group"
              style={{ marginLeft: `${item.level * 12}px` }}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: convertMarkdownBoldToHtml(item.content) }}></p>
              </div>
            </div>
          );
        } else if (item.type === 'numbered') {
          return (
            <div 
              key={index} 
              className="flex items-start mb-3 group"
              style={{ marginLeft: `${item.level * 12}px` }}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 group-hover:bg-purple-200 transition-colors">
                <span className="text-xs font-semibold text-purple-700">{item.number}</span>
              </div>
              <div className="flex-1">
                <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: convertMarkdownBoldToHtml(item.content) }}></p>
              </div>
            </div>
          );
        } else if (item.type === 'heading') {
          return (
            <h3 key={index} className="font-semibold text-lg mb-2 mt-4 text-gray-800" dangerouslySetInnerHTML={{ __html: convertMarkdownBoldToHtml(item.content) }}>
            </h3>
          );
        } else {
          return (
            <p key={index} className="mb-3 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: convertMarkdownBoldToHtml(item.content) }}>
            </p>
          );
        }
      })}
    </div>
  );
};

export default BulletPointSummary;
