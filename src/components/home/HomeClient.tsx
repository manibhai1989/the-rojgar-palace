"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Typewriter from 'typewriter-effect';
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Search, Settings, FileCheck, IdCard, Briefcase, Key, BookOpen, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { AnimatedBackground } from "@/components/ui/animated-background";

interface HomeClientProps {
    latestJobs: any[];
    latestResults: any[];
    latestAdmitCards: any[];
    latestAnswerKeys: any[];
    latestSyllabus: any[];
    latestAdmissions: any[];
}

export default function HomeClient({
    latestJobs,
    latestResults,
    latestAdmitCards,
    latestAnswerKeys,
    latestSyllabus,
    latestAdmissions
}: HomeClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const sections = [
        {
            title: "Latest Results",
            desc: "Access official results instantly.",
            icon: FileCheck,
            color: "emerald",
            items: latestResults.map(res => ({
                title: res.title,
                slug: res.link,
                date: res.createdAt
            }))
        },
        {
            title: "Admit Cards",
            desc: "Download your exam hall tickets.",
            icon: IdCard,
            color: "orange",
            items: latestAdmitCards.map(card => ({
                title: card.title,
                slug: card.link,
                date: card.createdAt
            }))
        },
        {
            title: "Latest Jobs",
            desc: "Explore thousands of job openings.",
            icon: Briefcase,
            color: "blue",
            items: latestJobs.map(job => ({
                title: job.title,
                slug: `/jobs/${job.slug}`,
                date: job.createdAt
            }))
        },
        {
            title: "Answer Keys",
            desc: "Check official exam answer keys.",
            icon: Key,
            color: "purple",
            items: latestAnswerKeys.map(item => ({
                title: item.title,
                slug: item.link,
                date: item.createdAt
            }))
        },
        {
            title: "Syllabus",
            desc: "Download exam syllabus & patterns.",
            icon: BookOpen,
            color: "pink",
            items: latestSyllabus.map(item => ({
                title: item.title,
                slug: item.link,
                date: item.createdAt
            }))
        },
        {
            title: "Admissions",
            desc: "Apply for university & college entries.",
            icon: GraduationCap,
            color: "cyan",
            items: latestAdmissions.map(item => ({
                title: item.title,
                slug: item.link,
                date: item.createdAt
            }))
        }
    ];

    return (
        <div className="flex flex-col gap-12 pb-20 relative">
            {/* Global Background Animation */}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 transition-colors duration-300">
                <AnimatedBackground className="absolute inset-0" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-1.5 text-sm font-medium mb-12 shadow-sm"
                    >
                        <TrendingUp className="mr-2 h-4 w-4 text-orange-500 dark:text-orange-400" />
                        <span className="text-slate-700 dark:text-slate-200">Latest: {latestJobs[0]?.title || "New Job Notifications Out!"}</span>
                        <ArrowRight className="ml-2 h-4 w-4 text-slate-400 dark:text-slate-400" />
                    </motion.div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 flex flex-col items-center text-slate-900 dark:text-white">
                        <span className="mb-2 md:mb-4">
                            Welcome to <span className="text-amber-600 dark:text-amber-400">The Rojgar Palace</span>
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 h-[1.2em] block" suppressHydrationWarning>
                            <Typewriter
                                options={{
                                    strings: ['Government Success', 'Dream Job', 'Secure Future'],
                                    autoStart: true,
                                    loop: true,
                                    deleteSpeed: 50,
                                    delay: 75,
                                }}
                            />
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                        Real-time updates for latest jobs, admit cards, results, and syllabus.
                        Trusted by millions of aspirants across India.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/jobs">
                            <Button size="lg" className="rounded-full px-8 h-12 text-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                                Browse Latest Jobs
                            </Button>
                        </Link>
                        <Link href="/tools">
                            <Button size="lg" className="rounded-full px-8 h-12 text-md bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                <Settings className="mr-2 h-4 w-4" />
                                Essential Tools
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Search */}
            <section className="container mx-auto px-4 -mt-12 md:-mt-16 z-10 flex justify-center">
                <Card className="w-full max-w-4xl transition-all duration-300 backdrop-blur-xl border bg-white/80 border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.1)] dark:bg-slate-900/80 dark:border-white/10 dark:shadow-2xl dark:hover:border-blue-500/30">
                    <CardContent className="p-4 md:p-6">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search jobs, results, admit cards..."
                                    className="w-full h-12 pl-10 pr-4 py-3 rounded-lg outline-none transition-all bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-900 placeholder:text-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                                    suppressHydrationWarning
                                    aria-label="Search jobs"
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-12 md:w-32 bg-blue-600 hover:bg-blue-700 w-full md:w-auto text-white">Search</Button>
                        </form>
                    </CardContent>
                </Card>
            </section>

            {/* Main Grid */}
            <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sections.map((feat, index) => (
                    <motion.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group h-full"
                    >
                        <Card className={cn(
                            "relative h-full overflow-hidden transition-all duration-300 border",
                            // Light Mode Styles
                            "bg-white border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1",
                            feat.color === "emerald" && "hover:border-emerald-200 hover:shadow-emerald-500/10",
                            feat.color === "orange" && "hover:border-orange-200 hover:shadow-orange-500/10",
                            feat.color === "blue" && "hover:border-blue-200 hover:shadow-blue-500/10",
                            feat.color === "purple" && "hover:border-purple-200 hover:shadow-purple-500/10",
                            feat.color === "pink" && "hover:border-pink-200 hover:shadow-pink-500/10",
                            feat.color === "cyan" && "hover:border-cyan-200 hover:shadow-cyan-500/10",

                            // Dark Mode Styles
                            "dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/10 dark:shadow-none dark:hover:border-white/20",
                            feat.color === "emerald" && "dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
                            feat.color === "orange" && "dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]",
                            feat.color === "blue" && "dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
                            feat.color === "purple" && "dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
                            feat.color === "pink" && "dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]",
                            feat.color === "cyan" && "dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                        )}>
                            {/* Top Accent Line */}
                            <div className={cn(
                                "absolute top-0 left-0 w-full h-1",
                                feat.color === "emerald" && "bg-emerald-500 dark:bg-emerald-500",
                                feat.color === "orange" && "bg-orange-500 dark:bg-orange-500",
                                feat.color === "blue" && "bg-blue-500 dark:bg-blue-500",
                                feat.color === "purple" && "bg-purple-500 dark:bg-purple-500",
                                feat.color === "pink" && "bg-pink-500 dark:bg-pink-500",
                                feat.color === "cyan" && "bg-cyan-500 dark:bg-cyan-500"
                            )} />

                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        "bg-slate-50 dark:bg-white/5",
                                        feat.color === "emerald" && "text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10",
                                        feat.color === "orange" && "text-orange-600 dark:text-orange-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10",
                                        feat.color === "blue" && "text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10",
                                        feat.color === "purple" && "text-purple-600 dark:text-purple-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10",
                                        feat.color === "pink" && "text-pink-600 dark:text-pink-400 group-hover:bg-pink-50 dark:group-hover:bg-pink-500/10",
                                        feat.color === "cyan" && "text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10"
                                    )}>
                                        <feat.icon className="h-6 w-6" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                                </div>

                                <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                                    {feat.title}
                                </CardTitle>
                                <CardDescription className="text-slate-500 dark:text-slate-400">
                                    {feat.desc}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="min-h-[200px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    <ul className="space-y-1">
                                        {feat.items.length > 0 ? (
                                            feat.items.slice(0, 8).map((item, i) => (
                                                <li key={i}>
                                                    <Link
                                                        href={item.slug}
                                                        className={cn(
                                                            "flex items-center py-2.5 px-3 rounded-md transition-all group/item",
                                                            "hover:bg-slate-50 dark:hover:bg-white/5",
                                                            feat.color === "emerald" && "hover:text-emerald-700 dark:hover:text-emerald-400",
                                                            feat.color === "orange" && "hover:text-orange-700 dark:hover:text-orange-400",
                                                            feat.color === "blue" && "hover:text-blue-700 dark:hover:text-blue-400",
                                                            feat.color === "purple" && "hover:text-purple-700 dark:hover:text-purple-400",
                                                            feat.color === "pink" && "hover:text-pink-700 dark:hover:text-pink-400",
                                                            feat.color === "cyan" && "hover:text-cyan-700 dark:hover:text-cyan-400"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0",
                                                            "bg-slate-300 dark:bg-slate-600",
                                                            feat.color === "emerald" && "group-hover/item:bg-emerald-500",
                                                            feat.color === "orange" && "group-hover/item:bg-orange-500",
                                                            feat.color === "blue" && "group-hover/item:bg-blue-500",
                                                            feat.color === "purple" && "group-hover/item:bg-purple-500",
                                                            feat.color === "pink" && "group-hover/item:bg-pink-500",
                                                            feat.color === "cyan" && "group-hover/item:bg-cyan-500"
                                                        )} />
                                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover/item:text-inherit line-clamp-1 flex-1">
                                                            {item.title}
                                                        </span>
                                                        {item.date && (
                                                            <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0">
                                                                {format(new Date(item.date), "dd MMM")}
                                                            </span>
                                                        )}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="py-8 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3">
                                                    <Search className="h-5 w-5 opacity-50" />
                                                </div>
                                                <span className="text-sm">No updates yet</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                                    <Button variant="ghost" size="sm" className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs group/btn">
                                        View All {feat.title}
                                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
