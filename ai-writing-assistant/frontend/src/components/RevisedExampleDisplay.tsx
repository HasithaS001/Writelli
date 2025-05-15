import React from 'react';

interface RevisedExampleDisplayProps {
  revisedExample: string;
}

const RevisedExampleDisplay: React.FC<RevisedExampleDisplayProps> = ({ 
  revisedExample 
}) => {
  if (!revisedExample) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-black mb-4">Revised Example</h3>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-black whitespace-pre-wrap">{revisedExample}</p>
      </div>
      <p className="mt-4 text-sm text-black">
        This revised example demonstrates how your text could be improved for better readability 
        while maintaining the same meaning.
      </p>
    </div>
  );
};

export default RevisedExampleDisplay;
