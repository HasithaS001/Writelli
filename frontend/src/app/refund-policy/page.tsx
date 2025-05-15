import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        
        {/* Last Updated Date */}
        <p className="text-sm text-gray-500 mb-8">Last Updated: May 14, 2025</p>

        {/* Introduction */}
        <section className="mb-10">
          <p className="text-gray-600 leading-relaxed mb-4">
            We strive to ensure complete satisfaction with our AI writing services. This refund policy outlines the terms and conditions for requesting and receiving refunds for our services.
          </p>
        </section>

        {/* Eligibility */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Eligibility</h2>
          <div className="space-y-4 text-gray-600">
            <p>You may be eligible for a refund under the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Technical issues preventing service access (within 24 hours of purchase)</li>
              <li>Duplicate charges or billing errors</li>
              <li>Service cancellation within 7 days of subscription start (pro-rated refund)</li>
              <li>Unauthorized transactions (with valid proof)</li>
            </ul>
          </div>
        </section>

        {/* Non-Refundable Items */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Non-Refundable Items</h2>
          <div className="space-y-4 text-gray-600">
            <p>The following are not eligible for refunds:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Used or partially used credits</li>
              <li>Subscription fees after the 7-day cancellation period</li>
              <li>Add-on services once activated</li>
              <li>Custom enterprise solutions</li>
            </ul>
          </div>
        </section>

        {/* Refund Process */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Process</h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
            <p className="text-gray-600">To request a refund:</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Contact our support team through the help center</li>
              <li>Provide your order/transaction ID</li>
              <li>Explain the reason for your refund request</li>
              <li>Include any relevant documentation</li>
            </ol>
            <p className="text-gray-600 mt-4">
              We will process eligible refund requests within 5-7 business days. The refund will be issued to the original payment method.
            </p>
          </div>
        </section>

        {/* Processing Time */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Time</h2>
          <div className="text-gray-600 space-y-4">
            <p>After approval, refunds typically process as follows:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Credit/Debit Cards: 5-10 business days</li>
              <li>PayPal: 3-5 business days</li>
              <li>Bank Transfers: 7-14 business days</li>
            </ul>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <p className="text-gray-600 mb-4">
              If you have any questions about our refund policy, please contact us:
            </p>
            <div className="space-y-2 text-gray-600">
              <p>Email: support@aiwritingassistant.com</p>
              <p>Help Center: help.aiwritingassistant.com</p>
              <p>Response Time: Within 24 hours</p>
            </div>
          </div>
        </section>

        {/* Policy Updates */}
        <section>
          <p className="text-sm text-gray-500">
            We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
