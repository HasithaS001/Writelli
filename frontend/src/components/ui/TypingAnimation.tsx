import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  typingSpeed = 30, // Characters per second
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset animation when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        // Handle HTML tags - if we encounter a tag, we need to include the entire tag at once
        if (text[currentIndex] === '<') {
          // Find the closing '>' of this tag
          const endTagIndex = text.indexOf('>', currentIndex);
          if (endTagIndex !== -1) {
            // Include the entire tag
            setDisplayedText(prev => prev + text.substring(currentIndex, endTagIndex + 1));
            setCurrentIndex(endTagIndex + 1);
            return;
          }
        }

        // Normal character
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 1000 / typingSpeed);

      return () => clearTimeout(timeoutId);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, typingSpeed, isComplete, onComplete]);

  // Use dangerouslySetInnerHTML to render HTML content
  return (
    <div 
      className={`${className} font-open-sans`} 
      style={{ fontFamily: '"Open Sans", sans-serif', color: '#172b4d' }}
      dangerouslySetInnerHTML={{ __html: displayedText }}
    />
  );
};

export default TypingAnimation;
