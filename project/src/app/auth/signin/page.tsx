"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import LoginButtons from "@/components/auth/login-buttons";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { status } = useSession();
  const [redirecting, setRedirecting] = useState(false);

  // If we're authenticated, we should be on the dashboard
  useEffect(() => {
    // Only redirect once and only if we're authenticated
    if (status === "authenticated" && !redirecting) {
      setRedirecting(true);
      console.log("Already authenticated, redirecting to dashboard...");
      
      // Use a timeout to avoid immediate redirects that might cause loops
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    }
  }, [status, redirecting]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 relative bg-primary rounded-full flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="30" r="8" fill="white" />
              <circle cx="80" cy="70" r="8" fill="white" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Agricultural Trial Plot Planning
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your field trials and observations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error === "AccessDenied"
                      ? "You do not have permission to sign in."
                      : "An error occurred during sign in. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Don't render login buttons if we're already authenticated and redirecting */}
          {status !== "authenticated" && <LoginButtons />}
          
          {status === "authenticated" && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Redirecting to dashboard...</p>
            </div>
          )}
          
          <div className="mt-6">
            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}