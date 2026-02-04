"use client";

import React from "react";
import { ResumeProvider } from "./context/ResumeContext";
import { ResumeEditor } from "./components/ResumeEditor";
import ClientOnly from "@/components/shared/ClientOnly";

export default function ResumeBuilderPage() {
    return (
        <ResumeProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans selection:bg-blue-500/30 transition-colors duration-300">
                {/* Ambient Background Lights */}
                <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-300/30 dark:bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/30 dark:bg-cyan-600/10 blur-[140px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-normal" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] dark:opacity-[0.2] pointer-events-none" />

                <ClientOnly>
                    <ResumeEditor />
                </ClientOnly>
            </div>
        </ResumeProvider>
    );
}
