import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/solid';

const monthlyPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for casual writers and students.',
    features: [
      '700-word limit',
      'Basic grammar checker',
      'Basic modes in Paraphraser',
      'Basic modes in Summarizer',
      'Access to Natural Flow mode in Humanizer',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '6.99',
    description: 'For professionals who need advanced writing tools.',
    features: [
      'Unlimited word limit',
      'Full access to all writing tools',
      'Advanced grammar & readability checkers',
      'All Paraphraser modes (fluency, formal, creative, etc.)',
      'All Summarizer formats (bullet, executive, detailed)',
      'Full Tone Converter & Humanizer',
      'Multi-language Translator',
      'Upload unlimited URLs and DOCX files',
    ],
    cta: 'Join Waitlist',
    popular: true,
  },
];

// Comparison table data
const comparisonFeatures = [
  { name: 'Word limit', free: '700 words', pro: 'Unlimited' },
  { name: 'Grammar checker', free: 'Basic', pro: 'Advanced' },
  { name: 'Readability checker', free: 'Limited', pro: 'Full access' },
  { name: 'Paraphraser modes', free: 'Basic only', pro: 'All modes (fluency, formal, creative, etc.)' },
  { name: 'Summarizer formats', free: 'Basic only', pro: 'All formats (bullet, executive, detailed)' },
  { name: 'Humanizer modes', free: 'Natural Flow only', pro: 'All modes' },
  { name: 'Tone Converter', free: 'Not available', pro: 'Full access' },
  { name: 'Translator', free: 'Not available', pro: 'Multi-language support' },
  { name: 'File uploads', free: 'Not available', pro: 'Unlimited URLs and DOCX files' },
];

interface PricingSectionProps {
  showComparisonToggle?: boolean;
  initialComparisonState?: boolean;
}

const yearlyPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for casual writers and students.',
    features: [
      '700-word limit',
      'Basic grammar checker',
      'Basic modes in Paraphraser',
      'Basic modes in Summarizer',
      'Access to Natural Flow mode in Humanizer',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '69.99',
    description: 'For professionals who need advanced writing tools.',
    features: [
      'Unlimited word limit',
      'Full access to all writing tools',
      'Advanced grammar & readability checkers',
      'All Paraphraser modes (fluency, formal, creative, etc.)',
      'All Summarizer formats (bullet, executive, detailed)',
      'Full Tone Converter & Humanizer',
      'Multi-language Translator',
      'Upload unlimited URLs and DOCX files',
      '2 months free with annual billing',
    ],
    cta: 'Access Waitlist',
    popular: true,
  },
];

const PricingSection = ({ 
  showComparisonToggle = true, 
  initialComparisonState = false 
}: PricingSectionProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(initialComparisonState);
  const [isYearly, setIsYearly] = useState(false);
  
  const pricingPlans = isYearly ? yearlyPlans : monthlyPlans;

  const handlePlanSelection = (plan: typeof pricingPlans[0], index: number) => {
    setIsLoading(index);
    
    // For Pro plan with "Join Waitlist" CTA
    if (plan.name === 'Pro' && plan.cta === 'Join Waitlist') {
      // Redirect to waitlist page
      router.push('/waitlist');
    } else {
      // For Free plan
      router.push('/auth/signup');
    }
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Simple, <span className="text-[#4169e2]">Transparent</span> Pricing
          </h2>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center justify-center gap-4 mb-8 bg-gray-50 p-2 rounded-full">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full transition-all ${!isYearly ? 'bg-white shadow-md text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full transition-all ${isYearly ? 'bg-white shadow-md text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Yearly
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Save 17%
              </span>
            </button>
          </div>
          <p className="text-xl text-gray-600">
            Choose the plan that works best for your writing needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl overflow-hidden border ${
                plan.popular 
                  ? 'border-[#4169e2] shadow-xl shadow-[#4169e2]/10 relative' 
                  : 'border-gray-200 shadow-md'
              } bg-white transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#4169e2] text-white py-1 px-4 text-sm font-medium rounded-bl-lg">
                  Payments coming soon – Join waitlist
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  {plan.price === '0' ? (
                    <span className="text-4xl font-bold text-gray-900">Free</span>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-[#4169e2] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePlanSelection(plan, index)}
                  disabled={isLoading === index}
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                    plan.popular 
                      ? 'bg-[#4169e2] hover:bg-[#3559c7] text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300'
                  } transition-colors ${isLoading === index ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading === index ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Toggle */}
        {showComparisonToggle && (
          <div className="text-center mb-8">
            <button 
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-[#4169e2] text-[#4169e2] hover:bg-blue-50 transition-colors"
            >
              {showComparison ? 'Hide Comparison' : 'View Detailed Comparison'}
              <svg className={`ml-2 w-5 h-5 transition-transform ${showComparison ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Comparison Table */}
        {showComparison && (
          <div className="max-w-5xl mx-auto overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-gray-700 font-medium">Feature</th>
                    <th className="py-4 px-6 text-center text-gray-700 font-medium">Free</th>
                    <th className="py-4 px-6 text-center text-gray-700 font-medium bg-blue-50">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 text-gray-800 font-medium">{feature.name}</td>
                      <td className="py-4 px-6 text-center">
                        {feature.free === 'Not available' ? (
                          <XMarkIcon className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          <div className="text-gray-600">{feature.free}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-blue-50">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? <CheckIcon className="w-5 h-5 text-[#4169e2] mx-auto" /> : <XMarkIcon className="w-5 h-5 text-red-500 mx-auto" />
                        ) : (
                          <div className="text-gray-800 font-medium">{feature.pro}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help choosing? <Link href="/contact" className="text-[#4169e2] font-medium hover:underline">Contact us</Link> for personalized assistance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
