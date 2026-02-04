"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <WifiOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-4">
                You are <span className="text-primary not-italic">Offline</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-md mb-8 leading-relaxed">
                It seems you've lost your internet connection.
                Don't worry, you can still browse previously visited pages.
            </p>
            <Button
                onClick={() => window.location.reload()}
                className="font-black uppercase tracking-widest px-8"
            >
                Try Again
            </Button>
        </div>
    );
}
