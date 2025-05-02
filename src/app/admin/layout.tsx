import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  console.log('Session', { session });
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {children}
        </div>
      </div>
    </div>
  );
} 