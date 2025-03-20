import AuthenticatedLayout from "@/components/layout/authenticated-layout";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}