import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-espresso">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8">{children}</div>
      </div>
    </div>
  );
}
