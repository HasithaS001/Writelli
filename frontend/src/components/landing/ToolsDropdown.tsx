"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ToolsDropdownProps {
  isMobile?: boolean;
  onSelect?: () => void;
}

export default function ToolsDropdown({ isMobile = false, onSelect }: ToolsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setIsOpen(false);
    }
  }, [pathname, isMounted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    onSelect?.();
  };

  const tools = [
    { href: '/grammar-checker', label: 'Grammar Checker' },
    { href: '/readability-checker', label: 'Readability Checker' },
    { href: '/paraphraser', label: 'Paraphraser' },
    { href: '/summarizer', label: 'Summarizer' },
    { href: '/translator', label: 'Translator' },
    { href: '/tone-converter', label: 'Tone Converter' },
    { href: '/humanizer', label: 'Humanizer' },
    { href: '/article-rewriter', label: 'Article Rewriter' },
  ];

  if (!isMounted) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-[#0072df] font-medium transition-colors py-2 flex items-center justify-between w-full"
        >
          Tools
          <svg
            className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="pl-4 space-y-2 mt-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block py-2 text-gray-700 hover:text-[#0072df] transition-colors"
                onClick={handleLinkClick}
              >
                {tool.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="text-gray-700 hover:text-[#0072df] font-medium transition-colors flex items-center"
      >
        Tools
        <svg
          className={`ml-1 h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#0072df] transition-colors"
              onClick={handleLinkClick}
            >
              {tool.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
