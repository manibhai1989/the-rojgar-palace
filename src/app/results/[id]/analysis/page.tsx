"use client";

import * as React from "react";
import {
    Trophy,
    Share2,
    Download,
    ChevronLeft,
    Bell,
    Search,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award
} from "lucide-react";
import { ResultAnalytics } from "@/components/results/result-analytics";
import { CutoffTrends } from "@/components/results/cutoff-trends";
import { GuidancePanel } from "@/components/results/guidance-panel";
import { ObjectionPortal } from "@/components/results/objection-portal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function ResultAnalysisPage() {
    return (
        <div className="min-h-screen bg-muted/20 pb-24">
            {/* Minimal Dashboard Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">Result <span className="text-primary not-italic">Dashboard</span></h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-2 text-[10px] font-black uppercase text-muted-foreground mr-4">
                            <Bell className="h-4 w-4" />
                            <span>Notifications: (3)</span>
                        </div>
                        <Button variant="outline" className="h-10 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                            <Download className="mr-2 h-4 w-4" /> Performance Report
                        </Button>
                        <Button className="h-10 bg-primary text-white hover:bg-primary/90 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                            <Share2 className="mr-2 h-4 w-4" /> Share Rank
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Candidate Overview Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="border-none shadow-xl overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12">
                                <div className="lg:col-span-4 bg-primary p-10 text-white space-y-8 relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                        <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black tracking-tighter italic">John Doe</h2>
                                            <p className="text-[10px] font-black uppercase text-white/70 tracking-widest">Candidate ID: #REG884210</p>
                                        </div>
                                        <Badge className="bg-white text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 h-7">
                                            <Award className="mr-2 h-3.5 w-3.5" /> Qualified for Stage 2
                                        </Badge>
                                    </div>
                                    <div className="relative z-10 grid grid-cols-2 gap-4 pt-8 border-t border-white/10 text-center">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-white/50">Overall Rank</p>
                                            <p className="text-xl font-black italic tracking-tighter">#2,442</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-white/50">Percentile</p>
                                            <p className="text-xl font-black italic tracking-tighter">98.42%</p>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-12 -left-12 opacity-10">
                                        <Trophy className="h-48 w-48 text-white" />
                                    </div>
                                </div>
                                <div className="lg:col-span-8 p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-8 content-center">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest border-b pb-2 flex items-center">
                                            <User className="mr-2 h-3.5 w-3.5" /> Identity Details
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm font-bold">
                                                <Mail className="h-4 w-4 mr-3 text-primary" /> john.doe@example.com
                                            </div>
                                            <div className="flex items-center text-sm font-bold">
                                                <Phone className="h-4 w-4 mr-3 text-primary" /> +91 98765 43210
                                            </div>
                                            <div className="flex items-center text-sm font-bold">
                                                <MapPin className="h-4 w-4 mr-3 text-primary" /> New Delhi, India
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest border-b pb-2 flex items-center">
                                            <Calendar className="mr-2 h-3.5 w-3.5" /> Application History
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-muted-foreground">Applied On</span>
                                                <span className="font-black">12 Aug 2024</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-muted-foreground">Category</span>
                                                <Badge variant="outline" className="text-[10px] font-black uppercase">UR (General)</Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-muted-foreground">Center</span>
                                                <span className="font-black">Sector 62, Noida</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Analysis Workspace */}
                <Tabs defaultValue="deep-analysis" className="w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-14">
                            <TabsTrigger value="deep-analysis" className="rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Performance DNA
                            </TabsTrigger>
                            <TabsTrigger value="cutoff-trends" className="rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Cutoff Matrix
                            </TabsTrigger>
                            <TabsTrigger value="objections" className="rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Objections
                            </TabsTrigger>
                            <TabsTrigger value="next-steps" className="rounded-xl font-black text-xs uppercase tracking-widest h-12 px-8 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                                Guidance
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] h-10 border-2">
                                <Search className="mr-2 h-3.5 w-3.5" /> Peer Lookup
                            </Button>
                        </div>
                    </div>

                    <TabsContent value="deep-analysis" className="mt-0 space-y-12">
                        <ResultAnalytics />
                    </TabsContent>

                    <TabsContent value="cutoff-trends" className="mt-0 space-y-12">
                        <CutoffTrends />
                    </TabsContent>

                    <TabsContent value="objections" className="mt-0 space-y-12">
                        <ObjectionPortal />
                    </TabsContent>

                    <TabsContent value="next-steps" className="mt-0 space-y-12">
                        <GuidancePanel status="qualified" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
