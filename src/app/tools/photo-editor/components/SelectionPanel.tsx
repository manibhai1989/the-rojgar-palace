"use client";

import React from "react";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import {
    Crop, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SelectionPanel({
    aspect: externalAspect,
    setAspect: externalSetAspect,
    setShowCropper: externalSetShowCropper,
    isEraserActive: externalIsEraserActive,
    setIsEraserActive: externalSetIsEraserActive
}: any = {}) {
    const context = usePhotoEditor() as any;

    const aspect = externalAspect || context.aspect;
    const setAspect = externalSetAspect || context.setAspect;
    const setShowCropper = externalSetShowCropper || context.setShowCropper;
    const isEraserActive = externalIsEraserActive || context.isEraserActive;
    const setIsEraserActive = externalSetIsEraserActive || context.setIsEraserActive;

    const aspects = [
        { label: "1:1 Square", ratio: 1 },
        { label: "4:3 Photo", ratio: 4 / 3 },
        { label: "16:9 Wide", ratio: 16 / 9 },
        { label: "9:16 Story", ratio: 9 / 16 },
        { label: "3:2 Camera", ratio: 3 / 2 },
        { label: "2:3 Portrait", ratio: 2 / 3 },
        { label: "5:4 Print", ratio: 5 / 4 },
        { label: "4:5 Insta", ratio: 4 / 5 },
        { label: "Freeform", ratio: undefined },
    ];

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-pink-600/10 to-red-600/10 border border-pink-500/20">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Crop className="w-10 h-10 text-pink-500 dark:text-pink-400" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 relative z-10">Precision Operations</h2>
                <p className="text-[10px] text-pink-600 dark:text-pink-200 font-bold uppercase tracking-widest relative z-10">Select cropping or erasing logic</p>
            </div>

            <div className="space-y-4">
                {/* Crop Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 px-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Aspect Projection</Label>
                        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {aspects.map((a) => (
                            <Button
                                key={a.label}
                                variant="outline"
                                onClick={() => setAspect(a.ratio)}
                                className={cn(
                                    "h-10 flex flex-col items-center justify-center gap-0.5 transition-all rounded-lg border",
                                    aspect === a.ratio
                                        ? "bg-pink-100 dark:bg-pink-600/20 border-pink-500 text-pink-700 dark:text-pink-300 shadow-sm"
                                        : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10"
                                )}
                            >
                                <span className="text-[9px] font-black uppercase tracking-widest">{a.label}</span>
                                <span className={cn(
                                    "text-[8px] font-bold opacity-60",
                                    aspect === a.ratio ? "text-pink-600 dark:text-pink-200" : "text-slate-400 dark:text-slate-600"
                                )}>
                                    {a.ratio === 1 ? '1:1' :
                                        a.ratio === 4 / 3 ? '4:3' :
                                            a.ratio === 16 / 9 ? '16:9' :
                                                a.ratio === 9 / 16 ? '9:16' :
                                                    a.ratio === 3 / 2 ? '3:2' :
                                                        a.ratio === 2 / 3 ? '2:3' :
                                                            a.ratio === 5 / 4 ? '5:4' :
                                                                a.ratio === 4 / 5 ? '4:5' : 'Free'}
                                </span>
                            </Button>
                        ))}
                    </div>

                    <Button
                        className="w-full h-11 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg shadow-lg gap-2 group/crop relative overflow-hidden mt-1"
                        onClick={() => setShowCropper(true)}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/crop:translate-y-0 transition-transform duration-300 skew-y-12" />
                        <Crop className="w-4 h-4 group-hover/crop:scale-110 transition-transform relative z-10" />
                        <span className="relative z-10">Initiate Manual Crop</span>
                    </Button>
                </div>

                {/* Eraser Operations */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 px-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Content Erase</Label>
                        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        <div
                            onClick={() => setIsEraserActive(!isEraserActive)}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-lg border cursor-pointer group transition-all duration-300",
                                isEraserActive ? "bg-red-500/10 border-red-500/50" : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-all",
                                    isEraserActive ? "bg-red-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                                )}>
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className={cn("text-[10px] font-black uppercase tracking-wider transition-colors", isEraserActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>Contextual Eraser</h4>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Remove unwanted artifacts</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-8 h-4 rounded-full relative transition-colors duration-300",
                                isEraserActive ? "bg-red-500/50" : "bg-slate-200 dark:bg-slate-700"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
                                    isEraserActive
                                        ? "left-4 shadow-sm"
                                        : "left-0.5"
                                )} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
