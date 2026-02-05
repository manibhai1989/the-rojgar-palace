
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, CheckCircle2, Globe, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SOURCES } from "@/lib/automation/registry";
import { scanAllSources } from "./actions"; // We need to create this action

export default function AutomationPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [foundJobs, setFoundJobs] = useState<any[]>([]);
    const [lastScan, setLastScan] = useState<string | null>(null);

    const handleScan = async () => {
        setIsScanning(true);
        const loadingToast = toast.loading("Scanning government portals...");

        try {
            const result = await scanAllSources();
            if (result.success) {
                setFoundJobs(result.data || []);
                setLastScan(new Date().toLocaleTimeString());
                toast.success(`Scan Complete! Found ${result.data?.length} potential jobs.`, { id: loadingToast });
            } else {
                toast.error("Scan Failed: " + result.error, { id: loadingToast });
            }
        } catch (error) {
            toast.error("Something went wrong", { id: loadingToast });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-slate-950 text-slate-100">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Universal Source Monitor
                </h1>
                <p className="text-slate-400 mt-2">
                    Automated web crawler for Government & Private job portals.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-900/50 border-white/5 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Active Sources</span>
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/20">{SOURCES.length} Monitored</Badge>
                        </CardTitle>
                        <CardDescription>Websites currently being watched for new PDFs.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SOURCES.map((source) => (
                            <div key={source.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                    {source.logo ? (
                                        <img src={source.logo} alt={source.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Globe className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-sm truncate">{source.name}</h4>
                                    <a href={source.url} target="_blank" className="text-xs text-blue-400 hover:underline truncate block">
                                        {source.url}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/5">
                    <CardHeader>
                        <CardTitle>Control Center</CardTitle>
                        <CardDescription>Trigger manual scans or config.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                            onClick={handleScan}
                            disabled={isScanning}
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning...
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5 mr-2 fill-current" /> Run Scan Now
                                </>
                            )}
                        </Button>
                        {lastScan && (
                            <p className="text-xs text-center text-slate-500">
                                Last checked at {lastScan}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* RESULTS SECTION */}
            {foundJobs.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-semibold text-emerald-400 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        New Findings
                    </h2>
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
                        {foundJobs.map((job, idx) => (
                            <div key={idx} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex justify-between items-center group">
                                <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-slate-500 mt-1" />
                                    <div>
                                        <h4 className="font-medium text-slate-200 group-hover:text-blue-300 transition-colors">
                                            {job.title}
                                        </h4>
                                        <p className="text-xs text-slate-500">{job.link}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="border-white/10 text-xs h-8" asChild>
                                        <a href={job.link} target="_blank">View PDF</a>
                                    </Button>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
                                        Import to Draft
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
