"use client";

import * as React from "react";
import {
    HelpCircle,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Trophy,
    Lightbulb,
    Timer,
    Flame
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
    {
        id: 1,
        question: "If HCF of two numbers is 11 and their LCM is 7700, if one of the numbers is 275, then the other is?",
        options: ["279", "283", "308", "318"],
        answer: 2, // 308
        explanation: "Product of two numbers = HCF × LCM. So, 275 × x = 11 × 7700 => x = (11 × 7700) / 275 = 308.",
        topic: "Number System",
        difficulty: "Medium"
    }
];

export function QuestionBank() {
    const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
    const [showExplanation, setShowExplanation] = React.useState(false);

    return (
        <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-8 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black italic tracking-tighter">Daily <span className="text-primary not-italic">Challenge</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Solve a new problem every day
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground">Difficulty</p>
                        <Badge variant="outline" className="text-[9px] font-black uppercase bg-orange-50 text-orange-600 border-orange-200">Medium</Badge>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Flame className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-muted/20 border-2 border-dashed border-primary/10 relative overflow-hidden">
                        <div className="relative z-10">
                            <Badge className="bg-primary text-white border-none mb-4 font-black text-[9px] uppercase tracking-widest">Question #242</Badge>
                            <p className="text-lg font-bold leading-relaxed">{questions[0].question}</p>
                        </div>
                        <div className="absolute top-0 right-0 opacity-5 scale-150 transform translate-x-4 -translate-y-4">
                            <Lightbulb className="h-32 w-32" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions[0].options.map((opt, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                className={cn(
                                    "h-16 rounded-2xl justify-start px-6 font-bold text-sm transition-all border-2",
                                    selectedOption === i
                                        ? (i === questions[0].answer ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700")
                                        : "bg-white hover:border-primary/50"
                                )}
                                onClick={() => setSelectedOption(i)}
                                disabled={selectedOption !== null}
                            >
                                <span className="mr-4 h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black">{String.fromCharCode(65 + i)}</span>
                                {opt}
                                {selectedOption === i && (
                                    <div className="ml-auto">
                                        {i === questions[0].answer ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                    </div>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedOption !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="pt-6 border-t space-y-4"
                        >
                            <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                                <div className="flex items-center space-x-2 text-blue-700">
                                    <Lightbulb className="h-4 w-4" />
                                    <p className="text-xs font-black uppercase">Expert Explanation</p>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                                    {questions[0].explanation}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button className="flex-1 bg-black text-white hover:bg-black/90 rounded-xl font-black uppercase text-[10px] tracking-widest h-12">
                                    Try Next Question <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest h-12 border-dashed">
                                    Discuss Topic
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center space-y-1">
                        <Timer className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="text-[8px] font-black uppercase text-muted-foreground">Avg. Time</p>
                        <p className="text-xs font-black">45s</p>
                    </div>
                    <div className="text-center space-y-1">
                        <Trophy className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="text-[8px] font-black uppercase text-muted-foreground">Solved</p>
                        <p className="text-xs font-black">1.2M+</p>
                    </div>
                    <div className="text-center space-y-1">
                        <CheckCircle2 className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p className="text-[8px] font-black uppercase text-muted-foreground">Accuracy</p>
                        <p className="text-xs font-black">72%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { cn } from "@/lib/utils";
