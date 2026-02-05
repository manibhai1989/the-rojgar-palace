
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Play, CheckCircle2, Globe, FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { scanAllSources } from "@/app/admin/automation/actions";
import { addSource, getSources, deleteSource } from "./source.actions";

export default function AutomationPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [foundJobs, setFoundJobs] = useState<any[]>([]);
    const [lastScan, setLastScan] = useState<string | null>(null);

    // Source State
    const [sources, setSources] = useState<any[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newSource, setNewSource] = useState({ name: "", url: "", selector: "a" });

    useEffect(() => {
        loadSources();
    }, []);

    const loadSources = async () => {
        const res = await getSources();
        if (res.success) setSources(res.data || []);
    };

    const handleAddSource = async () => {
        if (!newSource.name || !newSource.url) return toast.error("Name and URL are required");

        const res = await addSource(newSource);
        if (res.success) {
            toast.success("Source Added!");
            setSources([res.data, ...sources]); // Optimistic update
            setIsAddOpen(false);
            setNewSource({ name: "", url: "", selector: "a" });
        } else {
            toast.error(res.error);
        }
    };

    const handleDeleteSource = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Remove this website?")) return;
        const res = await deleteSource(id);
        if (res.success) {
            setSources(sources.filter(s => s.id !== id));
            toast.success("Source removed");
        }
    };

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
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Universal Source Monitor
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Automated web crawler for Government & Private job portals.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-slate-900/50 border-white/5 md:col-span-2">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg">Active Sources</CardTitle>
                                <CardDescription>Websites currently being watched.</CardDescription>
                            </div>

                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 gap-2">
                                        <Plus className="w-4 h-4" /> Add Website
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-white/10 text-slate-100">
                                    <DialogHeader>
                                        <DialogTitle>Add New Source</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Website Name</Label>
                                            <Input
                                                placeholder="e.g. UPSC Official"
                                                className="bg-black/20 border-white/10"
                                                value={newSource.name}
                                                onChange={e => setNewSource({ ...newSource, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Website URL</Label>
                                            <Input
                                                placeholder="https://upsc.gov.in/notices"
                                                className="bg-black/20 border-white/10"
                                                value={newSource.url}
                                                onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Link Selector (CSS)</Label>
                                            <Input
                                                placeholder="e.g. .news-list a"
                                                className="bg-black/20 border-white/10"
                                                value={newSource.selector}
                                                onChange={e => setNewSource({ ...newSource, selector: e.target.value })}
                                            />
                                            <p className="text-xs text-slate-500">
                                                Right click the link on the site {">"} Inspect {">"} Copy Selector
                                            </p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                        <Button onClick={handleAddSource} className="bg-blue-600 hover:bg-blue-700">Save Source</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
                        {sources.length === 0 ? (
                            <div className="col-span-2 text-center py-8 text-slate-500 border border-dashed border-white/5 rounded-xl">
                                No websites added yet. Add one to start crawling.
                            </div>
                        ) : (
                            sources.map((source) => (
                                <div key={source.id} className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 group relative">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden shrink-0 text-slate-500">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-sm truncate text-slate-200">{source.name}</h4>
                                        <a href={source.url} target="_blank" className="text-xs text-blue-400 hover:underline truncate block">
                                            {source.url}
                                        </a>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-600 hover:text-red-400 hover:bg-red-900/10 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => handleDeleteSource(source.id, e)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
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
