import React from "react";
import { useResume } from "../context/ResumeContext";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function AnalysisPanel() {
    const { suggestions, atsScore } = useResume();

    if (suggestions.length === 0 && atsScore > 0) {
        return (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-emerald-400">Perfectly Optimized!</h4>
                    <p className="text-xs text-emerald-300/70 mt-1">Your resume is following all ATS best practices.</p>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" /> AI Suggestions ({suggestions.length})
            </div>
            <div className="grid gap-2">
                {suggestions.map((sug, i) => (
                    <div key={i} className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-200/90 leading-relaxed flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                        {sug}
                    </div>
                ))}
            </div>
        </div>
    );
}
