import React from 'react';
import Image from 'next/image';

const DidYouKnow = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl font-bold text-blue-600 mb-6">Did You Know?</h2>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              AI Writing Saves 50% of Editing Time
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Writers and bloggers save hours using AI-powered tools. 
              Our advanced AI technology streamlines your writing process, 
              letting you focus on what matters most - creating great content.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-sm text-gray-600">Time Saved</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">2x</div>
                <div className="text-sm text-gray-600">Productivity</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative h-[400px]">
            <Image
              src="/images/time-saving-illustration.svg"
              alt="Time saving illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DidYouKnow;
