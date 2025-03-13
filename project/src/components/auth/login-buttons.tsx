'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';

export default function LoginButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedDemoRole, setSelectedDemoRole] = useState('researcher');

  const handleSignIn = async (provider: string) => {
    setIsLoading(provider);
    try {
      if (provider === 'credentials') {
        await signIn('credentials', {
          callbackUrl: '/dashboard',
          username: 'demo',
          role: selectedDemoRole,
        });
      } else {
        await signIn(provider, { callbackUrl: '/dashboard' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <button
        onClick={() => handleSignIn('google')}
        disabled={!!isLoading}
        className="flex items-center justify-center bg-white text-gray-800 py-2 px-4 rounded-md shadow-md hover:bg-gray-100 w-64 mx-auto"
      >
        <FcGoogle className="mr-2 text-xl" />
        {isLoading === 'google' ? 'Signing in...' : 'Sign in with Google'}
      </button>

      <button
        onClick={() => handleSignIn('azure-ad')}
        disabled={!!isLoading}
        className="flex items-center justify-center bg-[#2f2f2f] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#0078d4] w-64 mx-auto"
      >
        <FaMicrosoft className="mr-2 text-xl text-[#0078d4]" />
        {isLoading === 'azure-ad' ? 'Signing in...' : 'Sign in with Microsoft'}
      </button>

      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-md p-4 w-64 mx-auto">
        <h3 className="text-center font-semibold mb-2">Demo Login</h3>
        <div className="mb-2">
          <select
            value={selectedDemoRole}
            onChange={(e) => setSelectedDemoRole(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 mb-2"
          >
            <option value="admin">Admin</option>
            <option value="researcher">Researcher</option>
            <option value="field-technician">Field Technician</option>
          </select>
        </div>
        <button
          onClick={() => handleSignIn('credentials')}
          disabled={!!isLoading}
          className="flex items-center justify-center bg-primary-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-primary-700 w-full"
        >
          <FaUser className="mr-2" />
          {isLoading === 'credentials' ? 'Signing in...' : 'Demo Login'}
        </button>
      </div>
    </>
  );
}