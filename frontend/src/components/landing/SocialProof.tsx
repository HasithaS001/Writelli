import React from 'react';

const SocialProof = () => {
  const stats = [
    {
      value: '5K+',
      label: 'Active Users',
      description: 'Writers trust our tools daily'
    },
    {
      value: '10K+',
      label: 'Documents Improved',
      description: 'Enhanced writing quality'
    },
    {
      value: '99.9%',
      label: 'Accuracy Rate',
      description: 'Precise AI corrections'
    },
    {
      value: '150+',
      label: 'Countries',
      description: 'Global community of users'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Writers Worldwide</h2>
          <p className="text-lg text-gray-600">Join our growing community of successful writers</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-shadow duration-300"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100">
                  <div className="w-6 h-6 text-blue-600">
                    {/* Simple circle icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                </div>
                <dt>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                </dt>
                <dd className="text-sm text-gray-500">{stat.description}</dd>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
