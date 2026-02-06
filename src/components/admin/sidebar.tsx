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
    { title: "Admissions", href: "/admin/admissions", icon: GraduationCap },
    { title: "Applications", href: "/admin/applications", icon: FileText },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-card border-border transition-all duration-300 h-screen sticky top-0",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-md">
                {!isCollapsed && (
                    <span className="font-bold text-lg tracking-tight text-foreground">Admin <span className="text-primary font-extrabold">Panel</span></span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {!isCollapsed && (
                    <div className="px-3 mb-4">
                        <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground" size="sm" asChild>
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
                                        ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
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

            <div className="p-4 border-t border-border space-y-2 bg-muted/20">
                <Link
                    href="/dashboard"
                    className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="text-foreground font-semibold">User Dashboard</span>}
                </Link>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
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
