import React from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for casual writers who need basic grammar checking.',
    features: [
      'Basic grammar checking',
      'Up to 500 words per check',
      'Standard response time',
      '5 documents per month',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '19',
    description: 'For professional writers who need advanced writing assistance.',
    features: [
      'Advanced grammar & style checking',
      'Unlimited words per check',
      'Priority response time',
      'Unlimited documents',
      'Plagiarism detection',
      'Content suggestions',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '49',
    description: 'For teams and organizations with advanced needs.',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom templates',
      'API access',
      'Dedicated support',
      'Custom branding',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, <span className="text-[#0072df]">Transparent</span> Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for your writing needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl overflow-hidden border ${
                plan.popular 
                  ? 'border-[#0072df] shadow-lg shadow-[#0072df]/10 relative' 
                  : 'border-gray-200 shadow-sm'
              } bg-white transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#0072df] text-white py-1 px-4 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-[#0072df] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/signup" 
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                    plan.popular 
                      ? 'bg-[#0072df] hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition-colors`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
