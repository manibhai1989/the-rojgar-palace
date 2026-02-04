"use client";

import * as React from "react";
import {
    Fingerprint,
    Search,
    ShieldCheck,
    ArrowRight,
    HelpCircle,
    FileText,
    History
} from "lucide-react";
import { MarksCalculator } from "@/components/results/marks-calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ResultsVerifyPage() {
    const [isVerified, setIsVerified] = React.useState(false);

    return (
        <div className="min-h-screen bg-muted/20 pb-24">
            {/* Verification Hero */}
            <div className="bg-white border-b py-16">
                <div className="container mx-auto px-4 text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 max-w-2xl mx-auto"
                    >
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 font-black uppercase tracking-widest text-[10px] px-3 py-1">
                            Secure Verification Portal
                        </Badge>
                        <h1 className="text-5xl font-black tracking-tighter leading-none">
                            Verify Your <span className="text-primary italic">Exam Marks</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                            Access your candidate response sheet, calculate exact marks with negative marking,
                            and compare against official answer keys in real-time.
                        </p>
                    </motion.div>

                    {!isVerified && (
                        <Card className="max-w-xl mx-auto border-none shadow-2xl p-2 rounded-3xl">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            placeholder="Enter Roll Number / Registration ID"
                                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold text-lg"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <History className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="password"
                                            placeholder="Date of Birth (DDMMYYYY)"
                                            className="h-14 pl-12 rounded-2xl bg-muted/30 border-none font-bold text-lg"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setIsVerified(true)}
                                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
                                >
                                    Verify Response Sheet <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center justify-center">
                                    <ShieldCheck className="mr-2 h-3 w-3 text-green-600" /> End-to-end Encrypted Verification
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Main Calculator Workspace */}
            <AnimatePresence>
                {isVerified && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="container mx-auto px-4 mt-12 space-y-12"
                    >
                        {/* Header for verified state */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <FileText className="h-8 w-8" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">SSC CGL Tier 1 <span className="text-primary not-italic">2024</span></h2>
                                    <div className="flex gap-2">
                                        <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase">Shift: Morning</Badge>
                                        <Badge className="bg-muted text-muted-foreground border-none font-black text-[9px] uppercase">Date: 12 Oct 2024</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Candidate ID</p>
                                    <p className="text-xl font-black tracking-tighter">#REG884210</p>
                                </div>
                                <Button variant="outline" onClick={() => setIsVerified(false)} className="h-10 rounded-xl font-black text-[10px] uppercase border-red-200 text-red-600 hover:bg-red-50">
                                    Logout Session
                                </Button>
                            </div>
                        </div>

                        <MarksCalculator />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Help & Support Footer */}
            <div className="fixed bottom-8 right-8 z-50">
                <Button className="h-14 w-14 rounded-full bg-black text-white hover:bg-black/90 shadow-2xl p-0">
                    <HelpCircle className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
