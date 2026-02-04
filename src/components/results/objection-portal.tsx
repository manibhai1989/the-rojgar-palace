"use client";

import * as React from "react";
import {
    MessageSquareWarning,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Eye,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    User,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

const trendingObjections = [
    { id: "OBJ-442", qNo: 14, text: "The chemical formula for Benzene is C6H6, but options said C6H12.", votes: 1242, status: "Under Review" },
    { id: "OBJ-445", qNo: 82, text: "Current capital of Kazakhstan is Astana, not Nursultan according to recent updates.", votes: 856, status: "Clarification Sent" },
    { id: "OBJ-448", qNo: 5, text: "Ambiguous question phrasing in Math section regarding compound interest cycle.", votes: 412, status: "Pending" },
];

export function ObjectionPortal() {
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Objection <span className="text-primary not-italic">Management</span></h2>
                    <p className="text-muted-foreground font-medium max-w-lg">
                        Dispute incorrect answer keys with valid proof. Collective voting helps speed up official reviews.
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="h-14 px-8 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-600/20"
                >
                    {isFormOpen ? "Cancel Submission" : "Register New Objection"}
                </Button>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-none shadow-2xl bg-white p-8 rounded-[2.5rem]">
                            <CardContent className="p-0 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Question Number</label>
                                        <Input placeholder="Enter Q. No from response sheet" className="h-14 rounded-2xl bg-muted/30 border-none font-bold text-lg" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Your Claimed Answer</label>
                                        <div className="flex gap-2">
                                            {["A", "B", "C", "D"].map(opt => (
                                                <Button key={opt} variant="outline" className="h-14 flex-1 rounded-2xl font-black text-lg border-2">{opt}</Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Grounds for Objection (Supporting Proof)</label>
                                    <Textarea placeholder="Explain why the official key is wrong with reference to NCERT or standard textbooks..." className="min-h-[150px] rounded-2xl bg-muted/30 border-none font-medium text-sm p-6" />
                                </div>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Button className="flex-1 h-14 bg-black text-white hover:bg-black/90 rounded-2xl font-black uppercase tracking-widest text-xs">
                                        Submit for Verification
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-2 border-dashed">
                                        Upload Documents (PDF/JPG)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Trending Objections */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black italic tracking-tighter uppercase">Community <span className="text-primary italic">Hotspots</span></h3>
                        <div className="flex items-center space-x-2">
                            <Badge className="bg-muted text-muted-foreground border-none text-[9px] font-black uppercase tracking-widest">342 Active Disputes</Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {trendingObjections.map((obj, i) => (
                            <motion.div
                                key={obj.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-pointer overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <Badge className="bg-black text-white border-none font-black text-[9px]">Q.{obj.qNo}</Badge>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground">{obj.id}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] font-black uppercase text-orange-600 border-orange-200 bg-orange-50">
                                                {obj.status}
                                            </Badge>
                                        </div>
                                        <p className="font-bold text-sm leading-relaxed mb-6 group-hover:text-primary transition-colors">
                                            "{obj.text}"
                                        </p>
                                        <div className="flex items-center justify-between border-t pt-4">
                                            <div className="flex items-center space-x-6">
                                                <div className="flex items-center space-x-2 text-muted-foreground hover:text-green-600 transition-colors">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span className="text-[10px] font-black">{obj.votes}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-muted-foreground hover:text-red-600 transition-colors">
                                                    <ThumbsDown className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest group-hover:bg-primary/5 group-hover:text-primary">
                                                View Discussion <ChevronRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Status Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden p-8">
                        <CardContent className="p-0 space-y-6">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-orange-400" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black italic tracking-tighter">My <span className="text-orange-400">Applications</span></h4>
                                <p className="text-white/50 text-xs font-medium leading-relaxed">
                                    You haven't submitted any objections yet. You have <strong>42 hours</strong> remaining before the window closes.
                                </p>
                            </div>
                            <Button className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-xl font-black uppercase text-[10px] tracking-widest">
                                View Official Notice
                            </Button>
                        </CardContent>
                    </Card>

                    <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center">
                            <Users className="mr-2 h-3.5 w-3.5" /> Recent Activity
                        </h4>
                        <div className="space-y-3">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-white border shadow-sm">
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black">KA</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold truncate">Karan A. upvoted Objection #442</p>
                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">2 Mins Ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
