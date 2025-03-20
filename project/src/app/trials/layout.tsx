import AuthenticatedLayout from "@/components/layout/authenticated-layout";

export default function TrialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}