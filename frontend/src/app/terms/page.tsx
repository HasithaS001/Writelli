import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing or using AI Writing Assistant, you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to use our service for your 
              personal or business purposes, subject to these Terms.
            </p>
            <p className="text-gray-700">You must not:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Modify or copy our materials without explicit permission</li>
              <li>Use our service for any illegal purpose</li>
              <li>Attempt to decompile or reverse engineer our software</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person or mirror them on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 mb-4">
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for maintaining the security of your account and password.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Service Modifications</h2>
            <p className="text-gray-700">
              We reserve the right to modify or discontinue our service at any time without notice. 
              We shall not be liable to you or any third party for any modification, suspension, or 
              discontinuance of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700">
              In no event shall AI Writing Assistant be liable for any damages arising out of the use 
              or inability to use our materials or service, even if we have been notified of the 
              possibility of such damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Governing Law</h2>
            <p className="text-gray-700">
              These terms shall be governed by and construed in accordance with the laws of your jurisdiction, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-700">
              For any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@aiwritingassistant.com" className="text-blue-600 hover:text-blue-800">
                legal@aiwritingassistant.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
