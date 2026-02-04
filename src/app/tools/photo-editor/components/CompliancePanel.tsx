"use client";

import React, { useState, useEffect } from "react";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import {
    ShieldCheck, Sliders, RefreshCcw, Settings, Info, CheckCircle2, AlertCircle, FileType
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CompliancePanel({
    complianceData: externalComplianceData,
    setComplianceData: externalSetComplianceData,
    handleProcess: externalHandleProcess,
    resetToDefaults: externalResetToDefaults
}: any) {
    const context = usePhotoEditor() as any;

    // Support both prop-based and context-based usage
    const complianceData = externalComplianceData || context.complianceData;
    const setComplianceData = externalSetComplianceData || context.setComplianceData;
    const handleProcess = externalHandleProcess || context.handleProcess;
    const resetToDefaults = externalResetToDefaults || context.resetToDefaults;

    const updateCompliance = (field: string, value: any) => {
        setComplianceData((prev: any) => {
            const newCompliance = { ...prev, [field]: value };
            if (field === 'width' || field === 'height') {
                const width = field === 'width' ? parseInt(value) : newCompliance.width;
                const height = field === 'height' ? parseInt(value) : newCompliance.height;
                if (width && height) {
                    newCompliance.aspectRatio = (width / height).toFixed(2);
                }
            }
            return newCompliance;
        });
    };

    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-blue-500/10">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Sliders className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-0.5 relative z-10">Resize Settings</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium relative z-10">Set your required dimensions and file size.</p>
            </div>

            <div className="space-y-4">

                {/* Document Type */}
                <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Document Type</Label>
                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-white/5">
                        {["Photograph", "Signature"].map((type) => {
                            const isActive = complianceData.fileType === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => updateCompliance('fileType', type)}
                                    className={cn(
                                        "flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-2",
                                        isActive
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5"
                                    )}
                                >
                                    {type === "Photograph" ? <FileType className="w-3 h-3" /> : <Settings className="w-3 h-3" />}
                                    {type}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Inputs: Dimensions & Size */}
                <div className="space-y-4">
                    {/* Width & Height */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Target Dimensions (px)</Label>
                            {complianceData.width && complianceData.height && (
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-white/5">
                                    Ratio: {(complianceData.width / complianceData.height).toFixed(2)}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Width</span>
                                <Input
                                    type="number"
                                    value={complianceData.width}
                                    onChange={(e) => updateCompliance('width', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Height</span>
                                <Input
                                    type="number"
                                    value={complianceData.height}
                                    onChange={(e) => updateCompliance('height', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* File Size */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">File Size Limit (KB)</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Minimum</span>
                                <Input
                                    type="number"
                                    value={complianceData.minSize}
                                    onChange={(e) => updateCompliance('minSize', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Maximum</span>
                                <Input
                                    type="number"
                                    value={complianceData.maxSize}
                                    onChange={(e) => updateCompliance('maxSize', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/5">
                    {/* DPI Limits */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">DPI Requirements</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Min DPI</span>
                                <Input
                                    type="number"
                                    value={complianceData.minDPI}
                                    onChange={(e) => updateCompliance('minDPI', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] text-slate-500 ml-1">Max DPI</span>
                                <Input
                                    type="number"
                                    value={complianceData.maxDPI}
                                    onChange={(e) => updateCompliance('maxDPI', e.target.value)}
                                    className="h-9 bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 focus:border-blue-500 text-slate-900 dark:text-white text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-2">
                        {[
                            { key: 'strictMode', label: "Strict Mode", desc: "Fail if exact size isn't met" },
                            { key: 'autoOptimize', label: "Auto Optimize", desc: "Fix size automatically" },
                            { key: 'faceDetection', label: "Face Focus", desc: "Center face in frame" }
                        ].map((opt) => (
                            <div
                                key={opt.label}
                                onClick={() => updateCompliance(opt.key, !complianceData[opt.key])}
                                className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                            >
                                <div>
                                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{opt.label}</div>
                                    <div className="text-[9px] text-slate-500 font-medium">{opt.desc}</div>
                                </div>
                                <div className={cn(
                                    "w-8 h-4 rounded-full relative transition-colors",
                                    complianceData[opt.key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform",
                                        complianceData[opt.key] ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Validation Results Display */}
                {context.validationResults && context.validationResults.length > 0 && (
                    <div className="bg-slate-100 dark:bg-slate-950/50 rounded-lg p-2.5 border border-slate-200 dark:border-slate-800/50 space-y-1.5">
                        {context.validationResults.map((res: any, idx: number) => (
                            <div key={idx} className={cn(
                                "flex items-start gap-1.5 text-[10px] font-medium",
                                res.status === 'pass' ? "text-emerald-600 dark:text-emerald-400" :
                                    res.status === 'fail' ? "text-rose-600 dark:text-rose-400" :
                                        "text-amber-600 dark:text-amber-400"
                            )}>
                                {res.status === 'pass' ? <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" /> : <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />}
                                <span className="leading-tight">{res.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Action Button */}
                <div className="pt-1">
                    <Button
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg shadow-lg gap-2 group/apply relative overflow-hidden"
                        onClick={handleProcess}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/apply:translate-y-0 transition-transform duration-300 skew-y-12" />
                        <Sliders className="w-4 h-4 relative z-10 group-hover/apply:rotate-180 transition-transform duration-700" />
                        <span className="relative z-10">Process Image</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Helper icon component
function Maximize({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
    )
}

