'use client';

import { useState, useEffect } from 'react';
import { API_URL } from '@/app/env';

export default function ApiDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [testResult, setTestResult] = useState<string>('Not tested');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    setApiUrl(API_URL);
  }, []);

  const testApi = async () => {
    setTestResult('Testing...');
    try {
      // Try to fetch from the API
      const baseUrl = API_URL || 'http://localhost:5000';
      
      // Construct the test URL
      let testUrl;
      if (baseUrl.startsWith('/')) {
        const origin = window.location.origin;
        testUrl = `${origin}${baseUrl}/tools/ping`;
      } else {
        testUrl = `${baseUrl}/tools/ping`;
      }
      
      console.log('Testing API connection to:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
        mode: 'cors',
      });
      
      if (response.ok) {
        setTestResult(`✅ API connection successful! Status: ${response.status}`);
      } else {
        setTestResult(`❌ API responded with error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('API test error:', error);
      setTestResult(`❌ API connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md text-sm opacity-50 hover:opacity-100"
      >
        Debug API
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-md shadow-lg z-50 max-w-md">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">API Debugger</h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">×</button>
      </div>
      
      <div className="mb-4">
        <p className="text-sm mb-1 font-medium">Environment:</p>
        <p className="text-xs bg-gray-100 p-1 rounded">{process.env.NODE_ENV}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm mb-1 font-medium">API URL:</p>
        <p className="text-xs bg-gray-100 p-1 rounded break-all">{apiUrl || 'Not set'}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm mb-1 font-medium">NEXT_PUBLIC_API_URL:</p>
        <p className="text-xs bg-gray-100 p-1 rounded break-all">{process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
      </div>
      
      <div className="mb-4">
        <p className="text-sm mb-1 font-medium">Test Result:</p>
        <p className="text-xs bg-gray-100 p-1 rounded">{testResult}</p>
      </div>
      
      <button 
        onClick={testApi}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Test API Connection
      </button>
    </div>
  );
}
