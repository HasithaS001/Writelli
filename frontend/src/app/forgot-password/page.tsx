'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage(
          'Password reset link has been sent to your email. Please check your inbox and follow the instructions.'
        );
        setEmail(''); // Clear the email field after successful submission
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Image/Brand */}
      <div className="hidden md:flex md:w-1/2 bg-[#4f39f6] flex-col justify-center items-center p-10 text-white">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Reset Your Password</h1>
          <p className="text-xl mb-8">
            Enter your email address and we'll send you a link to reset your password.
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
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-700">Forgot Password</h2>
            <p className="mt-2 text-gray-500">
              Remember your password?{' '}
              <Link href="/signin" className="text-[#4f39f6] hover:text-[#3d2cc7] font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6]"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f39f6] hover:bg-[#3d2cc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f39f6] disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/signup" className="text-sm font-medium text-[#4f39f6] hover:text-[#3d2cc7]">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
