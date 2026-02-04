"use client";

import React from "react";
import { usePhotoEditor } from "../context/PhotoEditorContext";
import {
    UserSquare2, ShieldCheck, LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function IDMakerPanel({
    idData: externalIdData,
    setIdData: externalSetIdData
}: any = {}) {
    const context = usePhotoEditor() as any;

    const idData = externalIdData || context.idData;
    const setIdData = externalSetIdData || context.setIdData;

    const updateData = (key: string, val: any) => {
        setIdData((prev: any) => ({ ...prev, [key]: val }));
    };

    return (
        <div className="space-y-4 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20">
                <div className="absolute top-0 right-0 p-3 opacity-20">
                    <UserSquare2 className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 relative z-10">Identity Overlay</h2>
                <p className="text-[10px] text-purple-600 dark:text-purple-200 font-bold uppercase tracking-widest relative z-10">Biometric data synthesis</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Student Name</Label>
                    <div className="group relative">
                        <Input
                            value={idData.studentName}
                            onChange={(e) => updateData('studentName', e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="h-10 bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 focus:border-purple-500 text-slate-900 dark:text-white font-bold rounded-lg transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs"
                        />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-slate-200 dark:ring-white/5 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Date of Birth</Label>
                    <div className="group relative">
                        <Input
                            value={idData.studentDOB}
                            onChange={(e) => updateData('studentDOB', e.target.value)}
                            placeholder="DD-MM-YYYY"
                            className="h-10 bg-white dark:bg-black/20 border-slate-200 dark:border-slate-700 focus:border-purple-500 text-slate-900 dark:text-white font-bold rounded-lg transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-xs"
                        />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-slate-200 dark:ring-white/5 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Timestamp Format</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"].map((format) => (
                            <button
                                key={format}
                                onClick={() => updateData('dateFormat', format)}
                                className={cn(
                                    "text-[9px] h-8 px-1 font-bold tracking-widest uppercase rounded-lg border transition-all duration-300 relative overflow-hidden group",
                                    idData.dateFormat === format
                                        ? "bg-purple-100 dark:bg-purple-600/20 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm"
                                        : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10"
                                )}
                            >
                                <span className="relative z-10">{format}</span>
                                {idData.dateFormat === format && <div className="absolute inset-0 bg-purple-500/10 blur-sm" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2 grid grid-cols-1 gap-2">
                    {[
                        { label: "Display Name Overlay", key: "showName", icon: UserSquare2, color: "blue" },
                        { label: "Display DOB Layer", key: "showDOB", icon: ShieldCheck, color: "pink" }
                    ].map((item) => (
                        <div
                            key={item.key}
                            onClick={() => updateData(item.key, !idData[item.key as keyof typeof idData])}
                            className={cn(
                                "flex items-center justify-between p-2 rounded-lg border cursor-pointer group transition-all duration-300",
                                idData[item.key as keyof typeof idData]
                                    ? `bg-${item.color}-500/10 border-${item.color}-500/50`
                                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-md flex items-center justify-center transition-all",
                                    idData[item.key as keyof typeof idData] ? `bg-${item.color}-500 text-white shadow-lg` : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                                )}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className={cn("text-[10px] font-black uppercase tracking-wider transition-colors", idData[item.key as keyof typeof idData] ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>{item.label}</h4>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">Toggle visibility</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-8 h-4 rounded-full relative transition-colors duration-300",
                                idData[item.key as keyof typeof idData] ? `bg-${item.color}-500/50` : "bg-slate-200 dark:bg-slate-700"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300",
                                    idData[item.key as keyof typeof idData]
                                        ? `left-4 shadow-sm`
                                        : "left-0.5"
                                )} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <Button
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-lg shadow-lg gap-2 group/apply relative overflow-hidden"
                    onClick={() => updateData('showContrastFrame', !idData.showContrastFrame)}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/apply:translate-y-0 transition-transform duration-300 skew-y-12" />
                    <LayoutGrid className="w-4 h-4 relative z-10 group-hover/apply:rotate-90 transition-transform duration-500" />
                    <span className="relative z-10">Apply ID Synthesis</span>
                </Button>
            </div>
        </div>
    );
}
