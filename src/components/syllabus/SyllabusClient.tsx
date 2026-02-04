"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, BookOpen, ExternalLink, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { searchSyllabus } from "@/app/syllabus/actions";

interface SyllabusClientProps {
    initialSyllabus: any[];
}

export default function SyllabusClient({ initialSyllabus }: SyllabusClientProps) {
    const [syllabus, setSyllabus] = useState(initialSyllabus);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSearch = async (query: string) => {
        startTransition(async () => {
            const res = await searchSyllabus(query);
            if (res.success) {
                setSyllabus(res.syllabus || []);
            }
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="space-y-12">
            <div className="sticky top-20 z-30 p-2 bg-slate-950/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                        placeholder="Search for exam syllabus by name or organization..."
                        className="w-full bg-transparent border-none h-14 pl-12 focus-visible:ring-0 text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isPending && syllabus.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                        <p>Searching for syllabus...</p>
                    </div>
                ) : syllabus.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {syllabus.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                layout
                            >
                                <Card className="group bg-slate-900/40 border-white/5 hover:border-blue-500/30 backdrop-blur-md transition-all h-full flex flex-col overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">SYLLABUS</span>
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium">{item.organization}</p>
                                    </CardHeader>

                                    <CardContent className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Updated: {format(new Date(item.createdAt), "dd MMM yyyy")}</span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="bg-blue-500/5 border-t border-white/5 p-4">
                                        <Button
                                            asChild
                                            className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 font-bold transition-all"
                                        >
                                            <a href={item.link} target="_blank">
                                                View Syllabus PDF
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full py-40 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border border-white/10 mb-6">
                            <Search className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No syllabus found</h3>
                        <p className="text-slate-500">Try searching for a different keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
