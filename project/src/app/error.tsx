'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong!</h1>
          <p className="text-gray-600 mb-4">
            The application encountered an unexpected error.
          </p>
          
          <div className="mb-6 p-3 bg-gray-100 rounded text-left text-xs">
            <p>Error: {error.message || 'Unknown error'}</p>
            {error.digest && <p className="mt-1">Digest: {error.digest}</p>}
          </div>
          
          <div className="space-y-2 text-left text-sm mt-4">
            <p className="font-medium">Possible solutions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check that <code>NEXTAUTH_SECRET</code> is set</li>
              <li>Make sure <code>NEXTAUTH_URL</code> matches your deployed URL exactly</li>
              <li>Verify <code>ALLOW_DEMO_LOGIN</code> is set to "true"</li>
              <li>Clear your browser cookies and try again</li>
            </ul>
          </div>
          
          <button
            onClick={reset}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}