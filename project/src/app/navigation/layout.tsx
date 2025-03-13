import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import AuthenticatedLayout from '@/components/layout/authenticated-layout';

export default async function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}