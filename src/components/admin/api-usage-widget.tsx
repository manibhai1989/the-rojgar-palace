"use client";

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, CheckCircle, Zap, GripHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const AI_PROVIDER = process.env.NEXT_PUBLIC_AI_PROVIDER || "gemini";

// Limits based on Provider (Free Tiers)
// Groq: 30 RPM, 14,400 RPD
// Gemini: 15 RPM, 1,500 RPD
const LIST_RPM_LIMIT = AI_PROVIDER === "groq" ? 30 : 15;
const LIST_RPD_LIMIT = AI_PROVIDER === "groq" ? 14400 : 1500;

export function ApiUsageWidget({ incrementTrigger }: { incrementTrigger: number }) {
    const [stats, setStats] = useState({
        requestsInLastMinute: 0,
        requestsToday: 0,
        lastReset: Date.now()
    });

    // Effect to handle incrementTrigger updates
    useEffect(() => {
        if (incrementTrigger === 0) return;

        setStats(prev => {
            const now = Date.now();
            const storedToday = parseInt(sessionStorage.getItem("api_req_today") || "0") + 1;
            sessionStorage.setItem("api_req_today", storedToday.toString());

            const timestamps = JSON.parse(sessionStorage.getItem("api_req_timestamps") || "[]");
            timestamps.push(now);
            sessionStorage.setItem("api_req_timestamps", JSON.stringify(timestamps));

            return {
                ...prev,
                requestsToday: storedToday,
                requestsInLastMinute: prev.requestsInLastMinute + 1
            };
        });
    }, [incrementTrigger]);

    // Timer to clean up old timestamps
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const timestamps = JSON.parse(sessionStorage.getItem("api_req_timestamps") || "[]");
            const recent = timestamps.filter((t: number) => now - t < 60000);

            if (recent.length !== timestamps.length) {
                sessionStorage.setItem("api_req_timestamps", JSON.stringify(recent));
            }

            const todayCount = parseInt(sessionStorage.getItem("api_req_today") || "0");

            setStats(prev => ({
                ...prev,
                requestsInLastMinute: recent.length,
                requestsToday: todayCount
            }));

        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const rpmPercent = (stats.requestsInLastMinute / LIST_RPM_LIMIT) * 100;
    const isOverload = stats.requestsInLastMinute >= LIST_RPM_LIMIT;
    const isWarning = stats.requestsInLastMinute >= LIST_RPM_LIMIT * 0.8;

    return (
        <motion.div
            drag
            dragMomentum={false}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98, cursor: "grabbing" }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-[9999] p-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl w-80 cursor-grab active:cursor-grabbing"
        >
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                    <GripHorizontal className="w-4 h-4 text-slate-600" />
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-sm text-slate-200 select-none">
                        API Health ({AI_PROVIDER === 'groq' ? 'Groq' : 'Gemini'})
                    </h3>
                </div>
                <div className={cn(
                    "text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 select-none",
                    isOverload ? "bg-red-500/20 text-red-400" :
                        isWarning ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-emerald-500/20 text-emerald-400"
                )}>
                    {isOverload ? <AlertTriangle className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                    {isOverload ? "LIMIT HIT" : isWarning ? "SLOW DOWN" : "HEALTHY"}
                </div>
            </div>

            <div className="space-y-4 select-none">
                {/* RPM METER */}
                <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Rate (1 min)</span>
                        <span className={isWarning ? "text-yellow-400" : "text-white"}>{stats.requestsInLastMinute} / {LIST_RPM_LIMIT} reqs</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                            className={cn("h-full transition-all duration-500",
                                isOverload ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-blue-500"
                            )}
                            style={{ width: `${Math.min(rpmPercent, 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 text-right">Resets automatically in rolling 60s window</p>
                </div>

                {/* DAILY TRACKER */}
                <div className="pt-2 border-t border-white/5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Daily Usage Est.</span>
                        <span className="text-xs font-mono text-slate-200">{stats.requestsToday} / {LIST_RPD_LIMIT}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
