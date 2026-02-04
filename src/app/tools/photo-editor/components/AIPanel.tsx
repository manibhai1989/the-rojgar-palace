"use client";

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function AIPanel({
    isProcessing: externalIsProcessing,
    processingProgress: externalProgress,
    handleRemoveBackground: externalHandleRemoveBackground,
    bgColor: externalBgColor,
    setBgColor: externalSetBgColor,
    hasImage: externalHasImage
}: any = {}) {
    const context = usePhotoEditor() as any;

    const isRemoving = externalIsProcessing !== undefined ? externalIsProcessing : context.isProcessing;
    const progress = externalProgress !== undefined ? externalProgress : context.processingProgress;
    const handleRemoveBackground = externalHandleRemoveBackground || context.handleRemoveBackground;
    const bgColor = externalBgColor || context.bgColor;
    const setBgColor = externalSetBgColor || context.setBgColor;
    const hasImage = externalHasImage !== undefined ? externalHasImage : context.hasImage;

    const backgroundColors = [
        { name: "Transparent", value: "transparent" },
        { name: "White", value: "#ffffff" },
        { name: "Blue", value: "#3b82f6" },
        { name: "Red", value: "#ef4444" },
    ];

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Sparkles className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 relative z-10">AI Background Extraction</h2>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-200 font-bold uppercase tracking-widest relative z-10">Neural edge segmentation v4</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Analysis Status</Label>
                        <div className="flex items-center gap-1.5">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full shadow-sm",
                                isRemoving ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                            )} />
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                isRemoving ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                            )}>
                                {isRemoving ? "Extracting..." : "Engine Ready"}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-50" />
                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-lg dark:shadow-[0_0_30px_rgba(99,102,241,0.1)] group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Automated Segmentation</h4>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest leading-relaxed px-4">
                                    Our neural network will isolate the primary subject with sub-pixel precision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {isRemoving && (
                    <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            <span>Segmentation Progress</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden border border-slate-300 dark:border-white/5">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50">
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                        {backgroundColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => setBgColor(color.value)}
                                className={cn(
                                    "w-full aspect-square rounded-lg border transition-all duration-300 relative group overflow-hidden",
                                    bgColor === color.value
                                        ? "border-indigo-500 shadow-md scale-100"
                                        : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-white/30 scale-95 hover:scale-100"
                                )}
                                title={color.name}
                            >
                                <div
                                    className="absolute inset-0 z-0"
                                    style={{ backgroundColor: color.value === 'transparent' ? 'transparent' : color.value }}
                                >
                                    {color.value === 'transparent' && (
                                        <div className="w-full h-full bg-[url('/grid.svg')] opacity-20" />
                                    )}
                                </div>
                                {bgColor === color.value && <div className="absolute inset-0 z-10 ring-2 ring-indigo-500/50 rounded-lg" />}
                            </button>
                        ))}
                    </div>

                    <Button
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg shadow-lg gap-2 group/ai relative overflow-hidden"
                        onClick={() => handleRemoveBackground()}
                        disabled={isRemoving || !hasImage}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/ai:translate-y-0 transition-transform duration-300 skew-y-12" />
                        {isRemoving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Sparkles className="w-4 h-4 group-hover/ai:scale-125 transition-transform" />
                        )}
                        <span className="relative z-10">Remove Background</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
