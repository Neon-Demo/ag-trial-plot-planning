"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="mt-6 text-6xl font-extrabold text-white">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-300">Page Not Found</h2>
          <p className="mt-4 text-lg text-gray-400">
            We couldn't find the page you're looking for.
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800">
          <div className="space-y-4">
            <p className="text-gray-400 text-center">
              The page you requested does not exist or has been moved to a different location.
            </p>
            
            <div className="flex items-center justify-center mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}