"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consented = localStorage.getItem("cookie-consent");
        if (!consented) {
            // Small delay to not annoy immediately on load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur text-white border-t border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-blue-500 dark:text-blue-400">We value your privacy</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                        By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button className="bg-transparent border border-white/20 !text-white hover:bg-white/10" onClick={() => setIsVisible(false)}>
                        <X className="mr-2 h-4 w-4" /> Decline
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20" onClick={acceptCookies}>
                        Accept All
                    </Button>
                </div>
            </div>
        </div>
    );
}
