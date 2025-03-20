export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just render children with no session checks
  return <>{children}</>;
}