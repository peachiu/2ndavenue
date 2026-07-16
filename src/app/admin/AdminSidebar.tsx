"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Package,
    ArrowLeft,
    LogOut,
    User,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
    {
        label: "Visão geral",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Utilizadores",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Anúncios",
        href: "/admin/listings",
        icon: Package,
    },
];

export default function AdminSidebar({ user }: { user: any }) {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-card-bg border-r border-slate-700 z-40 flex flex-col">
            {/* Logo */}
            <Link
                href="/admin"
                className="flex items-center gap-3 px-6 h-20 border-b border-slate-700 group"
            >
                <img src="/logo.png" alt="SecondAvenue"
                    className="h-9 w-9 object-contain"
                    style={{ borderRadius: 10 }}
                />
                <div>
                    <p className="font-black text-off-white text-sm leading-tight">
                        Admin
                    </p>
                    <p className="text-[10px] font-bold text-slate-light uppercase tracking-widest">
                        SecondAvenue
                    </p>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin" &&
                            pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                                isActive
                                    ? "bg-periwinkle/10 text-periwinkle shadow-sm"
                                    : "text-slate-light hover:bg-hover-bg hover:text-off-white"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User info & actions */}
            <div className="p-4 border-t border-slate-700 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-light hover:bg-hover-bg hover:text-off-white transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar ao site
                </Link>
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-periwinkle/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user?.image ? (
                            <img
                                src={user.image}
                                alt={user.name || ""}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-4 h-4 text-periwinkle" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-off-white truncate">
                            {user?.name || "Admin"}
                        </p>
                        <p className="text-[10px] font-bold text-periwinkle uppercase tracking-widest">
                            Superuser
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="p-2 text-slate-lighter hover:text-red-500 hover:bg-red-900/30 rounded-xl transition-all"
                        title="Sair"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
