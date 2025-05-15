'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Editor } from '@tiptap/react';

interface PdfUploaderProps {
  editor: Editor;
  onClose: () => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ editor, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      // Dynamically import PDF.js to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Initialize the PDF.js worker
      const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages
      let extractedText = '';
      
      // Get the total number of pages
      const numPages = pdf.numPages;
      
      // Extract text from each page
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText + '\n\n';
      }

      // Insert the extracted text into the editor
      editor.chain().focus().insertContent(extractedText).run();
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Close the PDF upload form
      onClose();
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      setError('Failed to extract text from PDF');
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
    <div className="p-3">
      <h3 className="text-sm font-medium mb-2">Upload PDF</h3>
      <p className="text-xs text-gray-500 mb-3">Upload a PDF file to extract and insert its text content</p>
      
      {error && (
        <div className="mb-3 text-sm text-red-600">{error}</div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handlePdfUpload}
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
            'Choose PDF'
          )}
        </button>
      </div>
    </div>
  );
};

export default PdfUploader;
