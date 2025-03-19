'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  // Make sure we're mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Get client-safe environment variables (only NEXT_PUBLIC_*)
    const clientEnvVars: Record<string, string> = {};
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        clientEnvVars[key] = process.env[key] || '';
      }
    });
    
    // Add some diagnostic info
    clientEnvVars['NODE_ENV'] = process.env.NODE_ENV || '';
    clientEnvVars['NEXT_RUNTIME'] = 'browser';
    clientEnvVars['NEXT_PUBLIC_DEPLOYMENT_URL'] = window.location.origin;
    
    setEnvVars(clientEnvVars);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Environment Debugging</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-medium mr-2">Status:</span>
              <span className={`px-2 py-0.5 rounded text-sm ${
                status === 'authenticated' ? 'bg-green-100 text-green-800' : 
                status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>
            
            {status === 'authenticated' && (
              <>
                <div>
                  <span className="font-medium">User:</span> {session?.user?.name || 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {session?.user?.email || 'Unknown'}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {(session?.user as any)?.role || 'Not set'}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Client Environment</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Variable</th>
                  <th className="py-2 px-4 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(envVars).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 px-4 font-mono text-xs">{key}</td>
                    <td className="py-2 px-4 font-mono text-xs break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Required Environment Variables</h2>
        <p className="mb-4">The following variables must be set in AWS Amplify:</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Variable</th>
                <th className="py-2 px-4 text-left">Purpose</th>
                <th className="py-2 px-4 text-left">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono text-xs">NEXTAUTH_SECRET</td>
                <td className="py-2 px-4">Used for encrypting session tokens</td>
                <td className="py-2 px-4 font-mono text-xs">a-long-random-string-at-least-32-chars</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono text-xs">NEXTAUTH_URL</td>
                <td className="py-2 px-4">Your application's deployment URL</td>
                <td className="py-2 px-4 font-mono text-xs">{window.location.origin}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4 font-mono text-xs">ALLOW_DEMO_LOGIN</td>
                <td className="py-2 px-4">Enables demo login mode</td>
                <td className="py-2 px-4 font-mono text-xs">true</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}