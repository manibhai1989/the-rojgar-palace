"use client";

import * as React from "react";
import {
    CheckCircle2,
    XCircle,
    GraduationCap,
    Briefcase,
    Stethoscope,
    ShieldCheck,
    ArrowRight,
    Search,
    BookOpen,
    Target,
    Zap,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function GuidancePanel({ status = "qualified" }: { status?: "qualified" | "non-qualified" }) {
    if (status === "qualified") {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-xl bg-green-50/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black tracking-tighter flex items-center">
                                <Zap className="h-5 w-5 mr-2 text-green-600" /> Stage 2 Preparation
                            </CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase">Your next steps for Tier 2 / Interview</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Master Data Interpretation (Weightage: 30%)",
                                "Brush up on Current Affairs (Last 6 months)",
                                "Practice Group Discussion Topics",
                            ].map((task, i) => (
                                <div key={i} className="flex items-start space-x-3 p-3 bg-white rounded-xl border-none shadow-sm group">
                                    <div className="h-5 w-5 rounded-full border-2 border-green-200 flex items-center justify-center group-hover:bg-green-600 group-hover:border-green-600 transition-all">
                                        <CheckCircle2 className="h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">{task}</span>
                                </div>
                            ))}
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-black uppercase text-[10px] h-10 tracking-widest">
                                Start Preparation <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-blue-50/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-black tracking-tighter flex items-center">
                                <ShieldCheck className="h-5 w-5 mr-2 text-blue-600" /> Document Checklist
                            </CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase">Mandatory for verification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { label: "10th/12th Marksheets", status: "Ready" },
                                { label: "Degree Certificate", status: "Missing" },
                                { label: "Caste/OBC Certificate (if any)", status: "Ready" },
                                { label: "Identity Proof (Aadhar/Voter)", status: "Ready" },
                            ].map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm">
                                    <span className="text-xs font-bold text-muted-foreground">{doc.label}</span>
                                    <Badge className={doc.status === "Ready" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                                        {doc.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="p-8 rounded-[2rem] bg-indigo-600 text-white overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h4 className="text-2xl font-black italic tracking-tighter">Mock Interview <span className="text-indigo-300">Slot Available</span></h4>
                            <p className="text-sm font-medium text-white/70">Connect with retired board members for a live simulation.</p>
                        </div>
                        <Button className="h-12 px-8 bg-white text-indigo-600 hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-xs">
                            Book Slot Now
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl bg-orange-50/50">
                <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <Target className="h-7 w-7" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black tracking-tighter italic">Gap <span className="text-orange-600">Analysis</span></CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase">Why you missed the cutoff by 4.5 marks</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span className="text-muted-foreground">Accuracy Issue</span>
                                <span className="text-orange-600">62% (Ideal: 85%)</span>
                            </div>
                            <Progress value={62} className="h-1.5 bg-orange-100" />
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                You attempted 92 questions but 24 were incorrect. Improving accuracy would have netted you <strong>+7.2 marks</strong>.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                <span className="text-muted-foreground">Time Management</span>
                                <span className="text-red-600">Critical (GK)</span>
                            </div>
                            <Progress value={85} className="h-1.5 bg-red-100" />
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                You spent avg 110s on hard math questions, leaving only 12 mins for the entire English section.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h5 className="font-black text-sm uppercase italic">Recommended Backup Plans</h5>
                            <p className="text-[10px] font-bold text-muted-foreground">Based on your score, you have a 85% chance in these upcoming exams:</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="h-8 rounded-lg font-black uppercase text-[9px] border-orange-200 text-orange-700">SSC CHSL</Badge>
                            <Badge variant="outline" className="h-8 rounded-lg font-black uppercase text-[9px] border-orange-200 text-orange-700">Bank PO</Badge>
                            <Badge variant="outline" className="h-8 rounded-lg font-black uppercase text-[9px] border-orange-200 text-orange-700">State PSC</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="w-full h-14 bg-black text-white hover:bg-black/90 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl group">
                Download Personalized Improvement PDF <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
        </div>
    );
}
