import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }
  
  // Check if user is admin
  const userRole = (session.user as any).role;
  if (userRole !== 'admin') {
    redirect('/dashboard');
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}