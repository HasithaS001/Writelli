import React from 'react';
import Image from 'next/image';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Hasitha Sudheera',
      role: 'Founder & CEO',
      image: '/images/Hasitha.png',
      bio: 'Software Engineer,Hasitha leads Writelli\'s vision of making advanced writing tools accessible to everyone.',
      social: {
        linkedin: 'https://www.linkedin.com/in/hasitha-sudheera-bandara-b4b366346/',
        twitter: 'https://x.com/Mr_Hasitha001'
      }
    },
    {
      name: 'Hasitha Sudheera',
      role: 'Content Creator',
      image: '/images/Hasitha.png',
      bio: 'Content creator at Writelli.com, crafting compelling blogs that inform and inspire readers.',
      social: {
        linkedin: 'https://www.linkedin.com/in/hasitha-sudheera-bandara-b4b366346/',
        twitter: 'https://x.com/Mr_Hasitha001'
      }
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-8">
              About <span className="text-black">Write</span><span className="text-[#285dcf]">lli</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Empowering writers with intelligent AI tools to create exceptional content
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 transform transition-transform duration-500 group-hover:scale-105"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute inset-0">
                  {/* Floating circles */}
                  <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-blue-200/30 animate-float"></div>
                  <div className="absolute bottom-20 right-12 w-16 h-16 rounded-full bg-purple-200/30 animate-float-delayed"></div>
                  
                  {/* Decorative lines */}
                  <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"></div>
                  <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-200/50 to-transparent"></div>
                </div>

                {/* Main Illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* AI Brain */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>
                      <div className="absolute w-40 h-40 rounded-full border-2 border-dashed border-blue-300/50 animate-spin-slow"></div>
                    </div>
                    
                    {/* Writing Elements */}
                    <div className="absolute inset-0">
                      {/* Pen tip */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg className="w-16 h-16 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      
                      {/* Text lines */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-48 space-y-2">
                        <div className="h-1 w-full bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded"></div>
                        <div className="h-1 w-3/4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded"></div>
                        <div className="h-1 w-1/2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2024, Writelli is a team of passionate writers, developers, and AI enthusiasts dedicated to revolutionizing the writing process through artificial intelligence.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                We believe that AI should enhance human creativity, not replace it. Our tools are designed to help writers overcome blocks, refine their work, and explore new possibilities in their writing.
              </p>
              <p className="text-lg text-gray-700">
                Based in Silicon Valley with team members across the globe, we bring diverse perspectives and expertise to create tools that serve writers of all backgrounds and disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700">
              To democratize access to advanced writing tools and empower everyone to express their ideas with clarity, creativity, and confidence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Innovation</h3>
              <p className="text-gray-700 text-center">
                Continuously pushing the boundaries of what AI can do for writers and content creators.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Accessibility</h3>
              <p className="text-gray-700 text-center">
                Making powerful writing tools available to everyone, regardless of technical expertise.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Quality</h3>
              <p className="text-gray-700 text-center">
                Delivering reliable, accurate, and effective tools that genuinely improve writing outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Meet Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl -rotate-6 scale-95 transition-transform group-hover:rotate-0 group-hover:scale-100"></div>
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-[#285dcf] font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 mb-4 max-w-sm mx-auto">{member.bio}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.social.linkedin} className="text-gray-400 hover:text-[#285dcf] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                  </svg>
                </a>
                <a href={member.social.twitter} className="text-gray-400 hover:text-[#285dcf] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-6">Join Us on Our Mission</h2>
              <p className="text-xl text-blue-100 mb-8">
                Experience how AIWriter can transform your writing process and help you create better content faster.
              </p>
              <a
                href="/signup"
                className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition-colors"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
}
