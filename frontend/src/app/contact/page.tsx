'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message: data.message
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Column - Illustration */}
        <div className="hidden md:flex md:w-1/2 bg-[#4f39f6] flex-col justify-center items-center p-10 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl mb-8">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="relative h-64 w-full">
              <Image 
                src="/images/ai-robot.svg" 
                alt="AI Assistant Robot"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-base text-black">hello@writelli.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-base text-black">+94702188978</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-base text-black">386/C Welangathuduwawaththa,Ambalanwaththa,Galle, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Contact Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-lg">
            <div className="md:hidden text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h1>
              <p className="text-lg text-black">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            
            {submitStatus.type && (
              <div 
                className={`mb-6 p-4 rounded-md ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a message</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6] placeholder-black"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6] placeholder-black"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6] placeholder-black"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6] placeholder-black"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f39f6] hover:bg-[#3d2cc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f39f6] disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
            
            {/* Mobile Contact Info */}
            <div className="md:hidden mt-8 space-y-4 p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4f39f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">contact@aiwriter.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4f39f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4f39f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">123 AI Street, Silicon Valley, CA 94000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer variant="light" />
    </div>
  );
}
