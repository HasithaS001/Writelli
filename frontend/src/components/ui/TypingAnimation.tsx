import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  typingSpeed?: number; // Words per second
  className?: string;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  typingSpeed = 3, // Words per second
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
    // Split text into words while preserving HTML tags
    const words = text.split(/(?=<[^>]*>)|(?<=[^<]\s+)/).filter(word => word.trim() !== '');
    
    if (currentIndex < words.length) {
      const timeoutId = setTimeout(() => {
        const currentWord = words[currentIndex];
        // Add a space after the word unless it's an HTML tag or the last word
        const space = currentWord.startsWith('<') || currentIndex === words.length - 1 ? '' : ' ';
        setDisplayedText(prev => prev + currentWord + space);
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
