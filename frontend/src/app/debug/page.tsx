"use client";

import { useState, useEffect } from 'react';
import { API_URL } from '@/app/env';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({
    loading: true,
    apiUrl: '',
    origin: '',
    hostname: '',
    testResults: null,
    error: null
  });

  // Test API endpoints
  const testEndpoints = async () => {
    try {
      // Test the API directly
      const results = {
        apiUrl: API_URL,
        origin: window.location.origin,
        hostname: window.location.hostname,
        tests: [] as any[]
      };

      // Test endpoints
      const endpoints = [
        '/tools/grammar-checker',
        '/tools/readability-checker',
        '/tools/summarizer'
      ];

      for (const endpoint of endpoints) {
        try {
          let url;
          if (API_URL.startsWith('/')) {
            url = `${window.location.origin}${API_URL}${endpoint}`;
          } else {
            url = `${API_URL}${endpoint}`;
          }

          const startTime = Date.now();
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: 'This is a test.' }),
          });

          const endTime = Date.now();
          const responseTime = endTime - startTime;

          let responseData;
          let responseText = '';
          try {
            responseText = await response.text();
            responseData = JSON.parse(responseText);
          } catch (e) {
            // Keep the text response if JSON parsing fails
          }

          results.tests.push({
            endpoint,
            url,
            status: response.status,
            ok: response.ok,
            responseTime,
            responseData: responseData || responseText,
            headers: Object.fromEntries(response.headers.entries())
          });
        } catch (error: any) {
          results.tests.push({
            endpoint,
            error: error.message,
            stack: error.stack
          });
        }
      }

      setInfo({
        loading: false,
        apiUrl: API_URL,
        origin: window.location.origin,
        hostname: window.location.hostname,
        testResults: results,
        error: null
      });
    } catch (error: any) {
      setInfo({
        loading: false,
        apiUrl: API_URL,
        origin: window.location.origin || 'unknown',
        hostname: window.location.hostname || 'unknown',
        testResults: null,
        error: error.message
      });
    }
  };

  useEffect(() => {
    testEndpoints();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Debug Information</h1>
      
      {info.loading ? (
        <div className="text-center">
          <p>Testing API endpoints...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Environment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div><strong>API URL:</strong> {info.apiUrl}</div>
              <div><strong>Origin:</strong> {info.origin}</div>
              <div><strong>Hostname:</strong> {info.hostname}</div>
              <div><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</div>
            </div>
          </div>

          {info.error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4">
              <h2 className="text-xl font-semibold mb-2">Error</h2>
              <p>{info.error}</p>
            </div>
          )}

          {info.testResults && info.testResults.tests && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">API Test Results</h2>
              
              {info.testResults.tests.map((test: any, index: number) => (
                <div key={index} className={`border p-4 rounded ${test.error ? 'bg-red-50' : test.ok ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <h3 className="font-semibold">{test.endpoint}</h3>
                  
                  {test.error ? (
                    <div>
                      <p className="text-red-600"><strong>Error:</strong> {test.error}</p>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 overflow-auto">{test.stack}</pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>URL:</strong> {test.url}</p>
                      <p><strong>Status:</strong> {test.status}</p>
                      <p><strong>Response Time:</strong> {test.responseTime}ms</p>
                      
                      <div>
                        <strong>Response:</strong>
                        <pre className="text-xs mt-1 bg-gray-100 p-2 overflow-auto">
                          {typeof test.responseData === 'object' 
                            ? JSON.stringify(test.responseData, null, 2)
                            : test.responseData}
                        </pre>
                      </div>
                      
                      <div>
                        <strong>Headers:</strong>
                        <pre className="text-xs mt-1 bg-gray-100 p-2 overflow-auto">
                          {JSON.stringify(test.headers, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4">
            <button 
              onClick={testEndpoints}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Run Tests Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
