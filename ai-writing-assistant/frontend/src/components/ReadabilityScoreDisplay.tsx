import React from 'react';

interface ReadabilityScoreDisplayProps {
  fleschKincaid: number;
  gunningFog: number;
}

const ReadabilityScoreDisplay: React.FC<ReadabilityScoreDisplayProps> = ({ 
  fleschKincaid, 
  gunningFog 
}) => {
  // Helper function to determine color based on score
  const getScoreColor = (score: number, type: 'flesch' | 'fog') => {
    if (type === 'flesch') {
      // Flesch-Kincaid: Higher is easier to read (0-100 scale)
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-green-300';
      if (score >= 50) return 'bg-yellow-300';
      if (score >= 30) return 'bg-orange-400';
      return 'bg-red-500';
    } else {
      // Gunning Fog: Lower is easier to read (typically 6-17 scale)
      if (score <= 8) return 'bg-green-500';
      if (score <= 10) return 'bg-green-300';
      if (score <= 12) return 'bg-yellow-300';
      if (score <= 15) return 'bg-orange-400';
      return 'bg-red-500';
    }
  };

  // Helper function to get readability level description
  const getReadabilityLevel = (score: number, type: 'flesch' | 'fog') => {
    if (type === 'flesch') {
      if (score >= 90) return 'Very Easy';
      if (score >= 80) return 'Easy';
      if (score >= 70) return 'Fairly Easy';
      if (score >= 60) return 'Standard';
      if (score >= 50) return 'Fairly Difficult';
      if (score >= 30) return 'Difficult';
      return 'Very Difficult';
    } else {
      if (score <= 8) return 'Very Easy';
      if (score <= 10) return 'Easy';
      if (score <= 12) return 'Standard';
      if (score <= 15) return 'Difficult';
      return 'Very Difficult';
    }
  };

  // Calculate percentage for the progress bar (for visual representation)
  const fleschPercentage = Math.min(Math.max(fleschKincaid, 0), 100);
  const fogPercentage = Math.min(Math.max(100 - (gunningFog * 5), 0), 100); // Invert and scale

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-black mb-4">Readability Scores</h3>
      
      {/* Flesch-Kincaid Score */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-black">Flesch-Kincaid Score</span>
          <span className="text-sm font-bold text-black">{fleschKincaid.toFixed(1)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full ${getScoreColor(fleschKincaid, 'flesch')}`} 
            style={{ width: `${fleschPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-black">
          <span>0 (Very Complex)</span>
          <span>100 (Very Simple)</span>
        </div>
        <div className="mt-1 text-sm text-black">
          <span className="font-medium">Reading Level:</span> {getReadabilityLevel(fleschKincaid, 'flesch')}
        </div>
      </div>
      
      {/* Gunning Fog Index */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-black">Gunning Fog Index</span>
          <span className="text-sm font-bold text-black">{gunningFog.toFixed(1)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full ${getScoreColor(gunningFog, 'fog')}`} 
            style={{ width: `${fogPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-black">
          <span>6 (Simple)</span>
          <span>17+ (Complex)</span>
        </div>
        <div className="mt-1 text-sm text-black">
          <span className="font-medium">Years of Education Needed:</span> {gunningFog.toFixed(1)} years
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-bold text-black mb-2">What do these scores mean?</h4>
        <p className="text-sm text-black mb-2">
          <strong>Flesch-Kincaid Score</strong>: Measures readability based on sentence length and syllables. 
          Higher scores (70-100) indicate easier reading suitable for general audiences, while lower scores 
          indicate more complex text appropriate for academic or specialized content.
        </p>
        <p className="text-sm text-black">
          <strong>Gunning Fog Index</strong>: Estimates the years of formal education needed to understand 
          the text. Scores of 8-10 are ideal for universal understanding, while scores above 12 may be 
          challenging for general audiences.
        </p>
      </div>
    </div>
  );
};

export default ReadabilityScoreDisplay;
