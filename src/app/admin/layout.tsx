import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/authService";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
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