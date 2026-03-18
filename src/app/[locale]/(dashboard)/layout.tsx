import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        userName={session.user?.name}
        userRole={(session.user as { role?: string })?.role}
      />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
