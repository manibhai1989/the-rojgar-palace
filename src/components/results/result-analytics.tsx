"use client";

import * as React from "react";
import {
    TrendingUp,
    Target,
    Timer,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Brain,
    Scale,
    Trophy,
    Lightbulb,
    History
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    Cell,
    BarChart,
    Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const radarData = [
    { subject: 'Math', A: 90, fullMark: 100 },
    { subject: 'Reasoning', A: 85, fullMark: 100 },
    { subject: 'English', A: 70, fullMark: 100 },
    { subject: 'GK', A: 45, fullMark: 100 },
    { subject: 'Science', A: 60, fullMark: 100 },
];

const distributionData = [
    { score: 0, count: 50 },
    { score: 20, count: 200 },
    { score: 40, count: 800 },
    { score: 60, count: 1800 },
    { score: 80, count: 4200 },
    { score: 90, count: 2500 },
    { score: 100, count: 400 },
];

const timeData = [
    { name: 'Q1', time: 45, difficulty: 'Easy' },
    { name: 'Q2', time: 120, difficulty: 'Hard' },
    { name: 'Q3', time: 60, difficulty: 'Medium' },
    { name: 'Q4', time: 30, difficulty: 'Easy' },
    { name: 'Q5', time: 90, difficulty: 'Medium' },
];

export function ResultAnalytics() {
    return (
        <div className="space-y-8">
            {/* Top Analysis Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">Deep <span className="text-primary not-italic">Performance Insights</span></h2>
                    </div>
                    <p className="text-muted-foreground font-medium max-w-lg">
                        Visualizing your exam DNA: Where you excelled, where you struggled, and how you compared to the toppers.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                        <History className="mr-2 h-4 w-4" /> Compare vs 2023
                    </Button>
                    <Button className="h-11 bg-black text-white hover:bg-black/90 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                        AI Improvement Plan
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Score Distribution (Peer Comparison) */}
                <Card className="lg:col-span-8 border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black tracking-tighter">Score <span className="text-primary">Distribution</span></CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase">Percentage of candidates at each score point</CardDescription>
                            </div>
                            <div className="text-right">
                                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">Total: 45k+ Exams</Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={distributionData}>
                                <defs>
                                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="score" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 900, fontSize: '12px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#scoreColor)"
                                />
                                {/* Overlay user's score */}
                                <rect x="80%" y="0" width="2" height="100%" fill="hsl(var(--primary))" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. Sectional Strengths (Radar Chart) */}
                <Card className="lg:col-span-4 border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-black tracking-tighter">Skill <span className="text-primary">DNA</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase">Subject-wise balance analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] p-6 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 900, fill: '#6B7280' }} />
                                <Radar
                                    name="Your Performance"
                                    dataKey="A"
                                    stroke="hsl(var(--primary))"
                                    fill="hsl(var(--primary))"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 3. Detailed Insight Cards */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-xl bg-blue-50/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Timer className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-black uppercase italic">Time Efficiency</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-3xl font-black italic">42s</span>
                                    <span className="text-[9px] font-black text-green-600 uppercase">12% Faster than Avg</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                                    Highest efficiency in <strong>Reasoning</strong>. Consider spending 10 min more on <strong>GK</strong> to boost score.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-purple-50/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-black uppercase italic">Concept Mastery</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-3xl font-black italic">92%</span>
                                    <span className="text-[9px] font-black text-purple-600 uppercase italic">Algebra Master</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                                    Perfect score in <strong>Elementary Math</strong>. Weakness identified: <strong>Indian Geography</strong>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-orange-50/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Scale className="h-5 w-5" />
                                </div>
                                <h4 className="text-sm font-black uppercase italic">Attempt Strategy</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-3xl font-black italic">Aggressive</span>
                                    <Badge className="bg-orange-600 text-white border-none text-[8px] tracking-tighter">High Risk</Badge>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
                                    High attempt rate (92%). Reducing guesses could have pushed score up by <strong>4.2 marks</strong>.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-8 rounded-[2.5rem] bg-black text-white overflow-hidden relative group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <div className="flex items-center space-x-2">
                            <Lightbulb className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Smart Guidance</span>
                        </div>
                        <h4 className="text-2xl font-black italic tracking-tighter">Pathway to <span className="text-primary">Selection</span></h4>
                        <p className="text-sm font-medium text-white/70 leading-relaxed">
                            Based on your performance, you are already in the <strong>Top 1%</strong> for math.
                            We recommend focusing exclusively on <strong>General Awareness</strong> for the next 15 days
                            to ensure a confirmed selection in the next round.
                        </p>
                    </div>
                    <Button className="h-14 px-10 bg-primary hover:bg-primary/90 rounded-2xl font-black uppercase tracking-widest text-xs group/btn">
                        Get Full Roadmap <ArrowUpRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Button>
                </div>
                <div className="absolute bottom-0 right-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                    <Trophy className="h-64 w-64" />
                </div>
            </div>
        </div>
    );
}
