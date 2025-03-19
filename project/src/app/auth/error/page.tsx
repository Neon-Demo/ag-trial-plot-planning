'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// Component to handle the search params and error display
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map error codes to user-friendly messages
  const errorMessages: Record<string, string> = {
    default: 'An error occurred during authentication. Please try again.',
    configuration: 'There is a problem with the server configuration. Please contact support.',
    accessdenied: 'You do not have permission to sign in.',
    verification: 'The verification link is invalid or has expired.',
    'oauth-callback-error': 'There was a problem with the OAuth provider. Please try again later.',
  };

  const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.default;

  return (
    <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{errorMessage}</p>
      <div className="flex flex-col space-y-4">
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-md transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

// Fallback for the Suspense boundary
function AuthErrorFallback() {
  return (
    <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold text-primary-600 mb-4">Loading...</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">Please wait while we process your request.</p>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-primary-900">
      <Suspense fallback={<AuthErrorFallback />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}