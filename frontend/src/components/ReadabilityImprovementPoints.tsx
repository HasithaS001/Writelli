import React from 'react';

interface ReadabilityImprovementPointsProps {
  improvementPoints: string[];
}

const ReadabilityImprovementPoints: React.FC<ReadabilityImprovementPointsProps> = ({ 
  improvementPoints 
}) => {
  if (!improvementPoints || improvementPoints.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-black mb-4">Improvement Suggestions</h3>
      
      <ul className="list-disc pl-5 space-y-2">
        {improvementPoints.map((point, index) => (
          <li key={index} className="text-sm text-gray-700">
            {point}
          </li>
        ))}
      </ul>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          Apply these suggestions to improve the readability of your text.
        </p>
      </div>
    </div>
  );
};

export default ReadabilityImprovementPoints;
