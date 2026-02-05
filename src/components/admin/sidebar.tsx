"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Settings,
    Bell,
    FileText,
    ChevronLeft,
    LogOut,
    PlusCircle,
    IdCard,
    Key,
    ScrollText,
    GraduationCap,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Manage Jobs", href: "/admin/jobs", icon: Briefcase },
    { title: "Automation", href: "/admin/automation", icon: Users }, // Using Users icon as placeholder or find a better one like Bot/Sparkles
    { title: "Admissions", href: "/admin/admissions", icon: GraduationCap },
    { title: "Applications", href: "/admin/applications", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 transition-all duration-300 h-screen sticky top-0",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                {!isCollapsed && (
                    <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Admin <span className="text-blue-600 dark:text-cyan-400 font-extrabold">Panel</span></span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {!isCollapsed && (
                    <div className="px-3 mb-4">
                        <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-700" size="sm" asChild>
                            <Link href="/admin/jobs/new">
                                <PlusCircle className="mr-2 h-4 w-4" /> New Posting
                            </Link>
                        </Button>
                    </div>
                )}

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 dark:bg-cyan-900/20 text-blue-700 dark:text-cyan-300 shadow-sm border border-blue-100 dark:border-cyan-500/20"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
                                    isCollapsed && "justify-center px-0"
                                )}
                            >
                                <item.icon className="h-4 w-4 shrink-0" />
                                {!isCollapsed && <span>{item.title}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="text-slate-900 dark:text-white font-semibold">User Dashboard</span>}
                </Link>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="ml-3 font-semibold">Logout</span>}
                </Button>
            </div>
        </aside>
    );
}
