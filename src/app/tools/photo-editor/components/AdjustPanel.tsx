"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Sliders, RefreshCcw, Maximize, Layers
} from "lucide-react";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import { cn } from "@/lib/utils";

export function AdjustPanel({
    filters: externalFilters,
    updateFilter: externalUpdateFilter,
    transforms: externalTransforms,
    updateTransform: externalUpdateTransform,
    resetFilters: externalResetFilters
}: any = {}) {
    const context = usePhotoEditor() as any;

    const filters = externalFilters || context.filters;
    const updateFilter = externalUpdateFilter || context.updateFilter;
    const transforms = externalTransforms || context.transforms;
    const updateTransform = externalUpdateTransform || context.updateTransform;
    const resetFilters = externalResetFilters || context.resetFilters;

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <Sliders className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 relative z-10">Image Enhancer</h2>
                <p className="text-[10px] text-cyan-600 dark:text-cyan-200 font-bold uppercase tracking-widest relative z-10">Neural filter orchestration</p>
            </div>

            <div className="space-y-4">
                {/* Visual Filters */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Visual Filters</Label>
                        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="space-y-3 px-1">
                        {[
                            { name: "Brightness", key: "brightness", min: 50, max: 150 },
                            { name: "Contrast", key: "contrast", min: 50, max: 150 },
                            { name: "Saturation", key: "saturation", min: 0, max: 200 },
                            { name: "Blur", key: "blur", min: 0, max: 10 }
                        ].map((f) => (
                            <div key={f.key} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5">
                                        <Layers className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                                        <Label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{f.name}</Label>
                                    </div>
                                    <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm">
                                        {filters[f.key as keyof typeof filters]}
                                        {f.key === 'blur' ? 'px' : '%'}
                                    </span>
                                </div>
                                <div className="px-0.5">
                                    <Slider
                                        value={[filters[f.key as keyof typeof filters]]}
                                        min={f.min}
                                        max={f.max}
                                        step={1}
                                        onValueChange={([val]) => updateFilter(f.key as any, val)}
                                        className="py-1.5"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Geometry & Orientation */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 px-1">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Orientation</Label>
                        <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 px-1">
                        <Button
                            variant="outline"
                            onClick={() => updateTransform('flipH', transforms.flipH === 1 ? -1 : 1)}
                            className={cn(
                                "h-9 font-bold transition-all rounded-lg gap-2 text-[10px] uppercase tracking-wider",
                                transforms.flipH === -1
                                    ? "bg-cyan-100 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 border-cyan-500 shadow-sm hover:bg-cyan-200 dark:hover:bg-cyan-600/30"
                                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Maximize className="w-3.5 h-3.5" /> Flip Horiz
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => updateTransform('flipV', transforms.flipV === 1 ? -1 : 1)}
                            className={cn(
                                "h-9 font-bold transition-all rounded-lg gap-2 text-[10px] uppercase tracking-wider",
                                transforms.flipV === -1
                                    ? "bg-cyan-100 dark:bg-cyan-600/20 text-cyan-700 dark:text-cyan-300 border-cyan-500 shadow-sm hover:bg-cyan-200 dark:hover:bg-cyan-600/30"
                                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Maximize className="w-3.5 h-3.5 rotate-90" /> Flip Vert
                        </Button>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50">
                <Button
                    variant="ghost"
                    className="w-full h-9 text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all gap-2"
                    onClick={resetFilters}
                >
                    <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    Reset Adjustments
                </Button>
            </div>
        </div>
    );
}
