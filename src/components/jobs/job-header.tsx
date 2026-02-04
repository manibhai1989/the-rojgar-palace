"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, Bookmark, Printer, BadgeCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobHeaderProps {
    title: string;
    organization: string;
    logo?: string;
    isUrgent?: boolean;
    isLastDay?: boolean;
    isNew?: boolean;
    onPrint?: () => void;
    onShare?: () => void;
    onBookmark?: () => void;
}

export function JobHeader({
    title,
    organization,
    logo,
    isUrgent,
    isLastDay,
    isNew,
    onPrint,
    onShare,
    onBookmark,
}: JobHeaderProps) {
    return (
        <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
            <div className="flex items-start space-x-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative h-16 w-16 rounded-xl border bg-white shadow-sm flex items-center justify-center overflow-hidden"
                >
                    {logo ? (
                        <div className="relative h-12 w-12">
                            <Image
                                src={logo}
                                alt={organization}
                                fill
                                className="object-contain"
                                sizes="48px"
                            />
                        </div>
                    ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold text-xl">
                            {organization.charAt(0)}
                        </div>
                    )}
                </motion.div>
                <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {isUrgent && (
                            <Badge variant="destructive" className="animate-pulse">
                                <AlertCircle className="mr-1 h-3 w-3" /> Urgent
                            </Badge>
                        )}
                        {isLastDay && (
                            <Badge variant="destructive" className="bg-orange-600 hover:bg-orange-700">
                                Last Day
                            </Badge>
                        )}
                        {isNew && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 border-none">
                                New Opening
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <div className="flex items-center text-muted-foreground">
                        <BadgeCheck className="mr-1 h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{organization}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={onShare}>
                    <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={onBookmark}>
                    <Bookmark className="mr-2 h-4 w-4" /> Save
                </Button>
                <Button variant="outline" size="sm" onClick={onPrint} className="hidden sm:flex">
                    <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
            </div>
        </div>
    );
}
