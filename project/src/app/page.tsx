import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import LoginButtons from '@/components/auth/login-buttons';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <h1 className="text-4xl font-bold text-primary-700">AG Trial Plot Planning</h1>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center lg:static lg:h-auto lg:w-auto">
          {session ? (
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white"
            >
              Go to Dashboard
            </Link>
          ) : null}
        </div>
      </div>

      <div className="relative flex place-items-center">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Agricultural Trial Plot Planning & Observation System
          </h2>
          <p className="mb-8 text-lg md:text-xl">
            Streamline your agricultural field trials with our comprehensive planning, 
            navigation, and data collection platform
          </p>
          
          {!session ? (
            <div className="flex flex-col space-y-4">
              <LoginButtons />
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg">Logged in as: {session.user?.name || session.user?.email}</p>
              <Link
                href="/api/auth/signout"
                className="px-4 py-2 rounded-md bg-secondary-600 hover:bg-secondary-700 text-white"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mb-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center lg:mb-0 lg:text-left">
        <div className="group rounded-lg border border-gray-300 bg-white/5 px-5 py-4 dark:border-gray-700">
          <h2 className="mb-3 text-xl font-semibold">Plot Planning</h2>
          <p className="m-0 text-sm opacity-80">
            Create and manage trial plots with interactive mapping and design tools
          </p>
        </div>

        <div className="group rounded-lg border border-gray-300 bg-white/5 px-5 py-4 dark:border-gray-700">
          <h2 className="mb-3 text-xl font-semibold">Field Navigation</h2>
          <p className="m-0 text-sm opacity-80">
            GPS-guided navigation to efficiently visit and collect data from your trial plots
          </p>
        </div>

        <div className="group rounded-lg border border-gray-300 bg-white/5 px-5 py-4 dark:border-gray-700">
          <h2 className="mb-3 text-xl font-semibold">Data Collection</h2>
          <p className="m-0 text-sm opacity-80">
            Structured observation collection with support for various metrics and offline capabilities
          </p>
        </div>
      </div>
    </main>
  );
}