import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#0072df] to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Writing Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of writers who have already improved their content with our AI writing assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/grammar-checker" 
              className="px-8 py-4 bg-white text-[#0072df] font-medium rounded-lg text-center transition-all shadow-lg hover:shadow-xl hover:bg-gray-100"
            >
              Try for Free
            </Link>
            <Link 
              href="#pricing" 
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium rounded-lg text-center transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
