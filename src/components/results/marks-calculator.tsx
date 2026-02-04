"use client";

import * as React from "react";
import {
    FileCheck,
    Calculator,
    AlertCircle,
    CheckCircle2,
    XCircle,
    HelpCircle,
    TrendingUp,
    Download,
    Share2,
    MessageSquareWarning,
    History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";

const mockQuestions = [
    { id: 1, text: "What is the capital of France?", official: "B", candidate: "B", status: "Correct", marks: 1.0 },
    { id: 2, text: "Speed of light is?", official: "A", candidate: "C", status: "Incorrect", marks: -0.25 },
    { id: 3, text: "Largest ocean on Earth?", official: "D", candidate: "D", status: "Correct", marks: 1.0 },
    { id: 4, text: "Value of Pi up to 2 decimal places?", official: "B", candidate: null, status: "Unattempted", marks: 0 },
    { id: 5, text: "Chemical symbol for Gold?", official: "C", candidate: "C", status: "Correct", marks: 1.0 },
];

export function MarksCalculator() {
    const [viewMode, setViewMode] = React.useState<"summary" | "detailed">("detailed");

    const totalQuestions = mockQuestions.length;
    const attempted = mockQuestions.filter(q => q.candidate !== null).length;
    const correct = mockQuestions.filter(q => q.status === "Correct").length;
    const incorrect = mockQuestions.filter(q => q.status === "Incorrect").length;
    const rawScore = mockQuestions.reduce((acc, q) => acc + q.marks, 0);

    return (
        <div className="space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Attempted", value: attempted, icon: FileCheck, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Correct", value: correct, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Incorrect", value: incorrect, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
                    { label: "Total Score", value: rawScore.toFixed(2), icon: Calculator, color: "text-primary", bg: "bg-primary/10" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-none shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase text-muted-foreground border-muted-foreground/10">Live</Badge>
                                </div>
                                <div className="mt-4">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Performance Analytics Brief */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-900 via-primary to-primary text-white overflow-hidden relative">
                <CardContent className="p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black italic tracking-tighter">Your Expected Percentile</h3>
                            <p className="text-white/70 text-sm font-medium leading-relaxed max-w-md">
                                Based on initial data from 45,000+ candidates, your rank is predicted to be in the <strong>Top 15%</strong>.
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-5xl font-black tracking-tighter italic">98.42</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Predicted Percentile</p>
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white/70">Probability of Clearing Cutoff</span>
                            <span className="text-green-300">High Confidence (92%)</span>
                        </div>
                        <Progress value={92} className="h-1.5 bg-white/10" />
                    </div>
                </CardContent>
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <TrendingUp className="h-64 w-64" />
                </div>
            </Card>

            {/* Detailed Verification Table */}
            <Card className="border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between pb-6">
                    <div>
                        <CardTitle className="text-xl font-black italic tracking-tighter">Candidate <span className="text-primary not-italic">Response Sheet</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Verify each question and raise objections if needed
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                        <Button size="sm" className="h-9 bg-black text-white hover:bg-black/90 rounded-xl font-black text-[10px] uppercase tracking-widest">
                            <Share2 className="mr-2 h-4 w-4" /> Share Rank
                        </Button>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[80px] font-black uppercase text-[10px] tracking-wider text-muted-foreground text-center">Q. No</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-wider text-muted-foreground">Question Summary</TableHead>
                                <TableHead className="w-[100px] font-black uppercase text-[10px] tracking-wider text-muted-foreground text-center">Official</TableHead>
                                <TableHead className="w-[100px] font-black uppercase text-[10px] tracking-wider text-muted-foreground text-center">Your Ans</TableHead>
                                <TableHead className="w-[120px] font-black uppercase text-[10px] tracking-wider text-muted-foreground text-center">Outcome</TableHead>
                                <TableHead className="w-[100px] font-black uppercase text-[10px] tracking-wider text-muted-foreground text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockQuestions.map((q) => (
                                <TableRow key={q.id} className="group hover:bg-muted/20 transition-colors border-muted/50">
                                    <TableCell className="font-black text-center text-sm">{q.id}</TableCell>
                                    <TableCell className="font-bold text-xs max-w-xs truncate">{q.text}</TableCell>
                                    <TableCell className="text-center font-black">
                                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] uppercase font-black px-2">{q.official}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-black">
                                        {q.candidate ? (
                                            <Badge variant="outline" className="text-[10px] uppercase font-black px-2">{q.candidate}</Badge>
                                        ) : (
                                            <span className="text-[9px] font-black text-muted-foreground/30 uppercase italic">NA</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            {q.status === "Correct" && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                                            {q.status === "Incorrect" && <XCircle className="h-3.5 w-3.5 text-red-600" />}
                                            {q.status === "Unattempted" && <History className="h-3.5 w-3.5 text-muted-foreground/30" />}
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-tighter",
                                                q.status === "Correct" ? "text-green-600" :
                                                    q.status === "Incorrect" ? "text-red-600" : "text-muted-foreground/50"
                                            )}>
                                                {q.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-white transition-colors">
                                                    <MessageSquareWarning className="h-4 w-4 text-orange-600" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-6 rounded-2xl shadow-2xl border-none">
                                                <div className="space-y-4">
                                                    <div className="flex items-center space-x-2 text-orange-600">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Raise Objection</p>
                                                    </div>
                                                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                                        If you believe the official answer (<strong>{q.official}</strong>) is incorrect, submit an objection with valid proof.
                                                    </p>
                                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black uppercase text-[10px] h-9">
                                                        Start Objection Flow
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Community Insight */}
            <div className="p-6 rounded-[2rem] bg-orange-50 border-2 border-dashed border-orange-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                        <HelpCircle className="h-7 w-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg tracking-tighter uppercase italic">Objection Tracker</h4>
                        <p className="text-xs font-bold text-orange-700/70">85+ Objections already raised for Q. No 14 by community.</p>
                    </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl px-8 font-black uppercase text-xs h-12 shadow-xl shadow-orange-600/20">
                    View Trending Objections
                </Button>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
