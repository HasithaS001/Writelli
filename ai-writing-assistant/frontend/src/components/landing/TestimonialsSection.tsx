import React from 'react';

const testimonials = [
  {
    quote: "This AI writing assistant has completely transformed my workflow. I'm saving hours each day on editing and can focus more on creating great content.",
    author: "Sarah Johnson",
    role: "Content Creator",
    avatar: "/avatars/avatar-1.png"
  },
  {
    quote: "The grammar correction is spot-on, but what really impressed me was how it helped improve my writing style. My content now resonates better with my audience.",
    author: "Michael Chen",
    role: "Marketing Director",
    avatar: "/avatars/avatar-2.png"
  },
  {
    quote: "As a non-native English speaker, this tool has been invaluable. It catches nuances that other grammar checkers miss completely.",
    author: "Elena Petrova",
    role: "Technical Writer",
    avatar: "/avatars/avatar-3.png"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Trusted by <span className="text-[#0072df]">Thousands</span> of Writers
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            See what our users are saying about their experience with our AI writing assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="p-8 rounded-xl bg-white shadow-md hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <svg className="w-8 h-8 text-[#0072df]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
