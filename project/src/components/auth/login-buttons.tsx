"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleDemoLogin = async (demoUser: string) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    setSelectedDemo(demoUser);
    
    try {
      console.log(`Signing in as ${demoUser} demo user...`);
      
      // Use NextAuth's signIn with direct dashboard redirect
      // Use the window location to construct a base-relative URL
      const basePath = window.location.origin;
      signIn("credentials", { 
        username: demoUser,
        callbackUrl: `${basePath}/dashboard`,
        redirect: true
      });
      
      // No other logic needed - NextAuth will handle the redirect
      
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      setSelectedDemo(null);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Demo Researcher Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Only show the Researcher login button */}
        <button
          onClick={() => handleDemoLogin("researcher")}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${
            isLoading && selectedDemo === "researcher" ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {isLoading && selectedDemo === "researcher" ? "Signing in..." : "Demo Researcher"}
        </button>
      </div>
      
      <div className="mt-6">
        <p className="text-xs text-center text-gray-500 mt-2">
          This is a demo account with researcher access
        </p>
      </div>
    </div>
  );
}