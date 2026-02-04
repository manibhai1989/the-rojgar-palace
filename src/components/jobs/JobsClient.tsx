"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, Filter, Briefcase, Calendar, MapPin, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { searchJobs } from "@/app/jobs/actions";

interface JobsClientProps {
    initialJobs: any[];
}

const CATEGORIES = ["All", "Latest Jobs", "Bank", "SSC", "Railway", "UPSC", "State Govt", "Police", "Teacher", "Others"];

export default function JobsClient({ initialJobs }: JobsClientProps) {
    const [jobs, setJobs] = useState(initialJobs);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isPending, startTransition] = useTransition();

    const handleSearch = async (query: string, category: string) => {
        startTransition(async () => {
            const res = await searchJobs(query, category);
            if (res.success) {
                setJobs(res.jobs || []);
            }
        });
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery, selectedCategory);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="space-y-12">
            {/* Search and Filters Bar */}
            <div className="sticky top-20 z-30 p-2 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <Input
                        placeholder="Search by job title, organization or department..."
                        className="w-full bg-slate-50 dark:bg-white/5 border-none h-14 pl-12 focus-visible:ring-1 focus-visible:ring-blue-500/50 text-base text-slate-900 dark:text-white placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center px-2">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "primary" : "ghost"}
                            className={`rounded-full whitespace-nowrap px-6 h-10 ${selectedCategory === cat
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isPending && jobs.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-50">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                        <p className="text-slate-600 dark:text-slate-400">Searching for opportunities...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        {jobs.map((job, idx) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                layout
                            >
                                <Card className="group bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-none backdrop-blur-md transition-all h-full flex flex-col overflow-hidden relative">
                                    {/* Accent line */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                                                {job.category}
                                            </Badge>
                                            {job.isNew && (
                                                <Badge className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]">NEW</Badge>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{job.organization}</p>
                                    </CardHeader>

                                    <CardContent className="flex-1 space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Briefcase className="w-3.5 h-3.5" />
                                                <span>{job.vacanciesCount} Vacancies</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{job.location || "Multiple"}</span>
                                            </div>
                                        </div>

                                        {job.shortInfo && (
                                            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed italic">
                                                "{job.shortInfo}"
                                            </p>
                                        )}
                                    </CardContent>

                                    <CardFooter className="bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 py-4 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-tight">Last Date</span>
                                            <span className="text-sm font-semibold text-rose-500 dark:text-rose-400">
                                                {format(new Date(job.endDate), "dd MMM yyyy")}
                                            </span>
                                        </div>
                                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-blue-500/20">
                                            <Link href={`/jobs/${job.slug}`}>
                                                Details
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                ) : (
                    <div className="col-span-full py-40 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 mb-6">
                            <Search className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">No matching jobs found</h3>
                        <p className="text-slate-500">Try adjusting your search or category filters.</p>
                        <Button
                            variant="link"
                            className="text-blue-500 dark:text-blue-400 mt-4"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
