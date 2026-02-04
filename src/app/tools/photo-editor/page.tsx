"use client";

import React from "react";
import Link from "next/link";
import { usePhotoEditor } from "./context/PhotoEditorContext";
import { EditorShell } from "./components/EditorShell";
import {
    Sliders, Sparkles, Crop, UserSquare2, ShieldCheck, ChevronRight
} from "lucide-react";

export default function PhotoEditorPage() {
    const { image } = usePhotoEditor() as any;

    const tools = [
        { title: "Image Enhancer", desc: "Refine brightness, contrast & cognitive saturation", path: "/tools/photo-editor/adjust", icon: Sliders },
        { title: "AI BG Removal Tool", desc: "Neural-powered edge extraction & backdrop synthesis", path: "/tools/photo-editor/ai-background", icon: Sparkles },
        { title: "Crop & Selection", desc: "Precision frame definition & content erasure", path: "/tools/photo-editor/crop", icon: Crop },
        { title: "Student ID Maker", desc: "Identity protocol synthesis with white-balance", path: "/tools/photo-editor/id-maker", icon: UserSquare2 },
        { title: "Exam Compliance", desc: "Standardized regional validation protocols", path: "/tools/photo-editor/compliance", icon: ShieldCheck },
    ];

    return (
        <EditorShell>
            {!image ? (
                <div className="space-y-8 h-full flex flex-col justify-center">
                    <div className="space-y-4 text-center">
                        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] mb-4">
                            <Sparkles className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-white/50 uppercase tracking-tight">Initializing Core</h2>
                        <p className="text-xs text-blue-600/60 dark:text-blue-200/60 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto">
                            Upload an image to activate the neural processing matrix.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 pb-10 max-w-4xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                            Photo <span className="text-blue-600 dark:text-blue-500 not-italic">Studio</span>
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Select a tool to begin.
                        </p>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/10 p-2 shadow-xl dark:shadow-2xl overflow-hidden">
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {tools.map((tool) => (
                                <Link
                                    key={tool.path}
                                    href={tool.path}
                                    className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-300 first:rounded-t-2xl last:rounded-b-2xl"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:border-blue-500/50 group-hover:from-blue-50 dark:group-hover:from-blue-600/20 group-hover:to-blue-100 dark:group-hover:to-blue-900/20 transition-all">
                                        <tool.icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>

                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors leading-tight">{tool.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors mt-0.5 leading-snug">{tool.desc}</p>
                                    </div>

                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </EditorShell>
    );
}
