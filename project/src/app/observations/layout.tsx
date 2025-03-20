import AuthenticatedLayout from "@/components/layout/authenticated-layout";

export default function ObservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}