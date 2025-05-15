'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { useOnClickOutside } from './AdvancedEditor/hooks/useOnClickOutside';
import { extractTextFromUrl } from '@/lib/webUtils';
import dynamic from 'next/dynamic';

// Dynamically import the DocxUploader component with no SSR
const DocxUploader = dynamic(() => import('./DocumentUploader'), { ssr: false });

interface InsertOptionsProps {
  onInsertContent: (content: string) => void;
}

const InsertOptions: React.FC<InsertOptionsProps> = ({ onInsertContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWebLinkForm, setShowWebLinkForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [webUrl, setWebUrl] = useState('');
  const [isProcessingWebLink, setIsProcessingWebLink] = useState(false);
  const [webLinkError, setWebLinkError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
    setShowWebLinkForm(false);
    setShowDocumentUpload(false);
  });

  const processWebLink = async () => {
    if (!webUrl) return;
    
    try {
      setIsProcessingWebLink(true);
      setWebLinkError('');
      
      // Validate URL format
      if (!webUrl.match(/^https?:\/\/.+/)) {
        setWebLinkError('Please enter a valid URL starting with http:// or https://');
        setIsProcessingWebLink(false);
        return;
      }
      
      // Extract text from the web page
      const extractedText = await extractTextFromUrl(webUrl);
      
      // Insert the extracted text
      onInsertContent(extractedText);
      
      // Reset and close
      setWebUrl('');
      setShowWebLinkForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error processing web link:', error);
      setWebLinkError('Failed to extract text from the URL');
    } finally {
      setIsProcessingWebLink(false);
    }
  };

  const closeDocumentUploader = () => {
    setShowDocumentUpload(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
        title="Insert Content"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 5v14M5 12h14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12h14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="10" strokeWidth="1.5" opacity="0.6" />
        </svg>
        <span className="ml-2 font-medium">Insert</span>
      </button>

      {isOpen && !showWebLinkForm && !showDocumentUpload && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48 text-black">
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
            onClick={() => setShowWebLinkForm(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            Web Content
          </button>
          
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center"
            onClick={() => setShowDocumentUpload(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M9 15v-2h6v2"></path>
              <path d="M12 13v6"></path>
            </svg>
            DOCX Upload
          </button>
        </div>
      )}

      {showWebLinkForm && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-72 p-3 text-black">
          <h3 className="text-sm font-medium mb-2">Extract Web Content</h3>
          <p className="text-xs text-gray-500 mb-3">Enter a URL to extract and insert its text content</p>
          
          {webLinkError && (
            <div className="mb-3 text-sm text-red-600">{webLinkError}</div>
          )}
          
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
          />
          
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              onClick={() => {
                setShowWebLinkForm(false);
                setWebUrl('');
                setWebLinkError('');
              }}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              onClick={processWebLink}
              disabled={isProcessingWebLink}
            >
              {isProcessingWebLink ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Extract Content'
              )}
            </button>
          </div>
        </div>
      )}
      
      {showDocumentUpload && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-72 text-black">
          <DocxUploader onInsertContent={onInsertContent} onClose={closeDocumentUploader} />
        </div>
      )}
      
    </div>
  );
};

export default InsertOptions;
