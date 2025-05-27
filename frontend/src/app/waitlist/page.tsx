import { Metadata } from 'next';
import WaitlistForm from './WaitlistForm';

export const metadata: Metadata = {
  title: 'Join the Waitlist - Pro Access Coming Soon',
  description: 'Join the waitlist to get early access to our Pro features. Be the first to experience advanced writing tools and premium features.',
};

export default function WaitlistPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          <h1 className="font-geist-sans text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Pro Access</span>
            <span className="block text-blue-500">Coming Soon</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Join the waitlist to get early access to our Pro features. Be the first to experience advanced writing tools, unlimited word limits, and premium features.
          </p>
        </div>

        <div className="mt-10">
          <WaitlistForm />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {['Unlimited word limit', 'Advanced AI writing tools', 'Premium features'].map((feature) => (
            <div key={feature} className="relative overflow-hidden rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
