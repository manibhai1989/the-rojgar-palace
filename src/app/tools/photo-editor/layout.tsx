"use client";

import React from "react";
import { PhotoEditorProvider, usePhotoEditor } from "./context/PhotoEditorContext";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { fileInputRef, handleFileChange } = usePhotoEditor() as any;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
            {/* Header (Themes: Light/Dark) */}
            <header className="relative flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-12 px-4 shadow-xl z-20 border-b border-slate-200 dark:border-white/5">
                <div className="absolute inset-0 z-0 select-none">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 dark:from-blue-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                        <div className="text-left flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                <Zap className="w-3 h-3 fill-current" /> Professional Photo Engine
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-500/20 rounded-lg border border-blue-100 dark:border-blue-500/30">
                                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Advanced Tool Suite
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 max-w-lg text-base leading-relaxed">
                                Professional-grade image processing with neural edge extraction and regional compliance validation.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-[1750px] px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-30">
                {children}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
};

export default function PhotoEditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <PhotoEditorProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </PhotoEditorProvider>
    );
}
