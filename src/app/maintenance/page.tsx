"use client";

import { Construction, Timer, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-background p-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="relative h-32 w-32 bg-yellow-50 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-xl">
                    <Construction className="h-16 w-16 text-yellow-600 animate-bounce" />
                </div>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
                Under <span className="text-yellow-600">Maintenance</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-md font-medium mb-8 leading-relaxed">
                We are currently upgrading our servers to serve you better.
                Please check back in a few minutes.
            </p>

            <div className="grid gap-4 md:grid-cols-2 text-left bg-muted/50 p-6 rounded-2xl border w-full max-w-md">
                <div className="flex items-start space-x-3">
                    <Timer className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm">Estimated Time</h4>
                        <p className="text-xs text-muted-foreground">Approx. 30 minutes</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <ArrowUpCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                        <h4 className="font-bold text-sm">Status Update</h4>
                        <p className="text-xs text-muted-foreground">Database optimization in progress</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded">
                Error Code: 503_SERVICE_UNAVAILABLE
            </div>
        </div>
    );
}
