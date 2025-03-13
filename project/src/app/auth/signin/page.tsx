import { Metadata } from 'next';
import Link from 'next/link';
import LoginButtons from '@/components/auth/login-buttons';

export const metadata: Metadata = {
  title: 'Sign In - AG Trial Plot Planning',
  description: 'Sign in to your AG Trial Plot Planning account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white dark:from-primary-950 dark:to-primary-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              AG Trial Plot Planning
            </h1>
          </Link>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to access your agricultural trial planning dashboard
          </p>
        </div>

        <div className="space-y-4">
          <LoginButtons />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}