'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the hash fragment from the URL
  useEffect(() => {
    // Supabase adds the token and type to the URL hash fragment
    const hash = window.location.hash;
    if (hash) {
      // The hash will be in the format #access_token=XXX&type=recovery
      // We don't need to parse it manually as Supabase will handle it
      console.log('Hash fragment detected, Supabase will handle the reset flow');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Supabase handles the token validation internally
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Your password has been successfully reset.');
        // Clear the form
        setPassword('');
        setConfirmPassword('');
        
        // Redirect to sign in page after 3 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
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
            Create a new password for your account.
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

      {/* Right Column - Reset Password Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-700">Reset Password</h2>
            <p className="mt-2 text-gray-500">
              Enter your new password below
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
              <p className="mt-2">Redirecting to sign in page...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6]"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4f39f6] focus:border-[#4f39f6]"
                placeholder="Confirm your new password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f39f6] hover:bg-[#3d2cc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f39f6] disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/signin" className="text-sm font-medium text-[#4f39f6] hover:text-[#3d2cc7]">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
