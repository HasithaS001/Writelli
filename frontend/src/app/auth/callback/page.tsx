'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Check if this is a password reset callback
        const type = searchParams.get('type');
        
        if (type === 'recovery') {
          // This is a password reset flow
          console.log('Password reset flow detected');
          // Redirect to the reset password page
          router.push('/reset-password');
          return;
        }
        
        // Regular OAuth flow
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          router.push('/signin?error=Authentication%20failed');
          return;
        }
        
        // Redirect to the home page or dashboard after successful authentication
        router.push('/');
      } catch (error) {
        console.error('Exception during auth callback:', error);
        router.push('/signin?error=Authentication%20failed');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Completing sign in...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we authenticate your account.
          </p>
        </div>
        <div className="flex justify-center mt-5">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
