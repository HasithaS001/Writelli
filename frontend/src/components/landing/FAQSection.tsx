"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 text-left focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Writelli?",
      answer: "Writelli is an advanced AI-powered writing assistant that helps you create, improve, and polish your content. It offers tools for grammar checking, readability analysis, translation, summarization, and more."
    },
    {
      question: "How can Writelli help improve my writing?",
      answer: "Writelli provides comprehensive writing assistance through various tools including grammar checking, readability analysis, tone conversion, and translation. It helps identify errors, suggests improvements, and ensures your content is clear and engaging."
    },
    {
      question: "Is Writelli suitable for all types of writing?",
      answer: "Yes! Writelli is designed to help with various types of content including academic papers, business documents, creative writing, blog posts, and more. Our tools adapt to different writing styles and requirements."
    },
    {
      question: "Do I need to install any software to use Writelli?",
      answer: "No, Writelli is a web-based platform that works directly in your browser. There's no need to install any software - just sign up and start writing!"
    },
    {
      question: "What makes Writelli different from other writing tools?",
      answer: "Writelli combines multiple writing enhancement tools in one platform, powered by advanced AI technology. We offer a comprehensive suite of features, real-time suggestions, and a user-friendly interface designed for both beginners and professional writers."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about Writelli</p>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
