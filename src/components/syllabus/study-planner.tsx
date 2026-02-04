"use client";

import * as React from "react";
import {
    Calendar as CalendarIcon,
    Clock,
    Sparkles,
    ArrowRight,
    BrainCircuit,
    Pause,
    Play,
    RotateCcw,
    Zap,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function StudyPlanner() {
    const [hours, setHours] = React.useState([6]);
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/10 pb-8">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                        <BrainCircuit className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black italic tracking-tighter">AI Study <span className="text-primary not-italic">Planner</span></CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                            Customized preparation schedule generator
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                                <CalendarIcon className="mr-2 h-3 w-3" /> Target Exam Date
                            </Label>
                            <Input type="date" className="h-12 rounded-xl border-none bg-muted/30 font-bold focus:ring-2 focus:ring-primary/20" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center">
                                    <Clock className="mr-2 h-3 w-3" /> Daily Study Hours
                                </Label>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-xs tabular-nums">
                                    {hours}h / day
                                </Badge>
                            </div>
                            <Slider
                                value={hours}
                                onValueChange={setHours}
                                max={16}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                            <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground italic">
                                <span>Casual</span>
                                <span>Beast Mode</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-muted/20 border-2 border-dashed border-muted-foreground/10 space-y-4">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Planning Strategy</p>
                            <div className="space-y-3">
                                {[
                                    { label: "Spaced Repetition", checked: true },
                                    { label: "High-Weightage First", checked: true },
                                    { label: "Include Mock Tests", checked: true },
                                ].map((opt, i) => (
                                    <div key={i} className="flex items-center space-x-3 text-xs">
                                        <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Zap className="h-2 w-2 text-primary" />
                                        </div>
                                        <span className="font-bold text-muted-foreground">{opt.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={handleGenerate}
                        className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-70 group"
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <span className="flex items-center">
                                <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> Calculating Optimum Path...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Sparkles className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform" /> Generate Personal Study Plan
                            </span>
                        )}
                    </Button>
                </div>

                {/* Planner Preview (Hidden until generated) */}
                {!isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="pt-8 border-t space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase text-muted-foreground">Preview: First 3 Days</p>
                            <Button variant="link" className="font-black uppercase text-[10px] p-0 h-auto">View Full Schedule</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map((day) => (
                                <div key={day} className="p-4 rounded-xl border bg-muted/5 space-y-2">
                                    <p className="text-[9px] font-black uppercase text-primary">Day {day}</p>
                                    <p className="text-xs font-bold leading-tight truncate">Algebraic Identities & Practice</p>
                                    <div className="flex items-center text-[8px] text-muted-foreground font-black uppercase italic">
                                        <Clock className="h-2 w-2 mr-1" /> 2.5h Session
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
