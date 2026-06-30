import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Protect admin routes
    if (!session) {
        redirect("/login");
    }

    const user = session.user as any;
    if (user?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-charcoal flex">
            <AdminSidebar user={session.user} />
            <div className="flex-1 ml-64 p-8 pt-6">
                {children}
            </div>
        </div>
    );
}
