"use client";

import React from 'react';
import PricingSection from '@/components/landing/PricingSection';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Choose Your <span className="text-[#4169e2]">Plan</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
              Select the perfect plan for your writing needs
            </p>
          </div>
        </div>
      </div>
      
      <PricingSection showComparisonToggle={false} initialComparisonState={true} />
      
      <div className="py-12 bg-gray-50">

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">How does the free plan work?</h3>
                <p className="mt-2 text-gray-600">Our free plan gives you access to basic writing tools with a 700-word limit per request. It's perfect for casual writers and students who need occasional assistance.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Can I upgrade or downgrade my plan anytime?</h3>
                <p className="mt-2 text-gray-600">Yes, you can upgrade to the Pro plan at any time. If you need to downgrade, you can cancel your Pro subscription and revert to the Free plan at the end of your billing cycle.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900">How is payment processed?</h3>
                <p className="mt-2 text-gray-600">All payments are securely processed through Lemon Squeezy. We accept all major credit cards and PayPal. Your payment information is never stored on our servers.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Is there a refund policy?</h3>
                <p className="mt-2 text-gray-600">Yes, we offer a 14-day money-back guarantee if you're not satisfied with our Pro plan. Contact our support team to request a refund within this period.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer variant="light" />
    </div>
  );
}
