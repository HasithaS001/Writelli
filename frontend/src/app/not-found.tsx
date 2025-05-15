'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NotFound() {
  useEffect(() => {
    // Add confetti effect
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js';
    document.body.appendChild(script);

    script.onload = () => {
      const duration = 3 * 1000,
        animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const confetti = () => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        const particleCount = 50 * (timeLeft / duration);
        // @ts-ignore
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f39f6', '#3d2cc7', '#6c5ce7', '#a29bfe'],
        });

        requestAnimationFrame(confetti);
      };

      confetti();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Text */}
        <motion.h1
          className="text-9xl font-bold text-[#4f39f6]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Animated Robot Illustration */}
        <motion.div
          className="my-8 relative h-64"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <svg
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Robot Body */}
            <motion.rect
              x="150"
              y="100"
              width="100"
              height="120"
              rx="10"
              fill="#4f39f6"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Robot Head */}
            <motion.rect
              x="165"
              y="50"
              width="70"
              height="70"
              rx="10"
              fill="#3d2cc7"
              initial={{ rotate: 0 }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Robot Eyes */}
            <motion.circle
              cx="185"
              cy="80"
              r="10"
              fill="white"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="215"
              cy="80"
              r="10"
              fill="white"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Robot Arms */}
            <motion.line
              x1="150"
              y1="120"
              x2="100"
              y2="150"
              stroke="#3d2cc7"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: '150px 120px' }}
            />
            <motion.line
              x1="250"
              y1="120"
              x2="300"
              y2="150"
              stroke="#3d2cc7"
              strokeWidth="10"
              strokeLinecap="round"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: '250px 120px' }}
            />
          </svg>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for seems to have wandered off into cyberspace.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#4f39f6] hover:bg-[#3d2cc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f39f6] transition-colors duration-200"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
