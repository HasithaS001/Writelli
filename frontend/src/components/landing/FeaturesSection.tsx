import React from 'react';

const features = [
  {
    title: 'Grammar Correction',
    description: 'Eliminate grammar, spelling, and punctuation errors instantly with our AI-powered engine that learns from your writing style.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Readability Enhancer',
    description: 'Transform complex text into clear, concise content that resonates with your target audience and improves engagement.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Smart Paraphraser',
    description: 'Rewrite content with multiple style options while preserving your original meaning and improving clarity and impact.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'AI Summarizer',
    description: 'Condense lengthy articles and documents into clear, concise summaries that capture the essential points and key insights.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
  },
  {
    title: 'Multilingual Translator',
    description: 'Break language barriers with our advanced neural translation that preserves context, tone, and nuance across 100+ languages.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    title: 'Tone Adjuster',
    description: 'Adapt your writing to any context—from professional and academic to casual and creative—with one-click tone transformation.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
      </svg>
    ),
  },
  {
    title: 'Content Humanizer',
    description: 'Transform AI-generated or technical content into natural, human-like writing that connects authentically with your readers.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#0072df] font-semibold text-sm uppercase tracking-wider">Advanced Capabilities</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mt-3">
            Powerful Features for <span className="text-[#0072df] relative">Every Writer
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#0072df]/20" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M0,5 Q40,0 80,5 T160,5 T240,5 T300,5 V8 H0 Z" />
              </svg>
            </span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Our AI-powered tools help you write better content, faster and with greater confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group hover:border-[#0072df]/30 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0072df]/10 flex items-center justify-center text-[#0072df] mb-6 group-hover:bg-[#0072df] group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0072df] transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
