'use client';

import React, { useState, useRef, ChangeEvent } from 'react';

interface DocxUploaderProps {
  onInsertContent: (content: string) => void;
  onClose: () => void;
}

const DocxUploader: React.FC<DocxUploaderProps> = ({ onInsertContent, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is a DOCX
    if (
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      file.type !== 'application/msword'
    ) {
      setError('Please upload a DOCX file');
      return;
    }
    
    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Log file details for debugging
        console.log('Uploading file:', {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(2)} KB`
        });

        // Send the file to the server for processing
        const response = await fetch('/api/extract-document', {
          method: 'POST',
          body: formData,
        });
        
        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response content type:', response.headers.get('content-type'));
        
        // Debug the first part of the response
        if (responseText.length > 0) {
          console.log('Response preview:', responseText.substring(0, Math.min(100, responseText.length)));
        } else {
          console.log('Empty response received');
        }
        
        let responseData;
        
        try {
          // Try to parse as JSON
          responseData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Invalid JSON response:', responseText.substring(0, 200));
          throw new Error(`Server returned invalid response format. Check console for details.`);
        }
        
        if (!response.ok || !responseData.text) {
          const errorMessage = responseData.error || `Error ${response.status}: Failed to extract text`;
          console.error('API error:', errorMessage);
          throw new Error(errorMessage);
        }
        
        // Log success
        console.log('Text extraction successful, length:', responseData.text.length);
        
        // Insert the extracted text
        onInsertContent(responseData.text);
        
        // Close the document upload form
        onClose();
      } catch (error: any) {
        console.error('DOCX extraction error:', error);
        setError(error.message || 'Failed to extract text from document. Please try a different file.');
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Error extracting text from document:', error);
      setError(error.message || 'Failed to extract text from document');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-3 text-black">
      <h3 className="text-sm font-medium mb-2">Upload DOCX Document</h3>
      <p className="text-xs text-gray-500 mb-3">Upload a DOCX file to extract and insert its text content</p>
      
      {error && (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        className="hidden"
        onChange={handleDocumentUpload}
      />
      
      <div className="flex justify-between items-center">
        <button
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          onClick={triggerFileInput}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Choose Document'
          )}
        </button>
      </div>
    </div>
  );
};

export default DocxUploader;
