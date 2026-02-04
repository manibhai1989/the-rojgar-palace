"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={cn("hidden md:flex items-center text-sm text-muted-foreground", className)}>
            <Link
                href="/"
                className="flex items-center hover:text-foreground transition-colors"
                aria-label="Home"
            >
                <Home className="h-4 w-4" />
            </Link>

            {segments.map((segment, index) => {
                const path = `/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;
                const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

                return (
                    <React.Fragment key={path}>
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
                        {isLast ? (
                            <span className="font-medium text-foreground" aria-current="page">
                                {title}
                            </span>
                        ) : (
                            <Link
                                href={path}
                                className="hover:text-foreground transition-colors"
                            >
                                {title}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}
