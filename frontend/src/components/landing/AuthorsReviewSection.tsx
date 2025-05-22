import React, { useState } from 'react';

const testimonials = [
  {
    id: 'researchers',
    text: "Wordvice AI's Writing Assistant has been a crucial tool for preparing my research. The AI essay editor tools ensure my work is precise before I publish.",
    author: "Dr. Emily Rivera",
    role: "Graduate Researcher",
    avatar: "/avatars/researcher.png"
  },
  {
    id: 'students',
    text: "As a student juggling multiple assignments, this AI writing tool has been a lifesaver. It helps me refine my essays and ensures my arguments are clear and well-structured.",
    author: "Jason Thompson",
    role: "University Student",
    avatar: "/avatars/student.png"
  },
  {
    id: 'content-writers',
    text: "The tone adjustment feature is incredible. I can write content for different clients and platforms with consistent quality and appropriate style every time.",
    author: "Mia Chen",
    role: "Content Strategist",
    avatar: "/avatars/writer.png"
  },
  {
    id: 'enterprises',
    text: "Implementing this AI writing assistant across our marketing department has standardized our communication and significantly reduced editing time for our publications.",
    author: "Robert Johnson",
    role: "Marketing Director",
    avatar: "/avatars/enterprise.png"
  },
  {
    id: 'authors',
    text: "The content humanizer has been invaluable for my creative writing. It helps maintain my unique voice while polishing my prose to professional standards.",
    author: "Sophia Williams",
    role: "Published Author",
    avatar: "/avatars/author.png"
  }
];

const categories = [
  { id: 'researchers', label: 'Researchers' },
  { id: 'students', label: 'Students' },
  { id: 'content-writers', label: 'Content Writers' },
  { id: 'enterprises', label: 'Enterprises' },
  { id: 'authors', label: 'Authors' }
];

const AuthorsReviewSection = () => {
  const [activeCategory, setActiveCategory] = useState('researchers');
  
  const activeTestimonial = testimonials.find(t => t.id === activeCategory) || testimonials[0];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#0072df] uppercase tracking-wider mb-2">USER REVIEW</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Authors Love
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Our AI Writing Assistant
          </h3>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="md:hidden max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-12 border-b border-gray-200">
            <div className="flex flex-col">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 text-lg font-medium transition-colors duration-200 relative ${
                    activeCategory === category.id
                      ? 'text-[#0072df] bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Category Tabs */}
          <div className="hidden md:flex justify-center mb-12 border-b border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 text-lg font-medium transition-colors duration-200 relative ${
                  activeCategory === category.id
                    ? 'text-[#0072df]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
                {activeCategory === category.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0072df]"></span>
                )}
              </button>
            ))}
          </div>

          {/* Testimonial Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="mb-8">
              <p className="text-xl text-gray-700 italic">"{activeTestimonial.text}"</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                {activeTestimonial.avatar ? (
                  <img 
                    src={activeTestimonial.avatar} 
                    alt={activeTestimonial.author} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  activeTestimonial.author.charAt(0)
                )}
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-xl text-gray-900">{activeTestimonial.author}</h4>
                <p className="text-gray-600">{activeTestimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorsReviewSection;
