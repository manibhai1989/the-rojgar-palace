"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Users, CreditCard, Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { differenceInDays, formatDistanceToNow } from "date-fns";

interface QuickStatsBarProps {
    vacanciesCount: number;
    vacanciesDetail?: { gender: string; count: number }[];
    applicationFee: string;
    lastDate: Date;
    examDate?: Date;
}

export function QuickStatsBar({
    vacanciesCount,
    vacanciesDetail,
    applicationFee,
    lastDate,
    examDate,
}: QuickStatsBarProps) {
    const daysLeft = differenceInDays(lastDate, new Date());
    const isClosingSoon = daysLeft <= 3 && daysLeft >= 0;

    return (
        <Card className="glassmorphism border-none shadow-sm overflow-hidden mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-border">
                {/* Vacancies */}
                <div className="p-4 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            Total Vacancies
                        </p>
                        <p className="text-lg font-bold">
                            {vacanciesCount}
                        </p>
                        {vacanciesDetail && (
                            <div className="flex gap-2 mt-0.5">
                                {vacanciesDetail.map((v) => (
                                    <span key={v.gender} className="text-[10px] text-muted-foreground">
                                        {v.gender}: {v.count}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Application Fee */}
                <div className="p-4 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            App. Fee
                        </p>
                        <p className="text-lg font-bold">
                            {applicationFee}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            UPI/NetBanking
                        </p>
                    </div>
                </div>

                {/* Last Date Countdown */}
                <div className="p-4 flex items-center space-x-3">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        isClosingSoon ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                    )}>
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            Last Date to Apply
                        </p>
                        <p className={cn(
                            "text-lg font-bold",
                            isClosingSoon && "text-red-600 animate-pulse"
                        )}>
                            {daysLeft < 0 ? "Closed" : `${daysLeft} days left`}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Ends: {lastDate.toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Exam Date */}
                <div className="p-4 flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            Exam Date (Expected)
                        </p>
                        <p className="text-lg font-bold">
                            {examDate ? examDate.toLocaleDateString() : "TBA"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            Notification Pending
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

